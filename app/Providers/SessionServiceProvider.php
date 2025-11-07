<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class SessionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Configure session settings dynamically based on webview detection
        $this->configureSessionForWebview();
    }

    /**
     * Configure session settings for webview compatibility
     */
    protected function configureSessionForWebview(): void
    {
        if (!$this->app->runningInConsole() && $this->isWebviewRequest()) {
            // For webview requests, adjust session configuration
            // Use secure cookies based on environment (HTTPS detection)
            $isSecure = $this->isSecureConnection();
            
            config([
                'session.same_site' => $isSecure ? 'none' : 'lax',
                'session.secure' => $isSecure,
                'session.lifetime' => 43200, // 30 days (30 * 24 * 60 = 43200 minutes)
                'session.expire_on_close' => false, // Don't expire on close for webview
            ]);
        }
    }

    /**
     * Check if the current connection is secure (HTTPS)
     */
    protected function isSecureConnection(): bool
    {
        // Check if running on HTTPS
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            return true;
        }

        // Check if behind a proxy/load balancer (AWS, Cloudflare, etc.)
        if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
            return true;
        }

        // Check if behind AWS ELB
        if (!empty($_SERVER['HTTP_X_FORWARDED_PORT']) && $_SERVER['HTTP_X_FORWARDED_PORT'] === '443') {
            return true;
        }

        // Force secure in production environment
        if (config('app.env') === 'production') {
            return true;
        }

        return false;
    }

    /**
     * Detect if the current request is from a webview
     */
    protected function isWebviewRequest(): bool
    {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        if (empty($userAgent)) {
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
}