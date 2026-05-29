<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigWaGroup extends Model
{
    protected $table = 'config_wa_groups';

    protected $fillable = [
        'group_id',
        'keterangan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static function active()
    {
        return static::where('is_active', true)->get();
    }

    public static function findByKeterangan(string $keterangan): ?self
    {
        return static::where('keterangan', $keterangan)->where('is_active', true)->first();
    }
}
