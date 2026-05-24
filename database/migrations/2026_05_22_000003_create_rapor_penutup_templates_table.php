<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rapor_penutup_templates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('kelas_id')->index();
            $table->enum('kategori', ['penutup_umum', 'motivasi_orangtua', 'penguatan_positif']);
            $table->text('narasi_template')->nullable();
            $table->timestamps();

            $table->unique(['kelas_id', 'kategori']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapor_penutup_templates');
    }
};
