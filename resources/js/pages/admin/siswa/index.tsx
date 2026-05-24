import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Eye, UserCheck, Clock } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Siswa } from '@/types';

interface Props {
    pendingSiswa: {
        data: Siswa[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function SiswaIndex({ pendingSiswa }: Props) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getContactInfo = (siswa: Siswa) => {
        return siswa.ayah_no_hp || siswa.ibu_no_hp || '-';
    };

    return (
        <AppLayout>
            <Head title="Pendaftaran Siswa Baru" />

            <div className="space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Pendaftaran Siswa Baru</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola persetujuan pendaftaran siswa baru
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/siswa/create">
                            <Button>Tambah Siswa</Button>
                        </Link>
                        <Link href="/admin/siswa/approved/list">
                            <Button variant="outline">Data Siswa</Button>
                        </Link>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            <Clock className="mr-2 h-5 w-5" />
                            {pendingSiswa.data.length} Menunggu
                        </Badge>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Tanggal Daftar</TableHead>
                                <TableHead>Kontak Orang Tua</TableHead>
                                <TableHead>Lokasi</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingSiswa.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                        <p className="mt-2 text-muted-foreground">
                                            Tidak ada pendaftaran yang menunggu persetujuan
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingSiswa.data.map((siswa) => (
                                    <TableRow key={siswa.id}>
                                        <TableCell>
                                            {siswa.foto_siswa ? (
                                                <img
                                                    src={`/assets/images/foto_siswa/${siswa.foto_siswa}`}
                                                    alt={siswa.nama_lengkap}
                                                    className="w-12 h-12 object-cover rounded-full border-2 border-border"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold">
                                                    {siswa.nama_lengkap.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {siswa.nama_lengkap}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(siswa.tanggal_pendaftaran)}
                                        </TableCell>
                                        <TableCell>{getContactInfo(siswa)}</TableCell>
                                        <TableCell>
                                            {siswa.lokasi_pendaftaran || '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/siswa/${siswa.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {pendingSiswa.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {pendingSiswa.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        window.location.href = link.url;
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
