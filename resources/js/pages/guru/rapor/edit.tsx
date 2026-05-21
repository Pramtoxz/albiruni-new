import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Pertumbuhan {
    id: number;
    bulan: number;
    berat_badan: string | null;
    tinggi_badan: string | null;
    lingkar_kepala: string | null;
}

interface Perkembangan {
    id: number;
    aspek: string;
    status: string | null;
    narasi: string | null;
}

interface Rapor {
    id: number;
    semester: number;
    tahun_ajaran: string;
    guru_kelas: string | null;
    penutup: string | null;
    pertumbuhans: Pertumbuhan[];
    perkembangans: Perkembangan[];
}

interface Props {
    rapor: Rapor;
    aspekList: Record<string, string>;
    statusList: Record<string, string>;
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

type PertumbuhanItem = { bulan: number; berat_badan: string; tinggi_badan: string; lingkar_kepala: string };
type PerkembanganItem = { aspek: string; status: string; narasi: string };

export default function GuruRaporEdit({ rapor, aspekList, statusList }: Props) {
    const semesterKey = String(rapor.semester);
    const bulanList   = BULAN_SEMESTER[semesterKey];

    const initPertumbuhan: PertumbuhanItem[] = bulanList.map((b) => {
        const existing = rapor.pertumbuhans.find((p) => p.bulan === b.bulan);
        return {
            bulan: b.bulan,
            berat_badan:   existing?.berat_badan ?? '',
            tinggi_badan:  existing?.tinggi_badan ?? '',
            lingkar_kepala: existing?.lingkar_kepala ?? '',
        };
    });

    const initPerkembangan: PerkembanganItem[] = Object.keys(aspekList).map((aspek) => {
        const existing = rapor.perkembangans.find((p) => p.aspek === aspek);
        return { aspek, status: existing?.status ?? '', narasi: existing?.narasi ?? '' };
    });

    const { data, setData, put, processing } = useForm({
        guru_kelas:   rapor.guru_kelas ?? '',
        penutup:      rapor.penutup ?? '',
        pertumbuhan:  initPertumbuhan,
        perkembangan: initPerkembangan,
    });

    const updatePertumbuhan = (idx: number, field: keyof PertumbuhanItem, value: string) => {
        const updated = [...data.pertumbuhan];
        updated[idx] = { ...updated[idx], [field]: value };
        setData('pertumbuhan', updated);
    };

    const updatePerkembangan = (idx: number, field: keyof PerkembanganItem, value: string) => {
        const updated = [...data.perkembangan];
        updated[idx] = { ...updated[idx], [field]: value };
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
                                <p className="text-xs text-gray-500">BB | MB | BSH | BSB</p>
                            </div>
                            <div className="space-y-3">
                                {data.perkembangan.map((item, idx) => (
                                    <div key={item.aspek} className="rounded-2xl border border-gray-100 p-3 space-y-2 bg-gray-50">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-gray-700">{aspekList[item.aspek]}</span>
                                            <Select value={item.status} onValueChange={(v) => updatePerkembangan(idx, 'status', v)}>
                                                <SelectTrigger className="w-44 rounded-xl h-8 text-xs">
                                                    <SelectValue placeholder="Status..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(statusList).map(([k, v]) => (
                                                        <SelectItem key={k} value={k}>{k} — {v}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Textarea rows={2} placeholder="Narasi perkembangan (opsional)..."
                                            className="rounded-xl text-xs resize-none"
                                            value={item.narasi}
                                            onChange={(e) => updatePerkembangan(idx, 'narasi', e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Penutup */}
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-2">
                            <h2 className="font-bold text-gray-800">D. Penutup</h2>
                            <Textarea rows={4} placeholder="Narasi penutup rapor..."
                                className="rounded-xl text-sm resize-none"
                                value={data.penutup}
                                onChange={(e) => setData('penutup', e.target.value)} />
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
