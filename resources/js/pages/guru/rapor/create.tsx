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

interface Siswa {
    id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    kelas: { nama_kelas: string } | null;
    jenis_kelamin: string;
    tanggal_lahir: string;
}

interface Props {
    siswaList: Siswa[];
    aspekList: Record<string, string>;
    statusList: Record<string, string>;
    tahunAjaran: string;
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

export default function GuruRaporCreate({ siswaList, aspekList, statusList, tahunAjaran }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id:    '',
        semester:    '1',
        tahun_ajaran: tahunAjaran,
        guru_kelas:  '',
        penutup:     '',
        pertumbuhan: BULAN_SEMESTER['1'].map((b) => ({
            bulan: b.bulan, berat_badan: '', tinggi_badan: '', lingkar_kepala: '',
        })) as PertumbuhanItem[],
        perkembangan: Object.keys(aspekList).map((aspek) => ({
            aspek, status: '', narasi: '',
        })) as PerkembanganItem[],
    });

    const handleSemesterChange = (val: string) => {
        setData({
            ...data,
            semester: val,
            pertumbuhan: BULAN_SEMESTER[val].map((b) => ({
                bulan: b.bulan, berat_badan: '', tinggi_badan: '', lingkar_kepala: '',
            })),
        });
    };

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
        post('/guru/rapor');
    };

    const bulanList = BULAN_SEMESTER[data.semester];

    return (
        <>
            <Head title="Buat Rapor Digital" />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12" />

                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                            <ArrowLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Buat Rapor 📝</h1>
                            <p className="text-sm text-gray-600">Laporan tumbuh kembang anak</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Info Dasar */}
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-4">
                            <h2 className="font-bold text-gray-800">Informasi Dasar</h2>

                            <div className="space-y-1">
                                <Label className="text-sm text-gray-600">Siswa</Label>
                                <Select value={data.siswa_id} onValueChange={(v) => setData('siswa_id', v)}>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Pilih siswa..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {siswaList.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.nama_lengkap} — {s.kelas?.nama_kelas ?? '-'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.siswa_id && <p className="text-xs text-red-500">{errors.siswa_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-sm text-gray-600">Semester</Label>
                                    <Select value={data.semester} onValueChange={handleSemesterChange}>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Semester 1</SelectItem>
                                            <SelectItem value="2">Semester 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-sm text-gray-600">Tahun Ajaran</Label>
                                    <Input
                                        className="rounded-xl"
                                        value={data.tahun_ajaran}
                                        onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                        placeholder="2024/2025"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm text-gray-600">Nama Guru Kelas</Label>
                                <Input
                                    className="rounded-xl"
                                    value={data.guru_kelas}
                                    onChange={(e) => setData('guru_kelas', e.target.value)}
                                    placeholder="Nama guru kelas"
                                />
                            </div>
                        </div>

                        {/* Pertumbuhan */}
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                            <div>
                                <h2 className="font-bold text-gray-800">A. Data Pertumbuhan</h2>
                                <p className="text-xs text-gray-500">Isi data bulanan selama semester ini</p>
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

                        <Button type="submit" disabled={processing}
                            className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md border-0 text-base font-semibold">
                            {processing ? 'Menyimpan...' : 'Simpan sebagai Draft'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
