<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyReport extends Model
{
    protected $fillable = [
        'user_id',
        'siswa_id',
        'tanggal',
        'mood',
        'activity',
        'sarapan_pagi',
        'sarapan_status',
        'makan_siang',
        'makan_siang_status',
        'snack_sore',
        'snack_status',
        'minum_air_putih',
        'minum_susu',
        'tidur_siang',
        'tidur_siang_durasi',
        'bak',
        'bak_frekuensi',
        'bab',
        'bab_frekuensi',
        'kebutuhan_besok',
        'catatan_khusus',
        'catatan_insiden',
        'foto_kegiatan',
        'is_final',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'tidur_siang' => 'boolean',
        'bak' => 'boolean',
        'bab' => 'boolean',
        'is_final' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }
}
