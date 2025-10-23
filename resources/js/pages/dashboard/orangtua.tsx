import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    Calendar,
    CreditCard,
    FileText,
    Home,
    LogOut,
    MessageSquare,
    Users,
} from 'lucide-react';
import Swal from 'sweetalert2';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    kelas?: string;
    foto_siswa?: string;
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    siswa: Siswa | null;
    [key: string]: any;
}

export default function OrangtuaDashboard() {
    const { auth, siswa } = usePage<PageProps>().props;

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?',
            text: 'Apakah Anda yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post('/logout', {}, {
                    onSuccess: () => {
                        router.visit('/login');
                    }
                });
            }
        });
    };

    const menuItems = [
        { icon: Home, label: 'Beranda', active: true, href: '/dashboard' },
        { icon: FileText, label: 'Daily Report', active: false, href: '/orangtua/daily-report' },
        { icon: Calendar, label: 'Jadwal', active: false, href: '/orangtua/jadwal' },
        { icon: CreditCard, label: 'Pembayaran', active: false, href: '/orangtua/pembayaran' },
        { icon: MessageSquare, label: 'Pesan', active: false, href: '/orangtua/pesan' },
    ];

    const quickActions = [
        { icon: FileText, label: 'Daily Report', color: 'bg-blue-500', href: '/orangtua/daily-report' },
        { icon: BookOpen, label: 'Rapor', color: 'bg-green-500', href: '/orangtua/rapor' },
        { icon: CreditCard, label: 'Tagihan', color: 'bg-orange-500', href: '/orangtua/tagihan' },
        { icon: Calendar, label: 'Absensi', color: 'bg-purple-500', href: '/orangtua/absensi' },
    ];

    return (
        <>
            <Head title="Dashboard Orang Tua" />
            
            {/* Mobile-First Layout */}
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-20">
                {/* Header */}
                <div className="bg-primary px-4 pb-8 pt-6 text-primary-foreground">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary-foreground/20">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm opacity-90">Selamat Datang</p>
                                <h1 className="text-lg font-semibold">{auth.user.name}</h1>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary-foreground hover:bg-primary-foreground/10"
                            >
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary-foreground hover:bg-primary-foreground/10"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Info Card Siswa */}
                    {siswa ? (
                        <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    {siswa.foto_siswa ? (
                                        <Avatar className="h-12 w-12 border-2 border-primary-foreground/20">
                                            <AvatarImage src={`/assets/images/foto_siswa/${siswa.foto_siswa}`} />
                                            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                                                {siswa.nama_panggilan.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
                                            <Users className="h-6 w-6 text-primary-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1 text-primary-foreground">
                                        <p className="text-sm opacity-90">Anak Anda</p>
                                        <p className="font-semibold">{siswa.nama_panggilan}</p>
                                        <p className="text-xs opacity-75">
                                            {siswa.kelas ? `Kelas: ${siswa.kelas}` : 'Belum ada kelas'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
                            <CardContent className="p-4">
                                <div className="text-center text-primary-foreground">
                                    <p className="text-sm opacity-90">Belum ada data siswa</p>
                                    <Link href="/siswa/register" className="mt-2 inline-block text-xs underline">
                                        Daftar Siswa
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="-mt-4 px-4">
                    <div className="grid grid-cols-4 gap-3">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="flex flex-col items-center gap-2 rounded-xl bg-card p-3 shadow-sm transition-all active:scale-95"
                            >
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${action.color} text-white`}
                                >
                                    <action.icon className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-medium text-foreground">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="mt-6 space-y-4 px-4">
                    {/* Pengumuman */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Pengumuman Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-3 rounded-lg border p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Libur Semester</p>
                                    <p className="text-xs text-muted-foreground">
                                        Libur semester akan dimulai tanggal 20 Desember 2024
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">2 hari yang lalu</p>
                                </div>
                            </div>
                            <div className="flex gap-3 rounded-lg border p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Pertemuan Orang Tua</p>
                                    <p className="text-xs text-muted-foreground">
                                        Pertemuan orang tua akan diadakan hari Sabtu, 25 Nov 2024
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">5 hari yang lalu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aktivitas Terkini */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Aktivitas Terkini</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                                        <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Tugas Menggambar</p>
                                        <p className="text-xs text-muted-foreground">Sudah dikumpulkan</p>
                                    </div>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400">✓ Selesai</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Hadir Hari Ini</p>
                                        <p className="text-xs text-muted-foreground">Pukul 07:30 WIB</p>
                                    </div>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400">✓ Hadir</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
                    <div className="bottom-nav-safe flex items-center justify-around px-4 pt-3">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 transition-colors ${
                                    item.active
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
