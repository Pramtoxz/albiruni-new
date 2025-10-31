import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Copy, Calendar, CheckCircle2, Circle, Eye } from 'lucide-react';
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

interface RencanaPembelajaran {
    id: number;
    nama_rencana: string;
    tema: string;
    sub_tema: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_active: boolean;
    kelas: {
        id: number;
        nama_kelas: string;
    };
    creator: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface Props {
    rencanaPembelajaran: {
        data: RencanaPembelajaran[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function RencanaPembelajaranIndex({ rencanaPembelajaran }: Props) {
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus rencana "${nama}"?`)) {
            router.delete(`/admin/rencana-pembelajaran/${id}`);
        }
    };

    const handleCopy = (id: number) => {
        router.post(`/admin/rencana-pembelajaran/${id}/copy`);
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/rencana-pembelajaran/${id}/toggle-active`);
    };

    return (
        <AppLayout>
            <Head title="Rencana Pembelajaran" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Rencana Pembelajaran</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola rencana pembelajaran mingguan untuk setiap kelas
                        </p>
                    </div>
                    <Link href="/admin/rencana-pembelajaran/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Rencana Pembelajaran
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
                                    <TableHead>Nama Rencana</TableHead>
                                    <TableHead>Tema</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Dibuat Oleh</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rencanaPembelajaran.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <p className="text-muted-foreground">
                                                Belum ada rencana pembelajaran
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rencanaPembelajaran.data.map((rencana) => (
                                        <TableRow key={rencana.id}>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleActive(rencana.id)}
                                                    className="p-0 h-auto"
                                                >
                                                    {rencana.is_active ? (
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
                                                {rencana.nama_rencana}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{rencana.tema}</div>
                                                    {rencana.sub_tema && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {rencana.sub_tema}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {rencana.kelas.nama_kelas}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {format(new Date(rencana.tanggal_mulai), 'dd MMM yyyy', { locale: id })}
                                                        {' - '}
                                                        {format(new Date(rencana.tanggal_selesai), 'dd MMM yyyy', { locale: id })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{rencana.creator.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCopy(rencana.id)}
                                                        title="Copy rencana"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Link href={`/admin/rencana-pembelajaran/${rencana.id}/edit`}>
                                                        <Button variant="ghost" size="sm" title="Edit rencana">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(rencana.id, rencana.nama_rencana)
                                                        }
                                                        title="Hapus rencana"
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
