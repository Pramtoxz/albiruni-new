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
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Guru
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->date('tanggal');
            
            // Mood & Activity
            $table->string('mood')->nullable(); // Happy, Sad, Neutral, etc
            $table->text('activity')->nullable();
            
            // Menu Makanan
            $table->string('sarapan_pagi')->nullable();
            $table->enum('sarapan_status', ['habis', 'dimakan', 'tidak dimakan'])->nullable();
            $table->string('makan_siang')->nullable();
            $table->enum('makan_siang_status', ['habis', 'dimakan', 'tidak dimakan'])->nullable();
            $table->string('snack_sore')->nullable();
            $table->enum('snack_status', ['habis', 'dimakan', 'tidak dimakan'])->nullable();
            
            // Minum
            $table->string('minum_air_putih')->nullable(); // ml
            $table->string('minum_susu')->nullable(); // ml
            
            // Tidur & Toilet
            $table->boolean('tidur_siang')->default(false);
            $table->string('tidur_siang_durasi')->nullable();
            $table->boolean('bak')->default(false);
            $table->integer('bak_frekuensi')->nullable();
            $table->boolean('bab')->default(false);
            $table->integer('bab_frekuensi')->nullable();
            
            // Kebutuhan & Catatan
            $table->text('kebutuhan_besok')->nullable();
            $table->text('catatan_khusus')->nullable();
            $table->text('catatan_insiden')->nullable();
            
            // Foto
            $table->string('foto_kegiatan')->nullable();
            
            $table->timestamps();
            
            // Index
            $table->index(['tanggal', 'siswa_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
    }
};
