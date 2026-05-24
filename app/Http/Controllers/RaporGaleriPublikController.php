<?php

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\Rapor;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class RaporGaleriPublikController extends Controller
{
    public function show(Rapor $rapor): Response
    {
        abort_if($rapor->status !== 'final', 404);

        $rapor->load('siswa:id,nama_lengkap,nama_panggilan,jenis_kelamin');

        $tahunMulai = (int) explode('/', $rapor->tahun_ajaran)[0];

        if ($rapor->semester === 1) {
            $dari   = Carbon::create($tahunMulai, 7, 1)->startOfMonth();
            $sampai = Carbon::create($tahunMulai, 12, 31)->endOfMonth();
        } else {
            $dari   = Carbon::create($tahunMulai + 1, 1, 1)->startOfMonth();
            $sampai = Carbon::create($tahunMulai + 1, 6, 30)->endOfMonth();
        }

        $fotos = DailyReport::where('siswa_id', $rapor->siswa_id)
            ->whereNotNull('foto_kegiatan')
            ->where('foto_kegiatan', '!=', '')
            ->whereBetween('tanggal', [$dari, $sampai])
            ->orderByDesc('tanggal')
            ->get()
            ->map(fn ($r) => [
                'id'       => $r->id,
                'foto'     => $r->foto_kegiatan,
                'tanggal'  => Carbon::parse($r->tanggal)->locale('id')->isoFormat('D MMM Y'),
                'activity' => $r->activity,
            ]);

        return Inertia::render('rapor/galeri-publik', [
            'rapor' => [
                'id'           => $rapor->id,
                'semester'     => $rapor->semester,
                'tahun_ajaran' => $rapor->tahun_ajaran,
                'siswa'        => $rapor->siswa,
            ],
            'fotos' => $fotos,
        ]);
    }
}
