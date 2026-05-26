<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // otp_codes: full table scan pada setiap percobaan login OTP
        // nohp/email = varchar(255) utf8mb4 → prefix(100) agar tidak exceed 1000-byte limit
        // type = varchar(255) juga, prefix(20) cukup karena nilainya pendek (e.g. "login", "whatsapp")
        DB::statement('ALTER TABLE `otp_codes` ADD INDEX `otp_nohp_type_used` (`nohp`(50), `type`(20), `is_used`)');
        DB::statement('ALTER TABLE `otp_codes` ADD INDEX `otp_email_type_used` (`email`(50), `type`(20), `is_used`)');
        Schema::table('otp_codes', function (Blueprint $table) {
            $table->index('expires_at', 'otp_expires_at');
        });

        // siswa: is_active dipakai di hampir semua controller
        // lokasi_pendaftaran = varchar(255) utf8mb4 → prefix(100) untuk hindari key-too-long
        Schema::table('siswa', function (Blueprint $table) {
            $table->index('is_active', 'siswa_is_active');
            $table->index('status_siswa', 'siswa_status_siswa');
        });
        DB::statement('ALTER TABLE `siswa` ADD INDEX `siswa_lokasi` (`lokasi_pendaftaran`(100))');

        // daily_reports: is_final dipakai di storePulang & finalize
        Schema::table('daily_reports', function (Blueprint $table) {
            $table->index('is_final', 'daily_reports_is_final');
            // Composite [siswa_id, tanggal] lebih efisien untuk query per-siswa
            $table->index(['siswa_id', 'tanggal'], 'daily_reports_siswa_tanggal');
        });

        // pembayaran_spp: status_bayar dipakai di filter admin
        Schema::table('pembayaran_spp', function (Blueprint $table) {
            $table->index('status_bayar', 'spp_status_bayar');
            $table->index('tahun', 'spp_tahun');
        });
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE `otp_codes` DROP INDEX `otp_nohp_type_used`');
        DB::statement('ALTER TABLE `otp_codes` DROP INDEX `otp_email_type_used`');
        Schema::table('otp_codes', function (Blueprint $table) {
            $table->dropIndex('otp_expires_at');
        });

        Schema::table('siswa', function (Blueprint $table) {
            $table->dropIndex('siswa_is_active');
            $table->dropIndex('siswa_status_siswa');
        });
        DB::statement('ALTER TABLE `siswa` DROP INDEX `siswa_lokasi`');

        Schema::table('daily_reports', function (Blueprint $table) {
            $table->dropIndex('daily_reports_is_final');
            $table->dropIndex('daily_reports_siswa_tanggal');
        });

        Schema::table('pembayaran_spp', function (Blueprint $table) {
            $table->dropIndex('spp_status_bayar');
            $table->dropIndex('spp_tahun');
        });
    }
};
