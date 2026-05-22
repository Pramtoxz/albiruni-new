<?php

use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\PembayaranSppController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserActivityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // User Management - Check admin role in controller
    Route::resource('users', UserController::class);

    // Student Approval Management
    Route::get('siswa', [SiswaController::class, 'index'])->name('siswa.index');
    Route::get('siswa/create', [SiswaController::class, 'create'])->name('siswa.create');
    Route::post('siswa/store', [SiswaController::class, 'store'])->name('siswa.store');
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
    Route::get('menu-mingguan/{menuMingguan}/print', [\App\Http\Controllers\Admin\MenuMingguanController::class, 'printPdf'])->name('menu-mingguan.print');

    // Rencana Pembelajaran Management
    Route::get('rencana-pembelajaran', [\App\Http\Controllers\Admin\RencanaPembelajaranController::class, 'index'])->name('rencana-pembelajaran.index');
    Route::get('rencana-pembelajaran/create', [\App\Http\Controllers\Admin\RencanaPembelajaranController::class, 'create'])->name('rencana-pembelajaran.create');
    Route::post('rencana-pembelajaran', [\App\Http\Controllers\Admin\RencanaPembelajaranController::class, 'store'])->name('rencana-pembelajaran.store');
    Route::get('rencana-pembelajaran/{rencanaPembelajaran}/edit', [\App\Http\Controllers\Admin\RencanaPembelajaranController::class, 'edit'])->name('rencana-pembelajaran.edit');
    Route::put('rencana-pembelajaran/{rencanaPembelajaran}', [\App\Http\Controllers\Admin\RencanaPembelajaranController::class, 'update'])->name('rencana-pembelajaran.update');
    Route::delete('rencana-pembelajaran/{rencanaPembelajaran}', [\App\Http\Controllers\Admin\RencanaPembelajaranController::class, 'destroy'])->name('rencana-pembelajaran.destroy');
    Route::post('rencana-pembelajaran/{rencanaPembelajaran}/copy', [\App\Http\Controllers\Admin\RencanaPembelajaranController::class, 'copy'])->name('rencana-pembelajaran.copy');
    Route::post('rencana-pembelajaran/{rencanaPembelajaran}/toggle-active', [\App\Http\Controllers\Admin\RencanaPembelajaranController::class, 'toggleActive'])->name('rencana-pembelajaran.toggle-active');

    // Kelas Management
    Route::resource('kelas', KelasController::class);

    // Pembayaran SPP Management
    Route::get('pembayaran', [PembayaranSppController::class, 'index'])->name('pembayaran.index');
    Route::get('pembayaran/{pembayaran}', [PembayaranSppController::class, 'show'])->name('pembayaran.show');
    Route::post('pembayaran/{pembayaran}/verify', [PembayaranSppController::class, 'verify'])->name('pembayaran.verify');
    Route::post('pembayaran/{pembayaran}/pay-direct', [PembayaranSppController::class, 'payDirect'])->name('pembayaran.pay-direct');
    Route::post('pembayaran/generate', [PembayaranSppController::class, 'generate'])->name('pembayaran.generate');

    // Guru Management
    Route::resource('guru', \App\Http\Controllers\Admin\GuruController::class);

    // Emosi Management
    Route::resource('emosi', \App\Http\Controllers\Admin\EmosiController::class);

    // News Management
    Route::resource('news', \App\Http\Controllers\Admin\NewsController::class);

    // Events Management
    Route::get('events', [\App\Http\Controllers\Admin\EventController::class, 'index'])->name('events.index');
    Route::get('events/create', [\App\Http\Controllers\Admin\EventController::class, 'create'])->name('events.create');
    Route::post('events', [\App\Http\Controllers\Admin\EventController::class, 'store'])->name('events.store');
    Route::get('events/{event}/edit', [\App\Http\Controllers\Admin\EventController::class, 'edit'])->name('events.edit');
    Route::put('events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [\App\Http\Controllers\Admin\EventController::class, 'destroy'])->name('events.destroy');
    Route::post('events/{event}/toggle-active', [\App\Http\Controllers\Admin\EventController::class, 'toggleActive'])->name('events.toggle-active');

    // Daily Report Management
    Route::get('daily-report', [\App\Http\Controllers\DailyReportController::class, 'adminIndex'])->name('daily-report.index');
    Route::get('daily-report/{dailyReport}', [\App\Http\Controllers\DailyReportController::class, 'adminShow'])->name('daily-report.show');

    // Rapor Digital
    Route::get('rapor', [\App\Http\Controllers\Admin\RaporController::class, 'index'])->name('rapor.index');
    Route::post('rapor/toggle-aktif', [\App\Http\Controllers\Admin\RaporController::class, 'toggleAktif'])->name('rapor.toggle-aktif');
    Route::post('rapor/setting', [\App\Http\Controllers\Admin\RaporController::class, 'updateSetting'])->name('rapor.setting');
    Route::get('rapor/{rapor}', [\App\Http\Controllers\Admin\RaporController::class, 'show'])->name('rapor.show');

    // Template Rapor
    Route::get('template-rapor', [\App\Http\Controllers\Admin\TemplateRaporController::class, 'index'])->name('template-rapor.index');
    Route::get('template-rapor/{kelas}', [\App\Http\Controllers\Admin\TemplateRaporController::class, 'edit'])->name('template-rapor.edit');
    Route::put('template-rapor/{kelas}', [\App\Http\Controllers\Admin\TemplateRaporController::class, 'update'])->name('template-rapor.update');
    Route::get('template-rapor/{kelas}/export', [\App\Http\Controllers\Admin\TemplateRaporController::class, 'export'])->name('template-rapor.export');
    Route::post('template-rapor/{kelas}/import', [\App\Http\Controllers\Admin\TemplateRaporController::class, 'import'])->name('template-rapor.import');

    // User Activity Management
    Route::get('user-activity', [UserActivityController::class, 'index'])->name('user-activity.index');

    // Permission Management (IT only)
    Route::get('permissions', [\App\Http\Controllers\Admin\PermissionController::class, 'index'])->name('permissions.index');
    Route::put('permissions/{user}', [\App\Http\Controllers\Admin\PermissionController::class, 'update'])->name('permissions.update');
});
