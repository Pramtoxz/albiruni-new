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

            if (!$siswa || !$siswa->user) {
                Log::warning('Cannot send notification: Siswa or user not found', [
                    'report_id' => $report->id
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
        $message .= "• Tidur Siang: " . ($report->tidur_siang ? "✅" : "❌") . "\n";
        $message .= "• BAK: " . ($report->bak ? "✅ {$report->bak_frekuensi}x" : "❌") . "\n";
        $message .= "• BAB: " . ($report->bab ? "✅ {$report->bab_frekuensi}x" : "❌") . "\n\n";

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
        $message .= "_Terima kasih atas kepercayaan Anda_ 🙏";

        return $message;
    }
}
