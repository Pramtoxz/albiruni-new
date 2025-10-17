<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OtpType;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OtpController extends Controller
{
    public function __construct(
        protected OtpService $otpService
    ) {
    }

    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', Rule::enum(OtpType::class)],
            'nohp' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
        ]);

        $otpType = OtpType::from($validated['type']);
        $phone = $this->otpService->normalizePhone($validated['nohp']);
        $email = $validated['email'] ?? null;

        match ($otpType) {
            OtpType::Login => $this->ensureUserExistsForLogin($phone),
            OtpType::Register => $this->ensurePhoneAvailable($phone),
            OtpType::PasswordReset => $this->ensureUserExistsForPasswordReset($phone, $email),
        };

        $this->otpService->send($phone, $otpType, array_filter([
            'email' => $email,
        ]));

        return response()->json([
            'message' => __('Kode OTP telah dikirim ke WhatsApp Anda.'),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $request->merge([
            'nohp' => $this->otpService->normalizePhone($request->string('nohp')->toString()),
        ]);

        $validated = $request->validate([
            'nohp' => ['required', 'string', 'max:20'],
            'otp_code' => ['required', 'string', 'size:6'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $user = User::where('nohp', $validated['nohp'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'nohp' => [__('Akun dengan nomor tersebut tidak ditemukan.')],
            ]);
        }

        $this->otpService->validate(
            $validated['nohp'],
            $validated['otp_code'],
            OtpType::Login
        );

        Auth::login($user, $validated['remember'] ?? false);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    protected function ensureUserExistsForLogin(string $phone): void
    {
        $exists = User::where('nohp', $phone)->exists();

        if (! $exists) {
            throw ValidationException::withMessages([
                'nohp' => [__('Nomor WhatsApp belum terdaftar.')],
            ]);
        }
    }

    protected function ensurePhoneAvailable(string $phone): void
    {
        $exists = User::where('nohp', $phone)->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'nohp' => [__('Nomor WhatsApp sudah digunakan.')],
            ]);
        }
    }

    protected function ensureUserExistsForPasswordReset(string $phone, ?string $email): void
    {
        if (! $email) {
            throw ValidationException::withMessages([
                'email' => [__('Email wajib diisi untuk verifikasi OTP.')],
            ]);
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => [__('Akun dengan email tersebut tidak ditemukan.')],
            ]);
        }

        $this->otpService->assertPhoneMatchesUser($user, $phone);
    }
}
