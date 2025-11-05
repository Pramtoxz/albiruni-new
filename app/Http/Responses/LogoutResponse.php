<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;

class LogoutResponse implements LogoutResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        // Ensure session is properly cleaned up
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // For JSON requests (API), return empty response
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        // For web requests, redirect directly to login page
        // Using Inertia::location for smooth webview navigation
        return Inertia::location('/login');
    }
}