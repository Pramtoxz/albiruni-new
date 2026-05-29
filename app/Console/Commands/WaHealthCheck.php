<?php

namespace App\Console\Commands;

use App\Models\ConfigWaGroup;
use App\Providers\WhatsAppGateway;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class WaHealthCheck extends Command
{
    protected $signature = 'wa:health-check';

    protected $description = 'Kirim pesan health check ke grup WA untuk memastikan session aktif';

    public function handle(): int
    {
        try {
            $gateway = new WhatsAppGateway;
            $now = now()->setTimezone('Asia/Jakarta');

            $message = "*[HEALTH CHECK] WA GATEWAY ONLINE*\n";
            $message .= "-----------------------------------\n";
            $message .= "Tanggal : {$now->format('d/m/Y')}\n";
            $message .= "Waktu   : {$now->format('H:i')} WIB\n";
            $message .= "Status  : Session aktif, siap kirim notifikasi\n";
            $message .= "-----------------------------------\n";
            $message .= '_Pesan otomatis setiap pagi. Jika tidak muncul, segera cek gateway WA._';

            $groups = ConfigWaGroup::where('is_active', true)->get();

            if ($groups->isEmpty()) {
                $this->warn('Tidak ada grup WA aktif.');

                return self::FAILURE;
            }

            foreach ($groups as $group) {
                $gateway->sendToGroup($message, $group->group_id);
                $this->info("Terkirim → {$group->keterangan}");
            }

            Log::info('WA health check sent', ['groups' => $groups->pluck('keterangan')]);

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Gagal: '.$e->getMessage());
            Log::error('WA health check failed', ['exception' => $e->getMessage()]);

            return self::FAILURE;
        }
    }
}
