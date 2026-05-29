<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $keys = [
            'wa_gateway_url',
            'wa_gateway_secret',
            'wa_session_name',
            'wa_group_id',
        ];

        foreach ($keys as $key) {
            DB::table('app_settings')->insertOrIgnore([
                'key'        => $key,
                'value'      => env(strtoupper($key), ''),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('app_settings')->whereIn('key', [
            'wa_gateway_url',
            'wa_gateway_secret',
            'wa_session_name',
            'wa_group_id',
        ])->delete();
    }
};
