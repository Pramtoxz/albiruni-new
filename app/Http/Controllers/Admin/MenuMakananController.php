<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuMakanan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuMakananController extends Controller
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

        $menuMakanan = MenuMakanan::query()
            ->orderBy('jenis')
            ->orderBy('nama_menu')
            ->paginate(20);

        return Inertia::render('admin/menu-makanan/index', [
            'menuMakanan' => $menuMakanan,
        ]);
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'nama_menu' => 'required|string|max:255',
            'jenis' => ['required', Rule::in(['sarapan', 'makan_siang', 'snack'])],
        ]);

        MenuMakanan::create($validated);

        return redirect()->route('admin.menu-makanan.index')
            ->with('success', 'Menu makanan berhasil ditambahkan!');
    }

    public function update(Request $request, MenuMakanan $menuMakanan)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'nama_menu' => 'required|string|max:255',
            'jenis' => ['required', Rule::in(['sarapan', 'makan_siang', 'snack'])],
            'is_active' => 'boolean',
        ]);

        $menuMakanan->update($validated);

        return redirect()->route('admin.menu-makanan.index')
            ->with('success', 'Menu makanan berhasil diupdate!');
    }

    public function destroy(MenuMakanan $menuMakanan)
    {
        $this->checkAdmin();

        $menuMakanan->delete();

        return redirect()->route('admin.menu-makanan.index')
            ->with('success', 'Menu makanan berhasil dihapus!');
    }
}
