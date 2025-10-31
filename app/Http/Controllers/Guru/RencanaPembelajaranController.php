<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\RencanaPembelajaran;
use App\Models\KegiatanHarian;
use Illuminate\Http\Request;
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
        
        if (!$guru || !$guru->kelas_id) {
            return Inertia::render('guru/rencana-pembelajaran/index', [
                'rencanaPembelajaran' => ['data' => []],
                'message' => 'Anda belum ditugaskan ke kelas manapun.',
            ]);
        }

        $rencanaPembelajaran = RencanaPembelajaran::query()
            ->where('kelas_id', $guru->kelas_id)
            ->with(['creator:id,name', 'kelas:id,nama_kelas'])
            ->orderBy('tanggal_mulai', 'desc')
            ->paginate(10);

        return Inertia::render('guru/rencana-pembelajaran/index', [
            'rencanaPembelajaran' => $rencanaPembelajaran,
        ]);
    }

    public function show(RencanaPembelajaran $rencanaPembelajaran)
    {
        $this->checkGuru();

        $guru = auth()->user()->guru;
        
        // Check if guru can access this rencana (must be from their class)
        if ($guru->kelas_id !== $rencanaPembelajaran->kelas_id) {
            abort(403, 'Unauthorized - You can only view learning plans for your class');
        }

        $rencanaPembelajaran->load(['kegiatanHarian', 'kelas:id,nama_kelas', 'creator:id,name']);

        return Inertia::render('guru/rencana-pembelajaran/show', [
            'rencanaPembelajaran' => $rencanaPembelajaran,
        ]);
    }
}
