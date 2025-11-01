<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\RencanaPembelajaran;
use Inertia\Inertia;

class RencanaPembelajaranController extends Controller
{
    private function checkGuru()
    {
        if (auth()->user()->role !== 'guru') {
            abort(403, 'Unauthorized - Guru access only');
        }
    }

    public function index()
    {
        $this->checkGuru();

        $guru = auth()->user()->guru;

        // Get current day name in Indonesian
        $now = \Carbon\Carbon::now();
        $dayOfWeek = $now->dayOfWeek; // 0 = Sunday, 6 = Saturday
        $isLocal = config('app.env') === 'local';

        // Determine current day
        $currentDay = null;
        if ($dayOfWeek == 0 || $dayOfWeek == 6) {
            // Weekend: only show Friday's schedule in local environment
            if ($isLocal) {
                $currentDay = 'jumat';
            }
            // In production, currentDay stays null (no results on weekends)
        } else {
            // Weekday: show current day's schedule
            $currentDay = strtolower($now->locale('id')->dayName);
        }

        // Build query for rencana pembelajaran
        $query = RencanaPembelajaran::query()
            ->with(['creator:id,name', 'kelas:id,nama_kelas']);

        // Only filter by day if currentDay is set (weekdays or local weekend)
        if ($currentDay) {
            $query->whereHas('kegiatanHarian', function ($q) use ($currentDay) {
                $q->where('hari', $currentDay);
            });
        } else {
            // Production weekend: return no results
            $query->whereRaw('1 = 0');
        }

        // If guru has been assigned to a class, filter by their kelas_id
        if ($guru && $guru->kelas_id) {
            $query->where('kelas_id', $guru->kelas_id);
        }

        $rencanaPembelajaran = $query
            ->orderBy('is_active', 'desc')
            ->orderBy('tanggal_mulai', 'desc')
            ->paginate(10);

        return Inertia::render('guru/rencana-pembelajaran/index', [
            'rencanaPembelajaran' => $rencanaPembelajaran,
            'appEnv' => config('app.env'),
        ]);
    }

    public function show(RencanaPembelajaran $rencanaPembelajaran)
    {
        $this->checkGuru();

        $guru = auth()->user()->guru;

        // Check if guru has been assigned and can access this rencana (must be from their class)
        if ($guru && $guru->kelas_id && $guru->kelas_id !== $rencanaPembelajaran->kelas_id) {
            abort(403, 'Unauthorized - You can only view learning plans for your class');
        }

        $rencanaPembelajaran->load(['kegiatanHarian', 'kelas:id,nama_kelas', 'creator:id,name']);

        return Inertia::render('guru/rencana-pembelajaran/show', [
            'rencanaPembelajaran' => $rencanaPembelajaran,
            'appEnv' => config('app.env'),
        ]);
    }
}
