<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'tanggal' => 'date:Y-m-d',
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

    public function emosis(): BelongsToMany
    {
        return $this->belongsToMany(Emosi::class, 'daily_report_emosi');
    }

    /**
     * Daftar field wajib yang belum diisi.
     * Foto kegiatan sengaja dikecualikan (opsional).
     */
    public function getMissingFields(): array
    {
        $missing = [];

        if (blank($this->mood))            $missing[] = 'Mood';
        if (blank($this->activity))        $missing[] = 'Aktivitas';
        if (blank($this->sarapan_pagi))    $missing[] = 'Menu Sarapan';
        if (blank($this->makan_siang))     $missing[] = 'Menu Makan Siang';
        if (blank($this->minum_air_putih)) $missing[] = 'Minum Air Putih';
        if ($this->bak && blank($this->bak_frekuensi)) $missing[] = 'Frekuensi BAK';
        if ($this->bab && blank($this->bab_frekuensi)) $missing[] = 'Frekuensi BAB';

        // Rating 0 = belum dinilai, -1 = T/A (valid), 1-5 = valid
        if ((int) $this->sarapan_status === 0)     $missing[] = 'Rating Sarapan';
        if ((int) $this->makan_siang_status === 0) $missing[] = 'Rating Makan Siang';
        if ((int) $this->snack_status === 0)       $missing[] = 'Rating Snack';

        return $missing;
    }

    public function isComplete(): bool
    {
        if (!empty($this->getMissingFields())) {
            return false;
        }

        return $this->emosis()->exists();
    }
}
