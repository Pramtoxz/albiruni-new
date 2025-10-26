<?php

namespace App\Services;

use App\Enums\OtpType;
use App\Mail\OtpCodeMail;
use App\Models\Otp;
use App\Models\User;
use App\Providers\WhatsAppGateway;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class OtpService
{
    public function __construct(
        protected WhatsAppGateway $gateway
    ) {
    }

    /**
     * Normalize phone number to 62 format.
     * - 08xxx -> 628xxx
     * - 62xxx -> 62xxx (unchanged)
     * - 8xxx -> 628xxx
     */
    public function normalizePhone(string $phone): string
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // Convert 08xx to 628xx
        if (str_starts_with($phone, '08')) {
            return '62' . substr($phone, 1);
        }

        // If already starts with 62, return as is
        if (str_starts_with($phone, '62')) {
            return $phone;
        }

        // If starts with 8 (without 0), add 62
        if (str_starts_with($phone, '8')) {
            return '62' . $phone;
        }

        // Default: add 62 prefix
        return '62' . $phone;
    }

    /**
     * Create and send an OTP code for the given context.
     *
     * @param  array<string, mixed>  $context
     */
    public function send(string $phone, OtpType $type, array $context = []): void
    {
        $normalizedPhone = $this->normalizePhone($phone);

        DB::transaction(function () use ($normalizedPhone, $type, $context) {
            Otp::where('nohp', $normalizedPhone)
                ->where('type', $type->value)
                ->where('is_used', false)
                ->update(['is_used' => true]);

            $code = (string) random_int(100000, 999999);

            Otp::create([
                'email' => $context['email'] ?? null,
                'nohp' => $normalizedPhone,
                'otp_code' => $code,
                'type' => $type->value,
                'expires_at' => Carbon::now()->addMinutes($this->expiryMinutes()),
            ]);

            $message = $this->buildMessage($type, $code);

            $this->gateway->sendText($normalizedPhone, $message);

            if (! empty($context['email'])) {
                try {
                    Mail::to($context['email'])->send(
                        new OtpCodeMail($code, $type, $this->expiryMinutes())
                    );
                } catch (Throwable $exception) {
                    Log::error('Failed to send OTP email.', [
                        'email' => $context['email'],
                        'type' => $type->value,
                        'exception' => $exception,
                    ]);
                }
            }
        });
    }

    /**
     * Validate an OTP code and mark it as used.
     */
    public function validate(string $phone, string $code, OtpType $type, ?string $email = null): Otp
    {
        $normalizedPhone = $this->normalizePhone($phone);

        return DB::transaction(function () use ($normalizedPhone, $code, $type, $email) {
            $otpQuery = Otp::where('nohp', $normalizedPhone)
                ->where('otp_code', $code)
                ->where('type', $type->value)
                ->where('is_used', false)
                ->where('expires_at', '>=', Carbon::now());

            if ($email !== null) {
                $otpQuery->where('email', $email);
            }

            $otp = $otpQuery->latest('id')->lockForUpdate()->first();

            if (! $otp) {
                throw ValidationException::withMessages([
                    'otp_code' => __('OTP tidak valid atau sudah kadaluarsa.'),
                ]);
            }

            $otp->update(['is_used' => true]);

            return $otp;
        });
    }

    /**
     * Ensure the phone number belongs to the given user.
     */
    public function assertPhoneMatchesUser(User $user, string $phone): void
    {
        $normalizedPhone = $this->normalizePhone($phone);

        if ($user->nohp !== $normalizedPhone) {
            throw ValidationException::withMessages([
                'nohp' => __('Nomor WhatsApp tidak sesuai dengan akun.'),
            ]);
        }
    }

    /**
     * Expiry duration in minutes.
     */
    protected function expiryMinutes(): int
    {
        return (int) config('services.otp.ttl', 5);
    }

    protected function buildMessage(OtpType $type, string $code): string
    {
        $base = __('Kode OTP Anda adalah :code. Berlaku selama :minutes menit.', [
            'code' => $code,
            'minutes' => $this->expiryMinutes(),
        ]);

        return match ($type) {
            OtpType::Login => __('[Albiruni] OTP login: :message', ['message' => $base]),
            OtpType::Register => __('[Albiruni] OTP pendaftaran: :message', ['message' => $base]),
            OtpType::PasswordReset => __('[Albiruni] OTP reset password: :message', ['message' => $base]),
        };
    }
}
