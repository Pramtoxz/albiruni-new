import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import Swal from 'sweetalert2';

interface Kelas {
    id: number;
    nama_kelas: string;
    spp: string;
}

interface User {
    name: string;
    email: string;
    nohp: string;
}

interface Siswa {
    id: number;
    nama_lengkap: string;
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
    bukti_bayar: string | null;
    status_bayar: 'pending' | 'menunggu_verifikasi' | 'diterima' | 'ditolak';
    catatan_admin: string | null;
    siswa: Siswa;
    kelas: Kelas;
}

interface Props {
    pembayaran: Pembayaran;
}

export default function PembayaranShow({ pembayaran }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pembayaran SPP', href: '/admin/pembayaran' },
        { title: 'Detail', href: `/admin/pembayaran/${pembayaran.id}` },
    ];

    const { data, setData, post, processing } = useForm({
        status_bayar: '' as 'diterima' | 'ditolak' | '',
        catatan_admin: pembayaran.catatan_admin || '',
    });

    const handleVerify = (status: 'diterima' | 'ditolak') => {
        Swal.fire({
            title: `${status === 'diterima' ? 'Terima' : 'Tolak'} Pembayaran?`,
            text: `Apakah Anda yakin ingin ${status === 'diterima' ? 'menerima' : 'menolak'} pembayaran ini?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/admin/pembayaran/${pembayaran.id}/verify`, {
                    status_bayar: status,
                    catatan_admin: data.catatan_admin,
                }, {
                    onSuccess: () => {
                        Swal.fire('Berhasil!', 'Status pembayaran berhasil diperbarui', 'success');
                    },
                });
            }
        });
    };

    const formatBulan = (bulan: string) => {
        const [year, month] = bulan.split('-');
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
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
            <Head title="Detail Pembayaran" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Detail Pembayaran SPP</h1>
                        <p className="text-muted-foreground">Verifikasi pembayaran siswa</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Info Siswa */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Siswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nama:</span>
                                <span className="font-medium">{pembayaran.siswa.nama_lengkap}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Orang Tua:</span>
                                <span className="font-medium">{pembayaran.siswa.user.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">No. HP:</span>
                                <span className="font-medium">{pembayaran.siswa.user.nohp}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kelas:</span>
                                <span className="font-medium">{pembayaran.kelas.nama_kelas}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Pembayaran */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Periode:</span>
                                <span className="font-medium">{formatBulan(pembayaran.bulan)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Biaya:</span>
                                <span className="font-semibold text-primary">{formatRupiah(pembayaran.biaya)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tanggal Bayar:</span>
                                <span className="font-medium">
                                    {pembayaran.tanggal_bayar
                                        ? new Date(pembayaran.tanggal_bayar).toLocaleDateString('id-ID')
                                        : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge
                                    variant={
                                        pembayaran.status_bayar === 'diterima'
                                            ? 'default'
                                            : pembayaran.status_bayar === 'ditolak'
                                                ? 'destructive'
                                                : 'secondary'
                                    }
                                >
                                    {pembayaran.status_bayar}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bukti Pembayaran */}
                {pembayaran.bukti_bayar && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Bukti Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={`/assets/images/bukti_bayar/${pembayaran.bukti_bayar}`}
                                alt="Bukti Pembayaran"
                                className="w-full max-w-md rounded-lg border"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Form Verifikasi */}
                {pembayaran.status_bayar === 'menunggu_verifikasi' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Verifikasi Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Catatan Admin (Opsional)</Label>
                                <Textarea
                                    value={data.catatan_admin}
                                    onChange={(e) => setData('catatan_admin', e.target.value)}
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => handleVerify('diterima')}
                                    disabled={processing}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Terima Pembayaran
                                </Button>
                                <Button
                                    onClick={() => handleVerify('ditolak')}
                                    disabled={processing}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Tolak Pembayaran
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Catatan Admin (jika sudah diverifikasi) */}
                {pembayaran.catatan_admin && pembayaran.status_bayar !== 'menunggu_verifikasi' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Catatan Admin</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{pembayaran.catatan_admin}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
