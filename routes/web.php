<?php

use App\Http\Controllers\DeviceTokenController;
use App\Http\Controllers\OrangtuaDashboardController;
use App\Http\Controllers\SiswaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Kehadiran Routes (Public - untuk tablet dan TV)
Route::prefix('kehadiran')->name('kehadiran.')->group(function () {
    Route::get('setup', [\App\Http\Controllers\KehadiranController::class, 'setup'])->name('setup');
    Route::get('tablet', [\App\Http\Controllers\KehadiranController::class, 'tablet'])->name('tablet');
    Route::get('display', [\App\Http\Controllers\KehadiranController::class, 'display'])->name('display');

    Route::get('api/kelas', [\App\Http\Controllers\KehadiranController::class, 'getKelas'])->name('api.kelas');
    Route::get('api/siswa/{kelasId}', [\App\Http\Controllers\KehadiranController::class, 'getSiswaByKelas'])->name('api.siswa');
    Route::post('api/hadir', [\App\Http\Controllers\KehadiranController::class, 'store'])->name('api.store');
    Route::post('api/pulang', [\App\Http\Controllers\KehadiranController::class, 'storePulang'])->name('api.pulang');
    Route::get('api/hari-ini', [\App\Http\Controllers\KehadiranController::class, 'getKehadiranHariIni'])->name('api.hari-ini');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('api/device-tokens', [DeviceTokenController::class, 'store'])
        ->name('device-tokens.store');
    Route::delete('api/device-tokens', [DeviceTokenController::class, 'destroy'])
        ->name('device-tokens.destroy');
    Route::get('siswa/register', [SiswaController::class, 'create'])
        ->name('siswa.create');
    Route::post('siswa/register', [SiswaController::class, 'store'])
        ->name('siswa.store');

    Route::prefix('guru')->name('guru.')->group(function () {
        require_once 'guru.php';
    });
    Route::prefix('orangtua')->name('orangtua.')->middleware('check.siswa')->group(function () {
        require_once 'orangtua.php';
    });

    Route::middleware('check.siswa')->group(function () {
        Route::get('dashboard', function () {
            $user = auth()->user();
            if ($user->role === 'admin') {
                return Inertia::render('dashboard/admin');
            }

            if ($user->role === 'guru') {
                return Inertia::render('dashboard/guru');
            }

            return app(OrangtuaDashboardController::class)->index(request());
        })->name('dashboard');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
