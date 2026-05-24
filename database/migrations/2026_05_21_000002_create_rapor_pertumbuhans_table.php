<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rapor_pertumbuhans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rapor_id')->constrained('rapors')->cascadeOnDelete();
            $table->tinyInteger('bulan')->unsigned()->comment('7-12 sem 1, 1-6 sem 2');
            $table->decimal('berat_badan', 5, 2)->nullable()->comment('kg');
            $table->decimal('tinggi_badan', 5, 2)->nullable()->comment('cm');
            $table->decimal('lingkar_kepala', 5, 2)->nullable()->comment('cm');
            $table->timestamps();

            $table->unique(['rapor_id', 'bulan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapor_pertumbuhans');
    }
};
