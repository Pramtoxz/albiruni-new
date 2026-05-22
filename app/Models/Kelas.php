<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    protected $table = 'kelas';

    protected $fillable = [
        'nama_kelas',
        'kategori',
        'deskripsi',
        'spp',
    ];

    protected $casts = [
        'spp' => 'decimal:2',
    ];

    public function getKategoriMenuAttribute(): string
    {
        return $this->kategori ?? 'anak';
    }

    public function raporPerkembanganTemplates(): HasMany
    {
        return $this->hasMany(RaporPerkembanganTemplate::class);
    }

    public function raporPenutupTemplates(): HasMany
    {
        return $this->hasMany(RaporPenutupTemplate::class);
    }
}
