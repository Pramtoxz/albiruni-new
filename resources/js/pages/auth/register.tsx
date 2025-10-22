import { FormEvent, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useForm, Head, Link } from '@inertiajs/react';
import { LogIn, Mail, Lock, Phone, User, Shield, Send } from 'lucide-react';

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
    const [otpSendErrors, setOtpSendErrors] = useState<Record<string, string[]>>({});

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
                    payload?.message ?? 'Gagal mengirim OTP. Silakan coba kembali.',
                );
                return;
            }

            setOtpMessage(payload?.message ?? 'Kode OTP berhasil dikirim.');
        } catch (_) {
            setOtpRequestError(
                'Tidak dapat menghubungi layanan OTP. Pastikan koneksi internet stabil.',
            );
        } finally {
            setOtpSending(false);
        }
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 pb-safe">
                {/* Header */}
                <div className="bg-primary px-6 pb-16 pt-safe-top pt-8 text-primary-foreground">
                    <div className="mx-auto max-w-md">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur">
                                <Shield className="h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-center text-3xl font-bold">Buat Akun Baru</h1>
                        <p className="mt-2 text-center opacity-90">
                            Daftar untuk mengakses sistem TK Al-Biruni
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="mx-auto -mt-10 w-full max-w-md px-6 pb-8">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl bg-card p-6 shadow-2xl"
                        noValidate
                    >
                        <div className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Nama Lengkap
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                                        placeholder="Masukkan nama lengkap"
                                        className="h-12 pl-11 text-base"
                                    />
                                </div>
                                <InputError message={form.errors.name} />
                            </div>

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
                                        className="h-12 pl-11 text-base"
                                    />
                                </div>
                                <InputError message={form.errors.email || otpSendErrors.email?.[0]} />
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <Label htmlFor="nohp" className="text-sm font-medium">
                                    Nomor WhatsApp
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                                        className="h-12 pl-11 text-base"
                                    />
                                </div>
                                <InputError message={form.errors.nohp || otpSendErrors.nohp?.[0]} />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                                        placeholder="Minimal 8 karakter"
                                        className="h-12 pl-11 text-base"
                                    />
                                </div>
                                <InputError message={form.errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                    Konfirmasi Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        value={form.data.password_confirmation}
                                        onChange={(event) => {
                                            form.setData('password_confirmation', event.target.value);
                                            form.clearErrors('password_confirmation');
                                        }}
                                        placeholder="Ulangi password"
                                        className="h-12 pl-11 text-base"
                                    />
                                </div>
                                <InputError message={form.errors.password_confirmation} />
                            </div>

                            {/* OTP Section */}
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
                                    className="h-12 text-center text-lg tracking-widest"
                                />
                                <InputError message={form.errors.otp_code} />
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
                                disabled={form.processing}
                            >
                                {form.processing && <Spinner />}
                                Buat Akun
                            </Button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
