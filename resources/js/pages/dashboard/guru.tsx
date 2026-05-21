import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    CheckSquare,
    FileText,
    PenTool,
} from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import StatsCards from '@/components/dashboard/StatsCards';
import IconDaily from "@/assets/menu/guru/daily.webp"
import IconMateri from "@/assets/menu/guru/materi.webp"
import IconAbsen from "@/assets/menu/guru/absen.webp"
import IconGaleri from "@/assets/menu/guru/galeri.webp"
import IconSiswa from "@/assets/menu/siswa.webp"
import IconReport from "@/assets/menu/report.webp"
import IconPMateri from "@/assets/menu/materi.webp"

interface TodayStats {
    siswaHadir: number;
    totalSiswa: number;
    completedDailyReports: number;
    totalDailyReports: number;
    completedMateri: number;
    totalMateri: number;
}

interface RecentReport {
    id: number;
    title: string;
    class: string;
    siswa_name: string;
    time: string;
    status: string;
    statusColor: string;
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    todayStats: TodayStats;
    recentReports: RecentReport[];
    [key: string]: any;
}

export default function GuruDashboard() {
    const { auth, todayStats, recentReports } = usePage<PageProps>().props;

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
                router.post('/logout');
            }
        });
    };

    const quickActions = [
        { icon: PenTool, label: 'Daily Report', color: 'from-green-400 to-green-600', imageSrc: IconDaily, href: '/guru/daily-report' },
        { icon: BookOpen, label: 'Materi', color: 'from-orange-400 to-orange-600', imageSrc: IconMateri, href: '/guru/rencana-pembelajaran' },
        { icon: CheckSquare, label: 'Absensi', color: 'from-blue-400 to-blue-600', imageSrc: IconAbsen, href: '/guru/absensi' },
        { icon: Calendar, label: 'Jadwal', color: 'from-purple-400 to-purple-600', imageSrc: IconGaleri, href: '/guru/jadwal' },
        { icon: FileText, label: 'Rapor', color: 'from-indigo-400 to-indigo-600', imageSrc: IconReport, href: '/guru/rapor' },
    ];

    const statsCards = [
        { 
            label: 'Siswa Hadir', 
            value: todayStats.siswaHadir.toString(), 
            total: todayStats.totalSiswa.toString(), 
            color: 'from-green-400 to-green-600', 
            imageSrc: IconSiswa 
        },
        { 
            label: 'Daily Report', 
            value: todayStats.completedDailyReports.toString(), 
            total: todayStats.totalDailyReports.toString(), 
            color: 'from-blue-400 to-blue-600', 
            imageSrc: IconReport 
        },
        { 
            label: 'Materi Hari Ini', 
            value: todayStats.completedMateri.toString(), 
            total: todayStats.totalMateri.toString(), 
            color: 'from-purple-400 to-purple-600', 
            imageSrc: IconPMateri 
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
                <DashboardHeader
                    userName={auth.user.name}
                    userRole="guru"
                    onLogout={handleLogout}
                    subtitle="TK Al-Biruni ⭐"
                />

                {/* Stats Cards in Header */}
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 pb-12 -mt-12">
                    <StatsCards stats={statsCards} />
                </div>

                {/* Quick Actions */}
                <QuickActions actions={quickActions} />

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
                            {recentReports && recentReports.length > 0 ? (
                                recentReports.map((report) => (
                                    <Link key={report.id} href={`/guru/daily-report/${report.id}`}>
                                        <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-l-4 border-blue-400 hover:shadow-md transition-all">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 shadow-md">
                                                <PenTool className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800">{report.siswa_name}</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {report.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Kelas: {report.class} • {report.time}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-bold ${report.statusColor} self-center`}>
                                                {report.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-8 text-center text-sm text-gray-500">
                                    Belum ada daily report hari ini
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
