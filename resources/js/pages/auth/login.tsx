import { FormEvent, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, useForm } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

type LoginMode = 'password' | 'otp';

const OTP_CODE_LENGTH = 6;

interface OtpSendResponse {
    message?: string;
    errors?: Record<string, string[]>;
}

const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((entry) => typeof entry === 'string');

const isRecordOfStringArray = (
    value: unknown,
): value is Record<string, string[]> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    return Object.values(value).every(isStringArray);
};

const isOtpSendResponse = (value: unknown): value is OtpSendResponse => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const { message, errors } = value as {
        message?: unknown;
        errors?: unknown;
    };

    return (
        (message === undefined || typeof message === 'string') &&
        (errors === undefined || isRecordOfStringArray(errors))
    );
};

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

export default function Login({ status, canResetPassword }: LoginProps) {
    const [mode, setMode] = useState<LoginMode>('password');
    const otpForm = useForm({
        nohp: '',
        otp_code: '',
        remember: false,
    });
    const [otpSending, setOtpSending] = useState(false);
    const [otpMessage, setOtpMessage] = useState<string | null>(null);
    const [otpRequestError, setOtpRequestError] = useState<string | null>(null);
    const [otpSendErrors, setOtpSendErrors] = useState<
        Record<string, string[]>
    >({});

    const description =
        mode === 'password'
            ? 'Enter your email and password below to log in'
            : 'Gunakan nomor WhatsApp Anda untuk menerima OTP dan log in';

    const handleModeChange = (nextMode: LoginMode) => {
        setMode(nextMode);
        if (nextMode === 'otp') {
            return;
        }

        otpForm.reset();
        setOtpMessage(null);
        setOtpRequestError(null);
        setOtpSendErrors({});
    };

    const handleSendOtp = async () => {
        if (!otpForm.data.nohp) {
            setOtpSendErrors({ nohp: ['Nomor WhatsApp wajib diisi.'] });
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
                    type: 'login',
                    nohp: otpForm.data.nohp,
                }),
            });

            let payload: OtpSendResponse | null = null;

            try {
                const data: unknown = await response.json();

                if (isOtpSendResponse(data)) {
                    payload = data;
                }
            } catch {
                payload = null;
            }

            if (!response.ok) {
                if (response.status === 422 && payload?.errors) {
                    setOtpSendErrors(payload.errors);
                    return;
                }

                setOtpRequestError(
                    payload?.message ??
                        'Gagal mengirim OTP. Silakan coba beberapa saat lagi.',
                );
                return;
            }

            setOtpMessage(
                payload?.message ?? 'Kode OTP berhasil dikirim ke WhatsApp.',
            );
        } catch {
            setOtpRequestError(
                'Tidak dapat menghubungi layanan OTP. Pastikan koneksi internet stabil.',
            );
        } finally {
            setOtpSending(false);
        }
    };

    const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOtpRequestError(null);

        otpForm.post('/login/otp', {
            preserveScroll: true,
            onSuccess: () => {
                otpForm.reset('otp_code');
            },
        });
    };

    return (
        <AuthLayout title="Log in to your account" description={description}>
            <Head title="Log in" />

            <div className="mb-6 grid grid-cols-2 gap-2">
                <Button
                    type="button"
                    variant={mode === 'password' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('password')}
                >
                    Email &amp; Password
                </Button>
                <Button
                    type="button"
                    variant={mode === 'otp' ? 'default' : 'outline'}
                    onClick={() => handleModeChange('otp')}
                >
                    WhatsApp OTP
                </Button>
            </div>

            {mode === 'password' ? (
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-sm"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember">
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 w-full"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Log in
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            ) : (
                <form
                    onSubmit={handleOtpSubmit}
                    className="flex flex-col gap-6"
                    noValidate
                >
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="nohp">Nomor WhatsApp</Label>
                            <Input
                                id="nohp"
                                type="tel"
                                autoFocus
                                autoComplete="tel-national"
                                inputMode="numeric"
                                name="nohp"
                                value={otpForm.data.nohp}
                                onChange={(event) => {
                                    otpForm.setData('nohp', event.target.value);
                                    otpForm.clearErrors('nohp');
                                    setOtpSendErrors({});
                                }}
                                placeholder="628123xxxxxxxxx"
                            />
                            <InputError
                                message={
                                    otpForm.errors.nohp ||
                                    otpSendErrors.nohp?.[0]
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="otp_code">Kode OTP</Label>
                            <Input
                                id="otp_code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                name="otp_code"
                                maxLength={OTP_CODE_LENGTH}
                                value={otpForm.data.otp_code}
                                onChange={(event) => {
                                    otpForm.setData(
                                        'otp_code',
                                        event.target.value,
                                    );
                                    otpForm.clearErrors('otp_code');
                                }}
                                placeholder="Masukkan 6 digit OTP"
                            />
                            <InputError message={otpForm.errors.otp_code} />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="rememberOtp"
                                    checked={otpForm.data.remember}
                                    onCheckedChange={(checked) =>
                                        otpForm.setData(
                                            'remember',
                                            Boolean(checked),
                                        )
                                    }
                                />
                                <Label htmlFor="rememberOtp">
                                    Ingat saya
                                </Label>
                            </div>
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
                            disabled={otpForm.processing}
                        >
                            {otpForm.processing && <Spinner />}
                            Log in with OTP
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Need to use email instead?{' '}
                        <button
                            type="button"
                            className="text-primary underline"
                            onClick={() => handleModeChange('password')}
                        >
                            Switch to password login
                        </button>
                    </div>
                </form>
            )}

            {status && (
                <div className="mt-6 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
