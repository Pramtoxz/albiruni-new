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
        Schema::table('daily_reports', function (Blueprint $table) {
            // Change status columns from string to integer (1-5 rating)
            $table->integer('sarapan_status')->nullable()->change();
            $table->integer('makan_siang_status')->nullable()->change();
            $table->integer('snack_status')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_reports', function (Blueprint $table) {
            $table->string('sarapan_status')->nullable()->change();
            $table->string('makan_siang_status')->nullable()->change();
            $table->string('snack_status')->nullable()->change();
        });
    }
};
