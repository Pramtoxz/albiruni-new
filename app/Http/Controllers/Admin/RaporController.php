<?php

namespace App\Http\Controllers\Admin;

use App\Constants\WhoGrowthStandards;
use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Kelas;
use App\Models\Rapor;
use App\Models\RaporPerkembangan;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RaporController extends Controller
{
    public function index(Request $request): Response
    {
        $this->checkAdmin('daily-report.view');

        $tahunAjaran = $request->input('tahun_ajaran');
        $semester    = $request->input('semester');
        $kelasId     = $request->input('kelas_id');
        $search      = $request->input('search');

        $query = Rapor::with([
            'siswa:id,nama_lengkap,nama_panggilan,kelas_id,jenis_kelamin',
            'siswa.kelas:id,nama_kelas',
            'creator:id,name',
        ]);

        if ($tahunAjaran) {
            $query->where('tahun_ajaran', $tahunAjaran);
        }

        if ($semester) {
            $query->where('semester', $semester);
        }

        if ($kelasId) {
            $query->whereHas('siswa', fn ($q) => $q->where('kelas_id', $kelasId));
        }

        if ($search) {
            $query->whereHas('siswa', fn ($q) => $q->where('nama_lengkap', 'like', "%{$search}%")
                ->orWhere('nama_panggilan', 'like', "%{$search}%"));
        }

        $rapors = $query->orderByDesc('tahun_ajaran')
            ->orderBy('semester')
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(fn ($r) => [
                'id'           => $r->id,
                'siswa'        => $r->siswa,
                'semester'     => $r->semester,
                'tahun_ajaran' => $r->tahun_ajaran,
                'status'       => $r->status,
                'guru_kelas'   => $r->guru_kelas,
                'created_at'   => $r->created_at->format('d M Y'),
                'created_by'   => $r->creator->name ?? '-',
            ]);

        $kelasList      = Kelas::orderBy('nama_kelas')->get(['id', 'nama_kelas']);
        $tahunAjaranList = Rapor::distinct()->orderByDesc('tahun_ajaran')->pluck('tahun_ajaran');

        return Inertia::render('admin/rapor/index', [
            'rapors'           => $rapors,
            'kelasList'        => $kelasList,
            'tahunAjaranList'  => $tahunAjaranList,
            'raporAktif'       => AppSetting::get('rapor_aktif', '0') === '1',
            'raporSemester'    => AppSetting::get('rapor_semester', '1'),
            'raporTahunAjaran' => AppSetting::get('rapor_tahun_ajaran', $this->currentTahunAjaran()),
            'filters'          => [
                'tahun_ajaran' => $tahunAjaran,
                'semester'     => $semester,
                'kelas_id'     => $kelasId,
                'search'       => $search,
            ],
        ]);
    }

    public function show(Rapor $rapor): Response
    {
        $this->checkAdmin('daily-report.view');

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

        return Inertia::render('admin/rapor/show', [
            'rapor'            => array_merge($rapor->toArray(), ['created_at' => $createdAt]),
            'aspekLabels'      => RaporPerkembangan::ASPEK_LABELS,
            'statusLabels'     => RaporPerkembangan::STATUS_LABELS,
            'whoData'          => [
                'wfa'  => WhoGrowthStandards::getObjects('wfa', $sex),
                'lhfa' => WhoGrowthStandards::getObjects('lhfa', $sex),
                'hcfa' => WhoGrowthStandards::getObjects('hcfa', $sex),
            ],
            'usiaAwalSemester' => $usiaAwal,
        ]);
    }

    public function pdf(Rapor $rapor)
    {
        $this->checkAdmin('daily-report.view');

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
            'namaKepsek'       => AppSetting::get('nama_kepala_sekolah', '_______________'),
        ])->setPaper('a4', 'portrait');

        $filename = "Rapor-{$siswa->nama_lengkap}-Sem{$rapor->semester}-{$rapor->tahun_ajaran}.pdf";
        $filename = preg_replace('/[^A-Za-z0-9\-_.]/', '_', $filename);

        return $pdf->stream($filename);
    }

    public function updateSetting(Request $request): RedirectResponse
    {
        $this->checkAdmin('daily-report.view');

        $validated = $request->validate([
            'semester'     => 'required|in:1,2',
            'tahun_ajaran' => 'required|string|max:20|regex:/^\d{4}\/\d{4}$/',
        ]);

        AppSetting::set('rapor_semester', $validated['semester']);
        AppSetting::set('rapor_tahun_ajaran', $validated['tahun_ajaran']);

        return back()->with('success', "Setting rapor Semester {$validated['semester']} TA {$validated['tahun_ajaran']} berhasil disimpan.");
    }

    public function toggleAktif(): RedirectResponse
    {
        $this->checkAdmin('daily-report.view');

        $current = AppSetting::get('rapor_aktif', '0');
        AppSetting::set('rapor_aktif', $current === '1' ? '0' : '1');

        $status = $current === '1' ? 'dinonaktifkan' : 'diaktifkan';

        return back()->with('success', "Pengisian rapor berhasil {$status}.");
    }

    private function currentTahunAjaran(): string
    {
        $now  = now();
        $year = $now->month >= 7 ? $now->year : $now->year - 1;
        return "{$year}/" . ($year + 1);
    }

    private function checkAdmin(string $permission): void
    {
        if (! auth()->user()->hasPermission($permission)) {
            abort(403);
        }
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
