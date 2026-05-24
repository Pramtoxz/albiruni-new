<?php

namespace App\Http\Controllers\Orangtua;

use App\Http\Controllers\Controller;
use App\Models\DailyReport;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GaleriController extends Controller
{
    public function index(Request $request): Response
    {
        $siswaIds = Siswa::where('user_id', auth()->id())->pluck('id')->toArray();

        if (empty($siswaIds)) {
            return Inertia::render('orangtua/galeri/index', [
                'fotos'       => ['data' => [], 'links' => [], 'meta' => []],
                'siswaList'   => [],
                'filters'     => [],
            ]);
        }

        $siswaId    = $request->input('siswa_id', $siswaIds[0]);
        $semester   = $request->input('semester');
        $tahunAjaran = $request->input('tahun_ajaran');

        // Validasi siswa milik orangtua ini
        if (! in_array((int) $siswaId, $siswaIds)) {
            $siswaId = $siswaIds[0];
        }

        $query = DailyReport::where('siswa_id', $siswaId)
            ->whereNotNull('foto_kegiatan')
            ->where('foto_kegiatan', '!=', '')
            ->orderByDesc('tanggal');

        // Filter semester
        if ($semester && $tahunAjaran) {
            $tahunMulai = (int) explode('/', $tahunAjaran)[0];
            if ($semester == 1) {
                $dari   = Carbon::create($tahunMulai, 7, 1)->startOfMonth();
                $sampai = Carbon::create($tahunMulai, 12, 31)->endOfMonth();
            } else {
                $dari   = Carbon::create($tahunMulai + 1, 1, 1)->startOfMonth();
                $sampai = Carbon::create($tahunMulai + 1, 6, 30)->endOfMonth();
            }
            $query->whereBetween('tanggal', [$dari, $sampai]);
        }

        $fotos = $query->paginate(12)->through(fn ($r) => [
            'id'       => $r->id,
            'foto'     => $r->foto_kegiatan,
            'tanggal'  => Carbon::parse($r->tanggal)->locale('id')->isoFormat('D MMM Y'),
            'activity' => $r->activity,
        ])->withQueryString();

        $siswaList = Siswa::whereIn('id', $siswaIds)
            ->select('id', 'nama_panggilan', 'nama_lengkap')
            ->get()
            ->map(fn ($s) => [
                'id'   => $s->id,
                'nama' => $s->nama_panggilan ?: $s->nama_lengkap,
            ]);

        return Inertia::render('orangtua/galeri/index', [
            'fotos'      => $fotos,
            'siswaList'  => $siswaList,
            'filters'    => [
                'siswa_id'    => (int) $siswaId,
                'semester'    => $semester ? (int) $semester : null,
                'tahun_ajaran' => $tahunAjaran,
            ],
        ]);
    }
}
