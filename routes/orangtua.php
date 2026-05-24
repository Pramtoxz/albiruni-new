<?php

use App\Http\Controllers\DailyReportController;
use App\Http\Controllers\KegiatanHarianController;
use App\Http\Controllers\PembayaranSppController;
use App\Http\Controllers\KehadiranController;
use App\Http\Controllers\OrangtuaNewsController;

Route::get('berita', [OrangtuaNewsController::class, 'index'])
    ->name('berita.index');
Route::get('berita/{slug}', [OrangtuaNewsController::class, 'show'])
    ->name('berita.show');

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

Route::get('galeri', [\App\Http\Controllers\Orangtua\GaleriController::class, 'index'])
    ->name('galeri.index');

Route::get('rapor', [\App\Http\Controllers\Orangtua\RaporController::class, 'index'])
    ->name('rapor.index');
Route::get('rapor/{rapor}', [\App\Http\Controllers\Orangtua\RaporController::class, 'show'])
    ->name('rapor.show');
Route::get('rapor/{rapor}/pdf', [\App\Http\Controllers\Orangtua\RaporController::class, 'pdf'])
    ->name('rapor.pdf');