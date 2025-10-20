import { FormEvent, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const OTP_CODE_LENGTH = 6;

const getCsrfToken = () => {
    if (typeof document === 'undefined') {
        return '';
    }

    return (
        document
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
};

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const form = useForm({
        email: '',
        nohp: '',
        otp_code: '',
    });
    const [otpSending, setOtpSending] = useState(false);
    const [otpMessage, setOtpMessage] = useState<string | null>(null);
    const [otpRequestError, setOtpRequestError] = useState<string | null>(null);
    const [otpSendErrors, setOtpSendErrors] = useState<
        Record<string, string[]>
    >({});

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOtpRequestError(null);

        form.post('/forgot-password', {
            preserveScroll: true,
            onSuccess: () => {
                setOtpMessage(null);
                setOtpSendErrors({});
                form.reset('otp_code');
            },
        });
    };

    const handleSendOtp = async () => {
        const errors: Record<string, string[]> = {};

        if (!form.data.email) {
            errors.email = ['Email wajib diisi.'];
        }

        if (!form.data.nohp) {
            errors.nohp = ['Nomor WhatsApp wajib diisi.'];
        }

        if (Object.keys(errors).length > 0) {
            setOtpSendErrors(errors);
            return;
        }

        setOtpSending(true);
        setOtpMessage(null);
        setOtpRequestError(null);
        setOtpSendErrors({});

        try {
            const response = await fetch('/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    type: 'password_reset',
                    nohp: form.data.nohp,
                    email: form.data.email,
                }),
            });

            let payload: any = null;

            try {
                payload = await response.json();
            } catch (_) {
                payload = null;
            }

            if (!response.ok) {
                if (response.status === 422 && payload?.errors) {
                    setOtpSendErrors(payload.errors);
                    return;
                }

                setOtpRequestError(
                    payload?.message ??
                        'Gagal mengirim OTP. Silakan coba kembali.',
                );
                return;
            }

            setOtpMessage(
                payload?.message ?? 'Kode OTP berhasil dikirim.',
            );
        } catch (_) {
            setOtpRequestError(
                'Tidak dapat menghubungi layanan OTP. Pastikan koneksi internet stabil.',
            );
        } finally {
            setOtpSending(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot password"
            description="Verifikasi OTP WhatsApp sebelum menerima tautan reset password"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
            >
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            placeholder="email@example.com"
                            value={form.data.email}
                            onChange={(event) => {
                                form.setData('email', event.target.value);
                                form.clearErrors('email');
                                setOtpSendErrors((previous) => {
                                    const next = { ...previous };
                                    delete next.email;
                                    return next;
                                });
                            }}
                        />
                        <InputError
                            message={
                                form.errors.email || otpSendErrors.email?.[0]
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="nohp">Nomor WhatsApp</Label>
                        <Input
                            id="nohp"
                            type="tel"
                            name="nohp"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            placeholder="628123xxxxxxxxx"
                            value={form.data.nohp}
                            onChange={(event) => {
                                form.setData('nohp', event.target.value);
                                form.clearErrors('nohp');
                                setOtpSendErrors((previous) => {
                                    const next = { ...previous };
                                    delete next.nohp;
                                    return next;
                                });
                            }}
                        />
                        <InputError
                            message={
                                form.errors.nohp || otpSendErrors.nohp?.[0]
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-3">
                            <Label htmlFor="otp_code" className="m-0">
                                Kode OTP
                            </Label>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSendOtp}
                                disabled={otpSending}
                            >
                                {otpSending && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}
                                Kirim OTP
                            </Button>
                        </div>
                        <Input
                            id="otp_code"
                            type="text"
                            name="otp_code"
                            inputMode="numeric"
                            maxLength={OTP_CODE_LENGTH}
                            autoComplete="one-time-code"
                            placeholder="Masukkan 6 digit OTP"
                            value={form.data.otp_code}
                            onChange={(event) => {
                                form.setData('otp_code', event.target.value);
                                form.clearErrors('otp_code');
                            }}
                        />
                        <InputError message={form.errors.otp_code} />
                    </div>

                    {otpMessage && (
                        <p className="text-sm font-medium text-green-600">
                            {otpMessage}
                        </p>
                    )}

                    {otpRequestError && (
                        <p className="text-sm font-medium text-red-600">
                            {otpRequestError}
                        </p>
                    )}

                    <Button
                        className="w-full"
                        disabled={form.processing}
                        data-test="email-password-reset-link-button"
                        type="submit"
                    >
                        {form.processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        Email password reset link
                    </Button>
                </div>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink href={login()}>log in</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
