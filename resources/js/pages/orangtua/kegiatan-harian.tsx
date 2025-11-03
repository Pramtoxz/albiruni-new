import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Star, Sparkles, Target, Calendar } from 'lucide-react';

interface KegiatanHarian {
    id: number;
    nama_aktivitas: string;
    deskripsi: string;
    target_perkembangan: string;
    alat_bahan?: string;
    instruksi?: string;
    foto_kegiatan?: string;
    tanggal: string;
    hari: string;
}

interface Siswa {
    nama_lengkap: string;
    nama_panggilan: string;
    kelas?: {
        nama_kelas: string;
    };
}

interface Props {
    kegiatanList: KegiatanHarian[];
    siswa: Siswa;
}

export default function OrangtuaKegiatanHarian({ kegiatanList, siswa }: Props) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
        ];

        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <>
            <Head title={`Kegiatan Harian - ${siswa.nama_lengkap}`} />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-6 relative overflow-hidden">
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
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard">
                            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">Kegiatan Harian 📚</h1>
                            <p className="text-sm text-gray-600">{siswa.nama_lengkap}</p>
                        </div>
                    </div>

                    {/* Student Info Card */}
                    <Card className="border-0 bg-white shadow-xl rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-300 to-teal-300 rounded-bl-full opacity-50"></div>
                        <CardContent className="p-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-200 to-teal-300 shadow-lg">
                                        <BookOpen className="h-10 w-10 text-white" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1.5 border-2 border-white shadow-md">
                                        <Star className="h-4 w-4 text-white fill-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-bold text-gray-800">
                                        {siswa.nama_panggilan}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {siswa.kelas?.nama_kelas || 'Belum ada kelas'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kegiatan List */}
                    {kegiatanList && kegiatanList.length > 0 ? (
                        kegiatanList.map((kegiatan) => (
                            <Card key={kegiatan.id} className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
                                <CardContent className="p-0">
                                    {/* Foto Kegiatan */}
                                    {kegiatan.foto_kegiatan && (
                                        <div className="relative">
                                            <img
                                                src={`/assets/images/kegiatan/${kegiatan.foto_kegiatan}`}
                                                alt={kegiatan.nama_aktivitas}
                                                className="w-full h-56 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/assets/images/placeholder.jpg';
                                                }}
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4 text-green-600" />
                                                    <span className="text-xs font-semibold text-gray-700">
                                                        {kegiatan.hari}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 space-y-4">
                                        {/* Tanggal */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 text-green-600" />
                                            <span>{formatDate(kegiatan.tanggal)}</span>
                                        </div>

                                        {/* Nama Aktivitas */}
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-400 to-teal-400"></div>
                                                <h3 className="font-bold text-gray-800 text-lg">
                                                    {kegiatan.nama_aktivitas}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Deskripsi */}
                                        {kegiatan.deskripsi && (
                                            <div className="rounded-lg bg-green-50 p-3">
                                                <p className="text-xs font-semibold text-green-700 mb-1">
                                                    📝 Deskripsi
                                                </p>
                                                <p className="text-sm text-gray-700">{kegiatan.deskripsi}</p>
                                            </div>
                                        )}

                                        {/* Target Perkembangan */}
                                        {kegiatan.target_perkembangan && (
                                            <div className="rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 p-3 border-2 border-teal-200">
                                                <div className="flex items-start gap-2">
                                                    <Target className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-teal-700 mb-1">
                                                            Target Perkembangan
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            {kegiatan.target_perkembangan}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Alat & Bahan */}
                                        {kegiatan.alat_bahan && (
                                            <div className="rounded-lg bg-orange-50 p-3">
                                                <p className="text-xs font-semibold text-orange-700 mb-1">
                                                    🧰 Alat & Bahan
                                                </p>
                                                <p className="text-sm text-gray-700">{kegiatan.alat_bahan}</p>
                                            </div>
                                        )}

                                        {/* Instruksi */}
                                        {kegiatan.instruksi && (
                                            <div className="rounded-lg bg-purple-50 p-3">
                                                <p className="text-xs font-semibold text-purple-700 mb-1">
                                                    📋 Instruksi
                                                </p>
                                                <p className="text-sm text-gray-700">{kegiatan.instruksi}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-white">
                            <CardContent className="p-8 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                                        <BookOpen className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-800 mb-1">
                                            Belum Ada Kegiatan
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Kegiatan harian akan muncul di sini
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
