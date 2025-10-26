<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set remember token lifetime to 30 days (43200 minutes)
        config(['session.lifetime' => config('auth.remember_token_lifetime', 43200)]);
    }
}
