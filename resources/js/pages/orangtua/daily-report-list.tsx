import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, ChevronRight, Star, Sparkles } from 'lucide-react';

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
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
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
                    {/* Back Button & Title Card */}
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard">
                            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">Daily Report 📝</h1>
                            <p className="text-sm text-gray-600">Laporan kegiatan harian anak</p>
                        </div>
                    </div>
                    {reports.data.length === 0 ? (
                        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                            <CardContent className="py-12 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full mb-4 shadow-lg">
                                    <Calendar className="h-10 w-10 text-white" />
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Belum ada daily report</p>
                                <p className="text-xs text-gray-500 mt-1">Laporan akan muncul di sini</p>
                            </CardContent>
                        </Card>
                    ) : (
                        reports.data.map((report) => (
                            <Link key={report.id} href={`/orangtua/daily-report/${report.id}`}>
                                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all hover:scale-[1.02] relative">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-bl-full opacity-30"></div>
                                    <CardContent className="p-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-orange-300 text-4xl shadow-md">
                                                    {getMoodEmoji(report.mood)}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 bg-pink-400 rounded-full p-1 border-2 border-white shadow-md">
                                                    <Star className="h-3 w-3 text-white fill-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800 text-lg">{report.siswa.nama_panggilan}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(report.tanggal)}
                                                </p>
                                                <div className="mt-1 inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-0.5 rounded-full">
                                                    <span className="text-xs font-medium text-purple-700">
                                                        Mood: {report.mood}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 shadow-md">
                                                <ChevronRight className="h-5 w-5 text-white" />
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
