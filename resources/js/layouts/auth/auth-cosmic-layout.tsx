import AppLogoIcon from '@/components/app-logo-icon';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { home } from '@/routes';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LucideIcon, Rocket, ShieldCheck, Star, Users } from 'lucide-react';
import { PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

const featureHighlights: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
}> = [
    {
        title: 'Ruang belajar tematik',
        description:
            'Visual kosmik yang serasi dengan landing page menghadirkan rasa takjub sejak proses masuk aplikasi.',
        icon: Rocket,
    },
    {
        title: 'Keamanan terjaga',
        description:
            'Dukungan OTP WhatsApp dan kata sandi kuat memastikan data keluarga tetap terlindungi.',
        icon: ShieldCheck,
    },
    {
        title: 'Kolaborasi akrab',
        description:
            'Orang tua, guru, dan admin mendapatkan pengalaman konsisten di setiap perangkat dan peran.',
        icon: Users,
    },
];

export default function AuthCosmicLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;
    const brandName =
        name && name.trim() && name.trim() !== 'Laravel'
            ? name.trim()
            : 'Albiruni Preschool & Day Care';
    const brandTagline = 'Membuka galaksi petualangan belajar setiap hari';

    return (
        <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-gradient-to-br from-[#001632] via-[#041254] to-[#001632] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute -left-40 -top-52 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.45)_0%,_transparent_72%)] blur-3xl" />
                <div className="absolute -bottom-40 right-[-15%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.22)_0%,_transparent_70%)] blur-3xl" />
                <div className="absolute left-1/2 top-1/2 hidden h-[28rem] w-[28rem] -translate-y-1/2 translate-x-12 rounded-full bg-[radial-gradient(circle,_rgba(96,165,250,0.14)_0%,_transparent_70%)] blur-3xl md:block" />
                <PlaceholderPattern className="absolute inset-0 h-full w-full stroke-white/10" />
            </div>

            <div className="relative z-10 grid flex-1 items-stretch gap-12 px-6 py-12 md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:px-16">
                <aside className="hidden flex-col justify-between rounded-[34px] border border-white/15 bg-white/10 p-10 backdrop-blur-2xl lg:flex">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                                <AppLogoIcon className="size-8 fill-current text-white" />
                            </div>
                            <div>
                                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.48em] text-sky-200/80">
                                    Sejak 2014
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {brandName}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-semibold leading-tight text-white">
                                Ruang aman untuk tumbuh, bermimpi, dan
                                bersinar.
                            </h2>
                            <p className="text-sm text-white/70">
                                Kami membawa nuansa kosmik dari landing page ke
                                pengalaman autentikasi sehingga orang tua dan
                                pendidik merasakan identitas Albiruni sejak
                                langkah pertama.
                            </p>
                        </div>

                        <dl className="grid gap-4 text-sm text-white/80">
                            {featureHighlights.map(
                                ({ title: featureTitle, description: body, icon: Icon }) => (
                                    <div
                                        key={featureTitle}
                                        className="group flex gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 transition hover:border-white/30 hover:bg-white/15"
                                    >
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 text-white transition group-hover:bg-white/20">
                                            <Icon className="size-6" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <dt className="text-base font-semibold text-white">
                                                {featureTitle}
                                            </dt>
                                            <dd className="text-xs leading-relaxed text-white/70">
                                                {body}
                                            </dd>
                                        </div>
                                    </div>
                                ),
                            )}
                        </dl>
                    </div>

                    {quote?.message && (
                        <blockquote className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-7">
                            <div className="absolute -top-10 right-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.22)_0%,_transparent_70%)] blur-2xl" />
                            <Star className="mb-4 size-6 text-white/70" />
                            <p className="text-lg font-medium leading-relaxed text-white">
                                &ldquo;{quote.message}&rdquo;
                            </p>
                            {quote.author && (
                                <footer className="mt-5 text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                                    {quote.author}
                                </footer>
                            )}
                        </blockquote>
                    )}
                </aside>

                <main className="relative flex w-full justify-center">
                    <div className="relative w-full max-w-md">
                        <div
                            aria-hidden
                            className="absolute -top-14 right-10 hidden h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.45)_0%,_transparent_70%)] blur-2xl sm:block"
                        />
                        <div className="relative flex flex-col gap-8 rounded-[30px] border border-white/20 bg-white/95 p-8 text-left shadow-[0_45px_120px_rgba(15,23,42,0.35)] backdrop-blur-[32px] text-zinc-900 dark:border-white/10 dark:bg-zinc-950/85 dark:text-white sm:p-10">
                            <Link
                                href={home()}
                                className="flex items-center gap-3 text-sm font-semibold text-zinc-700 transition hover:text-zinc-900 dark:text-white/70 dark:hover:text-white"
                            >
                                <AppLogoIcon className="size-8 fill-current text-zinc-800 dark:text-white" />
                                <span>{brandName}</span>
                            </Link>

                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                        {description}
                                    </p>
                                )}
                                <p className="text-xs font-medium uppercase tracking-[0.4em] text-sky-600/80 dark:text-sky-300/80">
                                    {brandTagline}
                                </p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-200/80 to-transparent dark:via-white/10" />

                            <div className="flex flex-col gap-6">{children}</div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
