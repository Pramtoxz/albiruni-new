import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Plus, User, Edit, Send } from 'lucide-react';
import Swal from 'sweetalert2';

interface DailyReport {
    id: number;
    tanggal: string;
    mood: string;
    siswa: {
        nama_lengkap: string;
        nama_panggilan: string;
    };
    activity: string;
    is_final: boolean;
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

    const handleFinalize = (e: React.MouseEvent, reportId: number, siswaName: string) => {
        e.preventDefault();
        e.stopPropagation();

        Swal.fire({
            title: 'Kirim Notifikasi?',
            text: `Daily report untuk ${siswaName} akan dikirim ke orang tua dan tidak bisa diedit lagi.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Kirim!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    `/guru/daily-report/${reportId}/finalize`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil!',
                                text: 'Daily report berhasil dikirim ke orang tua',
                                confirmButtonColor: '#3085d6',
                            });
                        },
                        onError: () => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal!',
                                text: 'Terjadi kesalahan saat mengirim notifikasi',
                                confirmButtonColor: '#d33',
                            });
                        },
                    }
                );
            }
        });
    };

    return (
        <>
            <Head title="Daily Report" />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20"></div>

                {/* Floating Stars Decoration */}
                <div className="absolute top-8 right-8 animate-bounce">
                    <Calendar className="h-6 w-6 text-yellow-400 fill-yellow-400 opacity-40" />
                </div>

                {/* Content with integrated back button */}
                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Back Button & Title */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                                </button>
                            </Link>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-800">Daily Report 📝</h1>
                                <p className="text-sm text-gray-600">{reports.data.length} laporan</p>
                            </div>
                        </div>
                        <Link href="/guru/daily-report/create">
                            <Button
                                size="sm"
                                className="h-10 gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
                            >
                                <Plus className="h-4 w-4" />
                                Buat
                            </Button>
                        </Link>
                    </div>
                    {reports.data.length === 0 ? (
                        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                            <CardContent className="py-12 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full mb-4 shadow-lg">
                                    <Calendar className="h-10 w-10 text-white" />
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Belum ada daily report</p>
                                <p className="text-xs text-gray-500 mt-1">Buat laporan pertama Anda</p>
                                <Link href="/guru/daily-report/create">
                                    <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md" size="sm">
                                        <Plus className="mr-1 h-4 w-4" />
                                        Buat Daily Report
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        reports.data.map((report) => (
                            <Card key={report.id} className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-bl-full opacity-30"></div>
                                <CardContent className="p-4 relative z-10">
                                    <Link href={`/guru/daily-report/${report.id}`}>
                                        <div className="flex gap-3 mb-3">
                                            <div className="relative">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-orange-300 text-3xl shadow-md">
                                                    {getMoodEmoji(report.mood)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                    <h3 className="font-bold text-gray-800">
                                                        {report.siswa.nama_lengkap}
                                                    </h3>
                                                    {report.is_final && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Final
                                                        </span>
                                                    )}
                                                    {!report.is_final && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Draft
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(report.tanggal)}
                                                </div>
                                                {report.activity && (
                                                    <p className="line-clamp-2 text-sm text-gray-600">
                                                        {report.activity}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    
                                    {!report.is_final && (
                                        <div className="flex gap-2 pt-3 border-t">
                                            <Link href={`/guru/daily-report/${report.id}/edit`} className="flex-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                                onClick={(e) => handleFinalize(e, report.id, report.siswa.nama_lengkap)}
                                            >
                                                <Send className="h-4 w-4 mr-1" />
                                                Kirim Notifikasi
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
