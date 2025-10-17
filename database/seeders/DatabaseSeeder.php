<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

         User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'role' => 'admin',
                'password' => Hash::make('1234'),
                'nohp' => '6281918285109',
                'email_verified_at' => now(),
            ]
        );

         User::firstOrCreate(
            ['email' => 'orangtua1@gmail.com'],
            [
                'name' => 'Orang Tua 1',
                'role' => 'orangtua',
                'password' => Hash::make('1234'),
                'nohp' => '6282279690769',
                'email_verified_at' => now(),
            ]
        );


    }
}
