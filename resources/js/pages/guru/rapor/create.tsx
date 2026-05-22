import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    kelas_id: number | null;
    kelas: { nama_kelas: string } | null;
    jenis_kelamin: string;
    tanggal_lahir: string;
}

interface PerkembanganTemplate {
    aspek: string; indikator: string | null; contoh_narasi: string | null;
    narasi_bsb: string | null; narasi_bsh: string | null; narasi_mb: string | null; narasi_bb: string | null;
}

interface PenutupTemplate {
    kategori: string; narasi_template: string | null;
}

interface Props {
    siswaList: Siswa[];
    aspekList: Record<string, string>;
    statusList: Record<string, string>;
    raporSemester: string;
    raporTahunAjaran: string;
    guruNama: string;
    perkembanganTemplates: Record<string, PerkembanganTemplate[]>;
    penutupTemplates: Record<string, PenutupTemplate[]>;
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

export default function GuruRaporCreate({
    siswaList, aspekList, statusList,
    raporSemester, raporTahunAjaran, guruNama,
    perkembanganTemplates, penutupTemplates,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id:                   '',
        semester:                   raporSemester,
        tahun_ajaran:               raporTahunAjaran,
        guru_kelas:                 guruNama,
        penutup_umum:               '',
        penutup_motivasi_orangtua:  '',
        penutup_penguatan_positif:  '',
        pertumbuhan: BULAN_SEMESTER[raporSemester]?.map((b) => ({
            bulan: b.bulan, berat_badan: '', tinggi_badan: '', lingkar_kepala: '',
        })) as PertumbuhanItem[],
        perkembangan: Object.keys(aspekList).map((aspek) => ({
            aspek, status: '', narasi: '',
        })) as PerkembanganItem[],
    });

    const selectedSiswa = siswaList.find((s) => String(s.id) === data.siswa_id);
    const kelasId = selectedSiswa?.kelas_id ? String(selectedSiswa.kelas_id) : null;

    const hasTemplate = kelasId ? !!perkembanganTemplates[kelasId] : false;

    const replacePlaceholders = (text: string): string =>
        text
            .replace(/{nama_anak}/g, selectedSiswa?.nama_panggilan ?? '')
            .replace(/{nama_lengkap}/g, selectedSiswa?.nama_lengkap ?? '');

    const getPerkembanganTemplate = (aspek: string): PerkembanganTemplate | null => {
        if (!kelasId || !perkembanganTemplates[kelasId]) return null;
        const list = perkembanganTemplates[kelasId];
        return Array.isArray(list) ? (list.find((t) => t.aspek === aspek) ?? null) : null;
    };

    const getPenutupTemplate = (kategori: string): string => {
        if (!kelasId || !penutupTemplates[kelasId]) return '';
        const list = penutupTemplates[kelasId];
        const item = Array.isArray(list) ? list.find((t) => t.kategori === kategori) : null;
        return replacePlaceholders(item?.narasi_template ?? '');
    };

    useEffect(() => {
        if (!data.siswa_id) return;
        setData((prev) => ({
            ...prev,
            penutup_umum:              getPenutupTemplate('penutup_umum'),
            penutup_motivasi_orangtua: getPenutupTemplate('motivasi_orangtua'),
            penutup_penguatan_positif: getPenutupTemplate('penguatan_positif'),
            perkembangan: prev.perkembangan.map((item) => ({ ...item, status: '', narasi: '' })),
        }));
    }, [data.siswa_id]);

    const updatePertumbuhan = (idx: number, field: keyof PertumbuhanItem, value: string) => {
        const updated = [...data.pertumbuhan];
        updated[idx] = { ...updated[idx], [field]: value };
        setData('pertumbuhan', updated);
    };

    const updatePerkembanganStatus = (idx: number, status: string) => {
        const aspek = data.perkembangan[idx].aspek;
        const template = getPerkembanganTemplate(aspek);
let narasi = data.perkembangan[idx].narasi;
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
        post('/guru/rapor');
    };

    const bulanList = BULAN_SEMESTER[data.semester] ?? BULAN_SEMESTER['1'];

    return (
        <>
            <Head title="Buat Rapor Digital" />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12" />

                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
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

                            {/* Periode dari admin — read-only */}
                            <div className="flex items-center gap-2 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3">
                                <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                                <p className="text-sm text-blue-700">
                                    Semester <span className="font-semibold">{raporSemester}</span>
                                    {' · '}
                                    TA <span className="font-semibold">{raporTahunAjaran}</span>
                                </p>
                            </div>

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
                                <p className="text-xs text-gray-500">
                                    {!data.siswa_id
                                        ? 'Pilih siswa terlebih dahulu'
                                        : hasTemplate
                                            ? 'Pilih status (BSB/BSH/MB/BB) → narasi otomatis terisi'
                                            : 'Template kelas ini belum diisi admin — isi narasi secara manual'}
                                </p>
                            </div>
                            {data.siswa_id && !hasTemplate && (
                                <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                                    ⚠️ Template narasi untuk kelas <span className="font-semibold">{selectedSiswa?.kelas?.nama_kelas}</span> belum diisi. Hubungi admin untuk mengisi template di menu <span className="font-semibold">Template Rapor</span>.
                                </div>
                            )}
                            <div className="space-y-3">
                                {data.perkembangan.map((item, idx) => {
                                    const template = getPerkembanganTemplate(item.aspek);
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

                        {/* Section C: Penutup */}
                        <div className="shadow-lg rounded-3xl bg-white p-5 space-y-3">
                            <div>
                                <h2 className="font-bold text-gray-800">C. Narasi Emosional</h2>
                                <p className="text-xs text-gray-500">Auto-terisi dari template kelas. Bisa diedit.</p>
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
