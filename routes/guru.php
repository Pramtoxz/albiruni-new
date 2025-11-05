<?php

use App\Http\Controllers\DailyReportController;
use App\Http\Controllers\Guru\RencanaPembelajaranController;

Route::get('daily-report', [DailyReportController::class, 'index'])
    ->name('daily-report.index');
Route::get('daily-report/create', [DailyReportController::class, 'create'])
    ->name('daily-report.create');
Route::post('daily-report', [DailyReportController::class, 'store'])
    ->name('daily-report.store');
Route::get('daily-report/{dailyReport}', [DailyReportController::class, 'show'])
    ->name('daily-report.show');
Route::get('daily-report/{dailyReport}/edit', [DailyReportController::class, 'edit'])
    ->name('daily-report.edit');
Route::put('daily-report/{dailyReport}', [DailyReportController::class, 'update'])
    ->name('daily-report.update');
Route::post('daily-report/{dailyReport}/finalize', [DailyReportController::class, 'finalize'])
    ->name('daily-report.finalize');

Route::get('rencana-pembelajaran', [RencanaPembelajaranController::class, 'index'])
    ->name('rencana-pembelajaran.index');
Route::get('rencana-pembelajaran/{rencanaPembelajaran}', [RencanaPembelajaranController::class, 'show'])
    ->name('rencana-pembelajaran.show');