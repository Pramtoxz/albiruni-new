<?php

namespace App\Http\Controllers;

use App\Models\KegiatanHarian;
use App\Models\RencanaPembelajaran;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KegiatanHarianController extends Controller
{
    public function orangtuaIndex(Request $request)
    {
        $user = auth()->user();

        // Ambil data siswa dengan relasi kelas
        $siswa = Siswa::where('user_id', $user->id)
            ->with('kelas')
            ->first();

        if (! $siswa) {
            return redirect()->route('dashboard')
                ->with('error', 'Data siswa tidak ditemukan');
        }

        // Ambil kegiatan harian berdasarkan kelas siswa
        $kegiatanList = [];

        if ($siswa->kelas_id) {
            // Dapatkan nama hari ini dalam bahasa Indonesia
            $hariIni = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now()->dayOfWeek];

            // Cari rencana pembelajaran yang aktif untuk kelas siswa
            $rencanaPembelajaran = RencanaPembelajaran::where('kelas_id', $siswa->kelas_id)
                ->active()
                ->whereDate('tanggal_mulai', '<=', now())
                ->whereDate('tanggal_selesai', '>=', now())
                ->first();

            if ($rencanaPembelajaran) {
                // Ambil kegiatan harian untuk hari ini saja
                $kegiatanList = KegiatanHarian::where('rencana_pembelajaran_id', $rencanaPembelajaran->id)
                    ->where('hari', $hariIni)
                    ->orderBy('tanggal', 'desc')
                    ->get()
                    ->map(function ($kegiatan) {
                        return [
                            'id' => $kegiatan->id,
                            'nama_aktivitas' => $kegiatan->nama_aktivitas,
                            'deskripsi' => $kegiatan->deskripsi,
                            'target_perkembangan' => $kegiatan->target_perkembangan,
                            'alat_bahan' => $kegiatan->alat_bahan,
                            'instruksi' => $kegiatan->instruksi,
                            'foto_kegiatan' => $kegiatan->foto_kegiatan,
                            'tanggal' => $kegiatan->tanggal->format('Y-m-d'),
                            'hari' => $kegiatan->hari,
                        ];
                    });
            }
        }

        return Inertia::render('orangtua/kegiatan-harian', [
            'kegiatanList' => $kegiatanList,
            'siswa' => [
                'nama_lengkap' => $siswa->nama_lengkap,
                'nama_panggilan' => $siswa->nama_panggilan,
                'kelas' => $siswa->kelas ? [
                    'nama_kelas' => $siswa->kelas->nama_kelas,
                ] : null,
            ],
        ]);
    }
}
