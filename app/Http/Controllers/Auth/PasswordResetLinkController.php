<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OtpType;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    public function __construct(
        protected OtpService $otpService
    ) {
    }

    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'nohp' => $this->otpService->normalizePhone($request->string('nohp')->toString()),
        ]);

        $validated = $request->validate([
            'email' => 'required|email',
            'nohp' => 'required|string|max:20',
            'otp_code' => ['required', 'string', 'size:6'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => [__('Akun dengan email tersebut tidak ditemukan.')],
            ]);
        }

        $this->otpService->assertPhoneMatchesUser($user, $validated['nohp']);

        $this->otpService->validate(
            $validated['nohp'],
            $validated['otp_code'],
            OtpType::PasswordReset,
            $validated['email'],
        );

        $status = Password::sendResetLink(
            ['email' => $validated['email']]
        );

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return back()->with('status', __('Kode OTP terverifikasi. Tautan reset password telah dikirim ke email Anda.'));
    }
}
