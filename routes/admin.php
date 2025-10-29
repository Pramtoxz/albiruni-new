<?php

use App\Http\Controllers\Admin\KelasController;
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
    
    // Menu Mingguan Management
    Route::get('menu-mingguan', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'index'])->name('menu-mingguan.index');
    Route::get('menu-mingguan/create', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'create'])->name('menu-mingguan.create');
    Route::post('menu-mingguan', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'store'])->name('menu-mingguan.store');
    Route::get('menu-mingguan/{menuMingguan}/edit', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'edit'])->name('menu-mingguan.edit');
    Route::put('menu-mingguan/{menuMingguan}', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'update'])->name('menu-mingguan.update');
    Route::delete('menu-mingguan/{menuMingguan}', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'destroy'])->name('menu-mingguan.destroy');
    Route::post('menu-mingguan/{menuMingguan}/copy', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'copy'])->name('menu-mingguan.copy');
    Route::post('menu-mingguan/{menuMingguan}/toggle-active', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'toggleActive'])->name('menu-mingguan.toggle-active');
    
    // Kelas Management
    Route::resource('kelas', KelasController::class);
    
    // Pembayaran SPP Management
    Route::get('pembayaran', [PembayaranSppController::class, 'index'])->name('pembayaran.index');
    Route::get('pembayaran/{pembayaran}', [PembayaranSppController::class, 'show'])->name('pembayaran.show');
    Route::post('pembayaran/{pembayaran}/verify', [PembayaranSppController::class, 'verify'])->name('pembayaran.verify');
    Route::post('pembayaran/generate', [PembayaranSppController::class, 'generate'])->name('pembayaran.generate');
});
