<?php

use App\Http\Middleware\CheckSiswaRegistration;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\OptimizeSessionForWebview;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
// --- Impor tambahan untuk halaman eror ---
use Illuminate\Http\Request;
use Inertia\Inertia;

// ------------------------------------------

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            OptimizeSessionForWebview::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'check.siswa' => CheckSiswaRegistration::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // --- Kode untuk Halaman Eror Produksi ---
        $exceptions->respond(function ($response, Throwable $e, Request $request) {
            // Tampilkan halaman eror kustom untuk status code berikut di semua lingkungan
            // KECUALI untuk rute 'login/otp'
            if (
                in_array($response->getStatusCode(), [500, 503, 404, 403]) &&
                ! $request->is('login/otp')
            ) {
                return Inertia::render('Error', [
                    // Kirim status code ke komponen React
                    'status' => $response->getStatusCode(),
                    // Tentukan judul berdasarkan status code
                    'title' => [
                        503 => 'Layanan Tidak Tersedia',
                        500 => 'Kesalahan Server',
                        404 => 'Halaman Tidak Ditemukan',
                        403 => 'Dilarang',
                    ][$response->getStatusCode()] ?? 'Terjadi Kesalahan', // Fallback
                ])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }

            // Untuk eror lainnya atau rute 'login/otp', biarkan Laravel yang menangani
            return $response;
        });
        // -------------------------------------------
    })->create();
