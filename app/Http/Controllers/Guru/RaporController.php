<?php

namespace App\Http\Controllers\Guru;

use App\Constants\WhoGrowthStandards;
use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Rapor;
use App\Services\NotificationService;
use App\Models\RaporPerkembangan;
use App\Models\RaporPerkembanganTemplate;
use App\Models\RaporPenutupTemplate;
use App\Models\RaporPertumbuhan;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class RaporController extends Controller
{
    private function getAccessibleSiswaIds(): array
    {
        $user = auth()->user();
        $guru = $user->guru;

        if (! $guru) {
            return [];
        }

        $mainGuruId = $guru->getMainGuruId();

        return Siswa::where('guru_id', $mainGuruId)
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();
    }

    public function index(): Response
    {
        $siswaIds = $this->getAccessibleSiswaIds();

        $rapors = Rapor::with(['siswa:id,nama_lengkap,nama_panggilan,jenis_kelamin', 'creator:id,name'])
            ->whereIn('siswa_id', $siswaIds)
            ->orderByDesc('tahun_ajaran')
            ->orderBy('semester')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($r) => [
                'id'           => $r->id,
                'siswa'        => $r->siswa,
                'semester'     => $r->semester,
                'tahun_ajaran' => $r->tahun_ajaran,
                'status'       => $r->status,
                'guru_kelas'   => $r->guru_kelas,
                'created_at'   => $r->created_at->format('d M Y'),
                'created_by'   => $r->creator->name ?? '-',
            ]);

        return Inertia::render('guru/rapor/index', [
            'rapors' => $rapors,
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        if ($redirect = $this->checkRaporAktif()) return $redirect;
        $siswaIds = $this->getAccessibleSiswaIds();

        $siswaList = Siswa::with('kelas:id,nama_kelas')
            ->whereIn('id', $siswaIds)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nama_panggilan', 'kelas_id', 'jenis_kelamin', 'tanggal_lahir']);

        $kelasIds = $siswaList->pluck('kelas_id')->filter()->unique()->values();

        $perkembanganTemplates = RaporPerkembanganTemplate::whereIn('kelas_id', $kelasIds)
            ->get(['kelas_id', 'aspek', 'indikator', 'narasi_bsb', 'narasi_bsh', 'narasi_mb', 'narasi_bb'])
            ->groupBy('kelas_id');

        $penutupTemplates = RaporPenutupTemplate::whereIn('kelas_id', $kelasIds)
            ->get(['kelas_id', 'kategori', 'narasi_template'])
            ->groupBy('kelas_id');

        $user     = auth()->user();
        $guruNama = $user->guru?->nama_lengkap ?? $user->name;

        return Inertia::render('guru/rapor/create', [
            'siswaList'             => $siswaList,
            'aspekList'             => RaporPerkembangan::ASPEK_LABELS,
            'statusList'            => RaporPerkembangan::STATUS_LABELS,
            'raporSemester'         => AppSetting::get('rapor_semester', '1'),
            'raporTahunAjaran'      => AppSetting::get('rapor_tahun_ajaran', $this->currentTahunAjaran()),
            'guruNama'              => $guruNama,
            'perkembanganTemplates' => $perkembanganTemplates,
            'penutupTemplates'      => $penutupTemplates,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if ($redirect = $this->checkRaporAktif()) return $redirect;

        $validated = $request->validate([
            'siswa_id'                    => 'required|exists:siswa,id',
            'semester'                    => 'required|in:1,2',
            'tahun_ajaran'                => 'required|string|max:20',
            'guru_kelas'                  => 'nullable|string|max:255',
            'penutup_umum'                => 'nullable|string',
            'penutup_motivasi_orangtua'   => 'nullable|string',
            'penutup_penguatan_positif'   => 'nullable|string',
            'pertumbuhan'    => 'nullable|array',
            'pertumbuhan.*.bulan'         => 'required|integer|min:1|max:12',
            'pertumbuhan.*.berat_badan'   => 'nullable|numeric|min:0|max:200',
            'pertumbuhan.*.tinggi_badan'  => 'nullable|numeric|min:0|max:250',
            'pertumbuhan.*.lingkar_kepala' => 'nullable|numeric|min:0|max:100',
            'perkembangan'   => 'nullable|array',
            'perkembangan.*.aspek'  => 'required|in:' . implode(',', array_keys(RaporPerkembangan::ASPEK_LABELS)),
            'perkembangan.*.status' => 'nullable|in:BB,MB,BSH,BSB',
            'perkembangan.*.narasi' => 'nullable|string',
        ]);

        $siswaIds = $this->getAccessibleSiswaIds();
        if (! in_array($validated['siswa_id'], $siswaIds)) {
            abort(403);
        }

        $exists = Rapor::where('siswa_id', $validated['siswa_id'])
            ->where('semester', $validated['semester'])
            ->where('tahun_ajaran', $validated['tahun_ajaran'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['siswa_id' => 'Rapor untuk siswa ini pada semester dan tahun ajaran tersebut sudah ada.']);
        }

        $rapor = Rapor::create([
            'siswa_id'     => $validated['siswa_id'],
            'created_by'   => auth()->id(),
            'semester'     => $validated['semester'],
            'tahun_ajaran' => $validated['tahun_ajaran'],
            'status'       => 'draft',
            'guru_kelas'                 => $validated['guru_kelas'] ?? null,
            'penutup_umum'               => $validated['penutup_umum'] ?? null,
            'penutup_motivasi_orangtua'  => $validated['penutup_motivasi_orangtua'] ?? null,
            'penutup_penguatan_positif'  => $validated['penutup_penguatan_positif'] ?? null,
        ]);

        foreach ($validated['pertumbuhan'] ?? [] as $item) {
            if (! empty($item['berat_badan']) || ! empty($item['tinggi_badan']) || ! empty($item['lingkar_kepala'])) {
                RaporPertumbuhan::create([
                    'rapor_id'      => $rapor->id,
                    'bulan'         => $item['bulan'],
                    'berat_badan'   => $item['berat_badan'] ?? null,
                    'tinggi_badan'  => $item['tinggi_badan'] ?? null,
                    'lingkar_kepala' => $item['lingkar_kepala'] ?? null,
                ]);
            }
        }

        foreach ($validated['perkembangan'] ?? [] as $item) {
            RaporPerkembangan::create([
                'rapor_id' => $rapor->id,
                'aspek'    => $item['aspek'],
                'status'   => $item['status'] ?? null,
                'narasi'   => $item['narasi'] ?? null,
            ]);
        }

        return redirect()->route('guru.rapor.show', $rapor)
            ->with('success', 'Rapor berhasil disimpan sebagai draft.');
    }

    public function show(Rapor $rapor): Response|RedirectResponse
    {
        $this->authorizeRapor($rapor);

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

        return Inertia::render('guru/rapor/show', [
            'rapor'            => array_merge($rapor->toArray(), ['created_at' => $createdAt]),
            'aspekLabels'      => RaporPerkembangan::ASPEK_LABELS,
            'statusLabels'     => RaporPerkembangan::STATUS_LABELS,
            'whoData'          => $whoData,
            'usiaAwalSemester' => $usiaAwal,
        ]);
    }

    public function edit(Rapor $rapor): Response|RedirectResponse
    {
        if ($redirect = $this->checkRaporAktif()) return $redirect;
        $this->authorizeRapor($rapor);

        if ($rapor->isFinal()) {
            return redirect()->route('guru.rapor.show', $rapor)
                ->with('error', 'Rapor sudah final dan tidak bisa diedit.');
        }

        $rapor->load(['pertumbuhans', 'perkembangans', 'siswa:id,kelas_id,nama_panggilan,nama_lengkap']);

        $kelasId = $rapor->siswa?->kelas_id;

        $perkembanganTemplates = $kelasId
            ? RaporPerkembanganTemplate::where('kelas_id', $kelasId)
                ->get(['kelas_id', 'aspek', 'indikator', 'narasi_bsb', 'narasi_bsh', 'narasi_mb', 'narasi_bb'])
                ->keyBy('aspek')
            : collect();

        $penutupTemplates = $kelasId
            ? RaporPenutupTemplate::where('kelas_id', $kelasId)
                ->get(['kelas_id', 'kategori', 'narasi_template'])
                ->keyBy('kategori')
            : collect();

        return Inertia::render('guru/rapor/edit', [
            'rapor'                  => $rapor,
            'aspekList'              => RaporPerkembangan::ASPEK_LABELS,
            'statusList'             => RaporPerkembangan::STATUS_LABELS,
            'perkembanganTemplates'  => $perkembanganTemplates,
            'penutupTemplates'       => $penutupTemplates,
        ]);
    }

    public function update(Request $request, Rapor $rapor): RedirectResponse
    {
        if ($redirect = $this->checkRaporAktif()) return $redirect;
        $this->authorizeRapor($rapor);

        if ($rapor->isFinal()) {
            return redirect()->route('guru.rapor.show', $rapor)
                ->with('error', 'Rapor sudah final dan tidak bisa diedit.');
        }

        $validated = $request->validate([
            'guru_kelas'                  => 'nullable|string|max:255',
            'penutup_umum'                => 'nullable|string',
            'penutup_motivasi_orangtua'   => 'nullable|string',
            'penutup_penguatan_positif'   => 'nullable|string',
            'pertumbuhan'    => 'nullable|array',
            'pertumbuhan.*.bulan'          => 'required|integer|min:1|max:12',
            'pertumbuhan.*.berat_badan'    => 'nullable|numeric|min:0|max:200',
            'pertumbuhan.*.tinggi_badan'   => 'nullable|numeric|min:0|max:250',
            'pertumbuhan.*.lingkar_kepala' => 'nullable|numeric|min:0|max:100',
            'perkembangan'   => 'nullable|array',
            'perkembangan.*.aspek'  => 'required|in:' . implode(',', array_keys(RaporPerkembangan::ASPEK_LABELS)),
            'perkembangan.*.status' => 'nullable|in:BB,MB,BSH,BSB',
            'perkembangan.*.narasi' => 'nullable|string',
        ]);

        $rapor->update([
            'guru_kelas'                 => $validated['guru_kelas'] ?? $rapor->guru_kelas,
            'penutup_umum'               => $validated['penutup_umum'] ?? null,
            'penutup_motivasi_orangtua'  => $validated['penutup_motivasi_orangtua'] ?? null,
            'penutup_penguatan_positif'  => $validated['penutup_penguatan_positif'] ?? null,
        ]);

        $rapor->pertumbuhans()->delete();
        foreach ($validated['pertumbuhan'] ?? [] as $item) {
            if (! empty($item['berat_badan']) || ! empty($item['tinggi_badan']) || ! empty($item['lingkar_kepala'])) {
                RaporPertumbuhan::create([
                    'rapor_id'       => $rapor->id,
                    'bulan'          => $item['bulan'],
                    'berat_badan'    => $item['berat_badan'] ?? null,
                    'tinggi_badan'   => $item['tinggi_badan'] ?? null,
                    'lingkar_kepala' => $item['lingkar_kepala'] ?? null,
                ]);
            }
        }

        $rapor->perkembangans()->delete();
        foreach ($validated['perkembangan'] ?? [] as $item) {
            RaporPerkembangan::create([
                'rapor_id' => $rapor->id,
                'aspek'    => $item['aspek'],
                'status'   => $item['status'] ?? null,
                'narasi'   => $item['narasi'] ?? null,
            ]);
        }

        return redirect()->route('guru.rapor.show', $rapor)
            ->with('success', 'Rapor berhasil diperbarui.');
    }

    public function finalize(Rapor $rapor): RedirectResponse
    {
        if ($redirect = $this->checkRaporAktif()) return $redirect;
        $this->authorizeRapor($rapor);

        if ($rapor->isFinal()) {
            return redirect()->route('guru.rapor.show', $rapor)
                ->with('info', 'Rapor sudah final.');
        }

        $rapor->update(['status' => 'final']);

        dispatch(function () use ($rapor) {
            app(NotificationService::class)->sendRaporFinalisasi($rapor);
        })->afterResponse();

        return redirect()->route('guru.rapor.show', $rapor)
            ->with('success', 'Rapor berhasil difinalisasi dan siap dicetak.');
    }

    public function pdf(Rapor $rapor): HttpResponse
    {
        $this->authorizeRapor($rapor);

        $rapor->load([
            'siswa.kelas:id,nama_kelas',
            'pertumbuhans',
            'perkembangans',
            'creator:id,name',
        ]);

        $siswa    = $rapor->siswa;
        $sex      = strtolower($siswa->jenis_kelamin ?? '') === 'laki-laki' ? 'boys' : 'girls';
        $usiaAwal = $this->hitungUsiaAwalSemester($siswa->tanggal_lahir, $rapor->semester, $rapor->tahun_ajaran);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.rapor', [
            'rapor'            => $rapor,
            'siswa'            => $siswa,
            'usiaAwalSemester' => $usiaAwal,
            'sex'              => $sex,
            'aspekLabels'      => RaporPerkembangan::ASPEK_LABELS,
            'statusLabels'     => RaporPerkembangan::STATUS_LABELS,
            'qrCodePng'        => $this->buildQrPng(route('rapor.verify', $rapor->id)),
            'galeriQrPng'      => $this->buildQrPng(\Illuminate\Support\Facades\URL::signedRoute('rapor.galeri.publik', ['rapor' => $rapor->id])),
            'kepsekSrc'        => $this->buildKepsekSrc(),
            'namaKepsek'       => \App\Models\AppSetting::get('nama_kepala_sekolah', '_______________'),
        ])->setPaper('a4', 'portrait');

        $filename = "Rapor-{$siswa->nama_lengkap}-Sem{$rapor->semester}-{$rapor->tahun_ajaran}.pdf";
        $filename = preg_replace('/[^A-Za-z0-9\-_.]/', '_', $filename);

        return $pdf->download($filename);
    }

    private function checkRaporAktif(): ?RedirectResponse
    {
        if (AppSetting::get('rapor_aktif', '0') !== '1') {
            return redirect()->route('guru.rapor.index')
                ->with('error', 'Pengisian rapor sedang ditutup oleh admin. Silakan hubungi admin untuk informasi lebih lanjut.');
        }
        return null;
    }

    private function authorizeRapor(Rapor $rapor): void
    {
        $siswaIds = $this->getAccessibleSiswaIds();
        if (! in_array($rapor->siswa_id, $siswaIds)) {
            abort(403);
        }
    }

    private function currentTahunAjaran(): string
    {
        $now   = now();
        $year  = $now->month >= 7 ? $now->year : $now->year - 1;
        return "{$year}/" . ($year + 1);
    }

    private function hitungUsiaAwalSemester(?\Carbon\Carbon $tanggalLahir, int $semester, string $tahunAjaran): int
    {
        if (! $tanggalLahir) {
            return 0;
        }

        $tahunMulai = (int) explode('/', $tahunAjaran)[0];
        $bulanMulai = $semester === 1 ? 7 : 1;
        $tahunBulan = $semester === 1 ? $tahunMulai : $tahunMulai + 1;

        $awalSemester = \Carbon\Carbon::create($tahunBulan, $bulanMulai, 1);

        return (int) $tanggalLahir->diffInMonths($awalSemester);
    }

    private function buildQrPng(string $url): string
    {
        $qr     = \BaconQrCode\Encoder\Encoder::encode($url, \BaconQrCode\Common\ErrorCorrectionLevel::M());
        $matrix = $qr->getMatrix();
        $size   = $matrix->getWidth();

        $mod    = 4;
        $margin = 10;
        $dim    = $size * $mod + 2 * $margin;
        $img    = imagecreatetruecolor($dim, $dim);
        $white  = imagecolorallocate($img, 255, 255, 255);
        $black  = imagecolorallocate($img, 0, 0, 0);
        imagefill($img, 0, 0, $white);

        for ($y = 0; $y < $size; $y++) {
            for ($x = 0; $x < $size; $x++) {
                if ($matrix->get($x, $y) === 1) {
                    imagefilledrectangle(
                        $img,
                        $margin + $x * $mod, $margin + $y * $mod,
                        $margin + ($x + 1) * $mod - 1, $margin + ($y + 1) * $mod - 1,
                        $black
                    );
                }
            }
        }

        ob_start();
        imagepng($img);
        $png = ob_get_clean();
        imagedestroy($img);

        return 'data:image/png;base64,' . base64_encode($png);
    }

    private function buildKepsekSrc(): ?string
    {
        $path = public_path('assets/images/ttd/kepsek.png');
        return file_exists($path)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($path))
            : null;
    }
}
