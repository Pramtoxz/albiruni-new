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
        // Create rencana_pembelajaran table
        Schema::create('rencana_pembelajaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama_rencana');
            $table->string('tema');
            $table->string('sub_tema')->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->boolean('is_active')->default(false);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Create kegiatan_harian table
        Schema::create('kegiatan_harian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rencana_pembelajaran_id')->constrained('rencana_pembelajaran')->onDelete('cascade');
            $table->enum('hari', ['senin', 'selasa', 'rabu', 'kamis', 'jumat']);
            $table->date('tanggal');
            $table->string('nama_aktivitas');
            $table->text('deskripsi');
            $table->text('target_perkembangan');
            $table->text('alat_bahan');
            $table->text('instruksi');
            $table->string('foto_kegiatan')->nullable();
            $table->string('video_url')->nullable();
            $table->string('file_materi')->nullable();
            $table->timestamps();

            // Unique constraint to prevent duplicate entries
            $table->unique(['rencana_pembelajaran_id', 'hari', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kegiatan_harian');
        Schema::dropIfExists('rencana_pembelajaran');
    }
};
