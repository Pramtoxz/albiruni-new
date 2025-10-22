<?php

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
    
    // Dashboard dengan middleware check.siswa
    Route::middleware('check.siswa')->group(function () {
        Route::get('dashboard', function () {
            $user = auth()->user();
            
            // Pisahkan dashboard berdasarkan role
            if ($user->role === 'admin') {
                return Inertia::render('dashboard/admin');
            }
            
            return Inertia::render('dashboard/orangtua');
        })->name('dashboard');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
