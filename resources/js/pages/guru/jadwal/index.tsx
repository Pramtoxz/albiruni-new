import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ArrowLeft } from 'lucide-react';

interface Jadwal {
    id: number;
    kelas: string;
    mata_pelajaran: string;
    emoji: string;
    waktu: string;
    status: 'Selesai' | 'Berlangsung' | 'Akan Datang';
}

interface PageProps {
    jadwal: Jadwal[];
}

export default function JadwalPage({ jadwal = [] }: PageProps) {
    // Data dummy untuk sementara
    const dummyJadwal = [
        {
            id: 1,
            kelas: 'TK A',
            mata_pelajaran: 'Matematika',
            emoji: '🔢',
            waktu: '08:00 - 09:30 WIB',
            status: 'Selesai' as const
        },
        {
            id: 2,
            kelas: 'TK B',
            mata_pelajaran: 'Bahasa Indonesia',
            emoji: '📖',
            waktu: '10:00 - 11:30 WIB',
            status: 'Berlangsung' as const
        },
        {
            id: 3,
            kelas: 'TK A',
            mata_pelajaran: 'Seni & Kreativitas',
            emoji: '🎨',
            waktu: '13:00 - 14:30 WIB',
            status: 'Akan Datang' as const
        }
    ];

    const dataJadwal = jadwal.length > 0 ? jadwal : dummyJadwal;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Selesai':
                return {
                    bg: 'from-gray-50 to-gray-100',
                    border: 'border-gray-200',
                    iconBg: 'from-gray-400 to-gray-500',
                    badge: 'text-green-600 bg-green-100',
                    animate: ''
                };
            case 'Berlangsung':
                return {
                    bg: 'from-blue-100 to-purple-100',
                    border: 'border-blue-400',
                    iconBg: 'from-blue-500 to-purple-500',
                    badge: 'text-blue-600 bg-blue-200 animate-pulse',
                    animate: 'animate-pulse'
                };
            case 'Akan Datang':
                return {
                    bg: 'from-purple-50 to-pink-50',
                    border: 'border-purple-200',
                    iconBg: 'from-purple-400 to-pink-400',
                    badge: 'text-gray-500 bg-gray-200',
                    animate: ''
                };
            default:
                return {
                    bg: 'from-gray-50 to-gray-100',
                    border: 'border-gray-200',
                    iconBg: 'from-gray-400 to-gray-500',
                    badge: 'text-gray-500 bg-gray-200',
                    animate: ''
                };
        }
    };

    return (
        <>
            <Head title="Jadwal Mengajar" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-8">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 pb-8 pt-12 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <Link href="/dashboard/guru">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold drop-shadow-md">📅 Jadwal Mengajar</h1>
                            <p className="text-sm opacity-90">Jadwal mengajar hari ini</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 -mt-4 relative z-10">
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardContent className="space-y-3 p-4">
                            {dataJadwal.map((item) => {
                                const style = getStatusStyle(item.status);
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r ${style.bg} p-4 border-2 ${style.border} ${item.status === 'Berlangsung' ? 'shadow-md' : ''}`}
                                    >
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${style.iconBg} shadow-md ${style.animate}`}>
                                            <Calendar className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">
                                                {item.kelas} - {item.mata_pelajaran} {item.emoji}
                                            </p>
                                            <p className="text-xs text-gray-600">{item.waktu}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${style.badge}`}>
                                            {item.status} {item.status === 'Selesai' && '✓'}
                                        </span>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
