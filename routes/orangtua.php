<?php

use App\Http\Controllers\DailyReportController;
use App\Http\Controllers\KegiatanHarianController;
use App\Http\Controllers\PembayaranSppController;
use App\Http\Controllers\KehadiranController;

Route::get('daily-report', [DailyReportController::class, 'orangtuaIndex'])
    ->name('daily-report.index');
Route::get('daily-report/{dailyReport}', [DailyReportController::class, 'orangtuaShow'])
    ->name('daily-report.show');

Route::get('kegiatan-harian', [KegiatanHarianController::class, 'orangtuaIndex'])
    ->name('kegiatan-harian.index');

Route::get('pembayaran', [PembayaranSppController::class, 'index'])
    ->name('pembayaran.index');
Route::post('pembayaran/{pembayaran}/upload', [PembayaranSppController::class, 'upload'])
    ->name('pembayaran.upload');

Route::get('absensi', [KehadiranController::class, 'orangtuaIndex'])
    ->name('absensi.index');