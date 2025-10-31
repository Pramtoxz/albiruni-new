<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'tanggal' => 'date',
    ];

    public function rencanaPembelajaran(): BelongsTo
    {
        return $this->belongsTo(RencanaPembelajaran::class);
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
}
