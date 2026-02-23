<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\DailyReport;
use App\Models\PembayaranSpp;
use App\Models\Kehadiran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $totalSiswa = Siswa::where('status_siswa', true)->count();
        $totalGuru = Guru::count();
        $totalUser = User::count();
        
        $siswaPending = Siswa::where('status_siswa', false)->count();
        
        $dailyReportToday = DailyReport::whereDate('tanggal', today())->count();
        $dailyReportFinal = DailyReport::whereDate('tanggal', today())
            ->where('is_final', true)
            ->count();
        
        $kehadiranToday = Kehadiran::whereDate('tanggal', today())->count();
        
        $pembayaranPending = PembayaranSpp::where('status_bayar', 'pending')->count();
        $pembayaranVerified = PembayaranSpp::where('status_bayar', 'diterima')
            ->whereMonth('bulan', now()->month)
            ->whereYear('tahun', now()->year)
            ->count();
        
        $totalPendapatanBulanIni = PembayaranSpp::where('status_bayar', 'diterima')
            ->whereMonth('bulan', now()->month)
            ->whereYear('tahun', now()->year)
            ->sum('biaya');
        
        $dailyReportsRecent = DailyReport::with(['siswa', 'user'])
            ->where('is_final', true)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'tanggal' => $report->tanggal,
                    'siswa' => [
                        'nama_lengkap' => $report->siswa->nama_lengkap,
                    ],
                    'user' => [
                        'name' => $report->user->name,
                    ],
                    'created_at' => $report->created_at,
                ];
            });
        
        $siswaPendingList = Siswa::with('user')
            ->where('status_siswa', false)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($siswa) {
                return [
                    'id' => $siswa->id,
                    'nama_lengkap' => $siswa->nama_lengkap,
                    'tanggal_pendaftaran' => $siswa->tanggal_pendaftaran ?? $siswa->created_at,
                    'user' => [
                        'name' => $siswa->user->name,
                    ],
                ];
            });
        

        $activeUsers = User::whereIn('role', ['orangtua', 'guru'])
            ->leftJoin('sessions', 'users.id', '=', 'sessions.user_id')
            ->select('users.*', \DB::raw('MAX(sessions.last_activity) as last_activity'))
            ->groupBy('users.id', 'users.name', 'users.email', 'users.email_verified_at', 'users.password', 'users.nohp', 'users.role', 'users.remember_token', 'users.created_at', 'users.updated_at')
            ->orderByDesc('last_activity')
            ->take(5)
            ->get()
            ->map(function ($user) {
                $lastActivity = $user->last_activity ? \Carbon\Carbon::createFromTimestamp($user->last_activity) : null;
                
                $childName = null;
                if ($user->role === 'orangtua') {
                    $siswa = Siswa::where('user_id', $user->id)->first();
                    $childName = $siswa ? $siswa->nama_lengkap : null;
                }
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'child_name' => $childName,
                    'last_activity' => $lastActivity,
                    'is_guest' => false,
                ];
            });
        
        $guestSessions = \DB::table('sessions')
            ->whereNull('user_id')
            ->select(\DB::raw('COUNT(*) as session_count'), \DB::raw('MAX(last_activity) as last_activity'))
            ->first();
        
        if ($guestSessions && $guestSessions->session_count > 0) {
            $activeUsers->prepend([
                'id' => null,
                'name' => 'Guest',
                'email' => 'Pengunjung Company Profile',
                'role' => 'guest',
                'child_name' => null,
                'last_activity' => \Carbon\Carbon::createFromTimestamp($guestSessions->last_activity),
                'is_guest' => true,
                'session_count' => $guestSessions->session_count,
            ]);
        }
        
        $activeUsers = $activeUsers->take(5);
        
        $dailyReportStats = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $count = DailyReport::whereDate('tanggal', $date)
                ->where('is_final', true)
                ->count();
            $dailyReportStats[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('D'),
                'count' => $count,
            ];
        }
        
        $kehadiranStats = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $count = Kehadiran::whereDate('tanggal', $date)->count();
            $kehadiranStats[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('D'),
                'count' => $count,
            ];
        }
        
        $pembayaranByMonth = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $total = PembayaranSpp::where('status_bayar', 'diterima')
                ->whereMonth('bulan', $date->month)
                ->whereYear('tahun', $date->year)
                ->sum('biaya');
            $pembayaranByMonth[] = [
                'month' => $date->format('M'),
                'total' => (float) $total,
            ];
        }

        return Inertia::render('dashboard/admin', [
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'totalGuru' => $totalGuru,
                'totalUser' => $totalUser,
                'siswaPending' => $siswaPending,
                'dailyReportToday' => $dailyReportToday,
                'dailyReportFinal' => $dailyReportFinal,
                'kehadiranToday' => $kehadiranToday,
                'pembayaranPending' => $pembayaranPending,
                'pembayaranVerified' => $pembayaranVerified,
                'totalPendapatanBulanIni' => (float) $totalPendapatanBulanIni,
            ],
            'dailyReportsRecent' => $dailyReportsRecent,
            'siswaPendingList' => $siswaPendingList,
            'activeUsers' => $activeUsers,
            'charts' => [
                'dailyReportStats' => $dailyReportStats,
                'kehadiranStats' => $kehadiranStats,
                'pembayaranByMonth' => $pembayaranByMonth,
            ],
        ]);
    }
}
