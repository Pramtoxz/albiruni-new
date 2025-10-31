import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/star-rating';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, X, Star, Sparkles } from 'lucide-react';

interface DailyReport {
    id: number;
    tanggal: string;
    mood: string;
    activity: string;
    siswa: {
        nama_lengkap: string;
        nama_panggilan: string;
    };
    user: {
        name: string;
    };
    sarapan_pagi: string;
    sarapan_status: number;
    makan_siang: string;
    makan_siang_status: number;
    snack_sore: string;
    snack_status: number;
    minum_air_putih: string;
    minum_susu: string;
    tidur_siang: boolean;
    tidur_siang_durasi: string;
    bak: boolean;
    bak_frekuensi: number;
    bab: boolean;
    bab_frekuensi: number;
    kebutuhan_besok: string;
    catatan_khusus: string;
    catatan_insiden: string;
    foto_kegiatan: string;
}

interface Props {
    report: DailyReport;
}

export default function OrangtuaDailyReportShow({ report }: Props) {
    const getMoodEmoji = (mood: string) => {
        const moods: { [key: string]: string } = {
            Happy: '😊',
            Neutral: '😐',
            Sad: '😢',
        };
        return moods[mood] || '😊';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <>
            <Head title={`Daily Report - ${report.siswa.nama_lengkap}`} />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-6 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20"></div>
                <div className="absolute top-40 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-20"></div>

                {/* Floating Stars Decoration */}
                <div className="absolute top-8 right-8 animate-bounce">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 opacity-40" />
                </div>
                <div className="absolute top-24 left-12 animate-pulse">
                    <Sparkles className="h-5 w-5 text-pink-400 opacity-40" />
                </div>

                {/* Content with integrated back button */}
                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/orangtua/daily-report">
                            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">Daily Report 📝</h1>
                            <p className="text-sm text-gray-600">{report.siswa.nama_lengkap}</p>
                        </div>
                    </div>

                    {/* Mood & Date Card */}
                    <Card className="border-0 bg-white shadow-xl rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-bl-full opacity-50"></div>
                        <CardContent className="p-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-orange-300 text-5xl shadow-lg">
                                        {getMoodEmoji(report.mood)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-pink-400 rounded-full p-1.5 border-2 border-white shadow-md">
                                        <Star className="h-4 w-4 text-white fill-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-bold text-gray-800">
                                        Mood: {report.mood}
                                    </p>
                                    <p className="text-sm text-gray-600">{formatDate(report.tanggal)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Activity */}
                    {report.activity && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-yellow-50 to-orange-50">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-yellow-400 to-orange-400"></div>
                                    <h3 className="font-bold text-gray-800">🎯 Aktivitas Hari Ini</h3>
                                </div>
                                <p className="text-sm text-gray-700">{report.activity}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Makanan & Minuman */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
                        <CardContent className="p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-orange-400 to-red-400"></div>
                                <h3 className="font-bold text-gray-800">🍽️ Makanan & Minuman</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="rounded-lg bg-orange-50 p-3 space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Sarapan Pagi</p>
                                        <p className="text-xs text-gray-600">{report.sarapan_pagi}</p>
                                    </div>
                                    <StarRating value={report.sarapan_status} readonly />
                                </div>

                                <div className="rounded-lg bg-orange-50 p-3 space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Makan Siang</p>
                                        <p className="text-xs text-gray-600">{report.makan_siang}</p>
                                    </div>
                                    <StarRating value={report.makan_siang_status} readonly />
                                </div>

                                <div className="rounded-lg bg-orange-50 p-3 space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Snack Sore</p>
                                        <p className="text-xs text-gray-600">{report.snack_sore}</p>
                                    </div>
                                    <StarRating value={report.snack_status} readonly />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                                        <p className="text-xs text-gray-600">Air Putih</p>
                                        <p className="text-lg font-bold text-blue-600">
                                            {report.minum_air_putih}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                                        <p className="text-xs text-gray-600">Susu</p>
                                        <p className="text-lg font-bold text-blue-600">{report.minum_susu}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tidur & Toilet */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
                        <CardContent className="p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-purple-400 to-pink-400"></div>
                                <h3 className="font-bold text-gray-800">😴 Tidur & Toilet</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Tidur Siang</p>
                                        <p className="text-xs text-gray-600">
                                            {report.tidur_siang_durasi || '-'}
                                        </p>
                                    </div>
                                    {report.tidur_siang ? (
                                        <Check className="h-6 w-6 text-green-600" />
                                    ) : (
                                        <X className="h-6 w-6 text-red-600" />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-purple-50 p-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-800">BAK</p>
                                            {report.bak ? (
                                                <Check className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <X className="h-5 w-5 text-red-600" />
                                            )}
                                        </div>
                                        <p className="mt-1 text-2xl font-bold text-purple-600">
                                            {report.bak_frekuensi}x
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-purple-50 p-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-800">BAB</p>
                                            {report.bab ? (
                                                <Check className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <X className="h-5 w-5 text-red-600" />
                                            )}
                                        </div>
                                        <p className="mt-1 text-2xl font-bold text-purple-600">
                                            {report.bab_frekuensi}x
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kebutuhan Besok */}
                    {report.kebutuhan_besok && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400"></div>
                                    <h3 className="font-bold text-gray-800">📦 Kebutuhan Besok</h3>
                                </div>
                                <p className="text-sm text-gray-700">{report.kebutuhan_besok}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Catatan Khusus */}
                    {report.catatan_khusus && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-400 to-emerald-400"></div>
                                    <h3 className="font-bold text-gray-800">📝 Catatan Khusus</h3>
                                </div>
                                <p className="text-sm text-gray-700">{report.catatan_khusus}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Catatan Insiden */}
                    {report.catatan_insiden && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-red-50 to-pink-50">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-red-500 to-pink-500"></div>
                                    <h3 className="font-bold text-red-700">⚠️ Catatan Insiden</h3>
                                </div>
                                <p className="text-sm text-red-700">{report.catatan_insiden}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Foto Kegiatan */}
                    {report.foto_kegiatan && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
                            <CardContent className="p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-pink-400 to-rose-400"></div>
                                    <h3 className="font-bold text-gray-800">📸 Foto Kegiatan</h3>
                                </div>
                                <img
                                    src={`/assets/images/daily_reports/${report.foto_kegiatan}`}
                                    alt="Foto Kegiatan"
                                    className="w-full rounded-2xl object-cover shadow-md"
                                    onError={(e) => {
                                        e.currentTarget.src = '/assets/images/placeholder.jpg';
                                    }}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Guru */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-gray-50 to-slate-50">
                        <CardContent className="p-4 text-center">
                            <p className="text-xs text-gray-600">Dilaporkan oleh:</p>
                            <p className="font-medium text-gray-800">Aunty {report.user.name}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
