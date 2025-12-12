<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\GuruKehadiran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KehadiranController extends Controller
{
    private function checkGuru()
    {
        if (auth()->user()->role !== 'guru') {
            abort(403, 'Unauthorized - Guru access only');
        }
    }

    public function index(): Response
    {
        $this->checkGuru();

        $guru = auth()->user()->guru;

        if (!$guru) {
            abort(403, 'Data guru tidak ditemukan');
        }

        $today = now()->toDateString();

        // Get today's attendance
        $todayAttendance = GuruKehadiran::where('guru_id', $guru->id)
            ->whereDate('tanggal', $today)
            ->first();

        // Get recent attendance history (last 7 days)
        $recentAttendance = GuruKehadiran::where('guru_id', $guru->id)
            ->orderBy('tanggal', 'desc')
            ->limit(7)
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'tanggal' => $attendance->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $attendance->tanggal->locale('id')->isoFormat('dddd, D MMMM YYYY'),
                    'check_in' => $attendance->check_in,
                    'check_out' => $attendance->check_out,
                    'catatan' => $attendance->catatan,
                ];
            });

        return Inertia::render('guru/absensi/index', [
            'todayAttendance' => $todayAttendance ? [
                'id' => $todayAttendance->id,
                'tanggal' => $todayAttendance->tanggal->format('Y-m-d'),
                'check_in' => $todayAttendance->check_in,
                'check_out' => $todayAttendance->check_out,
                'catatan' => $todayAttendance->catatan,
            ] : null,
            'recentAttendance' => $recentAttendance,
            'currentTime' => now()->format('H:i:s'),
        ]);
    }

    public function checkIn(Request $request): RedirectResponse
    {
        $this->checkGuru();

        $guru = auth()->user()->guru;

        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $today = now()->toDateString();
        $currentTime = now()->format('H:i:s');

        // Check if already checked in today
        $existing = GuruKehadiran::where('guru_id', $guru->id)
            ->whereDate('tanggal', $today)
            ->first();

        if ($existing && $existing->check_in) {
            return redirect()->back()->with('error', 'Anda sudah melakukan check-in hari ini');
        }

        $validated = $request->validate([
            'catatan' => 'nullable|string|max:500',
        ]);

        GuruKehadiran::updateOrCreate(
            [
                'guru_id' => $guru->id,
                'tanggal' => $today,
            ],
            [
                'check_in' => $currentTime,
                'catatan' => $validated['catatan'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Check-in berhasil!');
    }

    public function checkOut(Request $request): RedirectResponse
    {
        $this->checkGuru();

        $guru = auth()->user()->guru;

        if (!$guru) {
            return redirect()->back()->with('error', 'Data guru tidak ditemukan');
        }

        $today = now()->toDateString();
        $currentTime = now()->format('H:i:s');

        // Check if checked in today
        $attendance = GuruKehadiran::where('guru_id', $guru->id)
            ->whereDate('tanggal', $today)
            ->first();

        if (!$attendance || !$attendance->check_in) {
            return redirect()->back()->with('error', 'Anda belum melakukan check-in hari ini');
        }

        if ($attendance->check_out) {
            return redirect()->back()->with('error', 'Anda sudah melakukan check-out hari ini');
        }

        $validated = $request->validate([
            'catatan' => 'nullable|string|max:500',
        ]);

        $attendance->update([
            'check_out' => $currentTime,
            'catatan' => $validated['catatan'] ?? $attendance->catatan,
        ]);

        return redirect()->back()->with('success', 'Check-out berhasil!');
    }
}
