import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Rapor {
    id: number;
    siswa: { id: number; nama_lengkap: string; nama_panggilan: string };
    semester: number;
    tahun_ajaran: string;
    created_at: string;
}

interface Props {
    rapors: Rapor[];
}

export default function OrangtuaRaporIndex({ rapors }: Props) {
    return (
        <>
            <Head title="Rapor Digital" />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12" />
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20" />

                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                            <ArrowLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Rapor Digital 📋</h1>
                            <p className="text-sm text-gray-600">{rapors.length} laporan tumbuh kembang</p>
                        </div>
                    </div>

                    {rapors.length === 0 ? (
                        <div className="shadow-xl rounded-3xl overflow-hidden bg-white p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full mb-4 shadow-lg">
                                <BookOpen className="h-10 w-10 text-white" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Belum ada rapor tersedia</p>
                            <p className="text-xs text-gray-500 mt-1">Rapor akan muncul setelah guru menyelesaikan pengisian</p>
                        </div>
                    ) : (
                        rapors.map((rapor) => (
                            <div key={rapor.id} className="shadow-lg rounded-3xl overflow-hidden bg-white relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-bl-full opacity-30" />
                                <div className="p-4 relative z-10">
                                    <div className="mb-2">
                                        <h3 className="font-bold text-gray-800">{rapor.siswa.nama_lengkap}</h3>
                                        <p className="text-xs text-gray-500">{rapor.siswa.nama_panggilan}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Semester {rapor.semester} — {rapor.tahun_ajaran}
                                    </p>
                                    <Link href={`/orangtua/rapor/${rapor.id}`} className="block">
                                        <Button size="sm" className="w-full rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-0 shadow-md">
                                            <Eye className="h-4 w-4 mr-1" /> Lihat Rapor
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
