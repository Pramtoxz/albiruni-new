<?php

use App\Http\Controllers\DeviceTokenController;
use App\Http\Controllers\GuruDashboardController;
use App\Http\Controllers\OrangtuaDashboardController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\KehadiranController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\OrangtuaNewsController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
        'otherNews' => $otherNews,
        'seo' => [
            'title' => 'Daycare & Preschool Padang - Al-Biruni Sumatera Barat',
            'description' => 'Daycare dan preschool terbaik di Padang. Al-Biruni melayani anak usia 1-6 tahun dengan 2 cabang di Ulak Karang dan Marapalam, Sumatera Barat.',
            'canonical' => 'https://albiruni.sch.id/',
            'keywords' => 'daycare padang, preschool padang, day care padang, tk padang, daycare sumatera barat, preschool sumatera barat, daycare ulak karang, daycare marapalam, baby class padang, kindergarten padang',
            'ogImage' => 'https://albiruni.sch.id/apple-touch-icon.png'
        ],
        'structuredData' => [
            'organization' => [ 
                'name' => 'Al-Biruni Preschool & Daycare',
                'url' => 'https://albiruni.sch.id',
                'logo' => 'https://albiruni.sch.id/apple-touch-icon.png',
                'description' => 'Daycare dan preschool terbaik di Padang, Sumatera Barat, melayani anak usia 1-6 tahun',
                'priceRange' => '$',
                'areaServed' => 'Padang, Sumatera Barat, Indonesia',
                'branches' => [
                    [
                        'name' => 'Al-Biruni Preschool & Daycare - Ulak Karang',
                        'address' => [
                            'streetAddress' => 'Jl. S. Parman No. 5',
                            'addressLocality' => 'Padang',
                            'addressRegion' => 'Sumatera Barat',
                            'postalCode' => '25000',
                            'addressCountry' => 'ID'
                        ],
                        'telephone' => '+62-751-123456',
                        'geo' => [
                            'latitude' => -0.9471,
                            'longitude' => 100.4172
                        ]
                    ],
                    [
                        'name' => 'Al-Biruni Preschool & Daycare - Marapalam',
                        'address' => [
                            'streetAddress' => 'Jl. Marapalam Raya',
                            'addressLocality' => 'Padang',
                            'addressRegion' => 'Sumatera Barat',
                            'postalCode' => '25000',
                            'addressCountry' => 'ID'
                        ],
                        'telephone' => '+62-751-654321',
                        'geo' => [
                            'latitude' => -0.9550,
                            'longitude' => 100.3693
                        ]
                    ]
                ]
            ]
        ]
    ]);
})->name('home');

// Public News Routes
Route::get('/berita', [NewsController::class, 'index'])->name('berita.index');
Route::get('/berita/{slug}', [NewsController::class, 'show'])->name('berita.show');

// Public rapor signature verification (no auth required)
Route::get('/verify/rapor/{rapor}', [\App\Http\Controllers\RaporVerifyController::class, 'show'])
    ->name('rapor.verify');

// Public rapor gallery (signed URL only — cannot be guessed or tampered)
Route::get('/rapor/galeri/{rapor}', [\App\Http\Controllers\RaporGaleriPublikController::class, 'show'])
    ->name('rapor.galeri.publik')
    ->middleware('signed');

// Sitemap Route
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Robots.txt Route
Route::get('/robots.txt', function () {
    $content = "User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /guru
Disallow: /orangtua
Disallow: /login
Disallow: /register
Disallow: /api/
Disallow: /kehadiran/

Sitemap: https://albiruni.sch.id/sitemap.xml";

    return response($content)
        ->header('Content-Type', 'text/plain');
})->name('robots');

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
            $user = Auth::user();
            if ($user->role === 'admin') {
                return app(\App\Http\Controllers\AdminDashboardController::class)->index();
            }

            if ($user->role === 'guru') {
                return app(GuruDashboardController::class)->index();
            }

            return app(OrangtuaDashboardController::class)->index(request());
        })->name('dashboard');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
