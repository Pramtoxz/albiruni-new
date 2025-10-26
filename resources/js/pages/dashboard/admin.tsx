import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Users, FileText, Settings } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: dashboard.url(),
    },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                    <p className="text-muted-foreground">Selamat datang di panel admin</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {/* User Management Card */}
                    <Link href="/admin/users">
                        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Manajemen User</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Kelola akun guru dan orang tua
                                    </p>
                                </div>
                                <div className="rounded-lg bg-primary/10 p-3">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm font-medium text-primary group-hover:underline">
                                Lihat semua →
                            </div>
                        </div>
                    </Link>

                    {/* Daily Reports Card */}
                    <div className="relative overflow-hidden rounded-xl border bg-card p-6 opacity-50">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Laporan Harian</h3>
                                <p className="text-sm text-muted-foreground">
                                    Lihat semua laporan harian
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            Segera hadir
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="relative overflow-hidden rounded-xl border bg-card p-6 opacity-50">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Pengaturan</h3>
                                <p className="text-sm text-muted-foreground">
                                    Konfigurasi sistem
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                                <Settings className="h-6 w-6 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            Segera hadir
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
