<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rapor_perkembangan_templates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('kelas_id')->index();
            $table->string('aspek');
            $table->string('indikator')->nullable();
            $table->text('contoh_narasi')->nullable();
            $table->text('narasi_bsb')->nullable();
            $table->text('narasi_bsh')->nullable();
            $table->text('narasi_mb')->nullable();
            $table->text('narasi_bb')->nullable();
            $table->timestamps();

            $table->unique(['kelas_id', 'aspek']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapor_perkembangan_templates');
    }
};
