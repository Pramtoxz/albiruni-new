<?php

use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\MenuMakananController;
use App\Http\Controllers\Admin\PembayaranSppController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // User Management - Check admin role in controller
    Route::resource('users', UserController::class);

    // Student Approval Management
    Route::get('siswa', [SiswaController::class, 'index'])->name('siswa.index');
    Route::get('siswa/approved/list', [SiswaController::class, 'approved'])->name('siswa.approved');
    Route::get('siswa/{siswa}', [SiswaController::class, 'show'])->name('siswa.show');
    Route::get('siswa/{siswa}/edit', [SiswaController::class, 'edit'])->name('siswa.edit');
    Route::put('siswa/{siswa}', [SiswaController::class, 'update'])->name('siswa.update');
    Route::post('siswa/{siswa}/approve', [SiswaController::class, 'approve'])->name('siswa.approve');
    
    // Menu Makanan Management
    Route::get('menu-makanan', [MenuMakananController::class, 'index'])->name('menu-makanan.index');
    Route::post('menu-makanan', [MenuMakananController::class, 'store'])->name('menu-makanan.store');
    Route::put('menu-makanan/{menuMakanan}', [MenuMakananController::class, 'update'])->name('menu-makanan.update');
    Route::delete('menu-makanan/{menuMakanan}', [MenuMakananController::class, 'destroy'])->name('menu-makanan.destroy');
    
    // Kelas Management
    Route::resource('kelas', KelasController::class);
    
    // Pembayaran SPP Management
    Route::get('pembayaran', [PembayaranSppController::class, 'index'])->name('pembayaran.index');
    Route::get('pembayaran/{pembayaran}', [PembayaranSppController::class, 'show'])->name('pembayaran.show');
    Route::post('pembayaran/{pembayaran}/verify', [PembayaranSppController::class, 'verify'])->name('pembayaran.verify');
    Route::post('pembayaran/generate', [PembayaranSppController::class, 'generate'])->name('pembayaran.generate');
});
