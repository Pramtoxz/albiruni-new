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
        Schema::create('guru_kehadiran', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('guru_id');
            $table->date('tanggal');
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Ensure one record per guru per day
            $table->unique(['guru_id', 'tanggal']);
            
            // Index for better performance
            $table->index('guru_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guru_kehadiran');
    }
};
