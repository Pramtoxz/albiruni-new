<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'light') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="user-authenticated" content="{{ auth()->check() ? 'true' : 'false' }}">
        
        {{-- Canonical URL untuk SEO --}}
        <link rel="canonical" href="{{ $canonicalUrl ?? url()->current() }}" />

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "light" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico?v={{ config('app.version', '1.0') }}" sizes="any">
        <link rel="icon" href="/favicon.svg?v={{ config('app.version', '1.0') }}" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v={{ config('app.version', '1.0') }}">
        
        {{-- Open Graph / Social Media Meta Tags --}}
        <meta property="og:image" content="{{ url('/apple-touch-icon.png') }}" />
        <meta property="og:image:secure_url" content="{{ url('/apple-touch-icon.png') }}" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="180" />
        <meta property="og:image:height" content="180" />

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
