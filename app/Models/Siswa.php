<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Siswa extends Model
{
    protected $table = 'siswa';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'nama_panggilan',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'kewarganegaraan',
        'anak_ke',
        'jumlah_saudara_kandung',
        'bahasa_sehari_hari',
        'foto_siswa',
        'berat_badan',
        'tinggi_badan',
        'golongan_darah',
        'riwayat_penyakit',
        'alasan_rawat_inap',
        'riwayat_alergi_makanan',
        'ayah_nama_lengkap',
        'ayah_tempat_tanggal_lahir',
        'ayah_pekerjaan',
        'ayah_pendidikan_terakhir',
        'ayah_nomor_identitas',
        'ayah_alamat_rumah',
        'ayah_telepon_rumah',
        'ayah_alamat_kantor',
        'ayah_telepon_kantor',
        'ayah_no_hp',
        'ibu_nama_lengkap',
        'ibu_tempat_tanggal_lahir',
        'ibu_pekerjaan',
        'ibu_pendidikan_terakhir',
        'ibu_nomor_identitas',
        'ibu_alamat_rumah',
        'ibu_telepon_rumah',
        'ibu_alamat_kantor',
        'ibu_telepon_kantor',
        'ibu_no_hp',
        'kontak_darurat_nama_lengkap',
        'kontak_darurat_hubungan',
        'kontak_darurat_pekerjaan',
        'kontak_darurat_nomor_identitas',
        'kontak_darurat_alamat_rumah',
        'kontak_darurat_telepon_rumah',
        'kontak_darurat_alamat_kantor',
        'kontak_darurat_telepon_kantor',
        'kontak_darurat_no_hp',
        'lokasi_pendaftaran',
        'tanggal_pendaftaran',
        'status_siswa',
        'jenis_pembayaran',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_pendaftaran' => 'date',
        'berat_badan' => 'decimal:2',
        'tinggi_badan' => 'decimal:2',
        'status_siswa' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
