<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('siswa/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
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

            'berat_badan' => 'nullable|numeric|min:0',
            'tinggi_badan' => 'nullable|numeric|min:0',
            'golongan_darah' => 'nullable|string|max:10',
            'riwayat_penyakit' => 'nullable|string',
            'alasan_rawat_inap' => 'nullable|string',
            'riwayat_alergi_makanan' => 'nullable|string',

            'ayah_nama_lengkap' => 'nullable|string|max:255',
            'ayah_tempat_lahir' => 'nullable|string|max:255',
            'ayah_tanggal_lahir' => 'nullable|date',
            'ayah_pekerjaan' => 'nullable|string|max:255',
            'ayah_pendidikan_terakhir' => 'nullable|string|max:255',
            'ayah_nomor_identitas' => 'nullable|string|max:255',
            'ayah_alamat_rumah' => 'nullable|string',
            'ayah_telepon_rumah' => 'nullable|string|max:20',
            'ayah_alamat_kantor' => 'nullable|string',
            'ayah_telepon_kantor' => 'nullable|string|max:20',
            'ayah_no_hp' => 'nullable|string|max:20',

            'ibu_nama_lengkap' => 'nullable|string|max:255',
            'ibu_tempat_lahir' => 'nullable|string|max:255',
            'ibu_tanggal_lahir' => 'nullable|date',
            'ibu_pekerjaan' => 'nullable|string|max:255',
            'ibu_pendidikan_terakhir' => 'nullable|string|max:255',
            'ibu_nomor_identitas' => 'nullable|string|max:255',
            'ibu_alamat_rumah' => 'nullable|string',
            'ibu_telepon_rumah' => 'nullable|string|max:20',
            'ibu_alamat_kantor' => 'nullable|string',
            'ibu_telepon_kantor' => 'nullable|string|max:20',
            'ibu_no_hp' => 'nullable|string|max:20',

            'kontak_darurat_nama_lengkap' => 'nullable|string|max:255',
            'kontak_darurat_hubungan' => 'nullable|string|max:255',
            'kontak_darurat_pekerjaan' => 'nullable|string|max:255',
            'kontak_darurat_nomor_identitas' => 'nullable|string|max:255',
            'kontak_darurat_alamat_rumah' => 'nullable|string',
            'kontak_darurat_telepon_rumah' => 'nullable|string|max:20',
            'kontak_darurat_alamat_kantor' => 'nullable|string',
            'kontak_darurat_telepon_kantor' => 'nullable|string|max:20',
            'kontak_darurat_no_hp' => 'nullable|string|max:20',

            'lokasi_pendaftaran' => 'nullable|string|max:255',
            'tanggal_pendaftaran' => 'nullable|date',
        ]);

        if ($request->hasFile('foto_siswa')) {
            $file = $request->file('foto_siswa');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/images/foto_siswa'), $filename);
            $validated['foto_siswa'] = $filename;
        }

        $request->user()->siswa()->create($validated);

        return redirect()->route('dashboard')->with('success', 'Data siswa berhasil disimpan!');
    }
}
