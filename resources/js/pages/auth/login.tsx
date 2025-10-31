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
    bypassOtp?: boolean;
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

export default function Login({ status, bypassOtp = false }: LoginProps) {
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

        // If OTP is bypassed, allow login without OTP code
        if (bypassOtp && !otpForm.data.otp_code) {
            otpForm.post('/login/otp', {
                preserveScroll: true,
            });
            return;
        }

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
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-safe relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-300 rounded-full opacity-20"></div>

                {/* Header */}
                <div className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 px-6 pb-16 pt-safe-top pt-12 md:pt-16 text-white shadow-lg">
                    {/* Floating Stars Decoration */}
                    <div className="absolute top-4 right-4 animate-bounce hidden md:block">
                        <Phone className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                    </div>
                    <div className="absolute top-12 left-8 animate-pulse hidden md:block">
                        <Send className="h-5 w-5 text-yellow-200" />
                    </div>

                    <div className="mx-auto max-w-md relative z-10">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-yellow-300/50">
                                    <img
                                        src={Logo}
                                        alt="Logo Albiruni"
                                        className="h-20 w-20 object-contain"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-2 border-2 border-white shadow-md">
                                    <Phone className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-center text-2xl font-bold drop-shadow-md">Al Biruni Preschool And Daycare</h1>
                        <p className="mt-2 text-center text-lg opacity-90">
                            {bypassOtp ? 'Login (Development Mode)' : 'Login dengan WhatsApp OTP'}
                        </p>
                        {!bypassOtp && (
                            <p className="mt-1 text-center text-sm opacity-75">
                                Hubungi admin untuk mendaftarkan nomor Anda
                            </p>
                        )}
                        {bypassOtp && (
                            <p className="mt-1 text-center text-sm opacity-75 text-yellow-300">
                                OTP dinonaktifkan - cukup masukkan nomor WhatsApp
                            </p>
                        )}
                    </div>
                </div>

                {/* Form Container */}
                <div className="mx-auto -mt-10 w-full max-w-md px-6 pb-8 relative z-10">
                    {/* OTP Form */}
                    <form
                        onSubmit={handleOtpSubmit}
                        className="rounded-3xl bg-white p-6 shadow-2xl border-0 relative overflow-hidden"
                        noValidate
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-bl-full opacity-50"></div>
                        <div className="space-y-5 relative z-10">
                            {/* WhatsApp Number */}
                            <div className="space-y-2">
                                <Label htmlFor="nohp" className="text-sm font-medium">
                                    Nomor WhatsApp
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="nohp"
                                        type="number"
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

                            {/* OTP Code - Only show if not bypassed */}
                            {!bypassOtp && (
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
                            )}

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
                                className="h-12 w-full text-base font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg"
                                disabled={otpForm.processing}
                            >
                                {otpForm.processing && <Spinner />}
                                {bypassOtp ? 'Masuk' : 'Masuk dengan OTP'}
                            </Button>
                        </div>
                    </form>

                    {/* Status Message */}
                    {status && (
                        <div className="mt-4 rounded-2xl bg-green-50 p-3 text-center text-sm font-medium text-green-700 shadow-md border-2 border-green-200">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
