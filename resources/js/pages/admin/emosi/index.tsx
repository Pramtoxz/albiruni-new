import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface Emosi {
    id: number;
    nama_emosi: string;
    deskripsi: string;
}

interface Props {
    emosis: Emosi[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Emosi',
        href: '/admin/emosi',
    },
];

export default function EmosiIndex({ emosis }: Props) {
    const handleDelete = (id: number, namaEmosi: string) => {
        Swal.fire({
            title: 'Hapus Emosi?',
            text: `Apakah Anda yakin ingin menghapus emosi "${namaEmosi}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/emosi/${id}`, {
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Emosi berhasil dihapus.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus emosi.', 'error');
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Emosi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Emosi</h1>
                        <p className="text-muted-foreground">Kelola data emosi siswa</p>
                    </div>
                    <Link href="/admin/emosi/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Emosi
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left font-semibold">No</th>
                                    <th className="p-4 text-left font-semibold">Nama Emosi</th>
                                    <th className="p-4 text-left font-semibold">Deskripsi</th>
                                    <th className="p-4 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emosis.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                            Belum ada data emosi
                                        </td>
                                    </tr>
                                ) : (
                                    emosis.map((item, index) => (
                                        <tr key={item.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">{index + 1}</td>
                                            <td className="p-4 font-medium">{item.nama_emosi}</td>
                                            <td className="p-4 text-muted-foreground">
                                                {item.deskripsi}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/admin/emosi/${item.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id, item.nama_emosi)}
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
        </AppLayout>
    );
}
