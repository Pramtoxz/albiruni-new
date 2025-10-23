import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, X } from 'lucide-react';

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
    sarapan_status: string;
    makan_siang: string;
    makan_siang_status: string;
    snack_sore: string;
    snack_status: string;
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

    const getStatusColor = (status: string) => {
        if (status === 'habis') return 'bg-green-100 text-green-700';
        if (status === 'dimakan') return 'bg-blue-100 text-blue-700';
        return 'bg-red-100 text-red-700';
    };

    return (
        <>
            <Head title={`Daily Report - ${report.siswa.nama_lengkap}`} />
            <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-background pb-safe pb-6">
                {/* Header dengan design mirip template */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 pb-8 pt-safe-top pt-6 text-white">
                    <div className="mb-4 flex items-center gap-3">
                        <Link href="/orangtua/daily-report">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">Daily Report</h1>
                            <p className="text-sm opacity-90">{report.siswa.nama_lengkap}</p>
                        </div>
                    </div>

                    {/* Mood & Date Card */}
                    <Card className="border-0 bg-white/95 shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-5xl">
                                    {getMoodEmoji(report.mood)}
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
                </div>

                <div className="-mt-4 space-y-4 px-4">
                    {/* Activity */}
                    {report.activity && (
                        <Card className="border-2 border-yellow-200">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-yellow-400"></div>
                                    <h3 className="font-bold text-gray-800">🎯 Aktivitas Hari Ini</h3>
                                </div>
                                <p className="text-sm text-gray-700">{report.activity}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Makanan & Minuman */}
                    <Card className="border-2 border-orange-200">
                        <CardContent className="p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-8 w-1 rounded-full bg-orange-400"></div>
                                <h3 className="font-bold text-gray-800">🍽️ Makanan & Minuman</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Sarapan Pagi</p>
                                        <p className="text-xs text-gray-600">{report.sarapan_pagi}</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(report.sarapan_status)}`}
                                    >
                                        {report.sarapan_status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Makan Siang</p>
                                        <p className="text-xs text-gray-600">{report.makan_siang}</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(report.makan_siang_status)}`}
                                    >
                                        {report.makan_siang_status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Snack Sore</p>
                                        <p className="text-xs text-gray-600">{report.snack_sore}</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(report.snack_status)}`}
                                    >
                                        {report.snack_status}
                                    </span>
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
                    <Card className="border-2 border-purple-200">
                        <CardContent className="p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-8 w-1 rounded-full bg-purple-400"></div>
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
                        <Card className="border-2 border-blue-200">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-blue-400"></div>
                                    <h3 className="font-bold text-gray-800">📦 Kebutuhan Besok</h3>
                                </div>
                                <p className="text-sm text-gray-700">{report.kebutuhan_besok}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Catatan Khusus */}
                    {report.catatan_khusus && (
                        <Card className="border-2 border-green-200">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-green-400"></div>
                                    <h3 className="font-bold text-gray-800">📝 Catatan Khusus</h3>
                                </div>
                                <p className="text-sm text-gray-700">{report.catatan_khusus}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Catatan Insiden */}
                    {report.catatan_insiden && (
                        <Card className="border-2 border-red-300 bg-red-50">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-red-500"></div>
                                    <h3 className="font-bold text-red-700">⚠️ Catatan Insiden</h3>
                                </div>
                                <p className="text-sm text-red-700">{report.catatan_insiden}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Foto Kegiatan */}
                    {report.foto_kegiatan && (
                        <Card className="border-2 border-pink-200">
                            <CardContent className="p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="h-8 w-1 rounded-full bg-pink-400"></div>
                                    <h3 className="font-bold text-gray-800">📸 Foto Kegiatan</h3>
                                </div>
                                <img
                                    src={`/storage/${report.foto_kegiatan}`}
                                    alt="Foto Kegiatan"
                                    className="w-full rounded-lg shadow-md"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Guru */}
                    <Card className="border-2 border-gray-200 bg-gray-50">
                        <CardContent className="p-4 text-center">
                            <p className="text-xs text-gray-600">Dilaporkan oleh:</p>
                            <p className="font-medium text-gray-800">{report.user.name}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
