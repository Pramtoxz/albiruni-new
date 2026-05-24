<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rapor_perkembangans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rapor_id')->constrained('rapors')->cascadeOnDelete();
            $table->enum('aspek', [
                'agama_moral',
                'motorik_kasar',
                'motorik_halus',
                'kognitif',
                'bahasa',
                'sosial_emosional',
                'kemandirian',
            ]);
            $table->enum('status', ['BB', 'MB', 'BSH', 'BSB'])->nullable();
            $table->text('narasi')->nullable();
            $table->timestamps();

            $table->unique(['rapor_id', 'aspek']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapor_perkembangans');
    }
};
