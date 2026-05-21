<?php

namespace App\Http\Controllers\Guru;

use App\Constants\WhoGrowthStandards;
use App\Http\Controllers\Controller;
use App\Models\Rapor;
use App\Models\RaporPerkembangan;
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

    public function create(): Response
    {
        $siswaIds = $this->getAccessibleSiswaIds();

        $siswaList = Siswa::with('kelas:id,nama_kelas')
            ->whereIn('id', $siswaIds)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nama_panggilan', 'kelas_id', 'jenis_kelamin', 'tanggal_lahir']);

        return Inertia::render('guru/rapor/create', [
            'siswaList'    => $siswaList,
            'aspekList'    => RaporPerkembangan::ASPEK_LABELS,
            'statusList'   => RaporPerkembangan::STATUS_LABELS,
            'tahunAjaran'  => $this->currentTahunAjaran(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'siswa_id'       => 'required|exists:siswa,id',
            'semester'       => 'required|in:1,2',
            'tahun_ajaran'   => 'required|string|max:20',
            'guru_kelas'     => 'nullable|string|max:255',
            'penutup'        => 'nullable|string',
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
            'guru_kelas'   => $validated['guru_kelas'] ?? null,
            'penutup'      => $validated['penutup'] ?? null,
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
            'sex'              => $sex,
        ]);
    }

    public function edit(Rapor $rapor): Response|RedirectResponse
    {
        $this->authorizeRapor($rapor);

        if ($rapor->isFinal()) {
            return redirect()->route('guru.rapor.show', $rapor)
                ->with('error', 'Rapor sudah final dan tidak bisa diedit.');
        }

        $rapor->load(['pertumbuhans', 'perkembangans']);

        $siswaIds = $this->getAccessibleSiswaIds();
        $siswaList = Siswa::with('kelas:id,nama_kelas')
            ->whereIn('id', $siswaIds)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nama_panggilan', 'kelas_id', 'jenis_kelamin', 'tanggal_lahir']);

        return Inertia::render('guru/rapor/edit', [
            'rapor'       => $rapor,
            'siswaList'   => $siswaList,
            'aspekList'   => RaporPerkembangan::ASPEK_LABELS,
            'statusList'  => RaporPerkembangan::STATUS_LABELS,
        ]);
    }

    public function update(Request $request, Rapor $rapor): RedirectResponse
    {
        $this->authorizeRapor($rapor);

        if ($rapor->isFinal()) {
            return redirect()->route('guru.rapor.show', $rapor)
                ->with('error', 'Rapor sudah final dan tidak bisa diedit.');
        }

        $validated = $request->validate([
            'guru_kelas'     => 'nullable|string|max:255',
            'penutup'        => 'nullable|string',
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
            'guru_kelas' => $validated['guru_kelas'] ?? $rapor->guru_kelas,
            'penutup'    => $validated['penutup'] ?? null,
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
        $this->authorizeRapor($rapor);

        if ($rapor->isFinal()) {
            return redirect()->route('guru.rapor.show', $rapor)
                ->with('info', 'Rapor sudah final.');
        }

        $rapor->update(['status' => 'final']);

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
}
