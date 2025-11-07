<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Informasi Umum Siswa
            $table->string('nama_lengkap');
            $table->string('nama_panggilan')->nullable();
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('agama')->nullable();
            $table->string('kewarganegaraan')->default('Indonesia');
            $table->integer('anak_ke')->nullable();
            $table->integer('jumlah_saudara_kandung')->nullable();
            $table->string('bahasa_sehari_hari')->nullable();
            $table->string('foto_siswa')->nullable();
            
            // Informasi Kesehatan Siswa
            $table->decimal('berat_badan', 5, 2)->nullable();
            $table->decimal('tinggi_badan', 5, 2)->nullable();
            $table->string('golongan_darah')->nullable();
            $table->text('riwayat_penyakit')->nullable();
            $table->text('alasan_rawat_inap')->nullable();
            $table->text('riwayat_alergi_makanan')->nullable();
            
            // Data Ayah
            $table->string('ayah_nama_lengkap')->nullable();
            $table->string('ayah_pekerjaan')->nullable();
            $table->string('ayah_pendidikan_terakhir')->nullable();
            $table->string('ayah_nomor_identitas')->nullable();
            $table->text('ayah_alamat_rumah')->nullable();
            $table->string('ayah_telepon_rumah')->nullable();
            $table->text('ayah_alamat_kantor')->nullable();
            $table->string('ayah_telepon_kantor')->nullable();
            $table->string('ayah_no_hp')->nullable();
            
            // Data Ibu
            $table->string('ibu_nama_lengkap')->nullable();
            $table->string('ibu_pekerjaan')->nullable();
            $table->string('ibu_pendidikan_terakhir')->nullable();
            $table->string('ibu_nomor_identitas')->nullable();
            $table->text('ibu_alamat_rumah')->nullable();
            $table->string('ibu_telepon_rumah')->nullable();
            $table->text('ibu_alamat_kantor')->nullable();
            $table->string('ibu_telepon_kantor')->nullable();
            $table->string('ibu_no_hp')->nullable();
            
            // Kontak Darurat
            $table->string('kontak_darurat_nama_lengkap')->nullable();
            $table->string('kontak_darurat_hubungan')->nullable();
            $table->string('kontak_darurat_pekerjaan')->nullable();
            $table->string('kontak_darurat_nomor_identitas')->nullable();
            $table->text('kontak_darurat_alamat_rumah')->nullable();
            $table->string('kontak_darurat_telepon_rumah')->nullable();
            $table->text('kontak_darurat_alamat_kantor')->nullable();
            $table->string('kontak_darurat_telepon_kantor')->nullable();
            $table->string('kontak_darurat_no_hp')->nullable();
            
            // Persetujuan
            $table->string('lokasi_pendaftaran')->nullable();
            $table->date('tanggal_pendaftaran')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
