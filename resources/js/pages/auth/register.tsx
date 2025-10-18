import { FormEvent, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { useForm, Head } from '@inertiajs/react';

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

export default function Register() {
    const form = useForm({
        name: '',
        email: '',
        nohp: '',
        password: '',
        password_confirmation: '',
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

        form.post('/register', {
            preserveScroll: true,
            onSuccess: () => {
                setOtpMessage(null);
                setOtpSendErrors({});
                form.reset('password', 'password_confirmation', 'otp_code');
            },
        });
    };

    const handleSendOtp = async () => {
        const errors: Record<string, string[]> = {};

        if (!form.data.nohp) {
            errors.nohp = ['Nomor WhatsApp wajib diisi.'];
        }

        if (!form.data.email) {
            errors.email = ['Email wajib diisi.'];
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
                    type: 'register',
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
                payload?.message ?? 'Kode OTP berhasil dikirim ke WhatsApp.',
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
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
                noValidate
            >
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            autoFocus
                            required
                            autoComplete="name"
                            name="name"
                            value={form.data.name}
                            onChange={(event) => {
                                form.setData('name', event.target.value);
                                form.clearErrors('name');
                            }}
                            placeholder="Full name"
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            name="email"
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
                            placeholder="email@example.com"
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
                            required
                            inputMode="numeric"
                            autoComplete="tel-national"
                            name="nohp"
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
                            placeholder="628123xxxxxxxxx"
                        />
                        <InputError
                            message={
                                form.errors.nohp || otpSendErrors.nohp?.[0]
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            name="password"
                            value={form.data.password}
                            onChange={(event) => {
                                form.setData('password', event.target.value);
                                form.clearErrors('password');
                            }}
                            placeholder="Password"
                        />
                        <InputError message={form.errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            autoComplete="new-password"
                            name="password_confirmation"
                            value={form.data.password_confirmation}
                            onChange={(event) => {
                                form.setData(
                                    'password_confirmation',
                                    event.target.value,
                                );
                                form.clearErrors('password_confirmation');
                            }}
                            placeholder="Confirm password"
                        />
                        <InputError
                            message={form.errors.password_confirmation}
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
                                {otpSending && <Spinner />}
                                Kirim OTP
                            </Button>
                        </div>
                        <Input
                            id="otp_code"
                            type="text"
                            inputMode="numeric"
                            maxLength={OTP_CODE_LENGTH}
                            autoComplete="one-time-code"
                            required
                            name="otp_code"
                            value={form.data.otp_code}
                            onChange={(event) => {
                                form.setData('otp_code', event.target.value);
                                form.clearErrors('otp_code');
                            }}
                            placeholder="Masukkan 6 digit OTP"
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
                        type="submit"
                        className="mt-2 w-full"
                        disabled={form.processing}
                        data-test="register-user-button"
                    >
                        {form.processing && <Spinner />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={login()} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
