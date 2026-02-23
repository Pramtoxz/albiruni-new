import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEventHandler, useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';

export default function CreateEvent() {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image: null as File | null,
        start_date: '',
        end_date: '',
        is_active: true,
        priority: 1,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    };

    const confirmSubmit = () => {
        post('/admin/events');
        setShowConfirmDialog(false);
    };

    return (
        <AppLayout>
            <Head title="Tambah Event" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Tambah Event Baru</h1>
                    <p className="text-muted-foreground mt-1">Buat event atau pengumuman baru untuk orang tua</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={5}
                                    required
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Gambar</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('image', file);
                                    }}
                                />
                                {data.image && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(data.image)}
                                            alt="Preview"
                                            className="h-32 w-auto rounded border"
                                        />
                                    </div>
                                )}
                                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Tanggal Mulai *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Tanggal Selesai *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Urutan Tampil</Label>
                                <Input
                                    id="priority"
                                    type="number"
                                    min="1"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', parseInt(e.target.value))}
                                />
                                <p className="text-sm text-muted-foreground">
                                    1 = tampil pertama, 2 = kedua, dst
                                </p>
                                {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Aktifkan Event
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Event'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                onConfirm={confirmSubmit}
                title="Konfirmasi Simpan Data"
                description={`Apakah Anda yakin ingin menyimpan event <strong>"${data.title}"</strong>?<br /><br />Pastikan semua data yang diisi sudah benar.`}
                confirmText="Ya, Simpan"
            />
        </AppLayout>
    );
}
