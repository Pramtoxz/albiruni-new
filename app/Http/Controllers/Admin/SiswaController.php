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

    public function approved()
    {
        $this->checkAdmin();

        $approvedSiswa = Siswa::query()
            ->where('status_siswa', true)
            ->with('user')
            ->latest('updated_at')
            ->paginate(10);

        return Inertia::render('admin/siswa/approved', [
            'approvedSiswa' => $approvedSiswa,
        ]);
    }

    public function edit(Siswa $siswa)
    {
        $this->checkAdmin();

        // Only allow editing approved students
        if (!$siswa->status_siswa) {
            return redirect()->route('admin.siswa.index')
                ->with('error', 'Hanya siswa yang sudah disetujui yang dapat diedit.');
        }

        $siswa->load('user');

        return Inertia::render('admin/siswa/edit', [
            'siswa' => $siswa,
        ]);
    }

    public function update(Request $request, Siswa $siswa)
    {
        $this->checkAdmin();

        // Only allow updating approved students
        if (!$siswa->status_siswa) {
            return redirect()->route('admin.siswa.index')
                ->with('error', 'Hanya siswa yang sudah disetujui yang dapat diedit.');
        }

        $validated = $request->validate([
            // Informasi Umum Siswa
            'nama_lengkap' => 'required|string|max:255',
            'nama_panggilan' => 'nullable|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string|max:255',
            'kewarganegaraan' => 'nullable|string|max:255',
            'anak_ke' => 'nullable|integer|min:1',
            'jumlah_saudara_kandung' => 'nullable|integer|min:0',
            'bahasa_sehari_hari' => 'nullable|string|max:255',
            'foto_siswa' => 'nullable|image|max:2048',
            
            // Informasi Kesehatan
            'berat_badan' => 'nullable|numeric|min:0',
            'tinggi_badan' => 'nullable|numeric|min:0',
            'golongan_darah' => 'nullable|string|max:10',
            'riwayat_penyakit' => 'nullable|string',
            'alasan_rawat_inap' => 'nullable|string',
            'riwayat_alergi_makanan' => 'nullable|string',
            
            // Data Ayah
            'ayah_nama_lengkap' => 'nullable|string|max:255',
            'ayah_tempat_tanggal_lahir' => 'nullable|string|max:255',
            'ayah_pekerjaan' => 'nullable|string|max:255',
            'ayah_pendidikan_terakhir' => 'nullable|string|max:255',
            'ayah_nomor_identitas' => 'nullable|string|max:255',
            'ayah_alamat_rumah' => 'nullable|string',
            'ayah_telepon_rumah' => 'nullable|string|max:20',
            'ayah_alamat_kantor' => 'nullable|string',
            'ayah_telepon_kantor' => 'nullable|string|max:20',
            'ayah_no_hp' => 'nullable|string|max:20',
            
            // Data Ibu
            'ibu_nama_lengkap' => 'nullable|string|max:255',
            'ibu_tempat_tanggal_lahir' => 'nullable|string|max:255',
            'ibu_pekerjaan' => 'nullable|string|max:255',
            'ibu_pendidikan_terakhir' => 'nullable|string|max:255',
            'ibu_nomor_identitas' => 'nullable|string|max:255',
            'ibu_alamat_rumah' => 'nullable|string',
            'ibu_telepon_rumah' => 'nullable|string|max:20',
            'ibu_alamat_kantor' => 'nullable|string',
            'ibu_telepon_kantor' => 'nullable|string|max:20',
            'ibu_no_hp' => 'nullable|string|max:20',
            
            // Kontak Darurat
            'kontak_darurat_nama_lengkap' => 'nullable|string|max:255',
            'kontak_darurat_hubungan' => 'nullable|string|max:255',
            'kontak_darurat_pekerjaan' => 'nullable|string|max:255',
            'kontak_darurat_nomor_identitas' => 'nullable|string|max:255',
            'kontak_darurat_alamat_rumah' => 'nullable|string',
            'kontak_darurat_telepon_rumah' => 'nullable|string|max:20',
            'kontak_darurat_alamat_kantor' => 'nullable|string',
            'kontak_darurat_telepon_kantor' => 'nullable|string|max:20',
            'kontak_darurat_no_hp' => 'nullable|string|max:20',
            
            // Persetujuan
            'lokasi_pendaftaran' => 'nullable|string|max:255',
            'tanggal_pendaftaran' => 'nullable|date',
            'jenis_pembayaran' => ['required', Rule::in(['transfer', 'cash'])],
        ]);

        // Handle foto upload
        if ($request->hasFile('foto_siswa')) {
            // Delete old photo if exists
            if ($siswa->foto_siswa) {
                $oldPhotoPath = public_path('assets/images/foto_siswa/' . $siswa->foto_siswa);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                }
            }

            $file = $request->file('foto_siswa');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/images/foto_siswa'), $filename);
            $validated['foto_siswa'] = $filename;
        } else {
            // Remove foto_siswa from validated data if no file uploaded
            unset($validated['foto_siswa']);
        }

        $siswa->update($validated);

        return redirect()->route('admin.siswa.approved')
            ->with('success', "Data siswa {$siswa->nama_lengkap} berhasil diupdate!");
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
