<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kehadiran', function (Blueprint $table) {
            $table->time('waktu_pulang')->nullable()->after('waktu_hadir');
            $table->enum('rating', ['like', 'no'])->nullable()->after('jenis_interaksi');
        });
    }

    public function down(): void
    {
        Schema::table('kehadiran', function (Blueprint $table) {
            $table->dropColumn(['waktu_pulang', 'rating']);
        });
    }
};
