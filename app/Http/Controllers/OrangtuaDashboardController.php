<?php

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\KegiatanHarian;
use App\Models\PembayaranSpp;
use App\Models\RencanaPembelajaran;
use App\Models\Siswa;
use App\Models\News;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrangtuaDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Ambil data siswa dengan relasi kelas
        $siswa = Siswa::where('user_id', $user->id)->with('kelas')->first();

        // Inisialisasi data
        $kegiatanHariIni = [];
        $notifikasi = [];

        if ($siswa) {
            // Ambil kegiatan harian jika ada kelas
            if ($siswa->kelas_id) {
                $hariIni = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now()->dayOfWeek];
                
                $rencanaPembelajaran = RencanaPembelajaran::where('kelas_id', $siswa->kelas_id)
                    ->where('is_active', true)
                    ->orderBy('tanggal_mulai', 'desc')
                    ->first();

                if ($rencanaPembelajaran) {
                    $kegiatanHariIni = KegiatanHarian::where('rencana_pembelajaran_id', $rencanaPembelajaran->id)
                        ->where('hari', $hariIni)
                        ->orderBy('tanggal', 'desc')
                        ->get()
                        ->map(function ($kegiatan) {
                            return [
                                'id' => $kegiatan->id,
                                'nama_aktivitas' => $kegiatan->nama_aktivitas,
                                'deskripsi' => $kegiatan->deskripsi,
                                'target_perkembangan' => $kegiatan->target_perkembangan,
                                'foto_kegiatan' => $kegiatan->foto_kegiatan,
                                'tanggal' => $kegiatan->tanggal->format('Y-m-d'),
                                'hari' => $kegiatan->hari,
                            ];
                        })
                        ->toArray();
                }
            }

            // Ambil notifikasi dari Daily Report
            $dailyReports = DailyReport::where('siswa_id', $siswa->id)
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($report) {
                    return [
                        'id' => $report->id,
                        'type' => 'daily_report',
                        'title' => 'Daily Report Baru',
                        'message' => 'Daily report untuk ' . $report->tanggal->format('d M Y') . ' telah diperbarui',
                        'updated_at' => $report->updated_at->toISOString(),
                        'url' => '/orangtua/daily-report/' . $report->id,
                    ];
                });

            // Ambil notifikasi dari Pembayaran SPP
            $pembayaranSpp = PembayaranSpp::where('siswa_id', $siswa->id)
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($spp) {
                    return [
                        'id' => $spp->id,
                        'type' => 'pembayaran_spp',
                        'title' => 'Update Pembayaran SPP',
                        'message' => 'Status pembayaran SPP ' . $spp->bulan . ' ' . $spp->tahun . ': ' . $spp->status_bayar,
                        'updated_at' => $spp->updated_at->toISOString(),
                        'url' => '/orangtua/pembayaran',
                    ];
                });

            // Gabungkan dan urutkan
            $notifikasi = $dailyReports->concat($pembayaranSpp)
                ->sortByDesc('updated_at')
                ->take(5)
                ->values()
                ->toArray();
        }

        // Ambil 3 berita terbaru yang published
        $latestNews = News::where('is_published', true)
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($news) {
                return [
                    'id' => $news->id,
                    'title' => $news->title,
                    'excerpt' => $news->excerpt,
                    'image_url' => $news->image_url,
                    'slug' => $news->slug,
                    'published_at' => $news->published_at->format('Y-m-d'),
                ];
            });

        $activeEvents = Event::active()
            ->orderBy('priority', 'asc')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'image_url' => $event->image_url,
                    'start_date' => $event->start_date->format('Y-m-d'),
                    'end_date' => $event->end_date->format('Y-m-d'),
                ];
            });

        return Inertia::render('dashboard/orangtua', [
            'siswa' => $siswa ? [
                'id' => $siswa->id,
                'nama_lengkap' => $siswa->nama_lengkap,
                'nama_panggilan' => $siswa->nama_panggilan,
                'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : null,
                'foto_siswa' => $siswa->foto_siswa,
                'is_active' => $siswa->is_active,
            ] : null,
            'kegiatanHariIni' => $kegiatanHariIni,
            'notifikasi' => $notifikasi,
            'latestNews' => $latestNews,
            'activeEvents' => $activeEvents,
        ]);
    }
}
