import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    Calendar,
    CheckSquare,
    ClipboardList,
    FileText,
    Home,
    MessageSquare,
    PenTool,
    Users,
} from 'lucide-react';

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: any;
}

export default function GuruDashboard() {
    const { auth } = usePage<PageProps>().props;

    const menuItems = [
        { icon: Home, label: 'Beranda', active: true, href: '/dashboard' },
        { icon: PenTool, label: 'Daily Report', active: false, href: '/guru/daily-report' },
        { icon: BookOpen, label: 'Materi', active: false, href: '/guru/materi' },
        { icon: Users, label: 'Siswa', active: false, href: '/guru/siswa' },
        { icon: MessageSquare, label: 'Pesan', active: false, href: '/guru/pesan' },
    ];

    const quickActions = [
        { icon: PenTool, label: 'Daily Report', color: 'bg-blue-500', href: '/guru/daily-report/create' },
        { icon: BookOpen, label: 'Upload Materi', color: 'bg-green-500', href: '/guru/materi/create' },
        { icon: CheckSquare, label: 'Absensi', color: 'bg-orange-500', href: '/guru/absensi' },
        { icon: Calendar, label: 'Jadwal', color: 'bg-purple-500', href: '/guru/jadwal' },
    ];

    const todayStats = [
        { label: 'Siswa Hadir', value: '24', total: '25', color: 'text-green-600' },
        { label: 'Daily Report', value: '3', total: '5', color: 'text-blue-600' },
        { label: 'Materi Hari Ini', value: '2', total: '3', color: 'text-purple-600' },
    ];

    const recentReports = [
        {
            title: 'Kegiatan Menggambar',
            class: 'TK A',
            time: '10:30 WIB',
            status: 'Selesai',
            statusColor: 'text-green-600',
        },
        {
            title: 'Belajar Berhitung',
            class: 'TK B',
            time: '13:00 WIB',
            status: 'Berlangsung',
            statusColor: 'text-blue-600',
        },
    ];

    return (
        <>
            <Head title="Dashboard Guru" />

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
                                <p className="text-xs opacity-75">Guru TK Al-Biruni</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground hover:bg-primary-foreground/10"
                        >
                            <Bell className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        {todayStats.map((stat, index) => (
                            <Card key={index} className="border-0 bg-primary-foreground/10 backdrop-blur">
                                <CardContent className="p-3 text-center">
                                    <p className="text-2xl font-bold text-primary-foreground">
                                        {stat.value}
                                        <span className="text-sm opacity-75">/{stat.total}</span>
                                    </p>
                                    <p className="text-xs text-primary-foreground/90">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
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
                    {/* Daily Report Hari Ini */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">📝 Daily Report Hari Ini</CardTitle>
                                <Link href="/guru/daily-report/create">
                                    <Button size="sm" variant="outline" className="h-8 text-xs">
                                        + Buat Baru
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentReports.map((report, index) => (
                                <div key={index} className="flex gap-3 rounded-lg border p-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                        <PenTool className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{report.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Kelas: {report.class} • {report.time}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-medium ${report.statusColor}`}>
                                        {report.status}
                                    </span>
                                </div>
                            ))}
                            {recentReports.length === 0 && (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Belum ada daily report hari ini
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Materi Pembelajaran */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">📚 Materi Pembelajaran</CardTitle>
                                <Link href="/guru/materi">
                                    <Button size="sm" variant="ghost" className="h-8 text-xs">
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-3 rounded-lg border p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Mengenal Angka 1-10</p>
                                    <p className="text-xs text-muted-foreground">TK A • Matematika</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Diupload 2 hari lalu</p>
                                </div>
                            </div>
                            <div className="flex gap-3 rounded-lg border p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Mengenal Huruf Vokal</p>
                                    <p className="text-xs text-muted-foreground">TK B • Bahasa Indonesia</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Diupload 3 hari lalu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jadwal Mengajar */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">📅 Jadwal Mengajar Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                                    <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">TK A - Matematika</p>
                                    <p className="text-xs text-muted-foreground">08:00 - 09:30 WIB</p>
                                </div>
                                <span className="text-xs font-medium text-green-600">Selesai</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-primary/50 bg-primary/5 p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">TK B - Bahasa Indonesia</p>
                                    <p className="text-xs text-muted-foreground">10:00 - 11:30 WIB</p>
                                </div>
                                <span className="text-xs font-medium text-blue-600">Berlangsung</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">TK A - Seni & Kreativitas</p>
                                    <p className="text-xs text-muted-foreground">13:00 - 14:30 WIB</p>
                                </div>
                                <span className="text-xs text-muted-foreground">Akan Datang</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tugas Pending */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">✅ Tugas Pending</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                        <ClipboardList className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Koreksi Tugas Menggambar</p>
                                        <p className="text-xs text-muted-foreground">15 tugas belum dikoreksi</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                                        <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Input Nilai Semester</p>
                                        <p className="text-xs text-muted-foreground">Deadline: 3 hari lagi</p>
                                    </div>
                                </div>
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
