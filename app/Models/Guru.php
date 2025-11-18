<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guru extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guru_utama_id',
        'kelas_id',
        'nip',
        'nama_lengkap',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'pendidikan_terakhir',
        'foto_guru',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date:Y-m-d',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function siswa(): HasMany
    {
        return $this->hasMany(Siswa::class, 'guru_id');
    }

    // Guru utama relationship (for guru pendamping)
    public function guruUtama(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'guru_utama_id');
    }

    // Guru pendamping relationship (for guru utama)
    public function guruPendamping(): HasMany
    {
        return $this->hasMany(Guru::class, 'guru_utama_id');
    }

    /**
     * Check if this guru is a guru pendamping
     */
    public function isGuruPendamping(): bool
    {
        return !is_null($this->guru_utama_id);
    }

    /**
     * Get all siswa that this guru can access
     * - If guru utama: get their own siswa
     * - If guru pendamping: get siswa from guru utama
     */
    public function getAccessibleSiswa()
    {
        if ($this->isGuruPendamping()) {
            // Guru pendamping can access siswa from guru utama
            return Siswa::where('guru_id', $this->guru_utama_id)->get();
        }
        
        // Guru utama can access their own siswa
        return $this->siswa;
    }

    /**
     * Get the main guru ID (either self or guru utama)
     */
    public function getMainGuruId(): int
    {
        return $this->guru_utama_id ?? $this->id;
    }
}
