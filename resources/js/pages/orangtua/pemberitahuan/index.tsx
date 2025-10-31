import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Calendar, ArrowLeft } from 'lucide-react';

interface Aktivitas {
    id: number;
    judul: string;
    deskripsi: string;
    status: string;
    icon: string;
    color: string;
}

interface PageProps {
    aktivitas: Aktivitas[];
}

export default function PemberitahuanPage({ aktivitas = [] }: PageProps) {
    // Data dummy untuk sementara
    const dummyAktivitas = [
        {
            id: 1,
            judul: 'Tugas Menggambar 🎨',
            deskripsi: 'Sudah dikumpulkan',
            status: 'Selesai',
            icon: 'book',
            color: 'orange'
        },
        {
            id: 2,
            judul: 'Hadir Hari Ini 🌟',
            deskripsi: 'Pukul 07:30 WIB',
            status: 'Hadir',
            icon: 'calendar',
            color: 'purple'
        }
    ];

    const dataAktivitas = aktivitas.length > 0 ? aktivitas : dummyAktivitas;

    return (
        <>
            <Head title="Aktivitas Terkini" />

            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 px-4 pb-8 pt-12 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <Link href="/dashboard/orangtua">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold drop-shadow-md">⭐ Aktivitas Terkini</h1>
                            <p className="text-sm opacity-90">Kegiatan buah hati Anda</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 -mt-4 relative z-10">
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardContent className="space-y-3 p-4">
                            {dataAktivitas.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between rounded-2xl bg-gradient-to-r ${
                                        item.color === 'orange'
                                            ? 'from-orange-50 to-yellow-50 border-2 border-orange-200'
                                            : 'from-purple-50 to-blue-50 border-2 border-purple-200'
                                    } p-4 hover:shadow-md transition-all cursor-pointer`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                                            item.color === 'orange'
                                                ? 'from-orange-400 to-yellow-400'
                                                : 'from-purple-400 to-blue-400'
                                        } shadow-md`}>
                                            {item.icon === 'book' ? (
                                                <BookOpen className="h-6 w-6 text-white" />
                                            ) : (
                                                <Calendar className="h-6 w-6 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{item.judul}</p>
                                            <p className="text-xs text-gray-600">{item.deskripsi}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl">✓</span>
                                        <span className="text-xs font-bold text-green-600">{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
