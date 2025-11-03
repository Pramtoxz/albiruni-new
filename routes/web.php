<?php

use App\Http\Controllers\DailyReportController;
use App\Http\Controllers\DeviceTokenController;
use App\Http\Controllers\KegiatanHarianController;
use App\Http\Controllers\PembayaranSppController;
use App\Http\Controllers\SiswaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // FCM Device Token Management
    Route::post('api/device-tokens', [DeviceTokenController::class, 'store'])
        ->name('device-tokens.store');
    Route::delete('api/device-tokens', [DeviceTokenController::class, 'destroy'])
        ->name('device-tokens.destroy');

    Route::get('siswa/register', [SiswaController::class, 'create'])
        ->name('siswa.create');
    Route::post('siswa/register', [SiswaController::class, 'store'])
        ->name('siswa.store');

    // Routes untuk guru - Daily Report & Rencana Pembelajaran
    Route::prefix('guru')->name('guru.')->group(function () {
        Route::get('daily-report', [DailyReportController::class, 'index'])
            ->name('daily-report.index');
        Route::get('daily-report/create', [DailyReportController::class, 'create'])
            ->name('daily-report.create');
        Route::post('daily-report', [DailyReportController::class, 'store'])
            ->name('daily-report.store');
        Route::get('daily-report/{dailyReport}', [DailyReportController::class, 'show'])
            ->name('daily-report.show');
        Route::get('daily-report/{dailyReport}/edit', [DailyReportController::class, 'edit'])
            ->name('daily-report.edit');
        Route::put('daily-report/{dailyReport}', [DailyReportController::class, 'update'])
            ->name('daily-report.update');
        Route::post('daily-report/{dailyReport}/finalize', [DailyReportController::class, 'finalize'])
            ->name('daily-report.finalize');

        // Rencana Pembelajaran (Read Only)
        Route::get('rencana-pembelajaran', [\App\Http\Controllers\Guru\RencanaPembelajaranController::class, 'index'])
            ->name('rencana-pembelajaran.index');
        Route::get('rencana-pembelajaran/{rencanaPembelajaran}', [\App\Http\Controllers\Guru\RencanaPembelajaranController::class, 'show'])
            ->name('rencana-pembelajaran.show');
    });

    // Routes untuk orang tua - Daily Report & Pembayaran
    Route::prefix('orangtua')->name('orangtua.')->middleware('check.siswa')->group(function () {
        Route::get('daily-report', [DailyReportController::class, 'orangtuaIndex'])
            ->name('daily-report.index');
        Route::get('daily-report/{dailyReport}', [DailyReportController::class, 'orangtuaShow'])
            ->name('daily-report.show');

        // Kegiatan Harian
        Route::get('kegiatan-harian', [KegiatanHarianController::class, 'orangtuaIndex'])
            ->name('kegiatan-harian.index');

        // Pembayaran SPP
        Route::get('pembayaran', [PembayaranSppController::class, 'index'])
            ->name('pembayaran.index');
        Route::post('pembayaran/{pembayaran}/upload', [PembayaranSppController::class, 'upload'])
            ->name('pembayaran.upload');
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
            $siswa = \App\Models\Siswa::where('user_id', $user->id)->with('kelas')->first();

            // Ambil kegiatan harian untuk hari ini berdasarkan kelas siswa
            $kegiatanHariIni = [];
            if ($siswa && $siswa->kelas_id) {
                // Dapatkan nama hari ini dalam bahasa Indonesia
                $hariIni = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now()->dayOfWeek];
                
                // Cari rencana pembelajaran yang aktif untuk kelas siswa
                $rencanaPembelajaran = \App\Models\RencanaPembelajaran::where('kelas_id', $siswa->kelas_id)
                    ->active()
                    ->orderBy('tanggal_mulai', 'desc')
                    ->first();

                if ($rencanaPembelajaran) {
                    // Ambil kegiatan harian untuk hari ini saja
                    $kegiatanHariIni = \App\Models\KegiatanHarian::where('rencana_pembelajaran_id', $rencanaPembelajaran->id)
                        ->where('hari', $hariIni)
                        ->orderBy('tanggal', 'desc')
                        ->get()
                        ->map(function ($kegiatan) {
                            return [
                                'id' => $kegiatan->id,
                                'nama_aktivitas' => $kegiatan->nama_aktivitas,
                                'deskripsi' => $kegiatan->deskripsi,
                                'target_perkembangan' => $kegiatan->target_perkembangan,
                                'foto_kegiatan' => $kegiatan->foto_kegiatan,
                                'tanggal' => $kegiatan->tanggal->format('Y-m-d'),
                                'hari' => $kegiatan->hari,
                            ];
                        });
                }
            }

            return Inertia::render('dashboard/orangtua', [
                'siswa' => $siswa ? [
                    'id' => $siswa->id,
                    'nama_lengkap' => $siswa->nama_lengkap,
                    'nama_panggilan' => $siswa->nama_panggilan,
                    'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : null,
                    'foto_siswa' => $siswa->foto_siswa,
                    'is_active' => $siswa->is_active,
                ] : null,
                'kegiatanHariIni' => $kegiatanHariIni,
            ]);
        })->name('dashboard');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
