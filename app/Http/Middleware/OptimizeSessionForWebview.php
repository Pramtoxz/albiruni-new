<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OptimizeSessionForWebview
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Optimize session configuration for webview requests
        if ($this->isWebview($request)) {
            $this->configureWebviewSession($request);
        }

        $response = $next($request);

        // Ensure session is properly saved for webview requests
        if ($this->isWebview($request) && $request->hasSession()) {
            $this->ensureSessionPersistence($request);
        }

        return $response;
    }

    /**
     * Detect if the request is coming from a webview
     */
    protected function isWebview(Request $request): bool
    {
        $userAgent = $request->userAgent();
        
        if (!$userAgent) {
            return false;
        }

        // Common webview indicators
        $webviewIndicators = [
            'wv',           // Android WebView
            'WebView',      // Generic WebView
            'Flutter',      // Flutter WebView
            'Mobile/',      // Mobile app context
            'App/',         // App context
        ];

        foreach ($webviewIndicators as $indicator) {
            if (stripos($userAgent, $indicator) !== false) {
                return true;
            }
        }

        // Check for missing browser-specific strings that indicate webview
        $browserStrings = ['Chrome/', 'Firefox/', 'Safari/', 'Edge/'];
        $hasBrowserString = false;
        
        foreach ($browserStrings as $browser) {
            if (stripos($userAgent, $browser) !== false) {
                $hasBrowserString = true;
                break;
            }
        }

        // If it has mobile indicators but no browser strings, likely webview
        if (!$hasBrowserString && (stripos($userAgent, 'Mobile') !== false || stripos($userAgent, 'Android') !== false)) {
            return true;
        }

        return false;
    }

    /**
     * Configure session for webview compatibility
     */
    protected function configureWebviewSession(Request $request): void
    {
        if (!$request->hasSession()) {
            return;
        }

        $session = $request->session();

        // Mark session as webview for tracking
        if (!$session->has('_is_webview_session')) {
            $session->put('_is_webview_session', true);
            $session->put('_webview_user_agent', $request->userAgent());
            $session->put('_webview_session_started', now()->toISOString());
        }

        // Extend session lifetime for webview stability
        $session->put('_webview_last_activity', now()->timestamp);
    }

    /**
     * Ensure session persistence for webview requests
     */
    protected function ensureSessionPersistence(Request $request): void
    {
        $session = $request->session();
        
        // Force session save for webview requests to ensure persistence
        $session->save();
        
        // Log session activity for debugging if needed
        if (config('app.debug')) {
            \Log::debug('Webview session saved', [
                'session_id' => $session->getId(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now()->toISOString(),
            ]);
        }
    }
}