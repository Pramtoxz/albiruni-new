<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RencanaPembelajaran;
use App\Models\KegiatanHarian;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RencanaPembelajaranController extends Controller
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

        $rencanaPembelajaran = RencanaPembelajaran::query()
            ->with(['creator:id,name', 'kelas:id,nama_kelas'])
            ->orderBy('tanggal_mulai', 'desc')
            ->paginate(10);

        return Inertia::render('admin/rencana-pembelajaran/index', [
            'rencanaPembelajaran' => $rencanaPembelajaran,
        ]);
    }

    public function create()
    {
        $this->checkAdmin();

        $kelas = Kelas::select('id', 'nama_kelas')->get();

        return Inertia::render('admin/rencana-pembelajaran/create', [
            'kelas' => $kelas,
        ]);
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'nama_rencana' => 'required|string|max:255',
            'tema' => 'required|string|max:255',
            'sub_tema' => 'nullable|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'kelas_id' => 'required|exists:kelas,id',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            if ($validated['is_active'] ?? false) {
                RencanaPembelajaran::where('kelas_id', $validated['kelas_id'])
                    ->update(['is_active' => false]);
            }

            $rencanaPembelajaran = RencanaPembelajaran::create([
                'nama_rencana' => $validated['nama_rencana'],
                'tema' => $validated['tema'],
                'sub_tema' => $validated['sub_tema'],
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'kelas_id' => $validated['kelas_id'],
                'is_active' => $validated['is_active'] ?? false,
                'created_by' => auth()->id(),
            ]);

            // Process kegiatan harian
            $kegiatanData = $request->input('kegiatan_harian', []);
            
            foreach ($kegiatanData as $index => $item) {
                if (!empty($item['nama_aktivitas'])) {
                    $kegiatan = [
                        'rencana_pembelajaran_id' => $rencanaPembelajaran->id,
                        'hari' => $item['hari'],
                        'tanggal' => $item['tanggal'],
                        'nama_aktivitas' => $item['nama_aktivitas'],
                        'deskripsi' => $item['deskripsi'] ?? '',
                        'target_perkembangan' => $item['target_perkembangan'] ?? '',
                        'alat_bahan' => $item['alat_bahan'] ?? '',
                        'instruksi' => $item['instruksi'] ?? '',
                        'video_url' => $item['video_url'] ?? null,
                    ];

                    // Handle foto_kegiatan upload
                    if ($request->hasFile("kegiatan_harian.{$index}.foto_kegiatan")) {
                        $file = $request->file("kegiatan_harian.{$index}.foto_kegiatan");
                        $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('assets/images/kegiatan'), $filename);
                        $kegiatan['foto_kegiatan'] = $filename;
                    }

                    // Handle file_materi upload
                    if ($request->hasFile("kegiatan_harian.{$index}.file_materi")) {
                        $file = $request->file("kegiatan_harian.{$index}.file_materi");
                        $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('assets/documents/kegiatan'), $filename);
                        $kegiatan['file_materi'] = $filename;
                    }

                    KegiatanHarian::create($kegiatan);
                }
            }

            DB::commit();

            return redirect()->route('admin.rencana-pembelajaran.index')
                ->with('success', 'Rencana pembelajaran berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan rencana pembelajaran: ' . $e->getMessage()]);
        }
    }

    public function edit(RencanaPembelajaran $rencanaPembelajaran)
    {
        $this->checkAdmin();

        $rencanaPembelajaran->load('kegiatanHarian');
        $kelas = Kelas::select('id', 'nama_kelas')->get();

        return Inertia::render('admin/rencana-pembelajaran/edit', [
            'rencanaPembelajaran' => $rencanaPembelajaran,
            'kelas' => $kelas,
        ]);
    }

    public function update(Request $request, RencanaPembelajaran $rencanaPembelajaran)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'nama_rencana' => 'required|string|max:255',
            'tema' => 'required|string|max:255',
            'sub_tema' => 'nullable|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'kelas_id' => 'required|exists:kelas,id',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            if ($validated['is_active'] ?? false) {
                RencanaPembelajaran::where('kelas_id', $validated['kelas_id'])
                    ->where('id', '!=', $rencanaPembelajaran->id)
                    ->update(['is_active' => false]);
            }

            $rencanaPembelajaran->update([
                'nama_rencana' => $validated['nama_rencana'],
                'tema' => $validated['tema'],
                'sub_tema' => $validated['sub_tema'],
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'kelas_id' => $validated['kelas_id'],
                'is_active' => $validated['is_active'] ?? false,
            ]);

            // Delete old kegiatan and their files
            foreach ($rencanaPembelajaran->kegiatanHarian as $kegiatan) {
                if ($kegiatan->foto_kegiatan && file_exists(public_path('assets/images/kegiatan/' . $kegiatan->foto_kegiatan))) {
                    unlink(public_path('assets/images/kegiatan/' . $kegiatan->foto_kegiatan));
                }
                if ($kegiatan->file_materi && file_exists(public_path('assets/documents/kegiatan/' . $kegiatan->file_materi))) {
                    unlink(public_path('assets/documents/kegiatan/' . $kegiatan->file_materi));
                }
            }
            $rencanaPembelajaran->kegiatanHarian()->delete();

            // Process kegiatan harian
            $kegiatanData = $request->input('kegiatan_harian', []);
            
            foreach ($kegiatanData as $index => $item) {
                if (!empty($item['nama_aktivitas'])) {
                    $kegiatan = [
                        'rencana_pembelajaran_id' => $rencanaPembelajaran->id,
                        'hari' => $item['hari'],
                        'tanggal' => $item['tanggal'],
                        'nama_aktivitas' => $item['nama_aktivitas'],
                        'deskripsi' => $item['deskripsi'] ?? '',
                        'target_perkembangan' => $item['target_perkembangan'] ?? '',
                        'alat_bahan' => $item['alat_bahan'] ?? '',
                        'instruksi' => $item['instruksi'] ?? '',
                        'video_url' => $item['video_url'] ?? null,
                    ];

                    // Handle foto_kegiatan upload
                    if ($request->hasFile("kegiatan_harian.{$index}.foto_kegiatan")) {
                        $file = $request->file("kegiatan_harian.{$index}.foto_kegiatan");
                        $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('assets/images/kegiatan'), $filename);
                        $kegiatan['foto_kegiatan'] = $filename;
                    }

                    // Handle file_materi upload
                    if ($request->hasFile("kegiatan_harian.{$index}.file_materi")) {
                        $file = $request->file("kegiatan_harian.{$index}.file_materi");
                        $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('assets/documents/kegiatan'), $filename);
                        $kegiatan['file_materi'] = $filename;
                    }

                    KegiatanHarian::create($kegiatan);
                }
            }

            DB::commit();

            return redirect()->route('admin.rencana-pembelajaran.index')
                ->with('success', 'Rencana pembelajaran berhasil diupdate!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate rencana pembelajaran: ' . $e->getMessage()]);
        }
    }

    public function destroy(RencanaPembelajaran $rencanaPembelajaran)
    {
        $this->checkAdmin();

        // Delete associated files
        foreach ($rencanaPembelajaran->kegiatanHarian as $kegiatan) {
            if ($kegiatan->foto_kegiatan && file_exists(public_path('assets/images/kegiatan/' . $kegiatan->foto_kegiatan))) {
                unlink(public_path('assets/images/kegiatan/' . $kegiatan->foto_kegiatan));
            }
            if ($kegiatan->file_materi && file_exists(public_path('assets/documents/kegiatan/' . $kegiatan->file_materi))) {
                unlink(public_path('assets/documents/kegiatan/' . $kegiatan->file_materi));
            }
        }

        $rencanaPembelajaran->delete();

        return redirect()->route('admin.rencana-pembelajaran.index')
            ->with('success', 'Rencana pembelajaran berhasil dihapus!');
    }

    public function copy(RencanaPembelajaran $rencanaPembelajaran)
    {
        $this->checkAdmin();

        DB::beginTransaction();
        try {
            $newRencana = RencanaPembelajaran::create([
                'nama_rencana' => $rencanaPembelajaran->nama_rencana . ' (Copy)',
                'tema' => $rencanaPembelajaran->tema,
                'sub_tema' => $rencanaPembelajaran->sub_tema,
                'tanggal_mulai' => $rencanaPembelajaran->tanggal_mulai->addWeek(),
                'tanggal_selesai' => $rencanaPembelajaran->tanggal_selesai->addWeek(),
                'kelas_id' => $rencanaPembelajaran->kelas_id,
                'is_active' => false,
                'created_by' => auth()->id(),
            ]);

            foreach ($rencanaPembelajaran->kegiatanHarian as $kegiatan) {
                $newKegiatanData = [
                    'rencana_pembelajaran_id' => $newRencana->id,
                    'hari' => $kegiatan->hari,
                    'tanggal' => $kegiatan->tanggal->addWeek(),
                    'nama_aktivitas' => $kegiatan->nama_aktivitas,
                    'deskripsi' => $kegiatan->deskripsi,
                    'target_perkembangan' => $kegiatan->target_perkembangan,
                    'alat_bahan' => $kegiatan->alat_bahan,
                    'instruksi' => $kegiatan->instruksi,
                    'video_url' => $kegiatan->video_url,
                ];

                // Copy foto_kegiatan file
                if ($kegiatan->foto_kegiatan && file_exists(public_path('assets/images/kegiatan/' . $kegiatan->foto_kegiatan))) {
                    $oldFile = public_path('assets/images/kegiatan/' . $kegiatan->foto_kegiatan);
                    $newFilename = time() . '_' . uniqid() . '_' . $kegiatan->foto_kegiatan;
                    $newFile = public_path('assets/images/kegiatan/' . $newFilename);
                    copy($oldFile, $newFile);
                    $newKegiatanData['foto_kegiatan'] = $newFilename;
                }

                // Copy file_materi
                if ($kegiatan->file_materi && file_exists(public_path('assets/documents/kegiatan/' . $kegiatan->file_materi))) {
                    $oldFile = public_path('assets/documents/kegiatan/' . $kegiatan->file_materi);
                    $newFilename = time() . '_' . uniqid() . '_' . $kegiatan->file_materi;
                    $newFile = public_path('assets/documents/kegiatan/' . $newFilename);
                    copy($oldFile, $newFile);
                    $newKegiatanData['file_materi'] = $newFilename;
                }

                KegiatanHarian::create($newKegiatanData);
            }

            DB::commit();

            return redirect()->route('admin.rencana-pembelajaran.edit', $newRencana)
                ->with('success', 'Rencana pembelajaran berhasil dicopy!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal copy rencana pembelajaran: ' . $e->getMessage()]);
        }
    }

    public function toggleActive(RencanaPembelajaran $rencanaPembelajaran)
    {
        $this->checkAdmin();

        DB::beginTransaction();
        try {
            if (!$rencanaPembelajaran->is_active) {
                RencanaPembelajaran::where('kelas_id', $rencanaPembelajaran->kelas_id)
                    ->update(['is_active' => false]);
                $rencanaPembelajaran->update(['is_active' => true]);
            } else {
                $rencanaPembelajaran->update(['is_active' => false]);
            }

            DB::commit();

            return back()->with('success', 'Status rencana berhasil diupdate!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengupdate status: ' . $e->getMessage()]);
        }
    }
}
