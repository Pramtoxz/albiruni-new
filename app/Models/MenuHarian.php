<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuHarian extends Model
{
    protected $table = 'menu_harian';

    protected $fillable = [
        'menu_mingguan_id',
        'hari',
        'waktu_makan',
        'kategori',
        'nama_menu',
    ];

    public function menuMingguan(): BelongsTo
    {
        return $this->belongsTo(MenuMingguan::class);
    }

    // Scope untuk filter by hari
    public function scopeForHari($query, $hari)
    {
        return $query->where('hari', $hari);
    }

    // Scope untuk filter by waktu makan
    public function scopeForWaktuMakan($query, $waktuMakan)
    {
        return $query->where('waktu_makan', $waktuMakan);
    }

    // Scope untuk filter by kategori
    public function scopeForKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }
}
