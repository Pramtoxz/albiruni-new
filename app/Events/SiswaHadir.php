<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SiswaHadir implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $kehadiran;

    public function __construct($kehadiran)
    {
        $this->kehadiran = $kehadiran;
    }

    public function broadcastOn()
    {
        return new Channel('kehadiran');
    }

    public function broadcastAs()
    {
        return 'siswa.hadir';
    }
}
