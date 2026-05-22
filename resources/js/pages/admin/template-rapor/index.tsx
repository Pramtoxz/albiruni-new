import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Edit } from 'lucide-react';

interface Kelas {
    id: number;
    nama_kelas: string;
    kategori: string;
    section_b_count: number;
    section_c_count: number;
}

interface Props {
    kelasList: Kelas[];
    aspekCount: number;
}

export default function AdminTemplateRaporIndex({ kelasList, aspekCount }: Props) {
    return (
        <AppLayout>
            <Head title="Template Rapor" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold">Template Rapor</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Kelola template narasi rapor per kelas (Section B & C)
                    </p>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Section B (Perkembangan)</TableHead>
                                <TableHead>Section C (Penutup)</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kelasList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Belum ada kelas
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kelasList.map((kelas) => (
                                    <TableRow key={kelas.id}>
                                        <TableCell className="font-medium">{kelas.nama_kelas}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">{kelas.kategori}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-sm font-medium ${kelas.section_b_count >= aspekCount ? 'text-green-600' : kelas.section_b_count > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                                                {kelas.section_b_count}/{aspekCount} aspek
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-sm font-medium ${kelas.section_c_count >= 3 ? 'text-green-600' : kelas.section_c_count > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                                                {kelas.section_c_count}/3 kategori
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/template-rapor/${kelas.id}`}>
                                                <Button variant="outline" size="sm" className="gap-1">
                                                    <Edit className="h-4 w-4" /> Edit Template
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
