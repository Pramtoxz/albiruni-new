import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, BookOpen } from 'lucide-react';
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
    message?: string;
}

export default function GuruRencanaPembelajaranIndex({ rencanaPembelajaran, message }: Props) {
    return (
        <AppLayout>
            <Head title="Rencana Pembelajaran" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Rencana Pembelajaran</h1>
                        <p className="text-muted-foreground mt-1">
                            Lihat rencana pembelajaran untuk kelas Anda
                        </p>
                    </div>
                </div>

                {message && (
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-center text-muted-foreground">{message}</p>
                        </CardContent>
                    </Card>
                )}

                {!message && (
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
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rencanaPembelajaran.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <p className="text-muted-foreground">
                                                    Belum ada rencana pembelajaran
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rencanaPembelajaran.data.map((rencana) => (
                                            <TableRow key={rencana.id}>
                                                <TableCell>
                                                    {rencana.is_active ? (
                                                        <Badge variant="default">Aktif</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Tidak Aktif</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {rencana.nama_rencana}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4" />
                                                            {rencana.tema}
                                                        </div>
                                                        {rencana.sub_tema && (
                                                            <div className="text-sm text-muted-foreground ml-6">
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
                                                <TableCell className="text-right">
                                                    <Link href={`/guru/rencana-pembelajaran/${rencana.id}`}>
                                                        <Button variant="ghost" size="sm" title="Lihat detail">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Lihat Detail
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
