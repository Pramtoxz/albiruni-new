import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, BookOpen, Eye, Star, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface RencanaPembelajaran {
    id: number;
    nama_rencana: string;
    tema: string;
    sub_tema: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_active: boolean;
    kelas: {
        id: number;
        nama_kelas: string;
    };
    creator: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Props {
    rencanaPembelajaran: {
        data: RencanaPembelajaran[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    message?: string;
}

export default function GuruRencanaPembelajaranIndex({ rencanaPembelajaran, message }: Props) {
    const today = new Date();

    return (
        <>
            <Head title="Rencana Pembelajaran" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-8 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-purple-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-300 rounded-full opacity-20"></div>

                {/* Floating Stars Decoration */}
                <div className="absolute top-8 right-8 animate-bounce">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 opacity-40" />
                </div>
                <div className="absolute top-20 left-12 animate-pulse">
                    <Sparkles className="h-5 w-5 text-purple-400 opacity-40" />
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
                                <h1 className="text-2xl font-bold text-gray-800">📚 Rencana Pembelajaran</h1>
                                <p className="text-sm text-gray-600">
                                    {format(today, 'EEEE, dd MMMM yyyy', { locale: id })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {message ? (
                        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                            <CardContent className="py-12 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full mb-4 shadow-lg">
                                    <BookOpen className="h-10 w-10 text-white" />
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{message}</p>
                            </CardContent>
                        </Card>
                    ) : rencanaPembelajaran.data.length === 0 ? (
                        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                            <CardContent className="py-12 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full mb-4 shadow-lg">
                                    <BookOpen className="h-10 w-10 text-white" />
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Belum ada rencana pembelajaran</p>
                                <p className="text-xs text-gray-500 mt-1">Hubungi admin untuk menambahkan rencana</p>
                            </CardContent>
                        </Card>
                    ) : (
                        rencanaPembelajaran.data.map((rencana) => (
                            <Link key={rencana.id} href={`/guru/rencana-pembelajaran/${rencana.id}`}>
                                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all hover:scale-[1.02] relative">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-300 to-purple-300 rounded-bl-full opacity-30"></div>
                                    <CardContent className="p-4 relative z-10">
                                        <div className="flex gap-3">
                                            <div className="relative">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 shadow-md">
                                                    <BookOpen className="h-7 w-7 text-white" />
                                                </div>
                                                {rencana.is_active && (
                                                    <div className="absolute -top-1 -right-1 bg-green-400 rounded-full p-1 border-2 border-white shadow-md">
                                                        <Star className="h-3 w-3 text-white fill-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-800">
                                                        {rencana.nama_rencana}
                                                    </h3>
                                                    {rencana.is_active && (
                                                        <Badge className="bg-green-500 text-white text-[10px] px-2 py-0">
                                                            Aktif
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="mb-2">
                                                    <p className="text-sm font-semibold text-purple-600">
                                                        {rencana.tema}
                                                    </p>
                                                    {rencana.sub_tema && (
                                                        <p className="text-xs text-gray-600">
                                                            {rencana.sub_tema}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        {rencana.kelas.nama_kelas}
                                                    </Badge>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {format(new Date(rencana.tanggal_mulai), 'dd MMM', { locale: id })}
                                                            {' - '}
                                                            {format(new Date(rencana.tanggal_selesai), 'dd MMM yyyy', { locale: id })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Button
                                                    size="sm"
                                                    className="h-8 gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    Lihat
                                                </Button>
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
