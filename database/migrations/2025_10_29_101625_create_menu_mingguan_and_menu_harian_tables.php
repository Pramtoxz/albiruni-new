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
        // Drop old menu_makanan table
        Schema::dropIfExists('menu_makanan');

        // Create menu_mingguan table
        Schema::create('menu_mingguan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_menu');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->boolean('is_active')->default(false);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Create menu_harian table
        Schema::create('menu_harian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_mingguan_id')->constrained('menu_mingguan')->onDelete('cascade');
            $table->enum('hari', ['senin', 'selasa', 'rabu', 'kamis', 'jumat']);
            $table->enum('waktu_makan', ['sarapan', 'makan_siang', 'snack']);
            $table->enum('kategori', ['anak', 'bayi', 'staff']);
            $table->string('nama_menu')->nullable();
            $table->timestamps();

            // Unique constraint to prevent duplicate entries
            $table->unique(['menu_mingguan_id', 'hari', 'waktu_makan', 'kategori']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_harian');
        Schema::dropIfExists('menu_mingguan');
    }
};
