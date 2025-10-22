import { FormEvent, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Form, Head, Link, useForm } from '@inertiajs/react';
import { store } from '@/routes/login';
import { LogIn, Mail, Lock, Phone, Shield, Send, KeyRound } from 'lucide-react';

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

const isRecordOfStringArray = (value: unknown): value is Record<string, string[]> => {
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
    const [mode, setMode] = useState<LoginMode>('otp');
    const otpForm = useForm({
        nohp: '',
        otp_code: '',
        remember: false,
    });
    const [otpSending, setOtpSending] = useState(false);
    const [otpMessage, setOtpMessage] = useState<string | null>(null);
    const [otpRequestError, setOtpRequestError] = useState<string | null>(null);
    const [otpSendErrors, setOtpSendErrors] = useState<Record<string, string[]>>({});

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
                    payload?.message ?? 'Gagal mengirim OTP. Silakan coba beberapa saat lagi.',
                );
                return;
            }

            setOtpMessage(payload?.message ?? 'Kode OTP berhasil dikirim ke WhatsApp.');
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
        <>
            <Head title="Login" />
            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 pb-safe">
                {/* Header */}
                <div className="bg-primary px-6 pb-16 pt-safe-top pt-8 text-primary-foreground">
                    <div className="mx-auto max-w-md">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur">
                                <LogIn className="h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-center text-3xl font-bold">Selamat Datang</h1>
                        <p className="mt-2 text-center opacity-90">
                            Masuk ke sistem TK Al-Biruni
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="mx-auto -mt-10 w-full max-w-md px-6 pb-8">
                    {/* Mode Switcher */}
                    <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-card p-2 shadow-lg">
                        <button
                            type="button"
                            onClick={() => handleModeChange('otp')}
                            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                mode === 'otp'
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Phone className="h-4 w-4" />
                            WhatsApp OTP
                        </button>
                        <button
                            type="button"
                            onClick={() => handleModeChange('password')}
                            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                mode === 'password'
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <KeyRound className="h-4 w-4" />
                            Email & Password
                        </button>
                    </div>

                    {/* OTP Form */}
                    {mode === 'otp' ? (
                        <form
                            onSubmit={handleOtpSubmit}
                            className="rounded-3xl bg-card p-6 shadow-2xl"
                            noValidate
                        >
                            <div className="space-y-5">
                                {/* WhatsApp Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="nohp" className="text-sm font-medium">
                                        Nomor WhatsApp
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                                            className="h-12 pl-11 text-base"
                                        />
                                    </div>
                                    <InputError message={otpForm.errors.nohp || otpSendErrors.nohp?.[0]} />
                                </div>

                                {/* OTP Code */}
                                <div className="rounded-xl border bg-muted/30 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <Label htmlFor="otp_code" className="text-sm font-medium">
                                            Kode OTP
                                        </Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handleSendOtp}
                                            disabled={otpSending}
                                            className="h-9"
                                        >
                                            {otpSending ? <Spinner /> : <Send className="mr-1 h-4 w-4" />}
                                            Kirim OTP
                                        </Button>
                                    </div>
                                    <Input
                                        id="otp_code"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        name="otp_code"
                                        maxLength={OTP_CODE_LENGTH}
                                        value={otpForm.data.otp_code}
                                        onChange={(event) => {
                                            otpForm.setData('otp_code', event.target.value);
                                            otpForm.clearErrors('otp_code');
                                        }}
                                        placeholder="Masukkan 6 digit OTP"
                                        className="h-12 text-center text-lg tracking-widest"
                                    />
                                    <InputError message={otpForm.errors.otp_code} />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="rememberOtp"
                                        checked={otpForm.data.remember}
                                        onCheckedChange={(checked) =>
                                            otpForm.setData('remember', Boolean(checked))
                                        }
                                    />
                                    <Label htmlFor="rememberOtp" className="text-sm">
                                        Ingat saya
                                    </Label>
                                </div>

                                {/* Messages */}
                                {otpMessage && (
                                    <div className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                        ✓ {otpMessage}
                                    </div>
                                )}

                                {otpRequestError && (
                                    <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                        ✗ {otpRequestError}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="h-12 w-full text-base font-semibold"
                                    disabled={otpForm.processing}
                                >
                                    {otpForm.processing && <Spinner />}
                                    Masuk dengan OTP
                                </Button>
                            </div>
                        </form>
                    ) : (
                        /* Password Form */
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="rounded-3xl bg-card p-6 shadow-2xl"
                        >
                            {({ processing, errors }) => (
                                <div className="space-y-5">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="h-12 pl-11 text-base"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-medium">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-xs font-medium text-primary hover:underline"
                                                >
                                                    Lupa password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Masukkan password"
                                                className="h-12 pl-11 text-base"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="remember" name="remember" />
                                        <Label htmlFor="remember" className="text-sm">
                                            Ingat saya
                                        </Label>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="h-12 w-full text-base font-semibold"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Masuk
                                    </Button>
                                </div>
                            )}
                        </Form>
                    )}

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Belum punya akun?{' '}
                            <Link href="/register" className="font-semibold text-primary hover:underline">
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
