import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, UserCog } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Guru {
    id: number;
    nip: string | null;
    nama_lengkap: string;
    jenis_kelamin: string | null;
    pendidikan_terakhir: string | null;
    foto_guru: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        nohp: string;
    };
    kelas: {
        id: number;
        nama_kelas: string;
    } | null;
}

interface Props {
    gurus: {
        data: Guru[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function GuruIndex({ gurus }: Props) {
    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data guru "${nama}"?`)) {
            router.delete(`/admin/guru/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Data Guru" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Data Guru</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola data guru dan penugasan kelas
                        </p>
                    </div>
                    <Link href="/admin/guru/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Guru
                        </Button>
                    </Link>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Guru</TableHead>
                                    <TableHead>NIP</TableHead>
                                    <TableHead>Kontak</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Pendidikan</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {gurus.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <UserCog className="h-12 w-12 text-muted-foreground" />
                                                <p className="text-muted-foreground">
                                                    Belum ada data guru
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    gurus.data.map((guru) => (
                                        <TableRow key={guru.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        {guru.foto_guru ? (
                                                            <AvatarImage
                                                                src={`/assets/images/foto_guru/${guru.foto_guru}`}
                                                                alt={guru.nama_lengkap}
                                                            />
                                                        ) : null}
                                                        <AvatarFallback>
                                                            {guru.nama_lengkap.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{guru.nama_lengkap}</p>
                                                        {guru.jenis_kelamin && (
                                                            <p className="text-sm text-muted-foreground">
                                                                {guru.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {guru.nip || (
                                                    <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p>{guru.user.email}</p>
                                                    <p className="text-muted-foreground">{guru.user.nohp}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {guru.kelas ? (
                                                    <Badge variant="secondary">
                                                        {guru.kelas.nama_kelas}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">
                                                        Belum ditugaskan
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {guru.pendidikan_terakhir || (
                                                    <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/guru/${guru.id}/edit`}>
                                                        <Button variant="ghost" size="sm" title="Edit">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(guru.id, guru.nama_lengkap)
                                                        }
                                                        title="Hapus"
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
