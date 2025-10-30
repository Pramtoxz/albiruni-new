<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
  
    public function index()
    {
        $kelas = Kelas::orderBy('nama_kelas')->get();

        return Inertia::render('admin/kelas/index', [
            'kelas' => $kelas,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/kelas/create');
    }

    public function store(Request $request)
    {
        // $validated = $request->validate([
        //     'nama_kelas' => 'required|string|max:255',
        //     'kategori' => 'required|in:anak,bayi',
        //     'deskripsi' => 'nullable|string',
        //     'spp' => 'required|numeric|min:0',
        // ]);

        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255',
            'deskripsi' =>  'nullable|string',
            'spp'       => 'required|numeric|min:0',
            'kategori'  => 'required|in:anak,bayi',
        ]);

        Kelas::create($validated);

        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil ditambahkan');
    }

    public function edit(Kelas $kela)
    {
        return Inertia::render('admin/kelas/edit', [
            'kelas' => $kela,
        ]);
    }

    public function update(Request $request, Kelas $kela)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255',
            'kategori' => 'required|in:anak,bayi',
            'deskripsi' => 'nullable|string',
            'spp' => 'required|numeric|min:0',
        ]);

        $kela->update($validated);

        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil diperbarui');
    }

    public function destroy(Kelas $kela)
    {
        $kela->delete();

        return redirect()->route('admin.kelas.index')
            ->with('success', 'Kelas berhasil dihapus');
    }
}
