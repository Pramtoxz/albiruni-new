<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Emosi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmosiController extends Controller
{
    public function index()
    {
        $emosis = Emosi::orderBy('nama_emosi')->get();

        return Inertia::render('admin/emosi/index', [
            'emosis' => $emosis,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/emosi/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_emosi' => 'required|string|max:255',
            'deskripsi' => 'required|string',
        ]);

        Emosi::create($validated);

        return redirect()->route('admin.emosi.index')
            ->with('success', 'Emosi berhasil ditambahkan');
    }

    public function edit(Emosi $emosi)
    {
        return Inertia::render('admin/emosi/edit', [
            'emosi' => $emosi,
        ]);
    }

    public function update(Request $request, Emosi $emosi)
    {
        $validated = $request->validate([
            'nama_emosi' => 'required|string|max:255',
            'deskripsi' => 'required|string',
        ]);

        $emosi->update($validated);

        return redirect()->route('admin.emosi.index')
            ->with('success', 'Emosi berhasil diperbarui');
    }

    public function destroy(Emosi $emosi)
    {
        $emosi->delete();

        return redirect()->route('admin.emosi.index')
            ->with('success', 'Emosi berhasil dihapus');
    }
}
