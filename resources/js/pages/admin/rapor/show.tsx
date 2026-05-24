import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileDown } from 'lucide-react';
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
    penutup: string | null;
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
    BB: 'bg-red-100 text-red-800',
    MB: 'bg-yellow-100 text-yellow-800',
    BSH: 'bg-blue-100 text-blue-800',
    BSB: 'bg-green-100 text-green-800',
};

export default function AdminRaporShow({
    rapor, aspekLabels, statusLabels, whoData, usiaAwalSemester, sex,
}: Props) {
    // Mapping pertumbuhan index → usia anak dalam bulan
    const buildPoints = (key: 'berat_badan' | 'tinggi_badan' | 'lingkar_kepala'): WhoDataPoint[] =>
        rapor.pertumbuhans.map((p, i) => ({
            month: usiaAwalSemester + i,
            value: p[key] !== null ? parseFloat(p[key] as string) : null,
        }));

    return (
        <AppLayout>
            <Head title={`Rapor — ${rapor.siswa.nama_lengkap}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Link href="/admin/rapor" className="text-muted-foreground text-sm flex items-center gap-1 mb-1 hover:text-foreground">
                            <ArrowLeft className="h-3 w-3" /> Kembali
                        </Link>
                        <h1 className="text-2xl font-bold">Rapor {rapor.siswa.nama_lengkap}</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Semester {rapor.semester} — {rapor.tahun_ajaran}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={rapor.status === 'final' ? 'default' : 'secondary'}>
                            {rapor.status === 'final' ? 'Final' : 'Draft'}
                        </Badge>
                        {rapor.status === 'final' && (
                            <a href={`/guru/rapor/${rapor.id}/pdf`} target="_blank" rel="noreferrer">
                                <Button size="sm" variant="outline">
                                    <FileDown className="mr-1 h-4 w-4" /> Unduh PDF
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="rounded-lg border bg-card p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Nama Lengkap</p>
                        <p className="font-medium">{rapor.siswa.nama_lengkap}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Kelas</p>
                        <p className="font-medium">{rapor.siswa.kelas?.nama_kelas ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Guru Kelas</p>
                        <p className="font-medium">{rapor.guru_kelas ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Dibuat Oleh</p>
                        <p className="font-medium">{rapor.creator.name}</p>
                        <p className="text-xs text-muted-foreground">{rapor.created_at}</p>
                    </div>
                </div>

                {/* Grafik WHO */}
                <div className="space-y-2">
                    <h2 className="font-semibold text-lg">A. Grafik Pertumbuhan (Kurva WHO)</h2>
                    <p className="text-sm text-muted-foreground">
                        Kotak biru pada grafik menunjukkan rentang semester ini (usia {usiaAwalSemester}–{usiaAwalSemester + 5} bulan).
                    </p>
                    {rapor.pertumbuhans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-lg border bg-card p-3">
                                <WhoChartOverlay
                                    indicator="wfa"
                                    sex={sex}
                                    dataPoints={buildPoints('berat_badan')}
                                    usiaAwal={usiaAwalSemester}
                                    title="Berat Badan / Umur (BB/U)"
                                    unit="kg"
                                />
                            </div>
                            <div className="rounded-lg border bg-card p-3">
                                <WhoChartOverlay
                                    indicator="lhfa"
                                    sex={sex}
                                    dataPoints={buildPoints('tinggi_badan')}
                                    usiaAwal={usiaAwalSemester}
                                    title="Tinggi Badan / Umur (TB/U)"
                                    unit="cm"
                                />
                            </div>
                            <div className="rounded-lg border bg-card p-3">
                                <WhoChartOverlay
                                    indicator="hcfa"
                                    sex={sex}
                                    dataPoints={buildPoints('lingkar_kepala')}
                                    usiaAwal={usiaAwalSemester}
                                    title="Lingkar Kepala / Umur (LK/U)"
                                    unit="cm"
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">Belum ada data pertumbuhan</p>
                    )}
                </div>

                {/* Tabel Pertumbuhan */}
                <div className="rounded-lg border bg-card p-4 space-y-3">
                    <h2 className="font-semibold">Data Pertumbuhan Bulanan</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 pr-4">Bulan</th>
                                    <th className="text-right py-2 pr-4">BB (kg)</th>
                                    <th className="text-right py-2 pr-4">TB (cm)</th>
                                    <th className="text-right py-2">LK (cm)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rapor.pertumbuhans.map((p) => (
                                    <tr key={p.id} className="border-b last:border-0">
                                        <td className="py-2 pr-4">{p.nama_bulan}</td>
                                        <td className="text-right py-2 pr-4">{p.berat_badan ?? '—'}</td>
                                        <td className="text-right py-2 pr-4">{p.tinggi_badan ?? '—'}</td>
                                        <td className="text-right py-2">{p.lingkar_kepala ?? '—'}</td>
                                    </tr>
                                ))}
                                {rapor.pertumbuhans.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-4 text-center text-muted-foreground">
                                            Belum ada data pertumbuhan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Perkembangan */}
                <div className="rounded-lg border bg-card p-4 space-y-3">
                    <h2 className="font-semibold">B. Perkembangan Anak</h2>
                    <div className="space-y-3">
                        {rapor.perkembangans.map((p) => (
                            <div key={p.id} className="rounded-md border p-3">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="font-medium text-sm">{aspekLabels[p.aspek] ?? p.aspek}</span>
                                    {p.status && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[p.status] ?? ''}`}>
                                            {p.status} — {statusLabels[p.status] ?? p.status}
                                        </span>
                                    )}
                                </div>
                                {p.narasi && (
                                    <p className="text-sm text-muted-foreground">{p.narasi}</p>
                                )}
                            </div>
                        ))}
                        {rapor.perkembangans.length === 0 && (
                            <p className="text-muted-foreground text-sm">Belum ada data perkembangan</p>
                        )}
                    </div>
                </div>

                {rapor.penutup && (
                    <div className="rounded-lg border bg-card p-4 space-y-2">
                        <h2 className="font-semibold">D. Penutup</h2>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{rapor.penutup}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
