<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceCanonicalUrl
{
    public function handle(Request $request, Closure $next): Response
    {
        // Force HTTPS
        if (!$request->secure() && app()->environment('production')) {
            return redirect()->secure($request->getRequestUri(), 301);
        }

        // Force non-www (atau ganti dengan www jika mau)
        if (str_starts_with($request->getHost(), 'www.')) {
            $request->headers->set('host', str_replace('www.', '', $request->getHost()));
            return redirect()->to($request->fullUrl(), 301);
        }

        return $next($request);
    }
}
