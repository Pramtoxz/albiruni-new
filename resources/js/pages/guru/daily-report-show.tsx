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
}

interface Props {
    report: DailyReport;
}

export default function DailyReportShow({ report }: Props) {
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
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-safe pb-6">
                {/* Header */}
                <div className="bg-primary px-4 pb-8 pt-4 text-primary-foreground">
                    <div className="mb-4 flex items-center gap-3">
                        <Link href="/guru/daily-report">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary-foreground/10">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Daily Report</h1>
                            <p className="text-sm opacity-90">{report.siswa.nama_lengkap}</p>
                        </div>
                    </div>

                    <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20 text-4xl">
                                    {getMoodEmoji(report.mood)}
                                </div>
                                <div className="flex-1 text-primary-foreground">
                                    <p className="text-sm opacity-90">Mood: {report.mood}</p>
                                    <div className="mt-1 flex items-center gap-2 text-xs opacity-75">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(report.tanggal)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="-mt-4 space-y-4 px-4">
                    {/* Activity */}
                    {report.activity && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">🎯 Aktivitas Hari Ini</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{report.activity}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Makanan & Minuman */}
                    <Card>
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
                    <Card>
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
                        <Card>
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
                        <Card>
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
                        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900/20 dark:bg-orange-900/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base text-orange-700 dark:text-orange-400">
                                    ⚠️ Catatan Insiden
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-orange-700 dark:text-orange-400">
                                    {report.catatan_insiden}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Foto Kegiatan */}
                    {report.foto_kegiatan && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">📸 Foto Kegiatan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={`/storage/${report.foto_kegiatan}`}
                                    alt="Foto Kegiatan"
                                    className="w-full rounded-lg"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Guru */}
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">Dilaporkan oleh:</p>
                            <p className="text-sm font-medium">{report.user.name}</p>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pb-4">
                        <Link href={`/guru/daily-report/${report.id}/edit`}>
                            <Button variant="outline" className="w-full">
                                Edit
                            </Button>
                        </Link>
                        <Button variant="default" className="w-full">
                            Bagikan ke Orang Tua
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
} 