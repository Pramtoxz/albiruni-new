import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, ArrowLeft, Plus } from 'lucide-react';

interface Materi {
    id: number;
    judul: string;
    kelas: string;
    mata_pelajaran: string;
    tanggal: string;
    color: string;
}

interface PageProps {
    materi: Materi[];
}

export default function MateriPage({ materi = [] }: PageProps) {
    // Data dummy untuk sementara
    const dummyMateri = [
        {
            id: 1,
            judul: 'Mengenal Angka 1-10 🔢',
            kelas: 'TK A',
            mata_pelajaran: 'Matematika',
            tanggal: '2 hari yang lalu',
            color: 'green'
        },
        {
            id: 2,
            judul: 'Mengenal Huruf Vokal 🔤',
            kelas: 'TK B',
            mata_pelajaran: 'Bahasa Indonesia',
            tanggal: '3 hari yang lalu',
            color: 'purple'
        },
        {
            id: 3,
            judul: 'Mengenal Warna Dasar 🎨',
            kelas: 'TK A',
            mata_pelajaran: 'Seni',
            tanggal: '5 hari yang lalu',
            color: 'orange'
        }
    ];

    const dataMateri = materi.length > 0 ? materi : dummyMateri;

    return (
        <>
            <Head title="Materi Pembelajaran" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-8">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 pb-8 pt-12 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/guru">
                                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all">
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold drop-shadow-md">📚 Materi Pembelajaran</h1>
                                <p className="text-sm opacity-90">Kelola materi ajar Anda</p>
                            </div>
                        </div>
                        <Link href="/guru/materi/create">
                            <Button className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full h-10 w-10 p-0">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 -mt-4 relative z-10">
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                        <CardContent className="space-y-3 p-4">
                            {dataMateri.map((item) => (
                                <Link key={item.id} href={`/guru/materi/${item.id}`}>
                                    <div className={`flex gap-3 rounded-2xl bg-gradient-to-r ${
                                        item.color === 'green' 
                                            ? 'from-green-50 to-teal-50 border-l-4 border-green-400' 
                                            : item.color === 'purple'
                                            ? 'from-purple-50 to-pink-50 border-l-4 border-purple-400'
                                            : 'from-orange-50 to-yellow-50 border-l-4 border-orange-400'
                                    } p-4 hover:shadow-md transition-all cursor-pointer`}>
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                            item.color === 'green' 
                                                ? 'bg-gradient-to-br from-green-400 to-teal-400' 
                                                : item.color === 'purple'
                                                ? 'bg-gradient-to-br from-purple-400 to-pink-400'
                                                : 'bg-gradient-to-br from-orange-400 to-yellow-400'
                                        } shadow-md`}>
                                            <BookOpen className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">{item.judul}</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {item.kelas} • {item.mata_pelajaran}
                                            </p>
                                            <p className={`mt-1 text-xs font-medium ${
                                                item.color === 'green' 
                                                    ? 'text-green-600' 
                                                    : item.color === 'purple'
                                                    ? 'text-purple-600'
                                                    : 'text-orange-600'
                                            }`}>
                                                Diupload {item.tanggal}
                                            </p>
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
