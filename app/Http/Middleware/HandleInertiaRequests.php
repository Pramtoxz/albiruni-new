<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, \Closure $next)
    {
        // Optimize session handling for webview stability
        $this->optimizeSessionForWebview($request);
        
        // Set appearance for root view
        $appearance = $request->cookie('appearance', 'light');
        view()->share('appearance', $appearance);
        
        return parent::handle($request, $next);
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'webview' => [
                'isWebview' => $this->isWebview($request),
                'userAgent' => $request->userAgent(),
            ],
        ]);
    }

    /**
     * Detect if the request is coming from a webview
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
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
     * Optimize session handling for webview stability
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    protected function optimizeSessionForWebview(Request $request): void
    {
        if (!$this->isWebview($request)) {
            return;
        }

        // Ensure session is started and properly configured for webview
        if (!$request->hasSession()) {
            return;
        }

        $session = $request->session();

        // Regenerate session ID periodically for security but not too frequently for webview stability
        if (!$session->has('_webview_session_initialized')) {
            $session->put('_webview_session_initialized', true);
            $session->put('_webview_last_regenerated', now()->timestamp);
        }

        // Only regenerate session ID if it's been more than 30 minutes for webview stability
        $lastRegenerated = $session->get('_webview_last_regenerated', 0);
        if (now()->timestamp - $lastRegenerated > 1800) { // 30 minutes
            $session->regenerate(false); // Don't destroy old session data
            $session->put('_webview_last_regenerated', now()->timestamp);
        }

        // Ensure session persistence for webview
        $session->save();
    }
}
