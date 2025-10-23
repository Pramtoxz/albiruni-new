import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react';

interface DailyReport {
    id: number;
    tanggal: string;
    mood: string;
    siswa: {
        nama_lengkap: string;
        nama_panggilan: string;
    };
}

interface Props {
    reports: {
        data: DailyReport[];
    };
}

export default function OrangtuaDailyReportList({ reports }: Props) {
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
        return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <>
            <Head title="Daily Report" />
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-safe pb-20">
                {/* Header */}
                <div className="bg-primary px-4 pb-6 pt-safe-top pt-6 text-primary-foreground">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary-foreground/10">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Daily Report</h1>
                            <p className="text-sm opacity-90">Laporan kegiatan harian anak</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3 p-4">
                    {reports.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Calendar className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Belum ada daily report</p>
                            </CardContent>
                        </Card>
                    ) : (
                        reports.data.map((report) => (
                            <Link key={report.id} href={`/orangtua/daily-report/${report.id}`}>
                                <Card className="transition-all hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl">
                                                {getMoodEmoji(report.mood)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{report.siswa.nama_panggilan}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(report.tanggal)}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Mood: {report.mood}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
