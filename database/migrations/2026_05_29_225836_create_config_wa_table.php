<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('config_wa', function (Blueprint $table) {
            $table->id();
            $table->string('wa_gateway_url')->default('');
            $table->string('wa_gateway_secret')->default('');
            $table->string('wa_session_name')->default('');
            $table->timestamps();
        });

        Schema::create('config_wa_groups', function (Blueprint $table) {
            $table->id();
            $table->string('group_id');
            $table->string('keterangan');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed config_wa dari nilai .env
        DB::table('config_wa')->insert([
            'wa_gateway_url'    => env('WA_GATEWAY_URL', ''),
            'wa_gateway_secret' => env('WA_GATEWAY_SECRET', ''),
            'wa_session_name'   => env('WA_SESSION_NAME', ''),
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);

        // Hapus key WA lama dari app_settings
        DB::table('app_settings')->whereIn('key', [
            'wa_gateway_url', 'wa_gateway_secret', 'wa_session_name', 'wa_group_id',
        ])->delete();
    }

    public function down(): void
    {
        Schema::dropIfExists('config_wa_groups');
        Schema::dropIfExists('config_wa');

        // Kembalikan key WA ke app_settings
        foreach (['wa_gateway_url', 'wa_gateway_secret', 'wa_session_name', 'wa_group_id'] as $key) {
            DB::table('app_settings')->insertOrIgnore([
                'key'        => $key,
                'value'      => '',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
};
