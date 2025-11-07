<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cabang extends Model
{
    protected $table='cabangs';

      protected $fillable = [
        'id',
        'nama_cabang',
    ];

}
