import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    kelas?: {
        id: number;
        nama_kelas: string;
    };
}

interface DailyReport {
    id: number;
    tanggal: string;
    mood: string;
    is_final: boolean;
    siswa: Siswa;
    user: {
        name: string;
    };
}

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Props {
    reports: {
        data: DailyReport[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    kelasList: Kelas[];
    filters: {
        tanggal: string;
        kelas_id?: number;
        search?: string;
    };
}

export default function AdminDailyReportIndex({
    reports,
    kelasList,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedKelas, setSelectedKelas] = useState(
        filters.kelas_id?.toString() || 'all',
    );
    const [selectedDate, setSelectedDate] = useState(filters.tanggal);

    const months = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const handleFilter = () => {
        router.get(
            '/admin/daily-report',
            {
                tanggal: selectedDate,
                kelas_id: selectedKelas === 'all' ? undefined : selectedKelas,
                search: search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReset = () => {
        setSearch('');
        setSelectedKelas('all');
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        router.get('/admin/daily-report');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Daily Report" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Daily Report</h1>
                        <p className="text-muted-foreground">
                            Pantau laporan harian siswa
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Tanggal
                            </label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Kelas
                            </label>
                            <Select
                                value={selectedKelas}
                                onValueChange={setSelectedKelas}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kelas
                                    </SelectItem>
                                    {kelasList.map((kelas) => (
                                        <SelectItem
                                            key={kelas.id}
                                            value={kelas.id.toString()}
                                        >
                                            {kelas.nama_kelas}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Cari Siswa
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Nama siswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleFilter();
                                        }
                                    }}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="flex items-end gap-2">
                            <Button onClick={handleFilter} className="flex-1">
                                Terapkan
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="flex-1"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Siswa</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Mood</TableHead>
                                    <TableHead>Dibuat Oleh</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="p-8 text-center text-muted-foreground"
                                        >
                                            Tidak ada data daily report
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.data.map((report) => (
                                        <TableRow
                                            key={report.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell>
                                                {formatDate(report.tanggal)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {
                                                            report.siswa
                                                                .nama_lengkap
                                                        }
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {
                                                            report.siswa
                                                                .nama_panggilan
                                                        }
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {report.siswa.kelas
                                                    ?.nama_kelas || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {report.mood || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {report.user.name}
                                            </TableCell>
                                            <TableCell>
                                                {report.is_final ? (
                                                    <Badge variant="default">
                                                        Terkirim
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        Draft
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center">
                                                    <Link
                                                        href={`/admin/daily-report/${report.id}`}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Eye className="h-4 w-4" />
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

                    {reports.last_page > 1 && (
                        <div className="flex justify-center gap-2 border-t p-4">
                            {reports.links.map((link, index) => (
                                <Button
                                    key={index}
                                    size="sm"
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    disabled={!link.url}
                                    onClick={() => {
                                        if (link.url) {
                                            router.get(link.url);
                                        }
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
