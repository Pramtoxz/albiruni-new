import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Upload, Save } from 'lucide-react';
import { useRef, useState, useEffect, FormEventHandler } from 'react';
import Swal from 'sweetalert2';

interface Kelas { id: number; nama_kelas: string; kategori: string }

interface PerkembanganTemplate {
    kelas_id: number; aspek: string; indikator: string | null;
    contoh_narasi: string | null; narasi_bsb: string | null;
    narasi_bsh: string | null; narasi_mb: string | null; narasi_bb: string | null;
}

interface PenutupTemplate {
    kelas_id: number; kategori: string; narasi_template: string | null;
}

interface Props {
    kelas: Kelas;
    aspekList: Record<string, string>;
    perkembanganTemplates: Record<string, PerkembanganTemplate>;
    penutupTemplates: Record<string, PenutupTemplate>;
    kategoriLabels: Record<string, string>;
}

type PerkembanganForm = {
    aspek: string;
    indikator: string;
    contoh_narasi: string;
    narasi_bsb: string;
    narasi_bsh: string;
    narasi_mb: string;
    narasi_bb: string;
};

type PenutupForm = { kategori: string; narasi_template: string };

export default function AdminTemplateRaporEdit({
    kelas, aspekList, perkembanganTemplates, penutupTemplates, kategoriLabels,
}: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const [perkembangan, setPerkembangan] = useState<PerkembanganForm[]>(
        Object.keys(aspekList).map((aspek) => {
            const t = perkembanganTemplates[aspek];
            return {
                aspek,
                indikator:     t?.indikator ?? '',
                contoh_narasi: t?.contoh_narasi ?? '',
                narasi_bsb:    t?.narasi_bsb ?? '',
                narasi_bsh:    t?.narasi_bsh ?? '',
                narasi_mb:     t?.narasi_mb ?? '',
                narasi_bb:     t?.narasi_bb ?? '',
            };
        })
    );

    const [penutup, setPenutup] = useState<PenutupForm[]>(
        Object.keys(kategoriLabels).map((kategori) => {
            const t = penutupTemplates[kategori];
            return { kategori, narasi_template: t?.narasi_template ?? '' };
        })
    );

    const [saving, setSaving] = useState(false);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({ icon: 'success', title: 'Berhasil', text: flash.success, timer: 2000, showConfirmButton: false });
        }
    }, [flash?.success]);

    const updatePerkembangan = (idx: number, field: keyof PerkembanganForm, value: string) => {
        const updated = [...perkembangan];
        updated[idx] = { ...updated[idx], [field]: value };
        setPerkembangan(updated);
    };

    const updatePenutup = (idx: number, value: string) => {
        const updated = [...penutup];
        updated[idx] = { ...updated[idx], narasi_template: value };
        setPenutup(updated);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put(`/admin/template-rapor/${kelas.id}`, { perkembangan, penutup }, {
            onFinish: () => setSaving(false),
        });
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);

        router.post(`/admin/template-rapor/${kelas.id}/import`, formData as any, {
            forceFormData: true,
            onFinish: () => {
                setImporting(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Template Rapor — ${kelas.nama_kelas}`} />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Template Rapor</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-muted-foreground text-sm">{kelas.nama_kelas}</p>
                                <Badge variant="outline" className="capitalize text-xs">{kelas.kategori}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <a href={`/admin/template-rapor/${kelas.id}/export`}>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Download className="h-4 w-4" /> Export Excel
                            </Button>
                        </a>
                        <Button variant="outline" size="sm" className="gap-1"
                            onClick={() => fileInputRef.current?.click()} disabled={importing}>
                            <Upload className="h-4 w-4" /> {importing ? 'Mengimport...' : 'Import Excel'}
                        </Button>
                        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section B */}
                    <div className="rounded-lg border bg-card">
                        <div className="border-b p-4">
                            <h2 className="font-semibold text-lg">Section B — Tumbuh Kembang Anak</h2>
                            <p className="text-muted-foreground text-sm mt-0.5">
                                Template narasi per aspek. Gunakan <code className="text-xs bg-muted px-1 rounded">{'{nama_anak}'}</code> sebagai placeholder nama panggilan.
                            </p>
                        </div>
                        <div className="divide-y">
                            {perkembangan.map((item, idx) => (
                                <div key={item.aspek} className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{aspekList[item.aspek]}</Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Indikator yang Diamati</Label>
                                            <Input value={item.indikator}
                                                onChange={(e) => updatePerkembangan(idx, 'indikator', e.target.value)}
                                                placeholder="Contoh: Hafalan doa, perilaku sopan" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Contoh Narasi Deskriptif</Label>
                                            <Input value={item.contoh_narasi}
                                                onChange={(e) => updatePerkembangan(idx, 'contoh_narasi', e.target.value)}
                                                placeholder="Narasi singkat contoh" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(['narasi_bsb', 'narasi_bsh', 'narasi_mb', 'narasi_bb'] as const).map((field) => {
                                            const labels: Record<string, string> = {
                                                narasi_bsb: 'BSB — Berkembang Sangat Baik',
                                                narasi_bsh: 'BSH — Berkembang Sesuai Harapan',
                                                narasi_mb:  'MB — Mulai Berkembang',
                                                narasi_bb:  'BB — Belum Berkembang',
                                            };
                                            return (
                                                <div key={field} className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground">{labels[field]}</Label>
                                                    <Textarea rows={3} value={item[field]}
                                                        onChange={(e) => updatePerkembangan(idx, field, e.target.value)}
                                                        placeholder={`Template narasi untuk status ${field.replace('narasi_', '').toUpperCase()}...`}
                                                        className="text-sm resize-none" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section C */}
                    <div className="rounded-lg border bg-card">
                        <div className="border-b p-4">
                            <h2 className="font-semibold text-lg">Section C — Narasi Emosional</h2>
                            <p className="text-muted-foreground text-sm mt-0.5">
                                Template teks penutup. Gunakan <code className="text-xs bg-muted px-1 rounded">{'{nama_anak}'}</code> sebagai placeholder.
                            </p>
                        </div>
                        <div className="divide-y">
                            {penutup.map((item, idx) => (
                                <div key={item.kategori} className="p-4 space-y-2">
                                    <Badge variant="secondary">{kategoriLabels[item.kategori]}</Badge>
                                    <Textarea rows={4} value={item.narasi_template}
                                        onChange={(e) => updatePenutup(idx, e.target.value)}
                                        placeholder={`Template narasi untuk ${kategoriLabels[item.kategori]}...`}
                                        className="text-sm resize-none" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving} className="gap-1">
                            <Save className="h-4 w-4" /> {saving ? 'Menyimpan...' : 'Simpan Template'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
