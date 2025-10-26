<?php

use App\Http\Controllers\Auth\OtpController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('otp/send', [OtpController::class, 'send'])
        ->name('otp.send');

    Route::post('login/otp', [OtpController::class, 'login'])
        ->name('login.otp');
});
