<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Cleanup expired sessions every day at 2 AM
Schedule::command('session:gc')->dailyAt('02:00');

// WA health check setiap pagi jam 06:00
Schedule::command('wa:health-check')->dailyAt('06:00')->timezone('Asia/Jakarta');

// Ringkasan daily report setiap malam jam 20:00
Schedule::command('wa:daily-report-summary')->dailyAt('20:00')->timezone('Asia/Jakarta');
