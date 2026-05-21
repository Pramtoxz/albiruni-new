import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, BookOpen, Eye, Pencil, CheckCircle2 } from 'lucide-react';

interface Rapor {
    id: number;
    siswa: { id: number; nama_lengkap: string; nama_panggilan: string };
    semester: number;
    tahun_ajaran: string;
    status: 'draft' | 'final';
    created_at: string;
    created_by: string;
}

interface Props {
    rapors: Rapor[];
}

export default function GuruRaporIndex({ rapors }: Props) {
    return (
        <>
            <Head title="Rapor Digital" />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12" />
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20" />

                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Rapor Digital 📋</h1>
                                <p className="text-sm text-gray-600">{rapors.length} laporan tumbuh kembang</p>
                            </div>
                        </div>
                        <Link href="/guru/rapor/create">
                            <Button size="sm" className="h-10 gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md border-0">
                                <Plus className="h-4 w-4" /> Buat
                            </Button>
                        </Link>
                    </div>

                    {rapors.length === 0 ? (
                        <div className="shadow-xl rounded-3xl overflow-hidden bg-white p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full mb-4 shadow-lg">
                                <BookOpen className="h-10 w-10 text-white" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Belum ada rapor digital</p>
                            <p className="text-xs text-gray-500 mt-1">Buat rapor pertama untuk siswa Anda</p>
                            <Link href="/guru/rapor/create">
                                <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md border-0" size="sm">
                                    <Plus className="mr-1 h-4 w-4" /> Buat Rapor
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        rapors.map((rapor) => (
                            <div key={rapor.id} className="shadow-lg rounded-3xl overflow-hidden bg-white relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-bl-full opacity-30" />
                                <div className="p-4 relative z-10">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{rapor.siswa.nama_lengkap}</h3>
                                            <p className="text-xs text-gray-500">{rapor.siswa.nama_panggilan}</p>
                                        </div>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                                            rapor.status === 'final'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {rapor.status === 'final' ? '✓ Final' : '● Draft'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Semester {rapor.semester} — {rapor.tahun_ajaran}
                                    </p>
                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                                        <Link href={`/guru/rapor/${rapor.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full rounded-xl">
                                                <Eye className="h-4 w-4 mr-1" /> Lihat
                                            </Button>
                                        </Link>
                                        {rapor.status === 'draft' && (
                                            <Link href={`/guru/rapor/${rapor.id}/edit`} className="flex-1">
                                                <Button size="sm" className="w-full rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 border-0">
                                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                                </Button>
                                            </Link>
                                        )}
                                        {rapor.status === 'final' && (
                                            <div className="flex-1 flex items-center justify-center text-xs text-green-700 font-medium gap-1">
                                                <CheckCircle2 className="h-4 w-4" /> Sudah Final
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
