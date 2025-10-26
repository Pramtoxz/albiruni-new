<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuMakanan extends Model
{
    protected $table = 'menu_makanan';

    protected $fillable = [
        'nama_menu',
        'jenis',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
