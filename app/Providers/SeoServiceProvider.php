<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class SeoServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        View::composer('*', function ($view) {
            $canonicalUrl = url()->current();
            
            // Remove trailing slash kecuali homepage
            if ($canonicalUrl !== config('app.url') && str_ends_with($canonicalUrl, '/')) {
                $canonicalUrl = rtrim($canonicalUrl, '/');
            }
            
            $view->with('canonicalUrl', $canonicalUrl);
        });
    }
}
