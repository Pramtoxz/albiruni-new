<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PembayaranSpp extends Model
{
    protected $table = 'pembayaran_spp';

    protected $fillable = [
        'siswa_id',
        'kelas_id',
        'bulan',
        'tahun',
        'biaya',
        'tanggal_bayar',
        'bukti_bayar',
        'status_bayar',
        'catatan_admin',
    ];

    protected $casts = [
        'biaya' => 'decimal:2',
        'tanggal_bayar' => 'date',
        'tahun' => 'integer',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }
}
