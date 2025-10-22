<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        \App\Models\User::create([
            'name' => 'Admin',
            'email' => 'admin@schalbiruni.com',
            'nohp' => '081234567890',
            'role' => 'admin',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // Guru
        \App\Models\User::create([
            'name' => 'Ibu Siti Nurhaliza',
            'email' => 'guru@schalbiruni.com',
            'nohp' => '081234567891',
            'role' => 'guru',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
    }
}
