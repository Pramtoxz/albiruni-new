import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Copy, Calendar, CheckCircle2, Circle, Printer } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface MenuMingguan {
    id: number;
    nama_menu: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_active: boolean;
    created_by: number;
    creator: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Props {
    menuMingguan: {
        data: MenuMingguan[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function MenuMingguanIndex({ menuMingguan }: Props) {
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus menu "${nama}"?`)) {
            router.delete(`/admin/menu-mingguan/${id}`);
        }
    };

    const handleCopy = (id: number) => {
        router.post(`/admin/menu-mingguan/${id}/copy`);
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/menu-mingguan/${id}/toggle-active`);
    };

    return (
        <AppLayout>
            <Head title="Menu Mingguan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Menu Mingguan</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola rencana menu per minggu untuk daycare
                        </p>
                    </div>
                    <Link href="/admin/menu-mingguan/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Menu Mingguan
                        </Button>
                    </Link>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Nama Menu</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Dibuat Oleh</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {menuMingguan.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <p className="text-muted-foreground">
                                                Belum ada menu mingguan
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    menuMingguan.data.map((menu) => (
                                        <TableRow key={menu.id}>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleActive(menu.id)}
                                                    className="p-0 h-auto"
                                                >
                                                    {menu.is_active ? (
                                                        <Badge variant="default" className="gap-1">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Aktif
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="gap-1">
                                                            <Circle className="h-3 w-3" />
                                                            Tidak Aktif
                                                        </Badge>
                                                    )}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {menu.nama_menu}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {format(new Date(menu.tanggal_mulai), 'dd MMM yyyy', { locale: id })}
                                                        {' - '}
                                                        {format(new Date(menu.tanggal_selesai), 'dd MMM yyyy', { locale: id })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{menu.creator.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <a
                                                        href={`/admin/menu-mingguan/${menu.id}/print`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            title="Cetak PDF untuk Koki"
                                                        >
                                                            <Printer className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCopy(menu.id)}
                                                        title="Copy menu"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Link href={`/admin/menu-mingguan/${menu.id}/edit`}>
                                                        <Button variant="ghost" size="sm" title="Edit menu">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(menu.id, menu.nama_menu)
                                                        }
                                                        title="Hapus menu"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
