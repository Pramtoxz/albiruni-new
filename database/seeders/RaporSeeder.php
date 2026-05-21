<?php

namespace Database\Seeders;

use App\Models\Rapor;
use App\Models\RaporPerkembangan;
use App\Models\RaporPertumbuhan;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Seeder;

class RaporSeeder extends Seeder
{
    private const TAHUN_AJARAN = '2024/2025';
    private const SEMESTER = 1;

    // Semester 1: Juli–Desember
    private const BULAN_SEMESTER_1 = [7, 8, 9, 10, 11, 12];

    // Sample growth data per bulan (incremental realistis untuk bayi/batita)
    private const PERTUMBUHAN_TEMPLATES = [
        // [berat_badan, tinggi_badan, lingkar_kepala]
        'laki_laki' => [
            7  => [8.50, 68.0, 44.5],
            8  => [8.80, 69.5, 44.8],
            9  => [9.10, 71.0, 45.1],
            10 => [9.40, 72.5, 45.3],
            11 => [9.60, 74.0, 45.5],
            12 => [9.80, 75.5, 45.8],
        ],
        'perempuan' => [
            7  => [7.90, 66.0, 43.5],
            8  => [8.20, 67.5, 43.8],
            9  => [8.50, 69.0, 44.1],
            10 => [8.70, 70.5, 44.3],
            11 => [8.90, 72.0, 44.5],
            12 => [9.10, 73.5, 44.8],
        ],
    ];

    private const PERKEMBANGAN_FINAL = [
        ['aspek' => 'agama_moral',       'status' => 'BSH', 'narasi' => 'Anak sudah mulai memahami konsep berdoa sebelum makan dan tidur. Mau mengikuti kegiatan ibadah bersama.'],
        ['aspek' => 'motorik_kasar',     'status' => 'BSH', 'narasi' => 'Anak mampu berjalan dan berlari dengan baik. Mulai bisa menendang bola dan memanjat tangga dengan bantuan.'],
        ['aspek' => 'motorik_halus',     'status' => 'MB',  'narasi' => 'Anak mulai berlatih memegang crayon dan mencoret-coret. Masih perlu bimbingan untuk koordinasi tangan lebih baik.'],
        ['aspek' => 'kognitif',          'status' => 'BSH', 'narasi' => 'Anak dapat mengenali bentuk dasar (lingkaran, kotak). Mulai menunjukkan rasa ingin tahu yang tinggi terhadap benda sekitar.'],
        ['aspek' => 'bahasa',            'status' => 'BSH', 'narasi' => 'Anak mulai mengucapkan 2–3 kata dengan jelas. Merespons panggilan nama dan perintah sederhana dengan baik.'],
        ['aspek' => 'sosial_emosional',  'status' => 'MB',  'narasi' => 'Anak sedang dalam proses belajar berbagi mainan. Kadang masih menangis saat berpisah dengan orang tua di pagi hari.'],
        ['aspek' => 'kemandirian',       'status' => 'MB',  'narasi' => 'Anak mulai bisa makan sendiri menggunakan sendok meski masih sering dibantu. Sudah bisa melepas sepatu sendiri.'],
    ];

    private const PERKEMBANGAN_DRAFT = [
        ['aspek' => 'agama_moral',       'status' => 'BSB', 'narasi' => null],
        ['aspek' => 'motorik_kasar',     'status' => 'BSH', 'narasi' => null],
        ['aspek' => 'motorik_halus',     'status' => 'BSH', 'narasi' => null],
        ['aspek' => 'kognitif',          'status' => null,  'narasi' => null],
        ['aspek' => 'bahasa',            'status' => null,  'narasi' => null],
        ['aspek' => 'sosial_emosional',  'status' => null,  'narasi' => null],
        ['aspek' => 'kemandirian',       'status' => null,  'narasi' => null],
    ];

    public function run(): void
    {
        $creator = User::where('role', 'guru')->first()
            ?? User::where('role', 'admin')->first();

        if (! $creator) {
            $this->command->warn('Tidak ada user guru/admin. Jalankan DatabaseSeeder terlebih dahulu.');
            return;
        }

        $siswaList = Siswa::where('status_siswa', true)
            ->whereNotNull('tanggal_lahir')
            ->with('kelas')
            ->get();

        if ($siswaList->isEmpty()) {
            $this->command->warn('Tidak ada siswa yang approved. Seed siswa terlebih dahulu.');
            return;
        }

        $this->command->info("Membuat rapor untuk {$siswaList->count()} siswa...");

        foreach ($siswaList as $index => $siswa) {
            $status   = $index % 3 === 0 ? 'draft' : 'final';
            $guruKelas = $creator->name;
            $penutup  = $status === 'final'
                ? "Demikian laporan tumbuh kembang {$siswa->nama_panggilan} untuk Semester 1 Tahun Ajaran " . self::TAHUN_AJARAN . ". Semoga anak terus tumbuh sehat dan bahagia. Kami berharap kerja sama yang baik antara sekolah dan orang tua dapat terus terjalin demi mendukung perkembangan anak secara optimal."
                : null;

            $rapor = Rapor::firstOrCreate(
                [
                    'siswa_id'     => $siswa->id,
                    'semester'     => self::SEMESTER,
                    'tahun_ajaran' => self::TAHUN_AJARAN,
                ],
                [
                    'created_by' => $creator->id,
                    'status'     => $status,
                    'guru_kelas' => $guruKelas,
                    'penutup'    => $penutup,
                ]
            );

            $jenisKelamin = strtolower($siswa->jenis_kelamin ?? '') === 'perempuan'
                ? 'perempuan'
                : 'laki_laki';

            $template = self::PERTUMBUHAN_TEMPLATES[$jenisKelamin];

            foreach (self::BULAN_SEMESTER_1 as $bulan) {
                [$bb, $tb, $lk] = $template[$bulan];

                // Variasi kecil agar data tidak identik semua siswa
                $variasi = ($siswa->id % 5) * 0.1;

                RaporPertumbuhan::firstOrCreate(
                    ['rapor_id' => $rapor->id, 'bulan' => $bulan],
                    [
                        'berat_badan'    => round($bb + $variasi, 2),
                        'tinggi_badan'   => round($tb + ($variasi * 2), 2),
                        'lingkar_kepala' => round($lk + ($variasi * 0.5), 2),
                    ]
                );
            }

            $perkembanganData = $status === 'final'
                ? self::PERKEMBANGAN_FINAL
                : self::PERKEMBANGAN_DRAFT;

            foreach ($perkembanganData as $item) {
                RaporPerkembangan::firstOrCreate(
                    ['rapor_id' => $rapor->id, 'aspek' => $item['aspek']],
                    [
                        'status' => $item['status'],
                        'narasi' => $item['narasi'],
                    ]
                );
            }

            $this->command->line("  ✓ {$siswa->nama_lengkap} — {$status}");
        }

        $this->command->info('RaporSeeder selesai.');
    }
}
