import { FormEvent, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Head, useForm } from '@inertiajs/react';
import { Phone, Send } from 'lucide-react';
import Logo from '@/assets/home/logoalbiruni.webp'


interface LoginProps {
    status?: string;
}

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

const getCsrfToken = (): string => {
    if (typeof document === 'undefined') {
        return '';
    }

    const token = document
        .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.getAttribute('content');

    if (!token) {
        console.error('CSRF token not found in meta tag');
        return '';
    }

    return token;
};

export default function Login({ status }: LoginProps) {
    const otpForm = useForm({
        nohp: '',
        otp_code: '',
        remember: false,
    });
    const [otpSending, setOtpSending] = useState(false);
    const [otpMessage, setOtpMessage] = useState<string | null>(null);
    const [otpRequestError, setOtpRequestError] = useState<string | null>(null);
    const [otpSendErrors, setOtpSendErrors] = useState<Record<string, string[]>>({});

    const handleSendOtp = async () => {
        if (!otpForm.data.nohp) {
            setOtpSendErrors({ nohp: ['Nomor WhatsApp wajib diisi.'] });
            return;
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            setOtpRequestError('CSRF token tidak ditemukan. Silakan refresh halaman.');
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
                    'X-CSRF-TOKEN': csrfToken,
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
                if (response.status === 419) {
                    setOtpRequestError(
                        'Session expired. Silakan refresh halaman dan coba lagi.',
                    );
                    return;
                }

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
                                <img
                                    src={Logo}
                                    alt="Logo Albiruni"
                                />
                            </div>
                        </div>
                        <h1 className="text-center text-xl font-bold">Al Biruni Preschool And Daycare</h1>
                        <p className="mt-2 text-center opacity-90">
                            Login dengan WhatsApp OTP
                        </p>
                        <p className="mt-1 text-center text-sm opacity-75">
                            Hubungi admin untuk mendaftarkan nomor Anda
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="mx-auto -mt-10 w-full max-w-md px-6 pb-8">
                    {/* OTP Form */}
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
                                            placeholder="08123xxxxxxxxx"
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

                                {/* Auto Remember Me - Hidden but always true */}
                                <input type="hidden" name="remember" value="1" />

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
