<?php

namespace App\Http\Controllers;

use App\Models\Kehadiran;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KehadiranController extends Controller
{
    // Halaman tablet untuk anak-anak
    public function tablet($cabang_id)
    {
        $cabang = \App\Models\Cabang::findOrFail($cabang_id);

        return Inertia::render('kehadiran/tablet', [
            'cabang' => $cabang,
        ]);
    }

    // Halaman TV display
    public function display($cabang_id)
    {
        $cabang = \App\Models\Cabang::findOrFail($cabang_id);

        return Inertia::render('kehadiran/display', [
            'cabang' => $cabang,
        ]);
    }

    // API: Get daftar kelas berdasarkan cabang_id
    public function getKelas($cabang_id)
    {
        $cabang = \App\Models\Cabang::findOrFail($cabang_id);

        // Filter siswa berdasarkan lokasi_pendaftaran (nama_cabang), lalu ambil kelas unik
        $kelasIds = Siswa::where('lokasi_pendaftaran', $cabang->nama_cabang)
            ->where('is_active', true)
            ->distinct()
            ->pluck('kelas_id');

        $kelas = Kelas::whereIn('id', $kelasIds)
            ->select('id', 'nama_kelas')
            ->orderBy('nama_kelas')
            ->get();

        return response()->json($kelas);
    }

    // API: Get daftar siswa berdasarkan kelas dan cabang
    public function getSiswaByKelas(Request $request, $cabang_id, $kelasId)
    {
        $cabang = \App\Models\Cabang::findOrFail($cabang_id);
        $excludeHadir = $request->query('exclude_hadir');
        $onlyHadir = $request->query('only_hadir');

        $query = Siswa::where('kelas_id', $kelasId)
            ->where('lokasi_pendaftaran', $cabang->nama_cabang)
            ->where('is_active', true);

        // Exclude siswa yang sudah hadir hari ini (untuk check-in)
        if ($excludeHadir) {
            $siswaHadirIds = Kehadiran::whereDate('tanggal', now()->toDateString())
                ->pluck('siswa_id')
                ->toArray();

            $query->whereNotIn('id', $siswaHadirIds);
        }

        // Only siswa yang sudah hadir tapi belum pulang (untuk check-out)
        if ($onlyHadir) {
            $siswaHadirIds = Kehadiran::whereDate('tanggal', now()->toDateString())
                ->whereNotNull('waktu_hadir')
                ->whereNull('waktu_pulang')
                ->pluck('siswa_id')
                ->toArray();

            $query->whereIn('id', $siswaHadirIds);
        }

        $siswa = $query->select('id', 'nama_panggilan', 'nama_lengkap', 'foto_siswa')
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'nama' => $s->nama_panggilan ?: $s->nama_lengkap,
                    'foto' => $s->foto_siswa,
                ];
            });

        return response()->json($siswa);
    }

    // API: Simpan kehadiran
    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'jenis_interaksi' => 'required|in:tos,tinju',
        ]);

        $kehadiran = Kehadiran::updateOrCreate(
            [
                'siswa_id' => $request->siswa_id,
                'tanggal' => now()->toDateString(),
            ],
            [
                'waktu_hadir' => now()->timezone('Asia/Jakarta')->toTimeString(),
                'jenis_interaksi' => $request->jenis_interaksi,
            ]
        );

        $siswa = Siswa::with('kelas')->find($request->siswa_id);

        // Broadcast ke TV display
        broadcast(new \App\Events\SiswaHadir([
            'id' => $kehadiran->id,
            'siswa_id' => $siswa->id,
            'nama' => $siswa->nama_panggilan ?: $siswa->nama_lengkap,
            'foto' => $siswa->foto_siswa,
            'kelas' => $siswa->kelas->nama_kelas ?? '',
            'waktu' => $kehadiran->waktu_hadir,
            'jenis_interaksi' => $kehadiran->jenis_interaksi,
        ]));

        return response()->json([
            'success' => true,
            'data' => $kehadiran,
        ]);
    }

    // API: Simpan waktu pulang
    public function storePulang(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'rating' => 'required|in:like,no',
        ]);

        $kehadiran = Kehadiran::where('siswa_id', $request->siswa_id)
            ->whereDate('tanggal', now()->toDateString())
            ->first();

        if (! $kehadiran) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa belum check-in hari ini',
            ], 400);
        }

        $kehadiran->update([
            'waktu_pulang' => now()->timezone('Asia/Jakarta')->toTimeString(),
            'rating' => $request->rating,
        ]);

        // Kirim notifikasi jika daily report sudah final
        $dailyReport = \App\Models\DailyReport::where('siswa_id', $request->siswa_id)
            ->whereDate('tanggal', now()->toDateString())
            ->where('is_final', true)
            ->first();

        if ($dailyReport) {
            $siswa = Siswa::find($request->siswa_id);

            app(\App\Services\NotificationService::class)->sendDailyReportToParent($dailyReport);

            app(\App\Services\FcmService::class)->sendToUser(
                userId: $siswa->user_id,
                title: 'Daily Report Tersedia',
                body: "Laporan harian {$siswa->nama_lengkap} sudah siap untuk dilihat",
                url: "/orangtua/daily-report/{$dailyReport->id}",
                extraData: [
                    'type' => 'daily_report_final',
                    'siswa_id' => $siswa->id,
                    'report_id' => $dailyReport->id,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'data' => $kehadiran,
        ]);
    }

    // API: Get kehadiran hari ini untuk TV display berdasarkan cabang
    public function getKehadiranHariIni($cabang_id)
    {
        $cabang = \App\Models\Cabang::findOrFail($cabang_id);

        $kehadiran = Kehadiran::with(['siswa.kelas'])
            ->whereDate('tanggal', now()->toDateString())
            ->whereNotNull('waktu_hadir')
            ->whereNull('waktu_pulang') // Hanya tampilkan yang belum check-out
            ->whereHas('siswa', function ($query) use ($cabang) {
                $query->where('lokasi_pendaftaran', $cabang->nama_cabang);
            })
            ->orderBy('waktu_hadir', 'desc')
            ->get()
            ->map(function ($k) {
                // Format waktu ke format Indonesia (HH:mm) dengan timezone Asia/Jakarta
                $waktu = \Carbon\Carbon::parse($k->waktu_hadir)
                    ->timezone('Asia/Jakarta')
                    ->format('H:i');

                return [
                    'id' => $k->id,
                    'siswa_id' => $k->siswa->id,
                    'nama' => $k->siswa->nama_panggilan ?: $k->siswa->nama_lengkap,
                    'foto' => $k->siswa->foto_siswa,
                    'kelas' => $k->siswa->kelas->nama_kelas ?? '',
                    'waktu' => $waktu,
                    'jenis_interaksi' => $k->jenis_interaksi,
                ];
            });

        return response()->json($kehadiran);
    }

    // Orangtua: Lihat absensi anak
    public function orangtuaIndex()
    {
        $user = auth()->user();
        $siswa = $user->siswa;

        if (! $siswa) {
            return redirect()->route('dashboard')->with('error', 'Data siswa tidak ditemukan');
        }

        $kehadiran = Kehadiran::where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->paginate(20);

        return Inertia::render('orangtua/absensi-list', [
            'kehadiran' => $kehadiran,
            'siswa' => $siswa,
        ]);
    }
}
