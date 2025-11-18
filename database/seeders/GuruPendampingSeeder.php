<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class GuruPendampingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder creates example data for testing guru pendamping feature:
     * - 1 Guru Utama with students
     * - 1 Guru Pendamping that assists the Guru Utama
     */
    public function run(): void
    {
        // Create Guru Utama User
        $guruUtamaUser = User::create([
            'name' => 'Ibu Siti (Guru Utama)',
            'email' => 'siti.guru@albiruni.sch.id',
            'password' => Hash::make('password'),
            'nohp' => '081234567890',
            'role' => 'guru',
            'email_verified_at' => now(),
        ]);

        // Create Guru Utama Profile
        $guruUtama = Guru::create([
            'user_id' => $guruUtamaUser->id,
            'guru_utama_id' => null, // This is the main guru
            'kelas_id' => 1, // Adjust based on your kelas data
            'nip' => 'NIP001',
            'nama_lengkap' => 'Siti Nurhaliza, S.Pd',
            'tempat_lahir' => 'Padang',
            'tanggal_lahir' => '1990-05-15',
            'jenis_kelamin' => 'P',
            'alamat' => 'Jl. Contoh No. 123, Padang',
            'pendidikan_terakhir' => 'S1 Pendidikan Anak Usia Dini',
        ]);

        // Create Guru Pendamping User
        $guruPendampingUser = User::create([
            'name' => 'Ibu Rina (Guru Pendamping)',
            'email' => 'rina.pendamping@albiruni.sch.id',
            'password' => Hash::make('password'),
            'nohp' => '081234567891',
            'role' => 'guru',
            'email_verified_at' => now(),
        ]);

        // Create Guru Pendamping Profile
        Guru::create([
            'user_id' => $guruPendampingUser->id,
            'guru_utama_id' => $guruUtama->id, // This guru assists the main guru
            'kelas_id' => 1, // Same class as guru utama
            'nip' => 'NIP002',
            'nama_lengkap' => 'Rina Marlina, S.Pd',
            'tempat_lahir' => 'Padang',
            'tanggal_lahir' => '1992-08-20',
            'jenis_kelamin' => 'P',
            'alamat' => 'Jl. Contoh No. 456, Padang',
            'pendidikan_terakhir' => 'S1 Pendidikan Anak Usia Dini',
        ]);

        $this->command->info('✅ Guru Utama dan Guru Pendamping berhasil dibuat!');
        $this->command->info('📧 Guru Utama: siti.guru@albiruni.sch.id (password: password)');
        $this->command->info('📧 Guru Pendamping: rina.pendamping@albiruni.sch.id (password: password)');
        $this->command->info('');
        $this->command->info('💡 Catatan:');
        $this->command->info('   - Assign siswa ke Guru Utama (ID: ' . $guruUtama->id . ')');
        $this->command->info('   - Guru Pendamping akan otomatis bisa akses siswa yang sama');
        $this->command->info('   - Keduanya bisa login dan input daily report untuk siswa tersebut');
    }
}
