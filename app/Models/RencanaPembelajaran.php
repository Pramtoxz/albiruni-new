<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RencanaPembelajaran extends Model
{
    protected $table = 'rencana_pembelajaran';

    protected $fillable = [
        'nama_rencana',
        'tema',
        'sub_tema',
        'tanggal_mulai',
        'tanggal_selesai',
        'kelas_id',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'is_active' => 'boolean',
    ];

    public function kegiatanHarian(): HasMany
    {
        return $this->hasMany(KegiatanHarian::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scope untuk rencana aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk rencana yang berlaku pada tanggal tertentu
    public function scopeForDate($query, $date)
    {
        return $query->where('tanggal_mulai', '<=', $date)
            ->where('tanggal_selesai', '>=', $date);
    }
}
