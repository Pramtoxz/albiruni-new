<?php

namespace App\Jobs;

use App\Models\DailyReport;
use App\Services\FcmService;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendDailyReportNotification implements ShouldQueue
{
    use Queueable;

    public int $tries   = 2;
    public int $timeout = 120;

    public function __construct(public readonly int $dailyReportId) {}

    public function handle(NotificationService $notification, FcmService $fcm): void
    {
        $report = DailyReport::with(['siswa.user', 'siswa.guru', 'emosis', 'user.guru'])
            ->find($this->dailyReportId);

        if (! $report || ! $report->is_final) {
            return;
        }

        $siswa = $report->siswa;

        if (! $siswa?->user) {
            return;
        }

        $notification->sendDailyReportToParent($report);

        $fcm->sendToUser(
            userId: $siswa->user_id,
            title: 'Daily Report Tersedia',
            body: "Laporan harian {$siswa->nama_lengkap} sudah siap untuk dilihat",
            url: "/orangtua/daily-report/{$report->id}",
            extraData: [
                'type'      => 'daily_report_final',
                'siswa_id'  => $siswa->id,
                'report_id' => $report->id,
            ]
        );
    }
}
