<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuMingguan;
use App\Models\MenuHarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MenuMingguanController extends Controller
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

        $menuMingguan = MenuMingguan::query()
            ->with('creator:id,name')
            ->orderBy('tanggal_mulai', 'desc')
            ->paginate(10);

        return Inertia::render('admin/menu-mingguan/index', [
            'menuMingguan' => $menuMingguan,
        ]);
    }

    public function create()
    {
        $this->checkAdmin();

        return Inertia::render('admin/menu-mingguan/create');
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'nama_menu' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'is_active' => 'boolean',
            'menu_harian' => 'array',
        ]);

        DB::beginTransaction();
        try {
            // If setting as active, deactivate all other menus
            if ($validated['is_active'] ?? false) {
                MenuMingguan::query()->update(['is_active' => false]);
            }

            $menuMingguan = MenuMingguan::create([
                'nama_menu' => $validated['nama_menu'],
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'is_active' => $validated['is_active'] ?? false,
                'created_by' => auth()->id(),
            ]);

            // Save menu harian items
            if (!empty($validated['menu_harian'])) {
                foreach ($validated['menu_harian'] as $item) {
                    if (!empty($item['nama_menu'])) {
                        MenuHarian::create([
                            'menu_mingguan_id' => $menuMingguan->id,
                            'hari' => $item['hari'],
                            'waktu_makan' => $item['waktu_makan'],
                            'kategori' => $item['kategori'],
                            'nama_menu' => $item['nama_menu'],
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('admin.menu-mingguan.index')
                ->with('success', 'Menu mingguan berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan menu mingguan: ' . $e->getMessage()]);
        }
    }

    public function edit(MenuMingguan $menuMingguan)
    {
        $this->checkAdmin();

        $menuMingguan->load('menuHarian');

        return Inertia::render('admin/menu-mingguan/edit', [
            'menuMingguan' => $menuMingguan,
        ]);
    }

    public function update(Request $request, MenuMingguan $menuMingguan)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'nama_menu' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'is_active' => 'boolean',
            'menu_harian' => 'array',
        ]);

        DB::beginTransaction();
        try {
            // If setting as active, deactivate all other menus
            if ($validated['is_active'] ?? false) {
                MenuMingguan::where('id', '!=', $menuMingguan->id)->update(['is_active' => false]);
            }

            $menuMingguan->update([
                'nama_menu' => $validated['nama_menu'],
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'is_active' => $validated['is_active'] ?? false,
            ]);

            // Delete existing menu harian and recreate
            $menuMingguan->menuHarian()->delete();

            if (!empty($validated['menu_harian'])) {
                foreach ($validated['menu_harian'] as $item) {
                    if (!empty($item['nama_menu'])) {
                        MenuHarian::create([
                            'menu_mingguan_id' => $menuMingguan->id,
                            'hari' => $item['hari'],
                            'waktu_makan' => $item['waktu_makan'],
                            'kategori' => $item['kategori'],
                            'nama_menu' => $item['nama_menu'],
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('admin.menu-mingguan.index')
                ->with('success', 'Menu mingguan berhasil diupdate!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate menu mingguan: ' . $e->getMessage()]);
        }
    }

    public function destroy(MenuMingguan $menuMingguan)
    {
        $this->checkAdmin();

        $menuMingguan->delete();

        return redirect()->route('admin.menu-mingguan.index')
            ->with('success', 'Menu mingguan berhasil dihapus!');
    }

    public function copy(MenuMingguan $menuMingguan)
    {
        $this->checkAdmin();

        DB::beginTransaction();
        try {
            // Create new menu mingguan with dates set to next week
            $newMenuMingguan = MenuMingguan::create([
                'nama_menu' => $menuMingguan->nama_menu . ' (Copy)',
                'tanggal_mulai' => $menuMingguan->tanggal_mulai->addWeek(),
                'tanggal_selesai' => $menuMingguan->tanggal_selesai->addWeek(),
                'is_active' => false,
                'created_by' => auth()->id(),
            ]);

            // Copy all menu harian items
            foreach ($menuMingguan->menuHarian as $menuHarian) {
                MenuHarian::create([
                    'menu_mingguan_id' => $newMenuMingguan->id,
                    'hari' => $menuHarian->hari,
                    'waktu_makan' => $menuHarian->waktu_makan,
                    'kategori' => $menuHarian->kategori,
                    'nama_menu' => $menuHarian->nama_menu,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.menu-mingguan.edit', $newMenuMingguan)
                ->with('success', 'Menu mingguan berhasil dicopy!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal copy menu mingguan: ' . $e->getMessage()]);
        }
    }

    public function toggleActive(MenuMingguan $menuMingguan)
    {
        $this->checkAdmin();

        DB::beginTransaction();
        try {
            if (!$menuMingguan->is_active) {
                // Deactivate all other menus
                MenuMingguan::query()->update(['is_active' => false]);
                $menuMingguan->update(['is_active' => true]);
            } else {
                $menuMingguan->update(['is_active' => false]);
            }

            DB::commit();

            return back()->with('success', 'Status menu berhasil diupdate!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate status: ' . $e->getMessage()]);
        }
    }

    public function printPdf(MenuMingguan $menuMingguan)
    {
        $this->checkAdmin();

        $menuMingguan->load(['menuHarian', 'creator']);

        $days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
        $waktuMakan = ['sarapan', 'makan_siang', 'snack'];

        // Check if download parameter exists
        if (request()->has('download')) {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.menu-mingguan', [
                'menuMingguan' => $menuMingguan,
                'days' => $days,
                'waktuMakan' => $waktuMakan,
            ]);

            $pdf->setPaper('a4', 'landscape');

            return $pdf->download('menu-mingguan-' . str_replace(' ', '-', $menuMingguan->nama_menu) . '.pdf');
        }

        // Show preview
        return view('pdf.menu-mingguan', [
            'menuMingguan' => $menuMingguan,
            'days' => $days,
            'waktuMakan' => $waktuMakan,
            'showDownloadButton' => true,
        ]);
    }
}
