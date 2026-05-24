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
    private const TAHUN_AJARAN = '2025/2026';
    private const SEMESTER = 2;

    // Semester 2: Januari–Juni
    private const BULAN_SEMESTER_2 = [1, 2, 3, 4, 5, 6];

    // Sample growth data per bulan — realistis untuk anak usia 5–6 tahun (prasekolah)
    private const PERTUMBUHAN_TEMPLATES = [
        // [berat_badan, tinggi_badan, lingkar_kepala]
        'laki_laki' => [
            1 => [18.50, 109.0, 50.5],
            2 => [18.70, 109.5, 50.6],
            3 => [18.90, 110.0, 50.7],
            4 => [19.10, 110.5, 50.8],
            5 => [19.30, 111.0, 50.9],
            6 => [19.50, 111.5, 51.0],
        ],
        'perempuan' => [
            1 => [17.80, 107.5, 49.5],
            2 => [18.00, 108.0, 49.6],
            3 => [18.20, 108.5, 49.7],
            4 => [18.40, 109.0, 49.8],
            5 => [18.60, 109.5, 49.9],
            6 => [18.80, 110.0, 50.0],
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
            $status    = $index % 3 === 0 ? 'draft' : 'final';
            $guruKelas = $creator->name;
            $nama      = $siswa->nama_panggilan;

            $rapor = Rapor::firstOrCreate(
                [
                    'siswa_id'     => $siswa->id,
                    'semester'     => self::SEMESTER,
                    'tahun_ajaran' => self::TAHUN_AJARAN,
                ],
                [
                    'created_by'                   => $creator->id,
                    'status'                       => $status,
                    'guru_kelas'                   => $guruKelas,
                    'penutup_umum'                 => $status === 'final'
                        ? "Demikian laporan tumbuh kembang {$nama} untuk Semester 1 Tahun Ajaran " . self::TAHUN_AJARAN . ". Semoga {$nama} terus tumbuh sehat, cerdas, dan berkarakter. Terima kasih atas kepercayaan Bapak/Ibu menitipkan putra-putri terbaik di Al-Biruni."
                        : null,
                    'penutup_motivasi_orangtua'    => $status === 'final'
                        ? "Kami mengajak Bapak/Ibu untuk terus mendukung tumbuh kembang {$nama} di rumah dengan memberikan stimulasi bermain, membaca buku cerita, dan menjaga rutinitas tidur yang cukup. Keterlibatan aktif orang tua adalah kunci keberhasilan anak."
                        : null,
                    'penutup_penguatan_positif'    => $status === 'final'
                        ? "{$nama} adalah anak yang memiliki potensi luar biasa. Kami melihat perkembangan positif setiap harinya. Tetaplah semangat dan terus eksplorasi dunia dengan rasa ingin tahu yang besar, ya {$nama}!"
                        : null,
                ]
            );

            $jenisKelamin = strtolower($siswa->jenis_kelamin ?? '') === 'perempuan'
                ? 'perempuan'
                : 'laki_laki';

            $template = self::PERTUMBUHAN_TEMPLATES[$jenisKelamin];

            foreach (self::BULAN_SEMESTER_2 as $bulan) {
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
