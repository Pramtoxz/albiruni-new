<?php

use App\Http\Controllers\DailyReportController;
use App\Http\Controllers\SiswaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Routes untuk pendaftaran siswa (tanpa middleware check.siswa)
    Route::get('siswa/register', [SiswaController::class, 'create'])
        ->name('siswa.create');
    Route::post('siswa/register', [SiswaController::class, 'store'])
        ->name('siswa.store');

    // Routes untuk guru - Daily Report
    Route::prefix('guru')->name('guru.')->group(function () {
        Route::get('daily-report', [DailyReportController::class, 'index'])
            ->name('daily-report.index');
        Route::get('daily-report/create', [DailyReportController::class, 'create'])
            ->name('daily-report.create');
        Route::post('daily-report', [DailyReportController::class, 'store'])
            ->name('daily-report.store');
        Route::get('daily-report/{dailyReport}', [DailyReportController::class, 'show'])
            ->name('daily-report.show');
    });

    // Routes untuk orang tua - Daily Report
    Route::prefix('orangtua')->name('orangtua.')->middleware('check.siswa')->group(function () {
        Route::get('daily-report', [DailyReportController::class, 'orangtuaIndex'])
            ->name('daily-report.index');
        Route::get('daily-report/{dailyReport}', [DailyReportController::class, 'orangtuaShow'])
            ->name('daily-report.show');
    });

    // Dashboard dengan middleware check.siswa
    Route::middleware('check.siswa')->group(function () {
        Route::get('dashboard', function () {
            $user = auth()->user();

            // Pisahkan dashboard berdasarkan role
            if ($user->role === 'admin') {
                return Inertia::render('dashboard/admin');
            }

            if ($user->role === 'guru') {
                return Inertia::render('dashboard/guru');
            }

            // Dashboard orang tua dengan data siswa
            $siswa = \App\Models\Siswa::where('user_id', $user->id)->first();

            return Inertia::render('dashboard/orangtua', [
                'siswa' => $siswa,
            ]);
        })->name('dashboard');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
