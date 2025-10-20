<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OTP Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 24px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
        <tr>
            <td style="padding: 24px;">
                <h1 style="margin: 0 0 16px; font-size: 20px; color: #1f2937;">Kode OTP Anda</h1>
                @php
                    $purpose = match ($type) {
                        \App\Enums\OtpType::Login => 'masuk ke akun',
                        \App\Enums\OtpType::Register => 'menyelesaikan pendaftaran',
                        \App\Enums\OtpType::PasswordReset => 'mengatur ulang kata sandi',
                    };
                @endphp
                <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563;">
                    Gunakan kode berikut untuk {{ $purpose }} Anda di Albiruni:
                </p>
                <p style="margin: 0 0 16px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827; text-align: center;">
                    {{ $code }}
                </p>
                <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563;">
                    Kode ini berlaku selama {{ $expiresInMinutes }} menit. Jangan bagikan kode ini kepada siapa pun.
                </p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    Jika Anda tidak meminta kode ini, abaikan email ini. Akun Anda akan tetap aman.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px 24px; background-color: #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center;">
                &copy; {{ date('Y') }} Albiruni Preschool & Day Care. All rights reserved.
            </td>
        </tr>
    </table>
</body>
</html>
