import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function DailyReportCreate() {
    const { data, setData, processing } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        kelas: '',
        tema: '',
        sub_tema: '',
        kegiatan_pembukaan: '',
        kegiatan_inti: '',
        kegiatan_penutup: '',
        catatan_khusus: '',
        foto_kegiatan: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post('/guru/daily-report', data);
    };

    return (
        <>
            <Head title="Buat Daily Report" />
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-6">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 bg-primary px-4 py-4 text-primary-foreground shadow-md">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary-foreground/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">Daily Report</h1>
                            <p className="text-sm opacity-90">Buat laporan kegiatan harian</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="mx-auto max-w-4xl space-y-4 p-4">
                    {/* Info Dasar */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">📋 Informasi Dasar</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="tanggal">Tanggal *</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kelas">Kelas *</Label>
                                <Select value={data.kelas} onValueChange={(value) => setData('kelas', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TK A">TK A</SelectItem>
                                        <SelectItem value="TK B">TK B</SelectItem>
                                        <SelectItem value="Kelompok Bermain">Kelompok Bermain</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tema">Tema Pembelajaran</Label>
                                <Input
                                    id="tema"
                                    value={data.tema}
                                    onChange={(e) => setData('tema', e.target.value)}
                                    placeholder="Contoh: Binatang"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sub_tema">Sub Tema</Label>
                                <Input
                                    id="sub_tema"
                                    value={data.sub_tema}
                                    onChange={(e) => setData('sub_tema', e.target.value)}
                                    placeholder="Contoh: Binatang Peliharaan"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kegiatan */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">📝 Kegiatan Pembelajaran</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="kegiatan_pembukaan">Kegiatan Pembukaan</Label>
                                <Textarea
                                    id="kegiatan_pembukaan"
                                    value={data.kegiatan_pembukaan}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('kegiatan_pembukaan', e.target.value)
                                    }
                                    placeholder="Contoh: Berdoa, bernyanyi, ice breaking..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kegiatan_inti">Kegiatan Inti *</Label>
                                <Textarea
                                    id="kegiatan_inti"
                                    value={data.kegiatan_inti}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('kegiatan_inti', e.target.value)
                                    }
                                    placeholder="Jelaskan kegiatan inti pembelajaran..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kegiatan_penutup">Kegiatan Penutup</Label>
                                <Textarea
                                    id="kegiatan_penutup"
                                    value={data.kegiatan_penutup}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('kegiatan_penutup', e.target.value)
                                    }
                                    placeholder="Contoh: Recalling, evaluasi, berdoa..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Catatan & Foto */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">📸 Catatan & Dokumentasi</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="catatan_khusus">Catatan Khusus</Label>
                                <Textarea
                                    id="catatan_khusus"
                                    value={data.catatan_khusus}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('catatan_khusus', e.target.value)
                                    }
                                    placeholder="Catatan penting atau kejadian khusus hari ini..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto_kegiatan">Foto Kegiatan</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="foto_kegiatan"
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={(e) => setData('foto_kegiatan', e.target.files?.[0] || null)}
                                        className="flex-1"
                                    />
                                    <Button type="button" size="icon" variant="outline">
                                        <Camera className="h-5 w-5" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Upload foto kegiatan pembelajaran (opsional)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="sticky bottom-0 bg-background/95 pt-4 pb-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <Button type="submit" className="h-12 w-full text-base" disabled={processing}>
                            <Save className="mr-2 h-5 w-5" />
                            {processing ? 'Menyimpan...' : 'Simpan Daily Report'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
