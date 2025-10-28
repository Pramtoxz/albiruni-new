import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle2, CreditCard, Banknote, Pencil } from 'lucide-react';
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
    approvedSiswa: {
        data: Siswa[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function SiswaApproved({ approvedSiswa }: Props) {
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

    const getPaymentBadge = (jenisPembayaran?: 'transfer' | 'cash') => {
        if (jenisPembayaran === 'transfer') {
            return (
                <Badge variant="default" className="gap-1">
                    <CreditCard className="h-3 w-3" />
                    Transfer
                </Badge>
            );
        }
        if (jenisPembayaran === 'cash') {
            return (
                <Badge variant="secondary" className="gap-1">
                    <Banknote className="h-3 w-3" />
                    Cash
                </Badge>
            );
        }
        return <Badge variant="outline">-</Badge>;
    };

    return (
        <AppLayout>
            <Head title="Data Siswa" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Kelola Data Siswa</h1>
                        <p className="text-muted-foreground mt-1">
                            Daftar siswa yang sudah disetujui
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/siswa">
                            <Button variant="outline">Pendaftaran Baru</Button>
                        </Link>
                        <Badge variant="default" className="text-lg px-4 py-2">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            {approvedSiswa.data.length} Siswa
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
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Tanggal Lahir</TableHead>
                                <TableHead>Kontak Orang Tua</TableHead>
                                <TableHead>Jenis Pembayaran</TableHead>
                                <TableHead>Tanggal Disetujui</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {approvedSiswa.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8">
                                        <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                        <p className="mt-2 text-muted-foreground">
                                            Belum ada siswa yang disetujui
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                approvedSiswa.data.map((siswa) => (
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
                                        <TableCell>{siswa.jenis_kelamin}</TableCell>
                                        <TableCell>
                                            {siswa.kelas ? (
                                                <Badge variant="outline">{siswa.kelas.nama_kelas}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(siswa.tanggal_lahir)}
                                        </TableCell>
                                        <TableCell>{getContactInfo(siswa)}</TableCell>
                                        <TableCell>
                                            {getPaymentBadge(siswa.jenis_pembayaran)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(siswa.updated_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/siswa/${siswa.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/siswa/${siswa.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {approvedSiswa.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {approvedSiswa.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
