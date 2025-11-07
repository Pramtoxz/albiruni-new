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
        Schema::table('siswa', function (Blueprint $table) {
            // Add new separate fields for ayah
            $table->string('ayah_tempat_lahir')->nullable()->after('ayah_nama_lengkap');
            $table->date('ayah_tanggal_lahir')->nullable()->after('ayah_tempat_lahir');
            
            // Add new separate fields for ibu
            $table->string('ibu_tempat_lahir')->nullable()->after('ibu_nama_lengkap');
            $table->date('ibu_tanggal_lahir')->nullable()->after('ibu_tempat_lahir');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            $table->dropColumn(['ayah_tempat_lahir', 'ayah_tanggal_lahir', 'ibu_tempat_lahir', 'ibu_tanggal_lahir']);
        });
    }
};
