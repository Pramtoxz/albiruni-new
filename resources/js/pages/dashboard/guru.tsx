import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    Calendar,
    CheckSquare,
    ClipboardList,
    FileText,
    Home,
    LogOut,
    MessageSquare,
    PenTool,
    Users,
    Sparkles,
    Star,
    Award,
} from 'lucide-react';
import Swal from 'sweetalert2';

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
        { icon: PenTool, label: 'Daily Report', active: false, href: '/guru/daily-report' },
        { icon: BookOpen, label: 'Materi', active: false, href: '/guru/materi' },
        { icon: Users, label: 'Siswa', active: false, href: '/guru/siswa' },
        { icon: MessageSquare, label: 'Pesan', active: false, href: '/guru/pesan' },
    ];

    const quickActions = [
        { icon: PenTool, label: 'Daily Report', color: 'from-blue-400 to-blue-600', emoji: '📝', href: '/guru/daily-report' },
        { icon: BookOpen, label: 'Upload Materi', color: 'from-green-400 to-green-600', emoji: '📚', href: '/guru/materi/create' },
        { icon: CheckSquare, label: 'Absensi', color: 'from-orange-400 to-orange-600', emoji: '✅', href: '/guru/absensi' },
        { icon: Calendar, label: 'Jadwal', color: 'from-purple-400 to-purple-600', emoji: '📅', href: '/guru/jadwal' },
    ];

    const todayStats = [
        { label: 'Siswa Hadir', value: '24', total: '25', color: 'from-green-400 to-green-600', emoji: '👦' },
        { label: 'Daily Report', value: '3', total: '5', color: 'from-blue-400 to-blue-600', emoji: '📝' },
        { label: 'Materi Hari Ini', value: '2', total: '3', color: 'from-purple-400 to-purple-600', emoji: '📖' },
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

            {/* Kindergarten Theme Layout */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-8 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-purple-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-300 rounded-full opacity-20"></div>
                
                {/* Header with Playful Design */}
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 pb-12 pt-6 text-white shadow-lg">
                    {/* Floating Stars Decoration */}
                    <div className="absolute top-4 right-4 animate-bounce">
                        <Award className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                    </div>
                    <div className="absolute top-12 left-8 animate-pulse">
                        <Sparkles className="h-5 w-5 text-yellow-200" />
                    </div>
                    
                    <div className="mb-6 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-14 w-14 border-4 border-white shadow-lg ring-4 ring-yellow-300/50">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl font-bold">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-white">
                                    <Star className="h-3 w-3 text-white fill-white" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium opacity-90 flex items-center gap-1">
                                    Selamat Datang, Guru 👋
                                </p>
                                <h1 className="text-xl font-bold drop-shadow-md">{auth.user.name}</h1>
                                <p className="text-xs opacity-90 mt-0.5">TK Al-Biruni ⭐</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-10 w-10 relative"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Colorful Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 relative z-10">
                        {todayStats.map((stat, index) => (
                            <Card key={index} className="border-0 bg-white/95 backdrop-blur shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform">
                                <CardContent className="p-3 text-center">
                                    <div className="text-3xl mb-1">{stat.emoji}</div>
                                    <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                        {stat.value}
                                        <span className="text-sm text-gray-400">/{stat.total}</span>
                                    </p>
                                    <p className="text-[10px] text-gray-600 font-medium leading-tight mt-1">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Playful Quick Actions */}
                <div className="-mt-8 px-4 relative z-20">
                    <div className="grid grid-cols-4 gap-3">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="group flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95"
                            >
                                <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:shadow-xl transition-all transform group-hover:-translate-y-1`}>
                                    <span className="text-2xl">{action.emoji}</span>
                                    <div className="absolute -top-1 -right-1 bg-yellow-300 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Sparkles className="h-3 w-3 text-yellow-600" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-700 text-center leading-tight">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Colorful Content Section */}
                <div className="mt-8 space-y-5 px-4 relative z-10">
                    {/* Daily Report Hari Ini */}
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-100 to-purple-100">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📝</span>
                                    Daily Report Hari Ini
                                </CardTitle>
                                <Link href="/guru/daily-report">
                                    <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:shadow-lg">
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4">
                            {recentReports.map((report, index) => (
                                <Link key={index} href={`/guru/daily-report/${index + 1}`}>
                                    <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-l-4 border-blue-400 hover:shadow-md transition-all">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 shadow-md">
                                            <PenTool className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">{report.title}</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Kelas: {report.class} • {report.time}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-bold ${report.statusColor} self-center`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            {recentReports.length === 0 && (
                                <div className="py-8 text-center text-sm text-gray-500">
                                    Belum ada daily report hari ini
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Materi Pembelajaran */}
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-3 bg-gradient-to-r from-green-100 to-teal-100">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📚</span>
                                    Materi Pembelajaran
                                </CardTitle>
                                <Link href="/guru/materi">
                                    <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 hover:shadow-lg">
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4">
                            <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-green-50 to-teal-50 p-4 border-l-4 border-green-400 hover:shadow-md transition-all">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-teal-400 shadow-md">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">Mengenal Angka 1-10 🔢</p>
                                    <p className="text-xs text-gray-600 mt-1">TK A • Matematika</p>
                                    <p className="mt-1 text-xs text-green-600 font-medium">Diupload 2 hari lalu</p>
                                </div>
                            </div>
                            <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-l-4 border-purple-400 hover:shadow-md transition-all">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 shadow-md">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">Mengenal Huruf Vokal 🔤</p>
                                    <p className="text-xs text-gray-600 mt-1">TK B • Bahasa Indonesia</p>
                                    <p className="mt-1 text-xs text-purple-600 font-medium">Diupload 3 hari lalu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jadwal Mengajar */}
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-3 bg-gradient-to-r from-orange-100 to-yellow-100">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">📅</span>
                                Jadwal Mengajar Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4">
                            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-2 border-gray-200">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 shadow-md">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">TK A - Matematika 🔢</p>
                                    <p className="text-xs text-gray-600">08:00 - 09:30 WIB</p>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Selesai ✓</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 p-4 border-2 border-blue-400 shadow-md">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-md animate-pulse">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">TK B - Bahasa Indonesia 📖</p>
                                    <p className="text-xs text-gray-600">10:00 - 11:30 WIB</p>
                                </div>
                                <span className="text-xs font-bold text-blue-600 bg-blue-200 px-3 py-1 rounded-full animate-pulse">Berlangsung</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-2 border-purple-200">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 shadow-md">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">TK A - Seni & Kreativitas 🎨</p>
                                    <p className="text-xs text-gray-600">13:00 - 14:30 WIB</p>
                                </div>
                                <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">Akan Datang</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tugas Pending */}
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-3 bg-gradient-to-r from-red-100 to-orange-100">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">✅</span>
                                Tugas Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4">
                            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 p-4 border-l-4 border-red-400 hover:shadow-md transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-orange-400 shadow-md">
                                        <ClipboardList className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Koreksi Tugas Menggambar 🎨</p>
                                        <p className="text-xs text-gray-600">15 tugas belum dikoreksi</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 p-4 border-l-4 border-yellow-400 hover:shadow-md transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-400 shadow-md">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Input Nilai Semester 📊</p>
                                        <p className="text-xs text-gray-600">Deadline: 3 hari lagi</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Menu Navigasi dalam Card */}
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
                        <div className="bg-white rounded-3xl p-4">
                            <p className="text-sm font-bold text-gray-700 mb-3 text-center">Menu Utama</p>
                            <div className="grid grid-cols-5 gap-2">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                                            item.active
                                                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
