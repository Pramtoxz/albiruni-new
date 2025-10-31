import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];

const HARI_LABELS: Record<string, string> = {
    senin: 'Senin',
    selasa: 'Selasa',
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jumat',
};

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface KegiatanHarian {
    id: number;
    hari: string;
    tanggal: string;
    nama_aktivitas: string;
    deskripsi: string;
    target_perkembangan: string;
    alat_bahan: string;
    instruksi: string;
    foto_kegiatan: string | null;
    video_url: string | null;
    file_materi: string | null;
}

interface RencanaPembelajaran {
    id: number;
    nama_rencana: string;
    tema: string;
    sub_tema: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    kelas_id: number;
    is_active: boolean;
    kegiatan_harian: KegiatanHarian[];
}

interface Props {
    rencanaPembelajaran: RencanaPembelajaran;
    kelas: Kelas[];
}

export default function RencanaPembelajaranEdit({ rencanaPembelajaran, kelas }: Props) {
    // Initialize kegiatan for all days
    const initialKegiatan = HARI.map((hari) => {
        const existing = rencanaPembelajaran.kegiatan_harian.find((k) => k.hari === hari);
        if (existing) {
            // Format tanggal untuk input type="date" (YYYY-MM-DD)
            const formattedTanggal = existing.tanggal ?
                (typeof existing.tanggal === 'string' ? existing.tanggal.split('T')[0] : existing.tanggal) : '';

            return {
                hari: existing.hari,
                tanggal: formattedTanggal,
                nama_aktivitas: existing.nama_aktivitas,
                deskripsi: existing.deskripsi,
                target_perkembangan: existing.target_perkembangan,
                alat_bahan: existing.alat_bahan,
                instruksi: existing.instruksi,
                foto_kegiatan: null,
                video_url: existing.video_url || '',
                file_materi: null,
            };
        }
        return {
            hari,
            tanggal: '',
            nama_aktivitas: '',
            deskripsi: '',
            target_perkembangan: '',
            alat_bahan: '',
            instruksi: '',
            foto_kegiatan: null,
            video_url: '',
            file_materi: null,
        };
    });

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nama_rencana: rencanaPembelajaran.nama_rencana,
        tema: rencanaPembelajaran.tema,
        sub_tema: rencanaPembelajaran.sub_tema || '',
        tanggal_mulai: typeof rencanaPembelajaran.tanggal_mulai === 'string'
            ? rencanaPembelajaran.tanggal_mulai.split('T')[0]
            : rencanaPembelajaran.tanggal_mulai,
        tanggal_selesai: typeof rencanaPembelajaran.tanggal_selesai === 'string'
            ? rencanaPembelajaran.tanggal_selesai.split('T')[0]
            : rencanaPembelajaran.tanggal_selesai,
        kelas_id: rencanaPembelajaran.kelas_id.toString(),
        is_active: rencanaPembelajaran.is_active,
        kegiatan_harian: initialKegiatan as Array<{
            hari: string;
            tanggal: string;
            nama_aktivitas: string;
            deskripsi: string;
            target_perkembangan: string;
            alat_bahan: string;
            instruksi: string;
            foto_kegiatan: File | null;
            video_url: string;
            file_materi: File | null;
        }>,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/rencana-pembelajaran/${rencanaPembelajaran.id}`);
    };

    // Auto-fill tanggal harian berdasarkan tanggal_mulai
    const handleTanggalMulaiChange = (value: string) => {
        setData('tanggal_mulai', value);

        if (value) {
            const startDate = new Date(value);
            const newKegiatan = [...data.kegiatan_harian];

            HARI.forEach((hari, index) => {
                const kegiatanIndex = newKegiatan.findIndex((k) => k.hari === hari);
                const tanggalHari = new Date(startDate);
                tanggalHari.setDate(startDate.getDate() + index);
                const formattedDate = tanggalHari.toISOString().split('T')[0];

                if (kegiatanIndex >= 0) {
                    newKegiatan[kegiatanIndex].tanggal = formattedDate;
                }
            });

            setData('kegiatan_harian', newKegiatan);

            // Auto-set tanggal_selesai (Jumat)
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 4);
            setData('tanggal_selesai', endDate.toISOString().split('T')[0]);
        }
    };

    const updateKegiatan = (hari: string, field: string, value: any) => {
        const newKegiatan = [...data.kegiatan_harian];
        const index = newKegiatan.findIndex((k) => k.hari === hari);

        if (index >= 0) {
            newKegiatan[index] = { ...newKegiatan[index], [field]: value };
            setData('kegiatan_harian', newKegiatan);
        }
    };

    const getKegiatanValue = (hari: string, field: string) => {
        const kegiatan = data.kegiatan_harian.find((k) => k.hari === hari);
        return kegiatan ? kegiatan[field as keyof typeof kegiatan] : '';
    };

    return (
        <AppLayout>
            <Head title={`Edit - ${rencanaPembelajaran.nama_rencana}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/rencana-pembelajaran">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Rencana Pembelajaran</h1>
                        <p className="text-muted-foreground mt-1">
                            Update rencana pembelajaran
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Info Dasar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_rencana">Nama Rencana *</Label>
                                    <Input
                                        id="nama_rencana"
                                        value={data.nama_rencana}
                                        onChange={(e) => setData('nama_rencana', e.target.value)}
                                        placeholder="Rencana Minggu 1"
                                        required
                                    />
                                    {errors.nama_rencana && (
                                        <p className="text-sm text-destructive">{errors.nama_rencana}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kelas_id">Kelas *</Label>
                                    <Select
                                        value={data.kelas_id}
                                        onValueChange={(value) => setData('kelas_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelas.map((k) => (
                                                <SelectItem key={k.id} value={k.id.toString()}>
                                                    {k.nama_kelas}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas_id && (
                                        <p className="text-sm text-destructive">{errors.kelas_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tema">Tema *</Label>
                                    <Input
                                        id="tema"
                                        value={data.tema}
                                        onChange={(e) => setData('tema', e.target.value)}
                                        placeholder="Profesi"
                                        required
                                    />
                                    {errors.tema && (
                                        <p className="text-sm text-destructive">{errors.tema}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sub_tema">Sub Tema</Label>
                                    <Input
                                        id="sub_tema"
                                        value={data.sub_tema}
                                        onChange={(e) => setData('sub_tema', e.target.value)}
                                        placeholder="Dokter dan Perawat"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai (Senin) *</Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => handleTanggalMulaiChange(e.target.value)}
                                        required
                                    />
                                    {errors.tanggal_mulai && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_mulai}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Tanggal harian akan otomatis terisi
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">Tanggal Selesai (Jumat) *</Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal_selesai && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_selesai}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked as boolean)
                                    }
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Set sebagai rencana aktif untuk kelas ini
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kegiatan Harian */}
                    {HARI.map((hari) => (
                        <Card key={hari}>
                            <CardHeader>
                                <CardTitle>{HARI_LABELS[hari]}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Tanggal</Label>
                                        <Input
                                            type="date"
                                            value={getKegiatanValue(hari, 'tanggal') as string}
                                            onChange={(e) =>
                                                updateKegiatan(hari, 'tanggal', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Nama Aktivitas</Label>
                                        <Input
                                            value={getKegiatanValue(hari, 'nama_aktivitas') as string}
                                            onChange={(e) =>
                                                updateKegiatan(hari, 'nama_aktivitas', e.target.value)
                                            }
                                            placeholder="Image Mimic Activity"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Deskripsi</Label>
                                    <Textarea
                                        value={getKegiatanValue(hari, 'deskripsi') as string}
                                        onChange={(e) =>
                                            updateKegiatan(hari, 'deskripsi', e.target.value)
                                        }
                                        placeholder="Deskripsi kegiatan..."
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Target Perkembangan</Label>
                                    <Textarea
                                        value={getKegiatanValue(hari, 'target_perkembangan') as string}
                                        onChange={(e) =>
                                            updateKegiatan(hari, 'target_perkembangan', e.target.value)
                                        }
                                        placeholder="Aspek kognitif anak..."
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Alat dan Bahan</Label>
                                    <Textarea
                                        value={getKegiatanValue(hari, 'alat_bahan') as string}
                                        onChange={(e) =>
                                            updateKegiatan(hari, 'alat_bahan', e.target.value)
                                        }
                                        placeholder="Worksheet, kertas origami..."
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Instruksi</Label>
                                    <Textarea
                                        value={getKegiatanValue(hari, 'instruksi') as string}
                                        onChange={(e) =>
                                            updateKegiatan(hari, 'instruksi', e.target.value)
                                        }
                                        placeholder="Mengajak anak untuk..."
                                        rows={3}
                                    />
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3 text-sm text-muted-foreground">
                                        Opsional
                                    </h4>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Foto Kegiatan</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    updateKegiatan(
                                                        hari,
                                                        'foto_kegiatan',
                                                        e.target.files?.[0] || null
                                                    )
                                                }
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Opsional - untuk ilustrasi kegiatan
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Link Video YouTube</Label>
                                            <Input
                                                value={getKegiatanValue(hari, 'video_url') as string}
                                                onChange={(e) =>
                                                    updateKegiatan(hari, 'video_url', e.target.value)
                                                }
                                                placeholder="https://youtu.be/..."
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Opsional - link video pembelajaran
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>File Materi</Label>
                                            <Input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) =>
                                                    updateKegiatan(
                                                        hari,
                                                        'file_materi',
                                                        e.target.files?.[0] || null
                                                    )
                                                }
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Opsional - PDF/DOC untuk guru
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/rencana-pembelajaran">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update Rencana Pembelajaran'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
