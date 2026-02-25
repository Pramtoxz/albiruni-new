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

interface DataItem {
    number: number;
    siswa_id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    kelas: string;
    cabang: string;
    status: 'ada_laporan' | 'hadir_tanpa_laporan' | 'tidak_hadir';
    daily_report: {
        id: number;
        tanggal: string;
        rating: number;
        is_final: boolean;
        created_by: string;
    } | null;
    kehadiran: {
        tanggal_hadir: string;
        jenis_interaksi: string;
    } | null;
}

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Summary {
    total: number;
    ada_laporan: number;
    hadir_tanpa_laporan: number;
    tidak_hadir: number;
}

interface Props {
    data: DataItem[];
    kelasList: Kelas[];
    filters: {
        tanggal: string;
        kelas_id?: number;
        cabang?: string;
        search?: string;
        status?: string;
    };
    summary: Summary;
}

export default function AdminDailyReportIndex({
    data,
    kelasList,
    filters,
    summary,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedKelas, setSelectedKelas] = useState(
        filters.kelas_id?.toString() || 'all',
    );
    const [selectedCabang, setSelectedCabang] = useState(filters.cabang || 'all');
    const [selectedDate, setSelectedDate] = useState(filters.tanggal);
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

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
                cabang: selectedCabang === 'all' ? undefined : selectedCabang,
                search: search || undefined,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
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
        setSelectedCabang('all');
        setSelectedStatus('all');
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
                    <div className="mb-4 grid grid-cols-4 gap-4">
                        <div className="rounded-lg bg-blue-50 p-4">
                            <div className="text-sm text-blue-600">Total Siswa</div>
                            <div className="text-2xl font-bold text-blue-700">{summary.total}</div>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4">
                            <div className="text-sm text-green-600">Ada Laporan</div>
                            <div className="text-2xl font-bold text-green-700">{summary.ada_laporan}</div>
                        </div>
                        <div className="rounded-lg bg-yellow-50 p-4">
                            <div className="text-sm text-yellow-600">Hadir Tanpa Laporan</div>
                            <div className="text-2xl font-bold text-yellow-700">{summary.hadir_tanpa_laporan}</div>
                        </div>
                        <div className="rounded-lg bg-red-50 p-4">
                            <div className="text-sm text-red-600">Tidak Hadir</div>
                            <div className="text-2xl font-bold text-red-700">{summary.tidak_hadir}</div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
                                Cabang
                            </label>
                            <Select
                                value={selectedCabang}
                                onValueChange={setSelectedCabang}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Cabang</SelectItem>
                                    <SelectItem value="Ulak Karang">Ulak Karang</SelectItem>
                                    <SelectItem value="Marapalam">Marapalam</SelectItem>
                                </SelectContent>
                            </Select>
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

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Status
                            </label>
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="ada_laporan">Ada Laporan</SelectItem>
                                    <SelectItem value="hadir_tanpa_laporan">Hadir Tanpa Laporan</SelectItem>
                                    <SelectItem value="tidak_hadir">Tidak Hadir</SelectItem>
                                </SelectContent>
                            </Select>
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
                                    <TableHead className="w-16">No</TableHead>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Cabang</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Status Kirim</TableHead>
                                    <TableHead>Dibuat Oleh</TableHead>
                                    <TableHead className="text-center">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="p-8 text-center text-muted-foreground"
                                        >
                                            Tidak ada data siswa
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item) => (
                                        <TableRow
                                            key={item.siswa_id}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                {item.number}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {item.nama_lengkap}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.nama_panggilan}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.kelas}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.cabang}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {item.status === 'ada_laporan' && (
                                                    <Badge variant="default" className="bg-green-600">
                                                        Ada Laporan
                                                    </Badge>
                                                )}
                                                {item.status === 'hadir_tanpa_laporan' && (
                                                    <Badge variant="default" className="bg-yellow-600">
                                                        Hadir Tanpa Laporan
                                                    </Badge>
                                                )}
                                                {item.status === 'tidak_hadir' && (
                                                    <Badge variant="destructive">
                                                        Tidak Hadir
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.kehadiran ? (
                                                    <div className="text-sm">
                                                        <div className="font-medium">{item.kehadiran.tanggal_hadir}</div>
                                                        <div className="text-muted-foreground capitalize">
                                                            {item.kehadiran.jenis_interaksi}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.daily_report ? (
                                                    item.daily_report.is_final ? (
                                                        <Badge variant="default">Terkirim</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Draft</Badge>
                                                    )
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.daily_report?.created_by || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center">
                                                    {item.daily_report ? (
                                                        <Link
                                                            href={`/admin/daily-report/${item.daily_report.id}`}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            Tidak ada laporan
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
