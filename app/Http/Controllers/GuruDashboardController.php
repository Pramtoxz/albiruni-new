<?php

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\Kehadiran;
use App\Models\KegiatanHarian;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuruDashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $guru = $user->guru;

        // Get today's date
        $today = now()->toDateString();

        // Initialize stats
        $totalSiswa = 0;
        $siswaHadir = 0;
        $totalDailyReports = 0;
        $completedDailyReports = 0;
        $totalMateri = 0;
        $completedMateri = 0;

        if ($guru) {
            // Get total siswa assigned to this guru
            $totalSiswa = Siswa::where('guru_id', $guru->id)
                ->where('is_active', true)
                ->count();

            // Get siswa hadir today (if record exists in kehadiran, student is present)
            $siswaHadir = Kehadiran::whereDate('tanggal', $today)
                ->whereHas('siswa', function ($query) use ($guru) {
                    $query->where('guru_id', $guru->id)
                        ->where('is_active', true);
                })
                ->count();

            // Get siswa IDs for this guru
            $siswaIds = Siswa::where('guru_id', $guru->id)
                ->where('is_active', true)
                ->pluck('id');

            // Total daily reports needed today (one per active student)
            $totalDailyReports = $siswaIds->count();

            // Completed daily reports today
            $completedDailyReports = DailyReport::whereDate('tanggal', $today)
                ->whereIn('siswa_id', $siswaIds)
                ->count();

            // Get today's kegiatan harian for this guru's class
            $kelasIds = Siswa::where('guru_id', $guru->id)
                ->where('is_active', true)
                ->pluck('kelas_id')
                ->unique();

            $totalMateri = KegiatanHarian::whereDate('tanggal', $today)
                ->whereHas('rencanaPembelajaran', function ($query) use ($kelasIds) {
                    $query->whereIn('kelas_id', $kelasIds);
                })
                ->count();

            // For now, assume all materi are completed (you can add a status field later)
            $completedMateri = $totalMateri;
        }

        // Get recent daily reports (today's reports)
        $recentReports = [];
        if ($guru) {
            $recentReports = DailyReport::with(['siswa.kelas'])
                ->whereDate('tanggal', $today)
                ->whereHas('siswa', function ($query) use ($guru) {
                    $query->where('guru_id', $guru->id);
                })
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($report) {
                    return [
                        'id' => $report->id,
                        'title' => $report->activity ?? 'Daily Report',
                        'class' => $report->siswa->kelas->nama_kelas ?? '-',
                        'siswa_name' => $report->siswa->nama_lengkap,
                        'time' => $report->created_at->format('H:i') . ' WIB',
                        'status' => $report->is_final ? 'Final' : 'Draft',
                        'statusColor' => $report->is_final ? 'text-green-600' : 'text-yellow-600',
                    ];
                });
        }

        return Inertia::render('dashboard/guru', [
            'todayStats' => [
                'siswaHadir' => $siswaHadir,
                'totalSiswa' => $totalSiswa,
                'completedDailyReports' => $completedDailyReports,
                'totalDailyReports' => $totalDailyReports,
                'completedMateri' => $completedMateri,
                'totalMateri' => $totalMateri,
            ],
            'recentReports' => $recentReports,
        ]);
    }
}
