<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // otp_codes: full table scan pada setiap percobaan login OTP
        Schema::table('otp_codes', function (Blueprint $table) {
            $table->index(['nohp', 'type', 'is_used'], 'otp_nohp_type_used');
            $table->index(['email', 'type', 'is_used'], 'otp_email_type_used');
            $table->index('expires_at', 'otp_expires_at');
        });

        // siswa: is_active dipakai di hampir semua controller
        Schema::table('siswa', function (Blueprint $table) {
            $table->index('is_active', 'siswa_is_active');
            $table->index('status_siswa', 'siswa_status_siswa');
            $table->index('lokasi_pendaftaran', 'siswa_lokasi');
        });

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
        Schema::table('otp_codes', function (Blueprint $table) {
            $table->dropIndex('otp_nohp_type_used');
            $table->dropIndex('otp_email_type_used');
            $table->dropIndex('otp_expires_at');
        });

        Schema::table('siswa', function (Blueprint $table) {
            $table->dropIndex('siswa_is_active');
            $table->dropIndex('siswa_status_siswa');
            $table->dropIndex('siswa_lokasi');
        });

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
