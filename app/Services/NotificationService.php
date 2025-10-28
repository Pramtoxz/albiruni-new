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

    /**
     * Send daily report notification to parent via WhatsApp
     */
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

            $parentPhone = $siswa->user->nohp;
            $message = $this->buildDailyReportMessage($report, $siswa);

            $this->gateway->sendText($parentPhone, $message);

            Log::info('Daily report notification sent', [
                'report_id' => $report->id,
                'siswa_id' => $siswa->id,
                'parent_phone' => $parentPhone,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Failed to send daily report notification', [
                'report_id' => $report->id,
                'exception' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * Build WhatsApp message for daily report
     */
    protected function buildDailyReportMessage(DailyReport $report, $siswa): string
    {
        $date = \Carbon\Carbon::parse($report->tanggal)->format('d/m/Y');
        $guruName = $report->user->name ?? 'Guru';

        $ratingText = function ($rating) {
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
        $message .= "━━━━━━━━━\n\n";
        $message .= "� {{$date}\n";
        $message .= "� Mood: {$report->mood}\n\n";

        // Ringkasan makanan
        $message .= "🍽️ *Makanan:*\n";
        if ($report->sarapan_pagi) {
            $message .= "• Sarapan: {$ratingText($report->sarapan_status)}\n";
        }
        if ($report->makan_siang) {
            $message .= "• Makan Siang: {$ratingText($report->makan_siang_status)}\n";
        }
        if ($report->snack_sore) {
            $message .= "• Snack: {$ratingText($report->snack_status)}\n";
        }
        $message .= "\n";

        // Ringkasan tidur & toilet
        $message .= "😴 *Tidur & Toilet:*\n";
        $message .= '• Tidur Siang: '.($report->tidur_siang ? '✅' : '❌')."\n";
        $message .= '• BAK: '.($report->bak ? "✅ {$report->bak_frekuensi}x" : '❌')."\n";
        $message .= '• BAB: '.($report->bab ? "✅ {$report->bab_frekuensi}x" : '❌')."\n\n";

        // Highlight catatan penting
        if ($report->catatan_insiden) {
            $message .= "⚠️ *Ada Catatan Insiden*\n\n";
        } elseif ($report->catatan_khusus) {
            $message .= "📝 *Ada Catatan Khusus*\n\n";
        }

        if ($report->kebutuhan_besok) {
            $message .= "📦 *Kebutuhan Besok:*\n{$report->kebutuhan_besok}\n\n";
        }

        $message .= "━━━━━━━━━\n\n";

        // Call to action - buka aplikasi
        $message .= "📱 *BUKA APLIKASI UNTUK MELIHAT DETAIL LENGKAP*\n\n";

        $message .= "Lihat foto kegiatan, detail makanan, dan catatan lengkap dari Aunty {$guruName}\n\n";
        $message .= '_Terima kasih atas kepercayaan Anda_ 🙏';

        return $message;
    }

    /**
     * Send SPP payment notification to parent via WhatsApp
     */
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

            $this->gateway->sendText($parentPhone, $message);

            Log::info('SPP notification sent', [
                'pembayaran_id' => $pembayaran->id,
                'siswa_id' => $siswa->id,
                'parent_phone' => $parentPhone,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Failed to send SPP notification', [
                'pembayaran_id' => $pembayaran->id,
                'exception' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * Build WhatsApp message for SPP notification
     */
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

    /**
     * Format bulan dari YYYY-MM ke nama bulan Indonesia
     */
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
