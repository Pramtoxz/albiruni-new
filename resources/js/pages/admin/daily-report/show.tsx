import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/star-rating';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Emosi {
    id: number;
    nama_emosi: string;
    icon: string;
}

interface DailyReport {
    id: number;
    tanggal: string;
    mood: string;
    activity: string;
    siswa: {
        nama_lengkap: string;
        nama_panggilan: string;
        kelas?: {
            nama_kelas: string;
        };
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
    emosis: Emosi[];
}

interface Props {
    report: DailyReport;
}

export default function AdminDailyReportShow({ report }: Props) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = [
            'Minggu',
            'Senin',
            'Selasa',
            'Rabu',
            'Kamis',
            'Jumat',
            'Sabtu',
        ];
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
        <AppLayout>
            <Head title={`Daily Report - ${report.siswa.nama_lengkap}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/daily-report">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Daily Report - {report.siswa.nama_lengkap}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(report.tanggal)}
                            </p>
                        </div>
                    </div>
                    {report.is_final ? (
                        <Badge variant="default">Terkirim</Badge>
                    ) : (
                        <Badge variant="secondary">Draft</Badge>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Informasi Siswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama Lengkap
                                </p>
                                <p className="font-medium">
                                    {report.siswa.nama_lengkap}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama Panggilan
                                </p>
                                <p className="font-medium">
                                    {report.siswa.nama_panggilan}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kelas
                                </p>
                                <p className="font-medium">
                                    {report.siswa.kelas?.nama_kelas || '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Informasi Laporan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tanggal
                                </p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <p className="font-medium">
                                        {formatDate(report.tanggal)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Mood
                                </p>
                                <p className="font-medium">{report.mood}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Dilaporkan Oleh
                                </p>
                                <p className="font-medium">
                                    {report.user.name}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {report.emosis && report.emosis.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Emosi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {report.emosis.map((emosi) => (
                                    <Badge key={emosi.id} variant="outline">
                                        {emosi.icon} {emosi.nama_emosi}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {report.activity && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Aktivitas Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{report.activity}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Makanan & Minuman
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border p-3 space-y-2">
                            <div>
                                <p className="text-sm font-medium">
                                    Sarapan Pagi
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {report.sarapan_pagi}
                                </p>
                            </div>
                            <StarRating
                                value={report.sarapan_status}
                                readonly
                                size="sm"
                            />
                        </div>

                        <div className="rounded-lg border p-3 space-y-2">
                            <div>
                                <p className="text-sm font-medium">
                                    Makan Siang
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {report.makan_siang}
                                </p>
                            </div>
                            <StarRating
                                value={report.makan_siang_status}
                                readonly
                                size="sm"
                            />
                        </div>

                        <div className="rounded-lg border p-3 space-y-2">
                            <div>
                                <p className="text-sm font-medium">
                                    Snack Sore
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {report.snack_sore}
                                </p>
                            </div>
                            <StarRating
                                value={report.snack_status}
                                readonly
                                size="sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border p-3">
                                <p className="text-sm text-muted-foreground">
                                    Air Putih
                                </p>
                                <p className="font-medium">
                                    {report.minum_air_putih}
                                </p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-sm text-muted-foreground">
                                    Susu
                                </p>
                                <p className="font-medium">
                                    {report.minum_susu}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Tidur & Toilet
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <p className="text-sm font-medium">
                                    Tidur Siang
                                </p>
                                <p className="text-sm text-muted-foreground">
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
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm text-muted-foreground">
                                        BAK
                                    </p>
                                    {report.bak ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <X className="h-4 w-4 text-red-600" />
                                    )}
                                </div>
                                <p className="font-medium">
                                    {report.bak_frekuensi}x
                                </p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm text-muted-foreground">
                                        BAB
                                    </p>
                                    {report.bab ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <X className="h-4 w-4 text-red-600" />
                                    )}
                                </div>
                                <p className="font-medium">
                                    {report.bab_frekuensi}x
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {report.kebutuhan_besok && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Kebutuhan Besok
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{report.kebutuhan_besok}</p>
                        </CardContent>
                    </Card>
                )}

                {report.catatan_khusus && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Catatan Khusus
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{report.catatan_khusus}</p>
                        </CardContent>
                    </Card>
                )}

                {report.catatan_insiden && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-base text-red-700">
                                Catatan Insiden
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-red-700">
                                {report.catatan_insiden}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {report.foto_kegiatan && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Foto Kegiatan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={`/assets/images/daily_reports/${report.foto_kegiatan}`}
                                alt="Foto Kegiatan"
                                className="w-full rounded-lg"
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
