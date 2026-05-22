<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rapor extends Model
{
    protected $fillable = [
        'siswa_id',
        'created_by',
        'semester',
        'tahun_ajaran',
        'status',
        'guru_kelas',
        'penutup_umum',
        'penutup_motivasi_orangtua',
        'penutup_penguatan_positif',
    ];

    protected $casts = [
        'semester' => 'integer',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function pertumbuhans(): HasMany
    {
        return $this->hasMany(RaporPertumbuhan::class)->orderBy('bulan');
    }

    public function perkembangans(): HasMany
    {
        return $this->hasMany(RaporPerkembangan::class);
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isFinal(): bool
    {
        return $this->status === 'final';
    }

    public function getSemesterLabel(): string
    {
        return "Semester {$this->semester}";
    }
}
