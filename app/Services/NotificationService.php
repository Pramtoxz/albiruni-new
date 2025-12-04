<?php

namespace App\Services;

use App\Models\DailyReport;
use App\Providers\WhatsAppGateway;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function __construct(

        protected WhatsAppGateway $gateway
    ) {}

    public function sendDailyReportToParent(DailyReport $report): void
    {
        try {
            $siswa = $report->siswa()->with('user')->first();

            if (! $siswa || ! $siswa->user) {
                Log::warning('Cannot send notification: Siswa or user not found', [
                    'report_id' => $report->id,
                ]);

                return;
            }

            // Load emosis relationship
            $report->load('emosis');

            $parentPhone = $siswa->user->nohp;
            $message = $this->buildDailyReportMessage($report, $siswa);

            // Kirim ke orang tua
            $this->gateway->sendText($parentPhone, $message);

            // Kirim juga ke developer untuk monitoring
            // $developerPhone = '6282279690769';
            // $devMessage = "🔔 *MONITORING - Daily Report Terkirim*\n\n";
            // $devMessage .= "Kepada: {$siswa->nama_lengkap}\n";
            // $devMessage .= "No. Orang Tua: {$parentPhone}\n";
            // $devMessage .= "Tanggal: ".date('d/m/Y H:i')."\n";
            // $devMessage .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            // $devMessage .= $message;
            
            // $this->gateway->sendText($developerPhone, $devMessage);

            Log::info('Daily report notification sent', [
                'report_id' => $report->id,
                'siswa_id' => $siswa->id,
                'parent_phone' => $parentPhone,
                'developer_notified' => true,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Failed to send daily report notification', [
                'report_id' => $report->id,
                'exception' => $exception->getMessage(),
            ]);
        }
    }

    protected function buildDailyReportMessage(DailyReport $report, $siswa): string
    {
        $date = \Carbon\Carbon::parse($report->tanggal)->format('d/m/Y');
        
        // Get guru info - bisa guru utama atau guru pendamping yang input
        $guruYangInput = $report->user->guru ?? null;
        $guruName = $report->user->name ?? 'Guru';
        
        // Get guru utama dari siswa
        $guruUtama = $siswa->guru ?? null;
        
        // Build guru info text
        $guruInfo = '';
        if ($guruUtama) {
            $guruInfo = "👩‍🏫 Guru Utama: Aunty {$guruUtama->nama_lengkap}\n";
            
            // Check if ada guru pendamping
            $guruPendamping = \App\Models\Guru::where('guru_utama_id', $guruUtama->id)->get();
            if ($guruPendamping->count() > 0) {
                $guruInfo .= "👥 Guru Pendamping: ";
                $pendampingNames = $guruPendamping->pluck('nama_lengkap')->toArray();
                $guruInfo .= "Aunty " . implode(', Aunty ', $pendampingNames) . "\n";
            }
            
            // Show who created this report
            if ($guruYangInput) {
                $reportCreator = $guruYangInput->nama_lengkap;
                $guruInfo .= "✍️ Laporan dibuat oleh: Aunty {$reportCreator}\n";
            }
        }

        $ratingText = function ($rating) {
            $rating = (int) $rating;
            if ($rating <= 0) {
                return '-';
            }
            
            // Ini Opsi Ya Guysszzzz ganti dengan ★/☆
            return match ($rating) {
                1 => '⭐',
                2 => '⭐⭐',
                3 => '⭐⭐⭐',
                4 => '⭐⭐⭐⭐',
                5 => '⭐⭐⭐⭐⭐',
                default => '-'
            };
        };

        $message = "*📋 DAILY REPORT - {$siswa->nama_lengkap}*\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $message .= "\n";
        $message .= "📅 {$date}\n";
        if ($guruInfo) {
            $message .= $guruInfo;
        }
        $message .= "😊 Mood: {$report->mood}\n";
        $message .= "\n";

        // Kehadiran (waktu hadir dan pulang)
        $kehadiran = \App\Models\Kehadiran::where('siswa_id', $siswa->id)
            ->whereDate('tanggal', $report->tanggal)
            ->first();

        $message .= "🕐 *Kehadiran:*\n";
        if ($kehadiran) {
            if ($kehadiran->waktu_hadir) {
                $waktuHadir = \Carbon\Carbon::parse($kehadiran->waktu_hadir)->format('H:i');
                $message .= "• Hadir: {$waktuHadir}\n";
            } else {
                $message .= "• Hadir: Belum tercatat\n";
            }
            
            if ($kehadiran->waktu_pulang) {
                $waktuPulang = \Carbon\Carbon::parse($kehadiran->waktu_pulang)->format('H:i');
                $message .= "• Pulang: {$waktuPulang}\n";
            } else {
                $message .= "• Pulang: Belum pulang\n";
            }
        } else {
            $message .= "• Hadir: Belum tercatat\n";
            $message .= "• Pulang: Belum tercatat\n";
        }
        $message .= "\n";

        // Emosi
        if ($report->emosis && $report->emosis->count() > 0) {
            $message .= "💭 *Emosi Hari Ini:*\n";
            foreach ($report->emosis as $emosi) {
                $message .= "✓ {$emosi->nama_emosi}\n";
            }
            $message .= "\n";
        }

        // Activity
        if ($report->activity) {
            $message .= "🎯 *Aktivitas Hari Ini:*\n";
            $message .= "{$report->activity}\n";
            $message .= "\n";
        }

        // Ringkasan makanan
        $message .= "🍽️ *Makanan:*\n";
        if ($report->sarapan_pagi) {
            $message .= "• Sarapan: {$report->sarapan_pagi} {$ratingText($report->sarapan_status)}\n";
        }
        if ($report->makan_siang) {
            $message .= "• Makan Siang: {$report->makan_siang} {$ratingText($report->makan_siang_status)}\n";
        }
        if ($report->snack_sore) {
            $message .= "• Snack: {$report->snack_sore} {$ratingText($report->snack_status)}\n";
        }
        $message .= "\n";

        // Minuman
        if ($report->minum_air_putih || $report->minum_susu) {
            $message .= "🥤 *Minuman:*\n";
            if ($report->minum_air_putih) {
                $message .= "• Air Putih: {$report->minum_air_putih}\n";
            }
            if ($report->minum_susu) {
                $message .= "• Susu: {$report->minum_susu}\n";
            }
            $message .= "\n";
        }

        // Ringkasan tidur & toilet
        $message .= "😴 *Tidur & Toilet:*\n";
        $message .= '• Tidur Siang: '.($report->tidur_siang ? '✅' : '❌');
        if ($report->tidur_siang && $report->tidur_siang_durasi) {
            $message .= " ({$report->tidur_siang_durasi})";
        }
        $message .= "\n";
        $message .= '• BAK: '.($report->bak ? "✅ {$report->bak_frekuensi}x" : '❌')."\n";
        $message .= '• BAB: '.($report->bab ? "✅ {$report->bab_frekuensi}x" : '❌')."\n";
        $message .= "\n";

        // Catatan Insiden
        $message .= "⚠️ *Catatan Insiden:*\n";
        $message .= $report->catatan_insiden ?: "Tidak ada insiden";
        $message .= "\n\n";

        // Catatan Khusus
        $message .= "📝 *Catatan Khusus:*\n";
        $message .= $report->catatan_khusus ?: "Tidak ada catatan khusus";
        $message .= "\n\n";

        // Kebutuhan Besok
        if ($report->kebutuhan_besok) {
            $message .= "📦 *Kebutuhan Besok:*\n";
            $message .= "{$report->kebutuhan_besok}\n";
            $message .= "\n";
        }

        $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        $message .= "\n";

        // Call to action - buka aplikasi
        $message .= "*Ini Pesan OTOMATIS Harap Jangan Di Balas!!!*\n ";
        $message .= "\n";
        $message .= "\n";
        $message .= "📱 *BUKA APLIKASI UNTUK MELIHAT DETAIL LENGKAP*\n ";
        $message .= "\n";
        
        // Build guru team text
        if ($guruUtama) {
            $guruTeam = "Aunty {$guruUtama->nama_lengkap}";
            $guruPendamping = \App\Models\Guru::where('guru_utama_id', $guruUtama->id)->get();
            if ($guruPendamping->count() > 0) {
                $pendampingNames = $guruPendamping->pluck('nama_lengkap')->toArray();
                $guruTeam .= " & Aunty " . implode(', Aunty ', $pendampingNames);
            }
            $message .= "Lihat foto kegiatan, detail makanan, dan catatan lengkap dari {$guruTeam}\n";
        } else {
            $message .= "Lihat foto kegiatan, detail makanan, dan catatan lengkap dari Aunty {$guruName}\n";
        }
        
        $message .= "\n";
        $message .= '_Terima kasih atas kepercayaan Anda_ 🙏';

        return $message;
    }

    public function sendSppNotificationToParent($pembayaran): void
    {
        try {
            $siswa = $pembayaran->siswa()->with('user')->first();

            if (! $siswa || ! $siswa->user) {
                Log::warning('Cannot send SPP notification: Siswa or user not found', [
                    'pembayaran_id' => $pembayaran->id,
                ]);

                return;
            }

            $parentPhone = $siswa->user->nohp;
            $message = $this->buildSppNotificationMessage($pembayaran, $siswa);

            // Kirim ke orang tua
            $this->gateway->sendText($parentPhone, $message);

            Log::info('SPP notification sent', [
                'pembayaran_id' => $pembayaran->id,
                'siswa_id' => $siswa->id,
                'parent_phone' => $parentPhone,
                'developer_notified' => true,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Failed to send SPP notification', [
                'pembayaran_id' => $pembayaran->id,
                'exception' => $exception->getMessage(),
            ]);
        }
    }

    protected function buildSppNotificationMessage($pembayaran, $siswa): string
    {
        $bulan = $this->formatBulan($pembayaran->bulan);
        $biaya = number_format($pembayaran->biaya, 0, ',', '.');

        $message = "*💳 TAGIHAN SPP - {$siswa->nama_lengkap}*\n";
        $message .= "━━━━━━━━━\n\n";
        $message .= "Assalamu'alaikum Ayah/Bunda,\n\n";
        $message .= "Tagihan SPP bulan *{$bulan}* telah tersedia:\n\n";
        $message .= "👤 Nama: {$siswa->nama_lengkap}\n";
        $message .= "🏫 Kelas: {$pembayaran->kelas->nama_kelas}\n";
        $message .= "📅 Periode: {$bulan}\n";
        $message .= "💰 Jumlah: *Rp {$biaya}*\n\n";
        $message .= "━━━━━━━━━\n\n";
        $message .= "📱 *CARA PEMBAYARAN:*\n\n";
        $message .= "1. Buka aplikasi Al Biruni\n";
        $message .= "2. Pilih menu *Pembayaran SPP*\n";
        $message .= "3. Upload bukti transfer\n";
        $message .= "4. Tunggu verifikasi admin\n\n";
        $message .= "━━━━━━━━━\n\n";
        $message .= "📌 *REKENING PEMBAYARAN:*\n";
        $message .= "Bank BRI\n";
        $message .= "a.n. Al Biruni Preschool\n";
        $message .= "No. Rek: 1234-5678-9012\n\n";
        $message .= "Mohon cantumkan nama siswa saat transfer.\n\n";
        $message .= '_Terima kasih atas kepercayaan Anda_ 🙏';

        return $message;
    }

    protected function formatBulan(string $bulan): string
    {
        [$year, $month] = explode('-', $bulan);
        $months = [
            '01' => 'Januari', '02' => 'Februari', '03' => 'Maret',
            '04' => 'April', '05' => 'Mei', '06' => 'Juni',
            '07' => 'Juli', '08' => 'Agustus', '09' => 'September',
            '10' => 'Oktober', '11' => 'November', '12' => 'Desember',
        ];

        return $months[$month].' '.$year;
    }
}
