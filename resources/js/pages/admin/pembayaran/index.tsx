import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, CheckCircle, XCircle, Clock, AlertCircle, Filter } from 'lucide-react';
import Swal from 'sweetalert2';

interface Kelas {
    id: number;
    nama_kelas: string;
    spp: string;
}

interface User {
    name: string;
    email: string;
}

interface Siswa {
    id: number;
    nama_lengkap: string;
    lokasi_pendaftaran?: string;
    user: User;
}

interface Pembayaran {
    id: number;
    siswa_id: number;
    kelas_id: number;
    bulan: string;
    tahun: number;
    biaya: string;
    tanggal_bayar: string | null;
    metode_bayar: 'cash' | 'transfer' | null;
    bukti_bayar: string | null;
    status_bayar: 'pending' | 'menunggu_verifikasi' | 'diterima' | 'ditolak';
    catatan_admin: string | null;
    siswa: Siswa;
    kelas: Kelas;
}

interface Props {
    pembayaran: {
        data: Pembayaran[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        cabang?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pembayaran SPP', href: '/admin/pembayaran' },
];

export default function PembayaranIndex({ pembayaran, filters }: Props) {
    const handleFilterChange = (key: string, value: string) => {
        router.get('/admin/pembayaran', {
            ...filters,
            [key]: value || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleGenerate = () => {
        Swal.fire({
            title: 'Generate Tagihan SPP?',
            text: 'Ini akan membuat tagihan SPP bulan ini untuk semua siswa aktif',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Generate',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post('/admin/pembayaran/generate');
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary"><AlertCircle className="mr-1 h-3 w-3" />Belum Bayar</Badge>;
            case 'menunggu_verifikasi':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="mr-1 h-3 w-3" />Menunggu Verifikasi</Badge>;
            case 'diterima':
                return <Badge variant="default" className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Diterima</Badge>;
            case 'ditolak':
                return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Ditolak</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const formatBulan = (bulan: string) => {
        const [year, month] = bulan.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${months[parseInt(month) - 1]} ${year}`;
    };

    const formatRupiah = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseFloat(amount));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembayaran SPP" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Pembayaran SPP</h1>
                        <p className="text-muted-foreground">Kelola pembayaran SPP siswa</p>
                    </div>
                    <Button onClick={handleGenerate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Tagihan Bulan Ini
                    </Button>
                </div>

                {/* Filter Section */}
                <div className="rounded-lg border bg-card p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">Filter</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cabang</label>
                            <Select
                                value={filters.cabang || 'all'}
                                onValueChange={(value) => handleFilterChange('cabang', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Cabang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Cabang</SelectItem>
                                    <SelectItem value="Ulak Karang">Ulak Karang</SelectItem>
                                    <SelectItem value="Marapalam">Marapalam</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Belum Bayar</SelectItem>
                                    <SelectItem value="menunggu_verifikasi">Menunggu Verifikasi</SelectItem>
                                    <SelectItem value="diterima">Diterima</SelectItem>
                                    <SelectItem value="ditolak">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {(filters.cabang || filters.status) && (
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => router.get('/admin/pembayaran')}
                                    className="w-full"
                                >
                                    Reset Filter
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left font-semibold">Siswa</th>
                                    <th className="p-4 text-left font-semibold">Kelas</th>
                                    <th className="p-4 text-left font-semibold">Periode</th>
                                    <th className="p-4 text-left font-semibold">Biaya</th>
                                    <th className="p-4 text-left font-semibold">Tgl Bayar</th>
                                    <th className="p-4 text-left font-semibold">Metode</th>
                                    <th className="p-4 text-left font-semibold">Status</th>
                                    <th className="p-4 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pembayaran.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                            Belum ada data pembayaran
                                        </td>
                                    </tr>
                                ) : (
                                    pembayaran.data.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium">{item.siswa.nama_lengkap}</p>
                                                    <p className="text-xs text-muted-foreground">{item.siswa.user.name}</p>
                                                    {item.siswa.lokasi_pendaftaran && (
                                                        <Badge variant="outline" className="mt-1 text-xs">
                                                            {item.siswa.lokasi_pendaftaran}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">{item.kelas.nama_kelas}</td>
                                            <td className="p-4">{formatBulan(item.bulan)}</td>
                                            <td className="p-4 font-semibold text-primary">{formatRupiah(item.biaya)}</td>
                                            <td className="p-4">
                                                {item.tanggal_bayar
                                                    ? new Date(item.tanggal_bayar).toLocaleDateString('id-ID')
                                                    : '-'}
                                            </td>
                                            <td className="p-4">
                                                {item.metode_bayar === 'cash' ? (
                                                    <Badge variant="outline" className="bg-green-50">Cash</Badge>
                                                ) : item.metode_bayar === 'transfer' ? (
                                                    <Badge variant="outline" className="bg-blue-50">Transfer</Badge>
                                                ) : '-'}
                                            </td>
                                            <td className="p-4">{getStatusBadge(item.status_bayar)}</td>
                                            <td className="p-4">
                                                <div className="flex justify-center">
                                                    <Link href={`/admin/pembayaran/${item.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
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
