import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/star-rating';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, X } from 'lucide-react';

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
    is_final: boolean;
}

interface Props {
    report: DailyReport;
    sudahCheckout: boolean;
}

export default function DailyReportShow({ report, sudahCheckout }: Props) {
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

                {/* Content with integrated back button */}
                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/guru/daily-report">
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
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-lg font-bold text-gray-800">
                                            Mood: {report.mood}
                                        </p>
                                        {report.is_final ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Final
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(report.tanggal)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Activity */}
                    {report.activity && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-yellow-50 to-orange-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">🎯 Aktivitas Hari Ini</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{report.activity}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Makanan & Minuman */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">🍽️ Makanan & Minuman</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="rounded-lg border p-3 space-y-2">
                                <div>
                                    <p className="text-sm font-medium">Sarapan Pagi</p>
                                    <p className="text-xs text-muted-foreground">{report.sarapan_pagi}</p>
                                </div>
                                <StarRating value={report.sarapan_status} readonly size="sm" />
                            </div>

                            <div className="rounded-lg border p-3 space-y-2">
                                <div>
                                    <p className="text-sm font-medium">Makan Siang</p>
                                    <p className="text-xs text-muted-foreground">{report.makan_siang}</p>
                                </div>
                                <StarRating value={report.makan_siang_status} readonly size="sm" />
                            </div>

                            <div className="rounded-lg border p-3 space-y-2">
                                <div>
                                    <p className="text-sm font-medium">Snack Sore</p>
                                    <p className="text-xs text-muted-foreground">{report.snack_sore}</p>
                                </div>
                                <StarRating value={report.snack_status} readonly size="sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">Air Putih</p>
                                    <p className="text-sm font-medium">{report.minum_air_putih}</p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">Susu</p>
                                    <p className="text-sm font-medium">{report.minum_susu}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tidur & Toilet */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">😴 Tidur & Toilet</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <p className="text-sm font-medium">Tidur Siang</p>
                                    <p className="text-xs text-muted-foreground">
                                        {report.tidur_siang_durasi || '-'}
                                    </p>
                                </div>
                                {report.tidur_siang ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                    <X className="h-5 w-5 text-red-600" />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">BAK</p>
                                        {report.bak ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-600" />
                                        )}
                                    </div>
                                    <p className="text-sm font-medium">{report.bak_frekuensi}x</p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">BAB</p>
                                        {report.bab ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-600" />
                                        )}
                                    </div>
                                    <p className="text-sm font-medium">{report.bab_frekuensi}x</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kebutuhan Besok */}
                    {report.kebutuhan_besok && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">📦 Kebutuhan Besok</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{report.kebutuhan_besok}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Catatan Khusus */}
                    {report.catatan_khusus && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">📝 Catatan Khusus</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{report.catatan_khusus}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Catatan Insiden */}
                    {report.catatan_insiden && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-red-50 to-pink-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base text-red-700">
                                    ⚠️ Catatan Insiden
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-red-700">
                                    {report.catatan_insiden}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Foto Kegiatan */}
                    {report.foto_kegiatan && (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">📸 Foto Kegiatan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={`/assets/images/daily_reports/${report.foto_kegiatan}`}
                                    alt="Foto Kegiatan"
                                    className="w-full rounded-2xl"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Guru */}
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-r from-gray-50 to-slate-50">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">Dilaporkan oleh:</p>
                            <p className="text-sm font-medium">{report.user.name}</p>
                        </CardContent>
                    </Card>

                    {/* Action & Status */}
                    <div className="pb-4 space-y-3">
                        {!report.is_final && (
                            <>
                                <Link href={`/guru/daily-report/${report.id}/edit`}>
                                    <Button variant="outline" className="w-full border-2 shadow-md">
                                        Edit Laporan
                                    </Button>
                                </Link>
                                {sudahCheckout ? (
                                    <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4 text-center">
                                        <p className="text-sm font-medium text-orange-800">
                                            ⚠️ {report.siswa.nama_panggilan} sudah pulang
                                        </p>
                                        <p className="text-xs text-orange-600 mt-1">
                                            Laporan belum terkirim. Admin dapat mengirimkan laporan ini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-center">
                                        <p className="text-sm font-medium text-blue-800">
                                            🕐 Menunggu {report.siswa.nama_panggilan} checkout pulang
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Laporan akan otomatis terkirim ke orang tua saat siswa pulang.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {report.is_final && (
                            <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center">
                                <p className="text-sm font-medium text-green-800">
                                    ✓ Daily report sudah dikirim ke orang tua
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    Laporan tidak bisa diedit lagi
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 