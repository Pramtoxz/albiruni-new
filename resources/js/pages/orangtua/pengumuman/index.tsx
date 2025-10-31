import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Bell, Calendar, ArrowLeft } from 'lucide-react';

interface Pengumuman {
    id: number;
    judul: string;
    isi: string;
    tanggal: string;
    icon: string;
    color: string;
}

interface PageProps {
    pengumuman: Pengumuman[];
}

export default function PengumumanPage({ pengumuman = [] }: PageProps) {
    // Data dummy untuk sementara
    const dummyPengumuman = [
        {
            id: 1,
            judul: 'Libur Semester 🎉',
            isi: 'Libur semester akan dimulai tanggal 20 Desember 2024',
            tanggal: '2 hari yang lalu',
            icon: 'bell',
            color: 'blue'
        },
        {
            id: 2,
            judul: 'Pertemuan Orang Tua 👨‍👩‍👧',
            isi: 'Pertemuan orang tua akan diadakan hari Sabtu, 25 Nov 2024',
            tanggal: '5 hari yang lalu',
            icon: 'calendar',
            color: 'green'
        }
    ];

    const dataPengumuman = pengumuman.length > 0 ? pengumuman : dummyPengumuman;

    return (
        <>
            <Head title="Pengumuman" />

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
                            <h1 className="text-2xl font-bold drop-shadow-md">📢 Pengumuman</h1>
                            <p className="text-sm opacity-90">Informasi terbaru untuk Anda</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 -mt-4 relative z-10">
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardContent className="space-y-3 p-4">
                            {dataPengumuman.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex gap-3 rounded-2xl bg-gradient-to-r ${
                                        item.color === 'blue' 
                                            ? 'from-blue-50 to-blue-100 border-l-4 border-blue-400' 
                                            : 'from-green-50 to-green-100 border-l-4 border-green-400'
                                    } p-4 hover:shadow-md transition-all cursor-pointer`}
                                >
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                        item.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                                    } shadow-md`}>
                                        {item.icon === 'bell' ? (
                                            <Bell className="h-6 w-6 text-white" />
                                        ) : (
                                            <Calendar className="h-6 w-6 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800">{item.judul}</p>
                                        <p className="text-xs text-gray-600 mt-1">{item.isi}</p>
                                        <p className={`mt-2 text-xs font-medium ${
                                            item.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                                        }`}>
                                            {item.tanggal}
                                        </p>
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
