import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/confirm-dialog';
import { useState } from 'react';

interface Kelas {
    id: number;
    nama_kelas: string;
    deskripsi: string | null;
    spp: string;
}

interface Props {
    kelas: Kelas[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kelas',
        href: '/admin/kelas',
    },
];

export default function KelasIndex({ kelas }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        id: number | null;
        nama: string;
    }>({
        open: false,
        id: null,
        nama: '',
    });

    const handleDelete = () => {
        if (deleteDialog.id) {
            router.delete(`/admin/kelas/${deleteDialog.id}`, {
                onSuccess: () => {
                    setDeleteDialog({ open: false, id: null, nama: '' });
                },
            });
        }
    };

    const formatRupiah = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseFloat(amount));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kelas" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Kelas</h1>
                        <p className="text-muted-foreground">Kelola data kelas dan SPP</p>
                    </div>
                    <Link href="/admin/kelas/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kelas
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left font-semibold">No</th>
                                    <th className="p-4 text-left font-semibold">Nama Kelas</th>
                                    <th className="p-4 text-left font-semibold">Deskripsi</th>
                                    <th className="p-4 text-left font-semibold">SPP</th>
                                    <th className="p-4 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kelas.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            Belum ada data kelas
                                        </td>
                                    </tr>
                                ) : (
                                    kelas.map((item, index) => (
                                        <tr key={item.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">{index + 1}</td>
                                            <td className="p-4 font-medium">{item.nama_kelas}</td>
                                            <td className="p-4 text-muted-foreground">
                                                {item.deskripsi || '-'}
                                            </td>
                                            <td className="p-4 font-semibold text-primary">
                                                {formatRupiah(item.spp)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/admin/kelas/${item.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setDeleteDialog({ open: true, id: item.id, nama: item.nama_kelas })}
                                                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
                description={`Apakah Anda yakin ingin menghapus kelas <strong>"${deleteDialog.nama}"</strong>?<br /><br />Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                variant="destructive"
            />
        </AppLayout>
    );
}
