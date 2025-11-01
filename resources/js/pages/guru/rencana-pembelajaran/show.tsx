import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, BookOpen, Download, Video, Star, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface KegiatanHarian {
    id: number;
    hari: string;
    tanggal: string;
    nama_aktivitas: string;
    deskripsi: string;
    target_perkembangan: string;
    alat_bahan: string;
    instruksi: string;
    foto_kegiatan: string | null;
    video_url: string | null;
    file_materi: string | null;
}

interface RencanaPembelajaran {
    id: number;
    nama_rencana: string;
    tema: string;
    sub_tema: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_active: boolean;
    kelas: {
        id: number;
        nama_kelas: string;
    };
    creator: {
        id: number;
        name: string;
    };
    kegiatan_harian: KegiatanHarian[];
}

interface Props {
    rencanaPembelajaran: RencanaPembelajaran;
    appEnv: string;
}

const HARI_LABELS: Record<string, string> = {
    senin: 'Senin',
    selasa: 'Selasa',
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jumat',
};

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;

    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle youtube.com/watch format
    if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const videoId = urlParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle youtube.com/embed format (already embedded)
    if (url.includes('youtube.com/embed/')) {
        return url;
    }

    return null;
};

export default function GuruRencanaPembelajaranShow({ rencanaPembelajaran, appEnv }: Props) {
    // Get current date and day
    const today = new Date();

    // Check if in development mode (local environment)
    const isDevelopment = appEnv === 'local';

    // Check for test_day parameter in URL for development/testing (only in development)
    const urlParams = new URLSearchParams(window.location.search);
    const testDay = isDevelopment ? urlParams.get('test_day') : null;

    // Use test day if provided (and in development), otherwise use actual current day
    const currentDayName = testDay || today.toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase();
    const todayDateString = today.toISOString().split('T')[0];

    // Filter kegiatan for today only
    const todayKegiatan = rencanaPembelajaran.kegiatan_harian.filter((kegiatan) => {
        const kegiatanDate = new Date(kegiatan.tanggal).toISOString().split('T')[0];
        // If test_day is provided (development only), only match by day name, ignore date
        if (testDay) {
            return kegiatan.hari === currentDayName;
        }
        // Normal mode: match both day and date
        return kegiatan.hari === currentDayName && kegiatanDate === todayDateString;
    });

    const sortedKegiatan = [...todayKegiatan].sort((a, b) => {
        const hariOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
        return hariOrder.indexOf(a.hari) - hariOrder.indexOf(b.hari);
    });

    return (
        <>
            <Head title={`Detail - ${rencanaPembelajaran.nama_rencana}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-8 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-purple-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-300 rounded-full opacity-20"></div>

                {/* Floating Stars Decoration */}
                <div className="absolute top-8 right-8 animate-bounce">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 opacity-40" />
                </div>
                <div className="absolute top-20 left-12 animate-pulse">
                    <Sparkles className="h-5 w-5 text-purple-400 opacity-40" />
                </div>

                {/* Content */}
                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/guru/rencana-pembelajaran">
                            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-800">
                                    {rencanaPembelajaran.nama_rencana}
                                </h1>
                                {rencanaPembelajaran.is_active && (
                                    <Badge className="bg-green-500 text-white text-[10px] px-2 py-0">
                                        Aktif
                                    </Badge>
                                )}
                                {isDevelopment && testDay && (
                                    <Badge className="bg-orange-500 text-white text-[10px] px-2 py-0">
                                        Test Mode
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                {rencanaPembelajaran.kelas.nama_kelas}
                            </p>
                        </div>
                    </div>

                    {/* Test Day Selector - Only show in development mode on weekends or when test_day is active */}
                    {isDevelopment && (testDay || today.getDay() === 0 || today.getDay() === 6) && (
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-orange-100 to-yellow-100 mb-3">
                            <CardContent className="p-3">
                                <p className="text-xs font-bold text-orange-800 mb-2">🧪 Mode Testing - Pilih Hari:</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {['senin', 'selasa', 'rabu', 'kamis', 'jumat'].map((day) => (
                                        <Link
                                            key={day}
                                            href={`?test_day=${day}`}
                                            className={`text-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${currentDayName === day
                                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                                                : 'bg-white text-gray-700 hover:bg-orange-200'
                                                }`}
                                        >
                                            {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                                        </Link>
                                    ))}
                                </div>
                                {testDay && (
                                    <Link href={window.location.pathname} className="block mt-2">
                                        <Button size="sm" variant="outline" className="w-full text-xs h-7">
                                            Reset ke Hari Ini
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Info Rencana */}
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-100 to-purple-100">
                            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Informasi Rencana
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Tema</p>
                                <p className="font-bold text-purple-600 text-lg">
                                    {rencanaPembelajaran.tema}
                                </p>
                                {rencanaPembelajaran.sub_tema && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {rencanaPembelajaran.sub_tema}
                                    </p>
                                )}
                            </div>
                            <div className="border-t pt-3">
                                <p className="text-xs text-gray-500 mb-1">Periode</p>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">
                                        {format(new Date(rencanaPembelajaran.tanggal_mulai), 'dd MMMM yyyy', { locale: id })}
                                        {' - '}
                                        {format(new Date(rencanaPembelajaran.tanggal_selesai), 'dd MMMM yyyy', { locale: id })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kegiatan Hari Ini */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">📅 Kegiatan Hari Ini</h2>
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                {format(today, 'EEEE, dd MMM', { locale: id })}
                            </Badge>
                        </div>

                        {sortedKegiatan.length === 0 ? (
                            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                                <CardContent className="py-12 text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-4 shadow-lg">
                                        <Calendar className="h-10 w-10 text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">
                                        Tidak ada kegiatan untuk hari ini
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Nikmati hari libur Anda! 🎉
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            sortedKegiatan.map((kegiatan) => (
                                <Card key={kegiatan.id} className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                                    <CardHeader className="pb-3 bg-gradient-to-r from-green-100 to-teal-100">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-bold text-gray-800">
                                                {HARI_LABELS[kegiatan.hari]}
                                            </CardTitle>
                                            <span className="text-xs text-gray-600">
                                                {format(new Date(kegiatan.tanggal), 'dd MMMM yyyy', { locale: id })}
                                            </span>
                                        </div>
                                        {kegiatan.nama_aktivitas && (
                                            <p className="text-lg font-bold text-purple-600 mt-2">
                                                {kegiatan.nama_aktivitas}
                                            </p>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        {/* Foto Kegiatan - Only show if exists */}
                                        {kegiatan.foto_kegiatan && (
                                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                        <ImageIcon className="h-4 w-4 text-pink-500" />
                                                        Foto Kegiatan
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-3">
                                                    <img
                                                        src={`/assets/images/kegiatan/${kegiatan.foto_kegiatan}`}
                                                        alt={kegiatan.nama_aktivitas}
                                                        className="w-full rounded-xl shadow-md"
                                                    />
                                                </CardContent>
                                            </Card>
                                        )}

                                        {kegiatan.deskripsi && (
                                            <div className="bg-blue-50 rounded-2xl p-3">
                                                <h4 className="font-bold text-sm text-gray-800 mb-2">📝 Deskripsi</h4>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                    {kegiatan.deskripsi}
                                                </p>
                                            </div>
                                        )}

                                        {kegiatan.target_perkembangan && (
                                            <div className="bg-green-50 rounded-2xl p-3">
                                                <h4 className="font-bold text-sm text-gray-800 mb-2">🎯 Target Perkembangan</h4>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                    {kegiatan.target_perkembangan}
                                                </p>
                                            </div>
                                        )}

                                        {kegiatan.alat_bahan && (
                                            <div className="bg-orange-50 rounded-2xl p-3">
                                                <h4 className="font-bold text-sm text-gray-800 mb-2">🛠️ Alat dan Bahan</h4>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                    {kegiatan.alat_bahan}
                                                </p>
                                            </div>
                                        )}

                                        {kegiatan.instruksi && (
                                            <div className="bg-purple-50 rounded-2xl p-3">
                                                <h4 className="font-bold text-sm text-gray-800 mb-2">📋 Instruksi</h4>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                    {kegiatan.instruksi}
                                                </p>
                                            </div>
                                        )}

                                        {/* Video YouTube - Only show if exists */}
                                        {kegiatan.video_url && getYouTubeEmbedUrl(kegiatan.video_url) && (
                                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                        <Video className="h-4 w-4 text-red-500" />
                                                        Video Pembelajaran
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-3">
                                                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                                                        <iframe
                                                            src={getYouTubeEmbedUrl(kegiatan.video_url) || ''}
                                                            title="Video Pembelajaran"
                                                            className="w-full h-full"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* File Materi - Only show if exists */}
                                        {kegiatan.file_materi && (
                                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                        <Download className="h-4 w-4 text-blue-500" />
                                                        File Materi
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-3">
                                                    <a
                                                        href={`/assets/documents/kegiatan/${kegiatan.file_materi}`}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md">
                                                            <Download className="h-4 w-4" />
                                                            Download Materi
                                                        </Button>
                                                    </a>
                                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                                        {kegiatan.file_materi}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
