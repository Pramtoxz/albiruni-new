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
            ['email' => 'azali@gmail.com'],
            [
                'name' => 'Azzalia Darma Putri',
                'role' => 'guru',
                'password' => Hash::make('1234'),
                'nohp' => '6282173427113',
                'email_verified_at' => now(),
            ]
        );
         User::firstOrCreate(
            ['email' => 'shinta@gmail.com'],
            [
                'name' => 'Shinta Gusri Amanda',
                'role' => 'guru',
                'password' => Hash::make('1234'),
                'nohp' => '6281268632133',
                'email_verified_at' => now(),
            ]
        );
         User::firstOrCreate(
            ['email' => 'messi@gmail.com'],
            [
                'name' => 'Mesi Fitri Yanti',
                'role' => 'guru',
                'password' => Hash::make('1234'),
                'nohp' => '6283180659296',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            RaporSeeder::class,
        ]);
    }
}
