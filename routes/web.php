<?php

use App\Http\Controllers\DeviceTokenController;
use App\Http\Controllers\OrangtuaDashboardController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\KehadiranController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\OrangtuaNewsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $latestNews = \App\Models\News::where('is_published', true)
        ->orderBy('published_at', 'desc')
        ->first();
    
    $otherNews = \App\Models\News::where('is_published', true)
        ->orderBy('published_at', 'desc')
        ->skip(1)
        ->take(3)
        ->get();

    return Inertia::render('Home', [
        'latestNews' => $latestNews,
        'otherNews' => $otherNews
    ]);
})->name('home');

// Public News Routes
Route::get('/berita', [NewsController::class, 'index'])->name('berita.index');
Route::get('/berita/{slug}', [NewsController::class, 'show'])->name('berita.show');

// Kehadiran Routes (Public - untuk tablet dan TV)
Route::prefix('kehadiran')->name('kehadiran.')->group(function () {
    // New routes with cabang_id parameter
    Route::get('tablet/{cabang_id}', [KehadiranController::class, 'tablet'])->name('tablet');
    Route::get('display/{cabang_id}', [KehadiranController::class, 'display'])->name('display');

    // API routes
    Route::get('api/kelas/{cabang_id}', [KehadiranController::class, 'getKelas'])->name('api.kelas');
    Route::get('api/siswa/{cabang_id}/{kelasId}', [KehadiranController::class, 'getSiswaByKelas'])->name('api.siswa');
    Route::post('api/hadir', [KehadiranController::class, 'store'])->name('api.store');
    Route::post('api/pulang', [KehadiranController::class, 'storePulang'])->name('api.pulang');
    Route::get('api/hari-ini/{cabang_id}', [KehadiranController::class, 'getKehadiranHariIni'])->name('api.hari-ini');
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
        require __DIR__.'/guru.php';
    });
    Route::prefix('orangtua')->name('orangtua.')->middleware('check.siswa')->group(function () {
        require __DIR__.'/orangtua.php';
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
