<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OtpType;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        protected OtpService $otpService
    ) {
    }

    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'nohp' => $this->otpService->normalizePhone($request->string('nohp')->toString()),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'nohp' => [
                'required',
                'string',
                'max:20',
                Rule::unique(User::class, 'nohp'),
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'otp_code' => ['required', 'string', 'size:6'],
        ]);

        $this->otpService->validate(
            $validated['nohp'],
            $validated['otp_code'],
            OtpType::Register,
            $validated['email'],
        );

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nohp' => $validated['nohp'],
            'password' => $validated['password'],
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

        // Jika user adalah orangtua dan belum ada data siswa, redirect ke pendaftaran siswa
        if ($user->role === 'orangtua' && !$user->siswa) {
            return redirect()->route('siswa.create');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
