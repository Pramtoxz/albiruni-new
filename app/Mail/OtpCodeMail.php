<?php

namespace App\Mail;

use App\Enums\OtpType;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        protected readonly string $code,
        protected readonly OtpType $type,
        protected readonly int $expiresInMinutes
    ) {
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject($this->subjectLine())
            ->view('emails.otp-code')
            ->with([
                'code' => $this->code,
                'type' => $this->type,
                'expiresInMinutes' => $this->expiresInMinutes,
            ]);
    }

    protected function subjectLine(): string
    {
        return match ($this->type) {
            OtpType::Login => __('[Albiruni] OTP Login'),
            OtpType::Register => __('[Albiruni] OTP Pendaftaran'),
            OtpType::PasswordReset => __('[Albiruni] OTP Reset Password'),
        };
    }
}
