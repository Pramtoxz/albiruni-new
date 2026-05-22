<?php

namespace App\Http\Controllers\Orangtua;

use App\Constants\WhoGrowthStandards;
use App\Http\Controllers\Controller;
use App\Models\Rapor;
use App\Models\RaporPerkembangan;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class RaporController extends Controller
{
    private function getAnakSiswaIds(): array
    {
        return Siswa::where('user_id', auth()->id())
            ->pluck('id')
            ->toArray();
    }

    public function index(): Response
    {
        $siswaIds = $this->getAnakSiswaIds();

        $rapors = Rapor::with(['siswa:id,nama_lengkap,nama_panggilan'])
            ->whereIn('siswa_id', $siswaIds)
            ->where('status', 'final')
            ->orderByDesc('tahun_ajaran')
            ->orderBy('semester')
            ->get()
            ->map(fn ($r) => [
                'id'           => $r->id,
                'siswa'        => $r->siswa,
                'semester'     => $r->semester,
                'tahun_ajaran' => $r->tahun_ajaran,
                'created_at'   => $r->created_at->format('d M Y'),
            ]);

        return Inertia::render('orangtua/rapor/index', [
            'rapors' => $rapors,
        ]);
    }

    public function show(Rapor $rapor): Response|RedirectResponse
    {
        $siswaIds = $this->getAnakSiswaIds();
        if (! in_array($rapor->siswa_id, $siswaIds) || ! $rapor->isFinal()) {
            abort(403);
        }

        $rapor->load([
            'siswa.kelas:id,nama_kelas',
            'pertumbuhans',
            'perkembangans',
            'creator:id,name',
        ]);

        $siswa    = $rapor->siswa;
        $sex      = strtolower($siswa->jenis_kelamin ?? '') === 'laki-laki' ? 'boys' : 'girls';
        $usiaAwal = $this->hitungUsiaAwalSemester($siswa->tanggal_lahir, $rapor->semester, $rapor->tahun_ajaran);

        $createdAt = $rapor->created_at
            ->setTimezone('Asia/Jakarta')
            ->isoFormat('D MMMM Y, HH:mm');

        $whoData = [
            'wfa'  => WhoGrowthStandards::getObjects('wfa', $sex),
            'lhfa' => WhoGrowthStandards::getObjects('lhfa', $sex),
            'hcfa' => WhoGrowthStandards::getObjects('hcfa', $sex),
        ];

        return Inertia::render('orangtua/rapor/show', [
            'rapor'            => array_merge($rapor->toArray(), ['created_at' => $createdAt]),
            'aspekLabels'      => RaporPerkembangan::ASPEK_LABELS,
            'statusLabels'     => RaporPerkembangan::STATUS_LABELS,
            'whoData'          => $whoData,
            'usiaAwalSemester' => $usiaAwal,
            'sex'              => $sex,
        ]);
    }

    public function pdf(Rapor $rapor): HttpResponse
    {
        $siswaIds = $this->getAnakSiswaIds();
        if (! in_array($rapor->siswa_id, $siswaIds) || ! $rapor->isFinal()) {
            abort(403);
        }

        $rapor->load([
            'siswa.kelas:id,nama_kelas',
            'pertumbuhans',
            'perkembangans',
            'creator:id,name',
        ]);

        $siswa    = $rapor->siswa;
        $sex      = strtolower($siswa->jenis_kelamin ?? '') === 'laki-laki' ? 'boys' : 'girls';
        $usiaAwal = $this->hitungUsiaAwalSemester($siswa->tanggal_lahir, $rapor->semester, $rapor->tahun_ajaran);

        $whoData = [
            'wfa'  => WhoGrowthStandards::get('wfa', $sex),
            'lhfa' => WhoGrowthStandards::get('lhfa', $sex),
            'hcfa' => WhoGrowthStandards::get('hcfa', $sex),
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.rapor', [
            'rapor'            => $rapor,
            'siswa'            => $siswa,
            'whoData'          => $whoData,
            'usiaAwalSemester' => $usiaAwal,
            'sex'              => $sex,
            'aspekLabels'      => RaporPerkembangan::ASPEK_LABELS,
            'statusLabels'     => RaporPerkembangan::STATUS_LABELS,
        ])->setPaper('a4', 'portrait');

        $filename = "Rapor-{$siswa->nama_lengkap}-Sem{$rapor->semester}-{$rapor->tahun_ajaran}.pdf";
        $filename = preg_replace('/[^A-Za-z0-9\-_.]/', '_', $filename);

        return $pdf->download($filename);
    }

    private function hitungUsiaAwalSemester(?\Carbon\Carbon $tanggalLahir, int $semester, string $tahunAjaran): int
    {
        if (! $tanggalLahir) return 0;

        $tahunMulai = (int) explode('/', $tahunAjaran)[0];
        $bulanMulai = $semester === 1 ? 7 : 1;
        $tahunBulan = $semester === 1 ? $tahunMulai : $tahunMulai + 1;

        return (int) $tanggalLahir->diffInMonths(\Carbon\Carbon::create($tahunBulan, $bulanMulai, 1));
    }
}
