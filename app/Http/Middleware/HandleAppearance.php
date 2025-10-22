<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Handle appearance cookie for theme switching
        if ($request->hasCookie('appearance')) {
            $appearance = $request->cookie('appearance');
            // You can add additional logic here if needed
        }

        return $response;
    }
}
