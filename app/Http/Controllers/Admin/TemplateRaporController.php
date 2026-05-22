<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\RaporPerkembangan;
use App\Models\RaporPerkembanganTemplate;
use App\Models\RaporPenutupTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TemplateRaporExport;
use App\Imports\TemplateRaporImport;

class TemplateRaporController extends Controller
{
    public function index(): Response
    {
        $this->checkAdmin('daily-report.view');

        $kelasList = Kelas::withCount([
            'raporPerkembanganTemplates as section_b_count',
            'raporPenutupTemplates as section_c_count',
        ])->orderBy('nama_kelas')->get(['id', 'nama_kelas', 'kategori']);

        $aspekCount = count(RaporPerkembangan::ASPEK_LABELS);

        return Inertia::render('admin/template-rapor/index', [
            'kelasList'  => $kelasList,
            'aspekCount' => $aspekCount,
        ]);
    }

    public function edit(Kelas $kelas): Response
    {
        $this->checkAdmin('daily-report.view');

        $perkembanganTemplates = RaporPerkembanganTemplate::where('kelas_id', $kelas->id)
            ->get()
            ->keyBy('aspek');

        $penutupTemplates = RaporPenutupTemplate::where('kelas_id', $kelas->id)
            ->get()
            ->keyBy('kategori');

        return Inertia::render('admin/template-rapor/edit', [
            'kelas'                  => $kelas,
            'aspekList'              => RaporPerkembangan::ASPEK_LABELS,
            'perkembanganTemplates'  => $perkembanganTemplates,
            'penutupTemplates'       => $penutupTemplates,
            'kategoriLabels'         => RaporPenutupTemplate::KATEGORI_LABELS,
        ]);
    }

    public function update(Request $request, Kelas $kelas): RedirectResponse
    {
        $this->checkAdmin('daily-report.view');

        $request->validate([
            'perkembangan'                      => 'nullable|array',
            'perkembangan.*.aspek'              => 'required|string',
            'perkembangan.*.indikator'          => 'nullable|string|max:500',
            'perkembangan.*.contoh_narasi'      => 'nullable|string',
            'perkembangan.*.narasi_bsb'         => 'nullable|string',
            'perkembangan.*.narasi_bsh'         => 'nullable|string',
            'perkembangan.*.narasi_mb'          => 'nullable|string',
            'perkembangan.*.narasi_bb'          => 'nullable|string',
            'penutup'                           => 'nullable|array',
            'penutup.*.kategori'                => 'required|in:penutup_umum,motivasi_orangtua,penguatan_positif',
            'penutup.*.narasi_template'         => 'nullable|string',
        ]);

        foreach ($request->input('perkembangan', []) as $item) {
            RaporPerkembanganTemplate::updateOrCreate(
                ['kelas_id' => $kelas->id, 'aspek' => $item['aspek']],
                [
                    'indikator'     => $item['indikator'] ?? null,
                    'contoh_narasi' => $item['contoh_narasi'] ?? null,
                    'narasi_bsb'    => $item['narasi_bsb'] ?? null,
                    'narasi_bsh'    => $item['narasi_bsh'] ?? null,
                    'narasi_mb'     => $item['narasi_mb'] ?? null,
                    'narasi_bb'     => $item['narasi_bb'] ?? null,
                ]
            );
        }

        foreach ($request->input('penutup', []) as $item) {
            RaporPenutupTemplate::updateOrCreate(
                ['kelas_id' => $kelas->id, 'kategori' => $item['kategori']],
                ['narasi_template' => $item['narasi_template'] ?? null]
            );
        }

        return back()->with('success', 'Template rapor berhasil disimpan.');
    }

    public function export(Kelas $kelas)
    {
        $this->checkAdmin('daily-report.view');

        $filename = 'template-rapor-' . \Str::slug($kelas->nama_kelas) . '.xlsx';

        return Excel::download(new TemplateRaporExport($kelas->id), $filename);
    }

    public function import(Request $request, Kelas $kelas): RedirectResponse
    {
        $this->checkAdmin('daily-report.view');

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        Excel::import(new TemplateRaporImport($kelas->id), $request->file('file'));

        return back()->with('success', 'Template berhasil diimport.');
    }

    private function checkAdmin(string $permission): void
    {
        if (! auth()->user()->hasPermission($permission)) {
            abort(403);
        }
    }
}
