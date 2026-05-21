<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rapors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->unsignedBigInteger('created_by')->index();
            $table->tinyInteger('semester')->unsigned()->comment('1 or 2');
            $table->string('tahun_ajaran', 20)->comment('e.g. 2025/2026');
            $table->enum('status', ['draft', 'final'])->default('draft');
            $table->string('guru_kelas')->nullable();
            $table->text('penutup')->nullable();
            $table->timestamps();

            $table->unique(['siswa_id', 'semester', 'tahun_ajaran']);
            $table->index(['tahun_ajaran', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapors');
    }
};
