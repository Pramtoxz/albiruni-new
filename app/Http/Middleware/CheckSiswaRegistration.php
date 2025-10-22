<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSiswaRegistration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Hanya cek untuk role orangtua
        if ($user && $user->role === 'orangtua') {
            // Cek apakah sudah ada data siswa
            if (!$user->siswa) {
                // Jika belum ada, redirect ke halaman pendaftaran siswa
                if (!$request->routeIs('siswa.create') && !$request->routeIs('siswa.store')) {
                    return redirect()->route('siswa.create');
                }
            }
        }

        return $next($request);
    }
}
