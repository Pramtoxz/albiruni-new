<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PembayaranSpp;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayaranSppController extends Controller
{
    private function checkAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized - Admin access only');
        }
    }

    public function index(Request $request)
    {
        $this->checkAdmin();

        $query = PembayaranSpp::with(['siswa.user', 'kelas']);

        if ($request->filled('cabang')) {
            $query->whereHas('siswa', function ($q) use ($request) {
                $q->where('lokasi_pendaftaran', $request->cabang);
            });
        }

        if ($request->filled('status')) {
            $query->where('status_bayar', $request->status);
        }

        $pembayaran = $query->orderBy('status_bayar')
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->paginate(20)
            ->appends($request->query());

        return Inertia::render('admin/pembayaran/index', [
            'pembayaran' => $pembayaran,
            'filters' => [
                'cabang' => $request->cabang,
                'status' => $request->status,
            ],
        ]);
    }

    public function show(PembayaranSpp $pembayaran)
    {
        $this->checkAdmin();

        $pembayaran->load(['siswa.user', 'kelas']);

        return Inertia::render('admin/pembayaran/show', [
            'pembayaran' => $pembayaran,
        ]);
    }

    public function verify(Request $request, PembayaranSpp $pembayaran)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'status_bayar' => 'required|in:diterima,ditolak',
            'catatan_admin' => 'nullable|string',
        ]);

        // Jika ditolak, reset status ke pending dan hapus bukti bayar agar bisa upload ulang
        if ($validated['status_bayar'] === 'ditolak') {
            // Hapus file bukti bayar jika ada
            if ($pembayaran->bukti_bayar) {
                $filePath = public_path('assets/images/bukti_bayar/'.$pembayaran->bukti_bayar);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }

            $pembayaran->update([
                'status_bayar' => 'pending',
                'catatan_admin' => $validated['catatan_admin'],
                'bukti_bayar' => null,
                'tanggal_bayar' => null,
            ]);
        } else {
            // Jika diterima, update seperti biasa
            $pembayaran->update($validated);
        }

        // Load relasi untuk notifikasi
        $pembayaran->load(['siswa.user', 'kelas']);

        // Kirim push notifikasi FCM ke orang tua
        try {
            $fcmService = app(\App\Services\FcmService::class);

            $title = $validated['status_bayar'] === 'diterima'
                ? 'Pembayaran SPP Diterima'
                : 'Pembayaran SPP Ditolak';

            $bulanTahun = \Carbon\Carbon::parse($pembayaran->bulan)->locale('id')->isoFormat('MMMM YYYY');

            $body = $validated['status_bayar'] === 'diterima'
                ? "Pembayaran SPP {$bulanTahun} untuk {$pembayaran->siswa->nama_lengkap} telah diterima."
                : "Pembayaran SPP {$bulanTahun} untuk {$pembayaran->siswa->nama_lengkap} ditolak. Silakan upload ulang bukti pembayaran.";

            if (! empty($validated['catatan_admin'])) {
                $body .= " Catatan: {$validated['catatan_admin']}";
            }

            $fcmService->sendToUser(
                userId: $pembayaran->siswa->user_id,
                title: $title,
                body: $body,
                url: '/orangtua/pembayaran',
                extraData: [
                    'type' => 'spp_verification',
                    'pembayaran_id' => $pembayaran->id,
                    'status' => $validated['status_bayar'],
                ]
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send FCM notification for payment verification', [
                'pembayaran_id' => $pembayaran->id,
                'error' => $e->getMessage(),
            ]);
        }

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Status pembayaran berhasil diperbarui dan notifikasi telah dikirim.');
    }

    public function generate()
    {
        $this->checkAdmin();

        $currentMonth = now()->format('Y-m');
        $currentYear = now()->year;

        $alreadyGenerated = PembayaranSpp::where('bulan', $currentMonth)
            ->where('tahun', $currentYear)
            ->exists();

        if ($alreadyGenerated) {
            return redirect()->route('admin.pembayaran.index')
                ->with('error', 'Tagihan SPP untuk bulan ini sudah pernah di-generate.');
        }

        $siswaList = Siswa::where('status_siswa', true)
            ->where('is_active', true)
            ->whereNotNull('kelas_id')
            ->with(['kelas', 'user'])
            ->get();

        if ($siswaList->isEmpty()) {
            return redirect()->route('admin.pembayaran.index')
                ->with('error', 'Tidak ada siswa aktif dengan kelas yang terdaftar.');
        }

        $generated = 0;
        $notificationService = app(\App\Services\NotificationService::class);
        $fcmService = app(\App\Services\FcmService::class);
        $delaySeconds = config('app.whatsapp_notification_delay', 2);

        foreach ($siswaList as $siswa) {
            $pembayaran = PembayaranSpp::create([
                'siswa_id' => $siswa->id,
                'kelas_id' => $siswa->kelas_id,
                'bulan' => $currentMonth,
                'tahun' => $currentYear,
                'biaya' => $siswa->kelas->spp,
                'status_bayar' => 'pending',
            ]);

            try {
                $notificationService->sendSppNotificationToParent($pembayaran);

                $fcmService->sendToUser(
                    userId: $siswa->user_id,
                    title: 'Tagihan SPP Baru',
                    body: 'Tagihan SPP bulan ini telah tersedia',
                    url: '/orangtua/pembayaran',
                    extraData: [
                        'type' => 'spp_billing',
                        'pembayaran_id' => $pembayaran->id,
                    ]
                );

                if ($generated < $siswaList->count() - 1) {
                    sleep($delaySeconds);
                }
            } catch (\Exception $e) {
                \Log::error('Failed to send SPP notification', [
                    'siswa_id' => $siswa->id,
                    'error' => $e->getMessage(),
                ]);
            }

            $generated++;
        }

        return redirect()->route('admin.pembayaran.index')
            ->with('success', "Berhasil generate {$generated} tagihan SPP untuk bulan ini dan notifikasi telah dikirim ke orang tua.");
    }
}
