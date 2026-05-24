<?php

namespace App\Imports;

use App\Models\RaporPerkembangan;
use App\Models\RaporPerkembanganTemplate;
use App\Models\RaporPenutupTemplate;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class TemplateRaporImport implements WithMultipleSheets
{
    public function __construct(private int $kelasId) {}

    public function sheets(): array
    {
        return [
            0 => new TemplateRaporSectionBImport($this->kelasId),
            1 => new TemplateRaporSectionCImport($this->kelasId),
        ];
    }
}

class TemplateRaporSectionBImport implements
    \Maatwebsite\Excel\Concerns\ToCollection,
    \Maatwebsite\Excel\Concerns\WithHeadingRow
{
    private const ASPEK_MAP = [
        'nilai agama & moral' => 'agama_moral',
        'motorik kasar'       => 'motorik_kasar',
        'motorik halus'       => 'motorik_halus',
        'kognitif'            => 'kognitif',
        'bahasa'              => 'bahasa',
        'sosial emosional'    => 'sosial_emosional',
        'kemandirian'         => 'kemandirian',
    ];

    public function __construct(private int $kelasId) {}

    public function collection(\Illuminate\Support\Collection $rows): void
    {
        foreach ($rows as $row) {
            $aspekLabel = strtolower(trim($row['aspek'] ?? ''));
            $aspek = self::ASPEK_MAP[$aspekLabel] ?? null;

            if (! $aspek) continue;

            RaporPerkembanganTemplate::updateOrCreate(
                ['kelas_id' => $this->kelasId, 'aspek' => $aspek],
                [
                    'indikator'     => $row['indikator_yang_diamati'] ?? null,
                    'contoh_narasi' => $row['contoh_narasi'] ?? null,
                    'narasi_bsb'    => $row['bsb'] ?? null,
                    'narasi_bsh'    => $row['bsh'] ?? null,
                    'narasi_mb'     => $row['mb'] ?? null,
                    'narasi_bb'     => $row['bb'] ?? null,
                ]
            );
        }
    }
}

class TemplateRaporSectionCImport implements
    \Maatwebsite\Excel\Concerns\ToCollection,
    \Maatwebsite\Excel\Concerns\WithHeadingRow
{
    private const KATEGORI_MAP = [
        'penutup umum'              => 'penutup_umum',
        'motivasi untuk orang tua'  => 'motivasi_orangtua',
        'penguatan positif'         => 'penguatan_positif',
    ];

    public function __construct(private int $kelasId) {}

    public function collection(\Illuminate\Support\Collection $rows): void
    {
        foreach ($rows as $row) {
            $kategoriLabel = strtolower(trim($row['kategori'] ?? ''));
            $kategori = self::KATEGORI_MAP[$kategoriLabel] ?? null;

            if (! $kategori) continue;

            RaporPenutupTemplate::updateOrCreate(
                ['kelas_id' => $this->kelasId, 'kategori' => $kategori],
                ['narasi_template' => $row['narasi_template'] ?? null]
            );
        }
    }
}
