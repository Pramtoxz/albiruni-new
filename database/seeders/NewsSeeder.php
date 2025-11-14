<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use Carbon\Carbon;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $news = [
            [
                'title' => 'Kegiatan Field Trip ke Planetarium',
                'excerpt' => 'Siswa-siswi Al-Biruni mengunjungi planetarium untuk belajar tentang tata surya dan bintang-bintang.',
                'content' => 'Pada hari Jumat kemarin, siswa-siswi Al-Biruni Preschool & Daycare melakukan field trip ke planetarium kota. Kegiatan ini bertujuan untuk memberikan pengalaman belajar langsung tentang tata surya, planet, dan bintang-bintang. Anak-anak sangat antusias melihat proyeksi langit malam dan mendengarkan penjelasan tentang konstelasi bintang. Kegiatan ini merupakan bagian dari kurikulum pembelajaran berbasis pengalaman yang kami terapkan.',
                'image' => 'placeholder-news.jpg',
                'slug' => 'kegiatan-field-trip-ke-planetarium',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Perayaan Hari Kartini di Al-Biruni',
                'excerpt' => 'Memperingati Hari Kartini dengan mengenakan pakaian adat dan belajar tentang keberagaman budaya Indonesia.',
                'content' => 'Al-Biruni Preschool & Daycare merayakan Hari Kartini dengan penuh semangat. Siswa-siswi mengenakan pakaian adat dari berbagai daerah di Indonesia. Kegiatan ini tidak hanya seru, tetapi juga edukatif karena anak-anak belajar tentang keberagaman budaya Indonesia. Guru-guru kami menjelaskan tentang perjuangan R.A. Kartini dan pentingnya pendidikan untuk semua anak, baik laki-laki maupun perempuan.',
                'image' => 'placeholder-news.jpg',
                'slug' => 'perayaan-hari-kartini-di-al-biruni',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'Workshop Parenting: Mendidik Anak di Era Digital',
                'excerpt' => 'Mengundang orang tua untuk belajar bersama tentang cara mendidik anak di era digital yang penuh tantangan.',
                'content' => 'Al-Biruni mengadakan workshop parenting dengan tema "Mendidik Anak di Era Digital". Workshop ini dihadiri oleh puluhan orang tua siswa dan menghadirkan psikolog anak sebagai narasumber. Materi yang dibahas meliputi screen time yang sehat, cara mengawasi konten digital, dan pentingnya interaksi langsung dengan anak. Orang tua sangat antusias dan banyak bertanya seputar tantangan mendidik anak di zaman sekarang.',
                'image' => 'placeholder-news.jpg',
                'slug' => 'workshop-parenting-mendidik-anak-di-era-digital',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(7),
            ],
            [
                'title' => 'Program Baby Class Baru: Stimulasi Dini untuk Usia 1-2 Tahun',
                'excerpt' => 'Al-Biruni membuka program Baby Class dengan kurikulum khusus untuk perkembangan optimal bayi usia 1-2 tahun.',
                'content' => 'Kami dengan bangga mengumumkan pembukaan program Baby Class di Al-Biruni Preschool & Daycare. Program ini dirancang khusus untuk bayi usia 1-2 tahun dengan fokus pada stimulasi sensorik dan motorik. Ruang kelas dilengkapi dengan mainan edukatif yang aman, area bermain yang lembut, dan pengawasan penuh dari guru-guru berpengalaman. Rasio guru dan murid dijaga 1:4 untuk memastikan setiap anak mendapat perhatian optimal.',
                'image' => 'placeholder-news.jpg',
                'slug' => 'program-baby-class-baru-stimulasi-dini',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(10),
            ],
            [
                'title' => 'Lomba Mewarnai Bertema Luar Angkasa',
                'excerpt' => 'Siswa Al-Biruni mengikuti lomba mewarnai dengan tema luar angkasa dan meraih berbagai penghargaan.',
                'content' => 'Siswa-siswi Al-Biruni berpartisipasi dalam lomba mewarnai tingkat kota dengan tema "Petualangan Luar Angkasa". Kami sangat bangga karena 3 siswa kami berhasil meraih juara! Kegiatan ini menunjukkan bahwa pembelajaran berbasis tema luar angkasa yang kami terapkan berhasil meningkatkan kreativitas dan imajinasi anak-anak. Selamat kepada para pemenang dan semua peserta yang telah berusaha dengan baik!',
                'image' => 'placeholder-news.jpg',
                'slug' => 'lomba-mewarnai-bertema-luar-angkasa',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(14),
            ],
        ];

        foreach ($news as $item) {
            News::create($item);
        }
    }
}
