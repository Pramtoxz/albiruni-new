import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Foto {
    id: number;
    foto: string;
    tanggal: string;
    activity: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Fotos {
    data: Foto[];
    links: PaginationLink[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

interface SiswaItem {
    id: number;
    nama: string;
}

interface Filters {
    siswa_id: number;
    semester: number | null;
    tahun_ajaran: string | null;
}

interface Props {
    fotos: Fotos;
    siswaList: SiswaItem[];
    filters: Filters;
}

const FOTO_BASE = '/assets/images/daily_reports/';

const SEMESTERS = [
    { value: '1', label: 'Semester 1 (Jul–Des)' },
    { value: '2', label: 'Semester 2 (Jan–Jun)' },
];

export default function OrangtuaGaleri({ fotos, siswaList, filters }: Props) {
    const [lightbox, setLightbox] = useState<Foto | null>(null);

    const applyFilter = (key: string, value: string | null) => {
        router.get('/orangtua/galeri', {
            ...filters,
            tahun_ajaran: filters.tahun_ajaran ?? undefined,
            semester: filters.semester ?? undefined,
            [key]: value ?? undefined,
        }, { preserveScroll: false });
    };

    return (
        <>
            <Head title="Galeri Foto Kegiatan" />

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
                            <h1 className="text-xl font-bold text-gray-800">Galeri Foto Kegiatan</h1>
                            <p className="text-sm text-gray-500">Kenangan aktivitas si kecil</p>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="shadow-lg rounded-3xl bg-white p-4 space-y-3">
                        {/* Filter anak (jika lebih dari 1) */}
                        {siswaList.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {siswaList.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => applyFilter('siswa_id', String(s.id))}
                                        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                            filters.siswa_id === s.id
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {s.nama}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Filter tahun ajaran & semester */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Tahun Ajaran (mis. 2025/2026)"
                                defaultValue={filters.tahun_ajaran ?? ''}
                                onBlur={e => applyFilter('tahun_ajaran', e.target.value || null)}
                                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                            <select
                                value={filters.semester ?? ''}
                                onChange={e => applyFilter('semester', e.target.value || null)}
                                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                            >
                                <option value="">Semua</option>
                                {SEMESTERS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        {(filters.semester || filters.tahun_ajaran) && (
                            <button
                                onClick={() => router.get('/orangtua/galeri', { siswa_id: filters.siswa_id })}
                                className="text-xs text-pink-500 font-medium"
                            >
                                Hapus filter
                            </button>
                        )}
                    </div>

                    {/* Total */}
                    {fotos.meta?.total > 0 && (
                        <p className="text-sm text-gray-500 px-1">
                            {fotos.meta.total} foto &bull; halaman {fotos.meta.current_page} dari {fotos.meta.last_page}
                        </p>
                    )}

                    {/* Grid foto */}
                    {fotos.data.length === 0 ? (
                        <div className="shadow-lg rounded-3xl bg-white p-10 text-center">
                            <Images className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">Belum ada foto kegiatan</p>
                            <p className="text-sm text-gray-400 mt-1">Foto akan muncul setelah guru mengirim daily report dengan foto</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {fotos.data.map(foto => (
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

                    {/* Pagination */}
                    {fotos.meta?.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            {fotos.meta.current_page > 1 && (
                                <Link
                                    href={fotos.links.find(l => l.label === '&laquo; Previous')?.url ?? '#'}
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-md active:scale-95"
                                >
                                    <ChevronLeft className="h-4 w-4 text-gray-700" />
                                </Link>
                            )}

                            <div className="flex gap-1">
                                {fotos.links
                                    .filter(l => l.label !== '&laquo; Previous' && l.label !== 'Next &raquo;')
                                    .map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url ?? '#'}
                                            className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold shadow-md transition-all ${
                                                link.active
                                                    ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white'
                                                    : 'bg-white text-gray-700'
                                            } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                            </div>

                            {fotos.meta.current_page < fotos.meta.last_page && (
                                <Link
                                    href={fotos.links.find(l => l.label === 'Next &raquo;')?.url ?? '#'}
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-md active:scale-95"
                                >
                                    <ChevronRight className="h-4 w-4 text-gray-700" />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
