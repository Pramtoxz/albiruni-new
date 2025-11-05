<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Session\SessionManager;

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
            config([
                'session.same_site' => 'none',
                'session.secure' => true, // Required when same_site is 'none'
                'session.lifetime' => 240, // Longer session for webview stability (4 hours)
                'session.expire_on_close' => false, // Don't expire on close for webview
            ]);
        }
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