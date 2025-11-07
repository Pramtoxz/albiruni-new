<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Emosi extends Model
{
      protected $table = 'emosis';

    protected $fillable = [
        'nama_emosi',
        'deskripsi',
    ];

}
