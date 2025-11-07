<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kelas;
use App\Models\Emosi;
use App\Models\Cabang;

class KelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        Kelas::create([
            'nama_kelas' => 'Baby',
            'kategori' => 'bayi',
            'deskripsi' => 'Kelas Baby 0-24 Bulan',
            'spp' => 500000,
        ]);

        Kelas::create([
            'nama_kelas' => 'Toodler',
            'kategori' => 'anak',
            'deskripsi' => 'Untuk Kelas 2-3 Tahun',
            'spp' => 500000,
        ]);

          Kelas::create([
            'nama_kelas' => 'Preschool',
            'kategori' => 'anak',
            'deskripsi' => 'Untuk Kelas 3-4 Tahun',
            'spp' => 500000,
        ]);
        
          Kelas::create([
            'nama_kelas' => 'TK',
            'kategori' => 'anak',
            'deskripsi' => 'Untuk Kelas 4-6 Tahun',
            'spp' => 500000,
        ]);

         Emosi::create([
            'nama_emosi' => 'Takut',
            'deskripsi' => 'Perasaan terancam oleh suatu hal yang dianggap berbahaya. Anak akan merasa takut jika pernah mendapat pengalaman tidak menyenangkan, mendapat pembiasaan untuk takut pada suatu hal, atau meniru orang di sekitarnya yang takut pada sesuatu',
        ]);

         Emosi::create([
            'nama_emosi' => 'Senang',
            'deskripsi' => 'Perasaan positif yang membuat anak merasa nyaman karena apa yang ia inginkan terpenuhi.'
         ]);
         Emosi::create([
            'nama_emosi' => 'Marah',
            'deskripsi' => 'Perasaan tidak senang atas hambatan yang dihadapi, karena menghadapi situasi yang membuatnya frustasi. Hal yang anak tunjukkan bisa berupa menangis, menendang, menggertak, memukul dan lainnya.'
         ]);
         Emosi::create([
            'nama_emosi' => 'Ingin Tau',
            'deskripsi' => 'Anak akan menunjukkan rasa ingin tahu jika melihat hal baru.'
         ]);
         Emosi::create([
            'nama_emosi' => 'Sedih',
            'deskripsi' => 'Perasaan yang muncul ketika anak mengalami kehilangan benda/orang/sesuatu yang ia sukai atau harapkan. Ungkapannya adalah dengan menangis atau enggan melakukan apapun.'
         ]);
         Emosi::create([
            'nama_emosi' => 'Afeksi',
            'deskripsi' =>'Perasaan kasih sayang anak yang ia tunjukkan pada sesuatu atau seseorang dengan memeluk, mencium, memegang, dan lainnya.'
         ]);

           Cabang::create([
            'nama_cabang' => 'Ulak Karang',
         ]);

           Cabang::create([
            'nama_cabang' => 'Aur Duri',
         ]);
    }
}
