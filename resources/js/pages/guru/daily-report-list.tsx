import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Plus, User } from 'lucide-react';

interface DailyReport {
    id: number;
    tanggal: string;
    mood: string;
    siswa: {
        nama_lengkap: string;
        nama_panggilan: string;
    };
    activity: string;
}

interface Props {
    reports: {
        data: DailyReport[];
        current_page: number;
        last_page: number;
    };
}

export default function DailyReportList({ reports }: Props) {
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
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Agu',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ];

        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <>
            <Head title="Daily Report" />
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-safe pb-6">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 bg-primary px-4 py-4 text-primary-foreground shadow-md">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary-foreground/10">
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold">Daily Report</h1>
                                <p className="text-sm opacity-90">{reports.data.length} laporan</p>
                            </div>
                        </div>
                        <Link href="/guru/daily-report/create">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-9 gap-1 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                            >
                                <Plus className="h-4 w-4" />
                                Buat
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3 p-4">
                    {reports.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Calendar className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Belum ada daily report</p>
                                <Link href="/guru/daily-report/create">
                                    <Button className="mt-4" size="sm">
                                        <Plus className="mr-1 h-4 w-4" />
                                        Buat Daily Report
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        reports.data.map((report) => (
                            <Link key={report.id} href={`/guru/daily-report/${report.id}`}>
                                <Card className="overflow-hidden transition-all hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                                                {getMoodEmoji(report.mood)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <h3 className="font-semibold">
                                                        {report.siswa.nama_lengkap}
                                                    </h3>
                                                </div>
                                                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(report.tanggal)}
                                                </div>
                                                {report.activity && (
                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {report.activity}
                                                    </p>
                                                )}
                                            </div>
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
