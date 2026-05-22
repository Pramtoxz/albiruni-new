import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Pertumbuhan {
    id: number; bulan: number;
    berat_badan: string | null; tinggi_badan: string | null; lingkar_kepala: string | null;
}

interface Perkembangan {
    id: number; aspek: string; status: string | null; narasi: string | null;
}

interface Siswa {
    id: number; kelas_id: number | null; nama_panggilan: string; nama_lengkap: string;
}

interface Rapor {
    id: number; semester: number; tahun_ajaran: string;
    guru_kelas: string | null;
    penutup_umum: string | null;
    penutup_motivasi_orangtua: string | null;
    penutup_penguatan_positif: string | null;
    pertumbuhans: Pertumbuhan[];
    perkembangans: Perkembangan[];
    siswa: Siswa;
}

interface PerkembanganTemplate {
    aspek: string; indikator: string | null;
    narasi_bsb: string | null; narasi_bsh: string | null; narasi_mb: string | null; narasi_bb: string | null;
}

interface PenutupTemplate {
    kategori: string; narasi_template: string | null;
}

interface Props {
    rapor: Rapor;
    aspekList: Record<string, string>;
    statusList: Record<string, string>;
    perkembanganTemplates: Record<string, PerkembanganTemplate>;
    penutupTemplates: Record<string, PenutupTemplate>;
}

const BULAN_SEMESTER: Record<string, { label: string; bulan: number }[]> = {
    '1': [
        { label: 'Juli', bulan: 7 }, { label: 'Agustus', bulan: 8 },
        { label: 'September', bulan: 9 }, { label: 'Oktober', bulan: 10 },
        { label: 'November', bulan: 11 }, { label: 'Desember', bulan: 12 },
    ],
    '2': [
        { label: 'Januari', bulan: 1 }, { label: 'Februari', bulan: 2 },
        { label: 'Maret', bulan: 3 }, { label: 'April', bulan: 4 },
        { label: 'Mei', bulan: 5 }, { label: 'Juni', bulan: 6 },
    ],
};

const STATUS_COLORS: Record<string, string> = {
    BSB: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
    BSH: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
    MB:  'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
    BB:  'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
};
const STATUS_ACTIVE: Record<string, string> = {
    BSB: 'bg-green-500 text-white border-green-500',
    BSH: 'bg-blue-500 text-white border-blue-500',
    MB:  'bg-yellow-500 text-white border-yellow-500',
    BB:  'bg-red-500 text-white border-red-500',
};

type PertumbuhanItem = { bulan: number; berat_badan: string; tinggi_badan: string; lingkar_kepala: string };
type PerkembanganItem = { aspek: string; status: string; narasi: string };

export default function GuruRaporEdit({ rapor, aspekList, statusList, perkembanganTemplates, penutupTemplates }: Props) {
    const semesterKey    = String(rapor.semester);
    const bulanList      = BULAN_SEMESTER[semesterKey];
    const hasTemplate    = Object.keys(perkembanganTemplates).length > 0;

    const replacePlaceholders = (text: string): string =>
        text
            .replace(/{nama_anak}/g, rapor.siswa?.nama_panggilan ?? '')
            .replace(/{nama_lengkap}/g, rapor.siswa?.nama_lengkap ?? '');

    const initPertumbuhan: PertumbuhanItem[] = bulanList.map((b) => {
        const existing = rapor.pertumbuhans.find((p) => p.bulan === b.bulan);
        return {
            bulan: b.bulan,
            berat_badan:    existing?.berat_badan ?? '',
            tinggi_badan:   existing?.tinggi_badan ?? '',
            lingkar_kepala: existing?.lingkar_kepala ?? '',
        };
    });

    const initPerkembangan: PerkembanganItem[] = Object.keys(aspekList).map((aspek) => {
        const existing = rapor.perkembangans.find((p) => p.aspek === aspek);
        return { aspek, status: existing?.status ?? '', narasi: existing?.narasi ?? '' };
    });

    const { data, setData, put, processing } = useForm({
        guru_kelas:                 rapor.guru_kelas ?? '',
        penutup_umum:               rapor.penutup_umum ?? '',
        penutup_motivasi_orangtua:  rapor.penutup_motivasi_orangtua ?? '',
        penutup_penguatan_positif:  rapor.penutup_penguatan_positif ?? '',
        pertumbuhan:  initPertumbuhan,
        perkembangan: initPerkembangan,
    });

    const updatePertumbuhan = (idx: number, field: keyof PertumbuhanItem, value: string) => {
        const updated = [...data.pertumbuhan];
        updated[idx] = { ...updated[idx], [field]: value };
        setData('pertumbuhan', updated);
    };

    const updatePerkembanganStatus = (idx: number, status: string) => {
        const aspek    = data.perkembangan[idx].aspek;
        const template = perkembanganTemplates[aspek] as PerkembanganTemplate | undefined;
        let narasi     = data.perkembangan[idx].narasi;
        if (template) {
            const raw = status === 'BSB' ? template.narasi_bsb
                      : status === 'BSH' ? template.narasi_bsh
                      : status === 'MB'  ? template.narasi_mb
                      : status === 'BB'  ? template.narasi_bb
                      : null;
            narasi = replacePlaceholders(raw ?? '');
        }
        const updated = [...data.perkembangan];
        updated[idx] = { ...updated[idx], status, narasi };
        setData('perkembangan', updated);
    };

    const updatePerkembanganNarasi = (idx: number, narasi: string) => {
        const updated = [...data.perkembangan];
        updated[idx] = { ...updated[idx], narasi };
        setData('perkembangan', updated);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/guru/rapor/${rapor.id}`);
    };

    return (
        <>
            <Head title="Edit Rapor Digital" />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-orange-300 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12" />

                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                            <ArrowLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Edit Rapor ✏️</h1>
                            <p className="text-sm text-gray-600">Semester {rapor.semester} — {rapor.tahun_ajaran}</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Guru Kelas */}
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                            <h2 className="font-bold text-gray-800">Informasi Rapor</h2>
                            <div className="space-y-1">
                                <Label className="text-sm text-gray-600">Nama Guru Kelas</Label>
                                <Input className="rounded-xl" value={data.guru_kelas}
                                    onChange={(e) => setData('guru_kelas', e.target.value)}
                                    placeholder="Nama guru kelas" />
                            </div>
                        </div>

                        {/* Pertumbuhan */}
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                            <div>
                                <h2 className="font-bold text-gray-800">A. Data Pertumbuhan</h2>
                                <p className="text-xs text-gray-500">Data bulanan selama semester ini</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[340px]">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 pr-3 text-gray-600 font-medium text-xs">Bulan</th>
                                            <th className="text-left py-2 pr-3 text-gray-600 font-medium text-xs">BB (kg)</th>
                                            <th className="text-left py-2 pr-3 text-gray-600 font-medium text-xs">TB (cm)</th>
                                            <th className="text-left py-2 text-gray-600 font-medium text-xs">LK (cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bulanList.map((b, idx) => (
                                            <tr key={b.bulan} className="border-b last:border-0">
                                                <td className="py-2 pr-3 font-medium text-gray-700 text-xs">{b.label}</td>
                                                <td className="py-1 pr-2">
                                                    <Input type="number" step="0.01" min="0" className="w-20 rounded-xl h-8 text-xs"
                                                        value={data.pertumbuhan[idx]?.berat_badan ?? ''}
                                                        onChange={(e) => updatePertumbuhan(idx, 'berat_badan', e.target.value)}
                                                        placeholder="0.00" />
                                                </td>
                                                <td className="py-1 pr-2">
                                                    <Input type="number" step="0.01" min="0" className="w-20 rounded-xl h-8 text-xs"
                                                        value={data.pertumbuhan[idx]?.tinggi_badan ?? ''}
                                                        onChange={(e) => updatePertumbuhan(idx, 'tinggi_badan', e.target.value)}
                                                        placeholder="0.00" />
                                                </td>
                                                <td className="py-1">
                                                    <Input type="number" step="0.01" min="0" className="w-20 rounded-xl h-8 text-xs"
                                                        value={data.pertumbuhan[idx]?.lingkar_kepala ?? ''}
                                                        onChange={(e) => updatePertumbuhan(idx, 'lingkar_kepala', e.target.value)}
                                                        placeholder="0.00" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Perkembangan */}
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                            <div>
                                <h2 className="font-bold text-gray-800">B. Perkembangan Anak</h2>
                                <p className="text-xs text-gray-500">
                                    {hasTemplate
                                        ? 'Pilih status (BSB/BSH/MB/BB) → narasi otomatis terisi'
                                        : 'Template kelas ini belum diisi admin — isi narasi secara manual'}
                                </p>
                            </div>
                            {!hasTemplate && (
                                <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                                    ⚠️ Template narasi untuk kelas ini belum diisi. Hubungi admin untuk mengisi template di menu <span className="font-semibold">Template Rapor</span>.
                                </div>
                            )}
                            <div className="space-y-3">
                                {data.perkembangan.map((item, idx) => {
                                    const template = perkembanganTemplates[item.aspek] as PerkembanganTemplate | undefined;
                                    return (
                                        <div key={item.aspek} className="rounded-2xl border border-gray-100 p-3 space-y-2 bg-gray-50">
                                            <div className="space-y-1">
                                                <span className="text-sm font-semibold text-gray-700">{aspekList[item.aspek]}</span>
                                                {template?.indikator && (
                                                    <p className="text-xs text-gray-400">{template.indikator}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-1.5 flex-wrap">
                                                {Object.keys(statusList).map((status) => (
                                                    <button key={status} type="button"
                                                        onClick={() => updatePerkembanganStatus(idx, status)}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                                                            item.status === status
                                                                ? STATUS_ACTIVE[status]
                                                                : STATUS_COLORS[status]
                                                        }`}>
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                            <Textarea rows={3} placeholder="Narasi perkembangan..."
                                                className="rounded-xl text-xs resize-none"
                                                value={item.narasi}
                                                onChange={(e) => updatePerkembanganNarasi(idx, e.target.value)} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section C */}
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                            <div>
                                <h2 className="font-bold text-gray-800">C. Narasi Emosional</h2>
                                <p className="text-xs text-gray-500">Narasi penutup dari template kelas. Bisa diedit.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-sm text-gray-600">Penutup Umum</Label>
                                    <Textarea rows={4} placeholder="Narasi penutup umum..."
                                        className="rounded-xl text-sm resize-none"
                                        value={data.penutup_umum}
                                        onChange={(e) => setData('penutup_umum', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-sm text-gray-600">Motivasi untuk Orang Tua</Label>
                                    <Textarea rows={4} placeholder="Narasi motivasi orang tua..."
                                        className="rounded-xl text-sm resize-none"
                                        value={data.penutup_motivasi_orangtua}
                                        onChange={(e) => setData('penutup_motivasi_orangtua', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-sm text-gray-600">Penguatan Positif</Label>
                                    <Textarea rows={4} placeholder="Narasi penguatan positif..."
                                        className="rounded-xl text-sm resize-none"
                                        value={data.penutup_penguatan_positif}
                                        onChange={(e) => setData('penutup_penguatan_positif', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}
                                className="flex-1 h-12 rounded-2xl">
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}
                                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md border-0 font-semibold">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
