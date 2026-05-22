import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown, CheckCircle, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import WhoChartOverlay, { type WhoDataPoint } from '@/components/who-chart-overlay';
import type { WhoZScorePoint } from '@/lib/whoGrowthStandards';

interface Pertumbuhan {
    id: number;
    bulan: number;
    berat_badan: string | null;
    tinggi_badan: string | null;
    lingkar_kepala: string | null;
    nama_bulan: string;
}

interface Perkembangan {
    id: number;
    aspek: string;
    status: string | null;
    narasi: string | null;
    aspek_label: string;
    status_label: string;
}

interface Rapor {
    id: number;
    siswa: {
        id: number;
        nama_lengkap: string;
        nama_panggilan: string;
        jenis_kelamin: string;
        tanggal_lahir: string;
        kelas: { nama_kelas: string } | null;
    };
    semester: number;
    tahun_ajaran: string;
    status: 'draft' | 'final';
    guru_kelas: string | null;
    penutup_umum: string | null;
    penutup_motivasi_orangtua: string | null;
    penutup_penguatan_positif: string | null;
    pertumbuhans: Pertumbuhan[];
    perkembangans: Perkembangan[];
    creator: { name: string };
    created_at: string;
}

interface WhoData {
    wfa: WhoZScorePoint[];
    lhfa: WhoZScorePoint[];
    hcfa: WhoZScorePoint[];
}

interface Props {
    rapor: Rapor;
    aspekLabels: Record<string, string>;
    statusLabels: Record<string, string>;
    whoData: WhoData;
    usiaAwalSemester: number;
    sex: 'boys' | 'girls';
}

const STATUS_COLORS: Record<string, string> = {
    BB:  'bg-red-100 text-red-800',
    MB:  'bg-yellow-100 text-yellow-800',
    BSH: 'bg-blue-100 text-blue-800',
    BSB: 'bg-green-100 text-green-800',
};

export default function GuruRaporShow({ rapor, aspekLabels, statusLabels, whoData, usiaAwalSemester, sex }: Props) {
    const handleFinalize = () => {
        Swal.fire({
            title: 'Finalisasi Rapor?',
            text: `Rapor ${rapor.siswa.nama_lengkap} akan difinalisasi dan tidak bisa diedit lagi.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Finalisasi!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/guru/rapor/${rapor.id}/finalize`, {}, {
                    onSuccess: () => Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Rapor telah difinalisasi.', confirmButtonColor: '#2563eb' }),
                });
            }
        });
    };

    // Mapping pertumbuhan index → usia anak dalam bulan
    const buildPoints = (key: 'berat_badan' | 'tinggi_badan' | 'lingkar_kepala'): WhoDataPoint[] =>
        rapor.pertumbuhans.map((p, i) => ({
            month: usiaAwalSemester + i,
            value: p[key] !== null ? parseFloat(p[key] as string) : null,
        }));

    const hasGrowthData = rapor.pertumbuhans.length > 0;

    return (
        <>
            <Head title={`Rapor — ${rapor.siswa.nama_lengkap}`} />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12" />

                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <button onClick={() => window.history.back()} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">{rapor.siswa.nama_lengkap}</h1>
                                <p className="text-sm text-gray-600">Semester {rapor.semester} — {rapor.tahun_ajaran}</p>
                            </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                            rapor.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {rapor.status === 'final' ? '✓ Final' : '● Draft'}
                        </span>
                    </div>

                    {/* Identitas */}
                    <div className="shadow-lg rounded-3xl bg-white p-5">
                        <h2 className="font-bold text-gray-800 mb-3">Identitas Anak</h2>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div>
                                <p className="text-xs text-gray-500">Kelas</p>
                                <p className="font-medium text-gray-800">{rapor.siswa.kelas?.nama_kelas ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Usia Awal Semester</p>
                                <p className="font-medium text-gray-800">
                                    {Math.floor(usiaAwalSemester / 12)} thn {usiaAwalSemester % 12} bln
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Jenis Kelamin</p>
                                <p className="font-medium text-gray-800 capitalize">{rapor.siswa.jenis_kelamin}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Guru Kelas</p>
                                <p className="font-medium text-gray-800">{rapor.guru_kelas ?? '-'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500">Dibuat Oleh</p>
                                <p className="font-medium text-gray-800">{rapor.creator.name}</p>
                                <p className="text-xs text-gray-400">{rapor.created_at}</p>
                            </div>
                        </div>
                    </div>

                    {/* A. Grafik Pertumbuhan WHO */}
                    <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                        <h2 className="font-bold text-gray-800">A. Grafik Pertumbuhan (Kurva WHO)</h2>

                        {hasGrowthData ? (
                            <>
                                <p className="text-xs text-gray-500">
                                    Kotak biru = rentang semester ini (usia {usiaAwalSemester}–{usiaAwalSemester + 5} bulan).
                                </p>
                                {/* Vertical stack charts */}
                                <div className="space-y-4">
                                    <WhoChartOverlay
                                        indicator="wfa"
                                        sex={sex}
                                        dataPoints={buildPoints('berat_badan')}
                                        usiaAwal={usiaAwalSemester}
                                        title="Berat Badan / Umur (BB/U)"
                                        unit="kg"
                                    />
                                    <WhoChartOverlay
                                        indicator="lhfa"
                                        sex={sex}
                                        dataPoints={buildPoints('tinggi_badan')}
                                        usiaAwal={usiaAwalSemester}
                                        title="Tinggi Badan / Umur (TB/U)"
                                        unit="cm"
                                    />
                                    <WhoChartOverlay
                                        indicator="hcfa"
                                        sex={sex}
                                        dataPoints={buildPoints('lingkar_kepala')}
                                        usiaAwal={usiaAwalSemester}
                                        title="Lingkar Kepala / Umur (LK/U)"
                                        unit="cm"
                                    />
                                </div>

                                {/* Tabel data pertumbuhan */}
                                <div className="overflow-x-auto mt-2">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2 pr-4 text-xs text-gray-500 font-medium">Bulan</th>
                                                <th className="text-right py-2 pr-4 text-xs text-gray-500 font-medium">BB (kg)</th>
                                                <th className="text-right py-2 pr-4 text-xs text-gray-500 font-medium">TB (cm)</th>
                                                <th className="text-right py-2 text-xs text-gray-500 font-medium">LK (cm)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rapor.pertumbuhans.map((p) => (
                                                <tr key={p.id} className="border-b last:border-0">
                                                    <td className="py-2 pr-4 text-gray-700 font-medium text-sm">{p.nama_bulan}</td>
                                                    <td className="text-right py-2 pr-4 text-gray-800">{p.berat_badan ?? '—'}</td>
                                                    <td className="text-right py-2 pr-4 text-gray-800">{p.tinggi_badan ?? '—'}</td>
                                                    <td className="text-right py-2 text-gray-800">{p.lingkar_kepala ?? '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">Belum ada data pertumbuhan</p>
                        )}
                    </div>

                    {/* B. Perkembangan */}
                    <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                        <h2 className="font-bold text-gray-800">B. Perkembangan Anak</h2>
                        {rapor.perkembangans.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">Belum ada data perkembangan</p>
                        ) : (
                            <div className="space-y-2">
                                {rapor.perkembangans.map((p) => (
                                    <div key={p.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                                        <p className="font-semibold text-sm text-gray-800 mb-1">
                                            {aspekLabels[p.aspek] ?? p.aspek}
                                        </p>
                                        {p.status && (
                                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mb-1 ${STATUS_COLORS[p.status] ?? ''}`}>
                                                {p.status} — {statusLabels[p.status] ?? p.status}
                                            </span>
                                        )}
                                        {p.narasi && (
                                            <p className="text-xs text-gray-500 leading-relaxed">{p.narasi}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* C. Narasi Emosional */}
                    {(rapor.penutup_umum || rapor.penutup_motivasi_orangtua || rapor.penutup_penguatan_positif) && (
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                            <h2 className="font-bold text-gray-800">C. Narasi Emosional</h2>
                            {rapor.penutup_umum && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Penutup Umum</p>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{rapor.penutup_umum}</p>
                                </div>
                            )}
                            {rapor.penutup_motivasi_orangtua && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Motivasi untuk Orang Tua</p>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{rapor.penutup_motivasi_orangtua}</p>
                                </div>
                            )}
                            {rapor.penutup_penguatan_positif && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Penguatan Positif</p>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{rapor.penutup_penguatan_positif}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Aksi */}
                    <div className="space-y-3">
                        {rapor.status === 'draft' && (
                            <>
                                <Button onClick={() => window.location.href = `/guru/rapor/${rapor.id}/edit`}
                                    variant="outline"
                                    className="w-full h-12 rounded-2xl font-semibold">
                                    <Pencil className="mr-2 h-4 w-4" /> Edit Rapor
                                </Button>
                                <Button onClick={handleFinalize}
                                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md border-0 font-semibold">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Finalisasi Rapor
                                </Button>
                            </>
                        )}
                        {rapor.status === 'final' && (
                            <a href={`/guru/rapor/${rapor.id}/pdf`} target="_blank" rel="noreferrer">
                                <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md border-0 font-semibold">
                                    <FileDown className="mr-2 h-4 w-4" /> Unduh PDF
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
