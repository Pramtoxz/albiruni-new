<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuruKehadiran extends Model
{
    protected $table = 'guru_kehadiran';

    protected $fillable = [
        'guru_id',
        'tanggal',
        'check_in',
        'check_out',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }
}
