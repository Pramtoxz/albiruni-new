import { Head } from '@inertiajs/react';
import { Images, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Foto {
    id: number;
    foto: string;
    tanggal: string;
    activity: string | null;
}

interface Props {
    rapor: {
        id: number;
        semester: number;
        tahun_ajaran: string;
        siswa: {
            id: number;
            nama_lengkap: string;
            nama_panggilan: string;
            jenis_kelamin: string;
        };
    };
    fotos: Foto[];
}

const FOTO_BASE = '/assets/images/daily_reports/';

export default function RaporGaleriPublik({ rapor, fotos }: Props) {
    const [lightbox, setLightbox] = useState<Foto | null>(null);
    const nama = rapor.siswa.nama_panggilan || rapor.siswa.nama_lengkap;

    return (
        <>
            <Head title={`Galeri Foto — ${nama}`} />

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setLightbox(null)}
                >
                    <div className="max-w-lg w-full space-y-2" onClick={e => e.stopPropagation()}>
                        <img
                            src={FOTO_BASE + lightbox.foto}
                            alt={lightbox.activity ?? 'Foto kegiatan'}
                            className="w-full rounded-2xl shadow-2xl"
                        />
                        <div className="bg-white/90 rounded-xl px-3 py-2">
                            <p className="text-sm font-semibold text-gray-800">{lightbox.activity ?? 'Kegiatan'}</p>
                            <p className="text-xs text-gray-500">{lightbox.tanggal}</p>
                        </div>
                        <button
                            onClick={() => setLightbox(null)}
                            className="w-full py-2 rounded-xl bg-white/80 text-gray-700 text-sm font-medium"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12" />

                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Galeri Foto {nama}</h1>
                            <p className="text-sm text-gray-500">
                                Semester {rapor.semester} &bull; T.A. {rapor.tahun_ajaran}
                            </p>
                        </div>
                    </div>

                    {/* Branding */}
                    <div className="shadow-lg rounded-3xl bg-white px-5 py-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0">
                            <Images className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-700">Al-Biruni Preschool &amp; Daycare</p>
                            <p className="text-xs text-gray-400">Dokumentasi kegiatan semester ini</p>
                        </div>
                        <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold bg-pink-100 text-pink-700 shrink-0">
                            {fotos.length} foto
                        </span>
                    </div>

                    {/* Grid foto */}
                    {fotos.length === 0 ? (
                        <div className="shadow-lg rounded-3xl bg-white p-10 text-center">
                            <Images className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">Belum ada foto kegiatan</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Foto akan muncul setelah guru mengirim daily report
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {fotos.map(foto => (
                                <button
                                    key={foto.id}
                                    onClick={() => setLightbox(foto)}
                                    className="relative aspect-square rounded-2xl overflow-hidden shadow-md active:scale-95 transition-transform"
                                >
                                    <img
                                        src={FOTO_BASE + foto.foto}
                                        alt={foto.activity ?? 'Foto kegiatan'}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-1.5 py-1">
                                        <p className="text-white text-[9px] truncate">{foto.tanggal}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Footer note */}
                    <p className="text-center text-xs text-gray-400 pt-2">
                        Halaman ini hanya bisa diakses melalui QR code resmi rapor.<br />
                        albiruni.sch.id
                    </p>
                </div>
            </div>
        </>
    );
}
