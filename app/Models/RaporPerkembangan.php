<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RaporPerkembangan extends Model
{
    public const ASPEK_LABELS = [
        'agama_moral'      => 'Nilai Agama & Moral',
        'motorik_kasar'    => 'Motorik Kasar',
        'motorik_halus'    => 'Motorik Halus',
        'kognitif'         => 'Kognitif',
        'bahasa'           => 'Bahasa',
        'sosial_emosional' => 'Sosial Emosional',
        'kemandirian'      => 'Kemandirian',
    ];

    public const STATUS_LABELS = [
        'BB'  => 'Belum Berkembang',
        'MB'  => 'Mulai Berkembang',
        'BSH' => 'Berkembang Sesuai Harapan',
        'BSB' => 'Berkembang Sangat Baik',
    ];

    protected $fillable = [
        'rapor_id',
        'aspek',
        'status',
        'narasi',
    ];

    public function rapor(): BelongsTo
    {
        return $this->belongsTo(Rapor::class);
    }

    public function getAspekLabelAttribute(): string
    {
        return self::ASPEK_LABELS[$this->aspek] ?? $this->aspek;
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->status] ?? $this->status;
    }
}
