<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    /**
     * Get kategori menu - now directly from database field
     */
    public function getKategoriMenuAttribute(): string
    {
        return $this->kategori ?? 'anak';
    }
}
