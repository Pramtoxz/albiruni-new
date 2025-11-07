<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kehadiran extends Model
{
    protected $table = 'kehadiran';

    protected $fillable = [
        'siswa_id',
        'tanggal',
        'waktu_hadir',
        'jenis_interaksi',
        'waktu_pulang',
        'rating',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'waktu_hadir' => 'datetime:H:i:s',
        'waktu_pulang' => 'datetime:H:i:s',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }
}
