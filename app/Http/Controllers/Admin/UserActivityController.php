<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $validated['start_date'] ?? now()->subWeek()->startOfDay();
        $endDate = $validated['end_date'] ?? now()->endOfDay();

        $startTimestamp = \Carbon\Carbon::parse($startDate)->timestamp;
        $endTimestamp = \Carbon\Carbon::parse($endDate)->timestamp;

        $userActivities = User::leftJoin('sessions', function($join) use ($startTimestamp, $endTimestamp) {
                $join->on('users.id', '=', 'sessions.user_id')
                     ->whereBetween('sessions.last_activity', [$startTimestamp, $endTimestamp]);
            })
            ->select(
                'users.*',
                \DB::raw('MAX(sessions.last_activity) as last_activity'),
                \DB::raw('COUNT(DISTINCT sessions.id) as session_count')
            )
            ->groupBy('users.id', 'users.name', 'users.email', 'users.email_verified_at', 'users.password', 'users.nohp', 'users.role', 'users.remember_token', 'users.created_at', 'users.updated_at')
            ->orderByDesc('last_activity')
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
                    'session_count' => $user->session_count ?? 0,
                    'is_guest' => false,
                ];
            });

        $guestSessions = \DB::table('sessions')
            ->whereNull('user_id')
            ->whereBetween('last_activity', [$startTimestamp, $endTimestamp])
            ->select(
                \DB::raw('COUNT(*) as session_count'),
                \DB::raw('MAX(last_activity) as last_activity')
            )
            ->first();
        
        if ($guestSessions && $guestSessions->session_count > 0) {
            $userActivities->prepend([
                'id' => null,
                'name' => 'Guest',
                'email' => 'Pengunjung Company Profile',
                'role' => 'guest',
                'child_name' => null,
                'last_activity' => \Carbon\Carbon::createFromTimestamp($guestSessions->last_activity),
                'session_count' => $guestSessions->session_count,
                'is_guest' => true,
            ]);
        }

        $totalUsers = $userActivities->where('is_guest', false)->count();
        $totalGuests = $guestSessions ? $guestSessions->session_count : 0;
        $totalSessions = $userActivities->sum('session_count');

        return Inertia::render('admin/user-activity/index', [
            'activities' => $userActivities,
            'filters' => [
                'start_date' => $startDate instanceof \Carbon\Carbon ? $startDate->format('Y-m-d') : $startDate,
                'end_date' => $endDate instanceof \Carbon\Carbon ? $endDate->format('Y-m-d') : $endDate,
            ],
            'stats' => [
                'total_users' => $totalUsers,
                'total_guests' => $totalGuests,
                'total_sessions' => $totalSessions,
            ],
        ]);
    }
}
