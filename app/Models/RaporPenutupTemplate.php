<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RaporPenutupTemplate extends Model
{
    public const KATEGORI_LABELS = [
        'penutup_umum'         => 'Penutup Umum',
        'motivasi_orangtua'    => 'Motivasi untuk Orang Tua',
        'penguatan_positif'    => 'Penguatan Positif',
    ];

    protected $fillable = [
        'kelas_id',
        'kategori',
        'narasi_template',
    ];

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }
}
