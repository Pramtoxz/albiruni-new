import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, FileText, ArrowLeft } from 'lucide-react';

interface Tugas {
    id: number;
    judul: string;
    deskripsi: string;
    icon: string;
    color: string;
}

interface PageProps {
    tugas: Tugas[];
}

export default function TugasPage({ tugas = [] }: PageProps) {
    // Data dummy untuk sementara
    const dummyTugas = [
        {
            id: 1,
            judul: 'Koreksi Tugas Menggambar 🎨',
            deskripsi: '15 tugas belum dikoreksi',
            icon: 'clipboard',
            color: 'red'
        },
        {
            id: 2,
            judul: 'Input Nilai Semester 📊',
            deskripsi: 'Deadline: 3 hari lagi',
            icon: 'file',
            color: 'yellow'
        },
        {
            id: 3,
            judul: 'Koreksi Tugas Berhitung 🔢',
            deskripsi: '8 tugas belum dikoreksi',
            icon: 'clipboard',
            color: 'orange'
        }
    ];

    const dataTugas = tugas.length > 0 ? tugas : dummyTugas;

    return (
        <>
            <Head title="Tugas Pending" />

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
                            <h1 className="text-2xl font-bold drop-shadow-md">✅ Tugas Pending</h1>
                            <p className="text-sm opacity-90">Tugas yang perlu diselesaikan</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 -mt-4 relative z-10">
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardContent className="space-y-3 p-4">
                            {dataTugas.map((item) => (
                                <Link key={item.id} href={`/guru/tugas/${item.id}`}>
                                    <div className={`flex items-center justify-between rounded-2xl bg-gradient-to-r ${
                                        item.color === 'red'
                                            ? 'from-red-50 to-orange-50 border-l-4 border-red-400'
                                            : item.color === 'yellow'
                                            ? 'from-yellow-50 to-amber-50 border-l-4 border-yellow-400'
                                            : 'from-orange-50 to-yellow-50 border-l-4 border-orange-400'
                                    } p-4 hover:shadow-md transition-all cursor-pointer`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                                                item.color === 'red'
                                                    ? 'from-red-400 to-orange-400'
                                                    : item.color === 'yellow'
                                                    ? 'from-yellow-400 to-amber-400'
                                                    : 'from-orange-400 to-yellow-400'
                                            } shadow-md`}>
                                                {item.icon === 'clipboard' ? (
                                                    <ClipboardList className="h-6 w-6 text-white" />
                                                ) : (
                                                    <FileText className="h-6 w-6 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{item.judul}</p>
                                                <p className="text-xs text-gray-600">{item.deskripsi}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
