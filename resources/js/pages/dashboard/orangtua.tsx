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
    Images,
    LogOut,
    Users,
    Sparkles,
    Star,
    Heart,
    Smile,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { NotifikasiModal } from '@/components/notifikasi-modal';
import EventModal from '@/components/event-modal';
import { useState } from 'react';
import LogoAlbiruni from "@/assets/home/logo.webp"
import IconDaily from "@/assets/menu/orangtua/daily.webp"
import IconSpp from "@/assets/menu/orangtua/spp.webp"
import IconKegiatan from "@/assets/menu/orangtua/kegiatan.webp"
import IconGaleri from "@/assets/menu/orangtua/galeri.webp"
import IconPemberitahuan from "@/assets/menu/pemberitahuan.webp"

interface Siswa {
    id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    kelas?: string;
    foto_siswa?: string;
    is_active: boolean;
}

interface KegiatanHarian {
    id: number;
    nama_aktivitas: string;
    deskripsi: string;
    target_perkembangan: string;
    foto_kegiatan?: string;
    tanggal: string;
}

interface Notifikasi {
    id: number;
    type: string;
    title: string;
    message: string;
    updated_at: string;
    url: string;
}

interface News {
    id: number;
    title: string;
    excerpt: string;
    image_url: string;
    slug: string;
    published_at: string;
}

interface Event {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    start_date: string;
    end_date: string;
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
    kegiatanHariIni: KegiatanHarian[];
    notifikasi: Notifikasi[];
    latestNews: News[];
    activeEvents: Event[];
    [key: string]: any;
}

export default function OrangtuaDashboard() {
    const { auth, siswa, kegiatanHariIni, notifikasi, latestNews, activeEvents } = usePage<PageProps>().props;
    const [showNotifikasi, setShowNotifikasi] = useState(false);

    // Debug notifikasi
    console.log('Notifikasi:', notifikasi);
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

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
        { icon: FileText, label: 'Daily Report', color: 'from-blue-400 to-blue-600', imageSrc: IconDaily, href: '/orangtua/daily-report' },
        { icon: CreditCard, label: 'Pembayaran', color: 'from-orange-400 to-orange-600', imageSrc: IconSpp, href: '/orangtua/pembayaran' },
        { icon: BookOpen, label: 'Kegiatan', color: 'from-green-400 to-green-600', imageSrc: IconKegiatan, href: '/orangtua/kegiatan-harian' },
        { icon: Calendar, label: 'Absensi', color: 'from-purple-400 to-purple-600', imageSrc: null, href: '/orangtua/absensi' },
        { icon: BookOpen, label: 'Rapor Digital', color: 'from-indigo-400 to-blue-600', imageSrc: null, href: '/orangtua/rapor' },
        { icon: Images, label: 'Galeri Foto', color: 'from-pink-400 to-rose-500', imageSrc: IconGaleri, href: '/orangtua/galeri' },
    ];

    return (
        <>
            <Head title="Dashboard Orang Tua" />
            
            <EventModal events={activeEvents || []} />

            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-300 rounded-full opacity-20"></div>

                <div className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 px-4 pb-12 pt-12 text-white shadow-lg">
                    <div className="absolute top-4 right-4 animate-bounce">
                        <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                    </div>
                    <div className="absolute top-12 left-8 animate-pulse">
                        <Sparkles className="h-5 w-5 text-yellow-200" />
                    </div>

                    <div className="mb-6 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-14 w-14 border-2 border-white shadow-lg ring-4 ring-yellow-300/50">
                                    <AvatarImage
                                        src={LogoAlbiruni}
                                        alt="Logo Albiruni"
                                        className="object-cover scale-125"
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-yellow-300 to-orange-400 text-white text-xl font-bold">
                                    </AvatarFallback>
                                    A
                                </Avatar>
                            </div>
                            <div>
                                <p className="text-sm font-medium opacity-90 flex items-center gap-1">
                                    Halo, Ayah/Bunda
                                </p>
                                <h1 className="text-xl font-bold drop-shadow-md">{auth.user.name}</h1>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-10 w-10 relative"
                                onClick={() => setShowNotifikasi(true)}
                            >
                                <Bell className="h-5 w-5" />
                                {notifikasi && notifikasi.length > 0 && (
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                                )}
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

                    {/* Cute Student Info Card */}
                    {siswa ? (
                        siswa.is_active ? (
                            <Card className="border-0 bg-white/95 backdrop-blur shadow-xl rounded-3xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-bl-full opacity-50"></div>
                                <CardContent className="p-5 relative z-10">
                                    <div className="flex items-center gap-4">
                                        {siswa.foto_siswa ? (
                                            <div className="relative">
                                                <Avatar className="h-16 w-16 border-4 border-white shadow-lg ring-4 ring-pink-200">
                                                    <AvatarImage src={`/assets/images/foto_siswa/${siswa.foto_siswa}`} />
                                                    <AvatarFallback className="bg-gradient-to-br from-pink-300 to-purple-400 text-white text-2xl font-bold">
                                                        {siswa.nama_panggilan.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-purple-400 border-4 border-white shadow-lg ring-4 ring-pink-200">
                                                    <Users className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                                                <Heart className="h-3 w-3 fill-pink-400 text-pink-400" />
                                                Buah Hati Anda
                                            </p>
                                            <p className="text-xl font-bold text-gray-800 mt-0.5">{siswa.nama_panggilan}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-medium shadow-sm">
                                                    {siswa.kelas ? siswa.kelas : 'Belum ada kelas'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-0 bg-white/95 backdrop-blur shadow-xl rounded-3xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-300 to-orange-300 rounded-bl-full opacity-50"></div>
                                <CardContent className="p-6 relative z-10">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-4 border-4 border-red-200">
                                            <span className="text-4xl">😔</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-800 mb-2">
                                            Maaf, Buah Hati Anda Sudah Tidak Aktif
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Silakan hubungi admin untuk informasi lebih lanjut
                                        </p>
                                        <div className="inline-block text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium shadow-sm">
                                            Status: Tidak Aktif
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    ) : (
                        <Card className="border-0 bg-white/95 backdrop-blur shadow-xl rounded-3xl">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-3">
                                        <Users className="h-8 w-8 text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Belum ada data siswa</p>
                                    <Link href="/siswa/register" className="inline-block text-sm text-white bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all">
                                        Daftar Siswa Sekarang
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Playful Quick Actions - Only show if student is active */}
                {siswa && siswa.is_active && (
                    <div className="-mt-8 px-4 relative z-20">
                        <div className="grid grid-cols-4 gap-3">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className="group flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95"
                                >
                                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:shadow-xl transition-all transform group-hover:-translate-y-1`}>
                                        {action.imageSrc ? (
                                            <img
                                                src={action.imageSrc}
                                                alt={action.label}
                                                className="w-14 h-14 object-contain"
                                            />
                                        ) : (
                                            <span className="text-2xl">{action.imageSrc}</span>
                                        )}
                                        <div className="absolute -top-1 -right-1 bg-yellow-300 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Sparkles className="h-3 w-3 text-yellow-600" />
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 text-center leading-tight">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Colorful Content Section - Only show if student is active */}
                {siswa && siswa.is_active && (
                    <div className="mt-8 space-y-5 px-4 relative z-10">
                        {/* Berita & Pengumuman dengan Tema Ceria */}
                        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="pb-3 bg-gradient-to-r from-yellow-100 to-orange-100">
                                <CardTitle className="text-lg font-bold text-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={IconPemberitahuan}
                                            alt="Logo"
                                            className="w-14 h-14 object-contain"
                                        />
                                        Berita Terkini
                                    </div>
                                    <Link href="/orangtua/berita" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                                        Lihat semua →
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-4">
                                {latestNews && latestNews.length > 0 ? (
                                    latestNews.map((news) => (
                                        <Link key={news.id} href={`/orangtua/berita/${news.slug}`}>
                                            <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-l-4 border-blue-400 hover:shadow-md transition-all mb-3">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={news.image_url}
                                                        alt={news.title}
                                                        className="w-16 h-16 rounded-xl object-cover shadow-sm"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">
                                                        {news.title}
                                                    </p>
                                                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                                        {news.excerpt}
                                                    </p>
                                                    <p className="text-xs text-blue-600 font-medium">
                                                        {formatDate(news.published_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-l-4 border-gray-300">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-300 shadow-md">
                                            <Bell className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">Belum ada berita</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Berita dan pengumuman akan muncul di sini
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Aktivitas Terkini dengan Desain Playful */}
                        <Link href="/orangtua/kegiatan-harian">
                            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all cursor-pointer">
                                <CardHeader className="pb-3 bg-gradient-to-r from-purple-100 to-pink-100">
                                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">⭐</span>
                                            Aktivitas Hari Ini
                                        </div>
                                        <span className="text-sm text-gray-600">Lihat semua →</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 p-4">
                                    {kegiatanHariIni && kegiatanHariIni.length > 0 ? (
                                        kegiatanHariIni.slice(0, 2).map((kegiatan) => (
                                            <div key={kegiatan.id} className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 p-4 border-2 border-orange-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-yellow-400 shadow-md">
                                                        <BookOpen className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{kegiatan.nama_aktivitas}</p>
                                                        <p className="text-xs text-gray-600 line-clamp-1">{kegiatan.deskripsi}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-2xl">📚</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-gray-600">Belum ada kegiatan hari ini</p>
                                            <p className="text-xs text-gray-500 mt-1">Klik untuk melihat semua kegiatan</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                )}
            </div>

            {/* Notifikasi Modal */}
            <NotifikasiModal
                open={showNotifikasi}
                onClose={() => setShowNotifikasi(false)}
                notifikasi={notifikasi || []}
            />
        </>
    );
}
