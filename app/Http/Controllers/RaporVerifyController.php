<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Rapor;

class RaporVerifyController extends Controller
{
    public function show(Rapor $rapor)
    {
        abort_if($rapor->status !== 'final', 404);

        $rapor->load(['siswa', 'siswa.kelas']);

        $kepsekPath = public_path('assets/images/ttd/kepsek.png');
        $kepsekSrc  = file_exists($kepsekPath)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($kepsekPath))
            : null;

        $namaKepsek = AppSetting::get('nama_kepala_sekolah', '_______________');

        return view('verify.rapor', compact('rapor', 'kepsekSrc', 'namaKepsek'));
    }
}
