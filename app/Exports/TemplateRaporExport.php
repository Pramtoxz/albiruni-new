<?php

namespace App\Exports;

use App\Models\RaporPerkembangan;
use App\Models\RaporPerkembanganTemplate;
use App\Models\RaporPenutupTemplate;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class TemplateRaporExport implements WithMultipleSheets
{
    use Exportable;

    public function __construct(private int $kelasId) {}

    public function sheets(): array
    {
        return [
            new TemplateRaporSectionBSheet($this->kelasId),
            new TemplateRaporSectionCSheet($this->kelasId),
        ];
    }
}

class TemplateRaporSectionBSheet implements
    \Maatwebsite\Excel\Concerns\WithTitle,
    \Maatwebsite\Excel\Concerns\FromArray,
    \Maatwebsite\Excel\Concerns\WithHeadings,
    \Maatwebsite\Excel\Concerns\WithStyles,
    \Maatwebsite\Excel\Concerns\WithColumnWidths
{
    public function __construct(private int $kelasId) {}

    public function title(): string { return 'Section B - Perkembangan'; }

    public function headings(): array
    {
        return ['Aspek', 'Indikator yang Diamati', 'Contoh Narasi', 'BSB', 'BSH', 'MB', 'BB'];
    }

    public function array(): array
    {
        $templates = RaporPerkembanganTemplate::where('kelas_id', $this->kelasId)
            ->get()
            ->keyBy('aspek');

        return array_map(function ($aspek, $label) use ($templates) {
            $t = $templates->get($aspek);
            return [
                $label,
                $t?->indikator ?? '',
                $t?->contoh_narasi ?? '',
                $t?->narasi_bsb ?? '',
                $t?->narasi_bsh ?? '',
                $t?->narasi_mb ?? '',
                $t?->narasi_bb ?? '',
            ];
        }, array_keys(RaporPerkembangan::ASPEK_LABELS), array_values(RaporPerkembangan::ASPEK_LABELS));
    }

    public function styles(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }

    public function columnWidths(): array
    {
        return ['A' => 25, 'B' => 30, 'C' => 40, 'D' => 50, 'E' => 50, 'F' => 50, 'G' => 50];
    }
}

class TemplateRaporSectionCSheet implements
    \Maatwebsite\Excel\Concerns\WithTitle,
    \Maatwebsite\Excel\Concerns\FromArray,
    \Maatwebsite\Excel\Concerns\WithHeadings,
    \Maatwebsite\Excel\Concerns\WithStyles,
    \Maatwebsite\Excel\Concerns\WithColumnWidths
{
    private const KATEGORI_LABELS = [
        'penutup_umum'      => 'Penutup Umum',
        'motivasi_orangtua' => 'Motivasi untuk Orang Tua',
        'penguatan_positif' => 'Penguatan Positif',
    ];

    public function __construct(private int $kelasId) {}

    public function title(): string { return 'Section C - Penutup'; }

    public function headings(): array
    {
        return ['Kategori', 'Narasi Template'];
    }

    public function array(): array
    {
        $templates = RaporPenutupTemplate::where('kelas_id', $this->kelasId)
            ->get()
            ->keyBy('kategori');

        return array_map(function ($kategori, $label) use ($templates) {
            $t = $templates->get($kategori);
            return [$label, $t?->narasi_template ?? ''];
        }, array_keys(self::KATEGORI_LABELS), array_values(self::KATEGORI_LABELS));
    }

    public function styles(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }

    public function columnWidths(): array
    {
        return ['A' => 30, 'B' => 80];
    }
}
