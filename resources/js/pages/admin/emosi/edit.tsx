import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import  ConfirmDialog  from '@/components/confirm-dialog';

interface Emosi {
    id: number;
    nama_emosi: string;
    deskripsi: string;
}

interface Props {
    emosi: Emosi;
}

export default function EmosiEdit({ emosi }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Emosi',
            href: '/admin/emosi',
        },
        {
            title: `Edit ${emosi.nama_emosi}`,
            href: `/admin/emosi/${emosi.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nama_emosi: emosi.nama_emosi,
        deskripsi: emosi.deskripsi,
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    };

    const confirmSubmit = () => {
        put(`/admin/emosi/${emosi.id}`, {
            onFinish: () => {
                setShowConfirmDialog(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${emosi.nama_emosi}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Emosi</h1>
                        <p className="text-muted-foreground">Perbarui data emosi</p>
                    </div>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama_emosi">
                                Nama Emosi <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nama_emosi"
                                value={data.nama_emosi}
                                onChange={(e) => setData('nama_emosi', e.target.value)}
                                placeholder="Contoh: Senang, Sedih, Marah"
                                required
                            />
                            {errors.nama_emosi && (
                                <p className="text-sm text-destructive">{errors.nama_emosi}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">
                                Deskripsi <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                placeholder="Deskripsi emosi"
                                rows={4}
                                required
                            />
                            {errors.deskripsi && (
                                <p className="text-sm text-destructive">{errors.deskripsi}</p>
                            )}
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
                description={`Apakah Anda yakin ingin mengupdate data <strong>"${data.nama_emosi}"</strong>?<br /><br />Pastikan semua perubahan sudah benar.`}
                confirmText="Ya, Update"
            />
        </AppLayout>
    );
}
