<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SiswaController extends Controller
{
    private function checkAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized - Admin access only');
        }
    }

    public function index()
    {
        $this->checkAdmin();

        $pendingSiswa = Siswa::query()
            ->where('status_siswa', false)
            ->with('user')
            ->latest('tanggal_pendaftaran')
            ->paginate(10);

        return Inertia::render('admin/siswa/index', [
            'pendingSiswa' => $pendingSiswa,
        ]);
    }

    public function show(Siswa $siswa)
    {
        $this->checkAdmin();

        $siswa->load('user');

        return Inertia::render('admin/siswa/show', [
            'siswa' => $siswa,
        ]);
    }

    public function approve(Request $request, Siswa $siswa)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'jenis_pembayaran' => ['required', Rule::in(['transfer', 'cash'])],
        ]);

        $siswa->update([
            'status_siswa' => true,
            'jenis_pembayaran' => $validated['jenis_pembayaran'],
        ]);

        return redirect()->route('admin.siswa.index')
            ->with('success', "Siswa {$siswa->nama_lengkap} berhasil disetujui!");
    }
}
