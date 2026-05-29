<?php

namespace App\Console\Commands;

use App\Models\ConfigWaGroup;
use App\Models\DailyReport;
use App\Providers\WhatsAppGateway;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WaDailyReportSummary extends Command
{
    protected $signature   = 'wa:daily-report-summary';
    protected $description = 'Kirim ringkasan daily report & kehadiran hari ini ke grup WA';

    public function handle(): int
    {
        try {
            $gateway = new WhatsAppGateway();
            $today   = now()->toDateString();
            $now     = now()->setTimezone('Asia/Jakarta');

            $terkirim = DailyReport::whereDate('tanggal', $today)
                ->where('is_final', true)
                ->count();

            $draftAnakPulang = DailyReport::whereDate('daily_reports.tanggal', $today)
                ->where('daily_reports.is_final', false)
                ->join('kehadiran', function ($join) use ($today) {
                    $join->on('kehadiran.siswa_id', '=', 'daily_reports.siswa_id')
                         ->whereDate('kehadiran.tanggal', $today)
                         ->whereNotNull('kehadiran.waktu_pulang');
                })
                ->count();

            $draftTidakLengkap = DailyReport::whereDate('daily_reports.tanggal', $today)
                ->where('daily_reports.is_final', false)
                ->join('kehadiran', function ($join) use ($today) {
                    $join->on('kehadiran.siswa_id', '=', 'daily_reports.siswa_id')
                         ->whereDate('kehadiran.tanggal', $today)
                         ->whereNull('kehadiran.waktu_pulang');
                })
                ->count();

            $kehadiranStats = DB::table('kehadiran')
                ->join('siswa', 'siswa.id', '=', 'kehadiran.siswa_id')
                ->join('kelas', 'kelas.id', '=', 'siswa.kelas_id')
                ->whereDate('kehadiran.tanggal', $today)
                ->whereNotNull('kehadiran.waktu_hadir')
                ->where('siswa.is_active', true)
                ->select(
                    'siswa.lokasi_pendaftaran as cabang',
                    'kelas.nama_kelas',
                    DB::raw('COUNT(*) as total')
                )
                ->groupBy('siswa.lokasi_pendaftaran', 'kelas.nama_kelas')
                ->orderBy('siswa.lokasi_pendaftaran')
                ->orderBy('kelas.nama_kelas')
                ->get();

            $totalHadir = $kehadiranStats->sum('total');

            $message  = "*[RINGKASAN HARIAN] {$now->format('d/m/Y')}*\n";
            $message .= "-----------------------------------\n\n";

            $message .= "*Daily Report:*\n";
            $message .= "Terkirim ke orang tua   : *{$terkirim}*\n";
            $message .= "Draft (anak sudah pulang): *{$draftAnakPulang}* _(perlu kirim manual)_\n";
            $message .= "Draft (data tidak lengkap): *{$draftTidakLengkap}*\n";
            $message .= "\n";

            $message .= "*Kehadiran Hari Ini: {$totalHadir} siswa*\n";

            $perCabang = $kehadiranStats->groupBy('cabang');
            foreach ($perCabang as $cabang => $kelasGroup) {
                $totalCabang = $kelasGroup->sum('total');
                $cabangLabel = $cabang ?: 'Tidak diketahui';
                $message .= "\n[{$cabangLabel}] {$totalCabang} siswa\n";
                foreach ($kelasGroup as $row) {
                    $message .= "  - {$row->nama_kelas}: {$row->total} siswa\n";
                }
            }

            $message .= "\n-----------------------------------\n";
            $message .= "_Dikirim otomatis pukul {$now->format('H:i')} WIB_";

            $groups = ConfigWaGroup::where('is_active', true)->get();

            if ($groups->isEmpty()) {
                $this->warn('Tidak ada grup WA aktif.');
                return self::FAILURE;
            }

            foreach ($groups as $group) {
                $gateway->sendToGroup($message, $group->group_id);
                $this->info("Terkirim → {$group->keterangan}");
            }

            Log::info('WA daily report summary sent', [
                'terkirim'          => $terkirim,
                'draft_anak_pulang' => $draftAnakPulang,
                'draft_tidak_lengkap' => $draftTidakLengkap,
                'total_hadir'       => $totalHadir,
            ]);

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Gagal: ' . $e->getMessage());
            Log::error('WA daily report summary failed', ['exception' => $e->getMessage()]);
            return self::FAILURE;
        }
    }
}
