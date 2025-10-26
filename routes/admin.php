<?php

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
});
