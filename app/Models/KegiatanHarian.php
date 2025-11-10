<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class KegiatanHarian extends Model
{
    protected $table = 'kegiatan_harian';

    protected $fillable = [
        'rencana_pembelajaran_id',
        'hari',
        'tanggal',
        'nama_aktivitas',
        'deskripsi',
        'target_perkembangan',
        'alat_bahan',
        'instruksi',
        'foto_kegiatan',
        'video_url',
        'file_materi',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];

    protected $appends = ['kelas_id'];

    public function rencanaPembelajaran(): BelongsTo
    {
        return $this->belongsTo(RencanaPembelajaran::class);
    }

    // Accessor untuk mendapatkan kelas_id dari rencana pembelajaran
    protected function kelasId(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->rencanaPembelajaran?->kelas_id,
        );
    }

    // Scope untuk filter by hari
    public function scopeForHari($query, $hari)
    {
        return $query->where('hari', $hari);
    }

    // Scope untuk filter by tanggal
    public function scopeForTanggal($query, $tanggal)
    {
        return $query->where('tanggal', $tanggal);
    }

    // Scope untuk filter by kelas_id
    public function scopeForKelas($query, $kelasId)
    {
        return $query->whereHas('rencanaPembelajaran', function ($q) use ($kelasId) {
            $q->where('kelas_id', $kelasId);
        });
    }
}
