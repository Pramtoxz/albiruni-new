<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RaporPerkembanganTemplate extends Model
{
    protected $fillable = [
        'kelas_id',
        'aspek',
        'indikator',
        'contoh_narasi',
        'narasi_bsb',
        'narasi_bsh',
        'narasi_mb',
        'narasi_bb',
    ];

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function getNarasiByStatus(string $status): ?string
    {
        return match ($status) {
            'BSB' => $this->narasi_bsb,
            'BSH' => $this->narasi_bsh,
            'MB'  => $this->narasi_mb,
            'BB'  => $this->narasi_bb,
            default => null,
        };
    }
}
