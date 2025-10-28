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

        // Filter by cabang/lokasi
        if ($request->filled('cabang')) {
            $query->whereHas('siswa', function ($q) use ($request) {
                $q->where('lokasi_pendaftaran', $request->cabang);
            });
        }

        // Filter by status
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

        $pembayaran->update($validated);

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    public function generate()
    {
        $this->checkAdmin();

        $currentMonth = now()->format('Y-m');
        $currentYear = now()->year;

        // Check if already generated for this month
        $alreadyGenerated = PembayaranSpp::where('bulan', $currentMonth)
            ->where('tahun', $currentYear)
            ->exists();

        if ($alreadyGenerated) {
            return redirect()->route('admin.pembayaran.index')
                ->with('error', 'Tagihan SPP untuk bulan ini sudah pernah di-generate.');
        }

        // Get all active students with kelas
        $siswaList = Siswa::where('status_siswa', true)
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
            // Create payment record
            $pembayaran = PembayaranSpp::create([
                'siswa_id' => $siswa->id,
                'kelas_id' => $siswa->kelas_id,
                'bulan' => $currentMonth,
                'tahun' => $currentYear,
                'biaya' => $siswa->kelas->spp,
                'status_bayar' => 'pending',
            ]);

            // Send notifications to parent
            try {
                // WhatsApp notification
                $notificationService->sendSppNotificationToParent($pembayaran);
                
                // FCM push notification
                $fcmService->sendToUser(
                    userId: $siswa->user_id,
                    title: 'Tagihan SPP Baru',
                    body: "Tagihan SPP bulan ini telah tersedia",
                    url: "/orangtua/pembayaran",
                    extraData: [
                        'type' => 'spp_billing',
                        'pembayaran_id' => $pembayaran->id,
                    ]
                );
                
                // Add delay between notifications (except for the last one)
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
