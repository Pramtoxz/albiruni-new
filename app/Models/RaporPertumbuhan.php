<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RaporPertumbuhan extends Model
{
    protected $fillable = [
        'rapor_id',
        'bulan',
        'berat_badan',
        'tinggi_badan',
        'lingkar_kepala',
    ];

    protected $appends = ['nama_bulan'];

    protected $casts = [
        'bulan' => 'integer',
        'berat_badan' => 'decimal:2',
        'tinggi_badan' => 'decimal:2',
        'lingkar_kepala' => 'decimal:2',
    ];

    public function rapor(): BelongsTo
    {
        return $this->belongsTo(Rapor::class);
    }

    public function getNamaBulanAttribute(): string
    {
        $bulanMap = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret',
            4 => 'April', 5 => 'Mei', 6 => 'Juni',
            7 => 'Juli', 8 => 'Agustus', 9 => 'September',
            10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return $bulanMap[$this->bulan] ?? "-";
    }
}
