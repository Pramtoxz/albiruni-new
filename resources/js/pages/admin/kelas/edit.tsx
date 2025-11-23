import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';

interface Kelas {
    id: number;
    nama_kelas: string;
    kategori: 'anak' | 'bayi';
    deskripsi: string | null;
    spp: string;
}

interface Props {
    kelas: Kelas;
}

export default function KelasEdit({ kelas }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Kelas',
            href: '/admin/kelas',
        },
        {
            title: `Edit ${kelas.nama_kelas}`,
            href: `/admin/kelas/${kelas.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nama_kelas: kelas.nama_kelas,
        kategori: kelas.kategori,
        deskripsi: kelas.deskripsi || '',
        spp: kelas.spp,
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    };

    const confirmSubmit = () => {
        put(`/admin/kelas/${kelas.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${kelas.nama_kelas}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Kelas</h1>
                        <p className="text-muted-foreground">Perbarui data kelas</p>
                    </div>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama_kelas">
                                Nama Kelas <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nama_kelas"
                                value={data.nama_kelas}
                                onChange={(e) => setData('nama_kelas', e.target.value)}
                                placeholder="Contoh: Preschool, Toodler"
                                required
                            />
                            {errors.nama_kelas && (
                                <p className="text-sm text-destructive">{errors.nama_kelas}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="kategori">
                                Kategori <span className="text-destructive">*</span>
                            </Label>
                            <select
                                id="kategori"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value as 'anak' | 'bayi')}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="anak">Anak</option>
                                <option value="bayi">Bayi</option>
                            </select>
                            {errors.kategori && (
                                <p className="text-sm text-destructive">{errors.kategori}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Kategori menentukan menu makanan yang tersedia
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                placeholder="Deskripsi kelas (opsional)"
                                rows={3}
                            />
                            {errors.deskripsi && (
                                <p className="text-sm text-destructive">{errors.deskripsi}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="spp">
                                SPP (Rp) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="spp"
                                type="number"
                                inputMode="numeric"
                                value={data.spp}
                                onChange={(e) => setData('spp', e.target.value)}
                                placeholder="Contoh: 500000"
                                min="0"
                                step="1000"
                                required
                            />
                            {errors.spp && (
                                <p className="text-sm text-destructive">{errors.spp}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Masukkan nominal SPP dalam Rupiah
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </div>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={confirmSubmit}
                title="Konfirmasi Update Data"
                description={`Apakah Anda yakin ingin mengupdate kelas <strong>"${data.nama_kelas}"</strong>?<br /><br />Pastikan semua perubahan sudah benar.`}
                confirmText="Ya, Update"
            />
        </AppLayout>
    );
}
