import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Head, Link, useForm } from '@inertiajs/react';
import { Upload, CheckCircle, XCircle, Clock, AlertCircle, Eye, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import Swal from 'sweetalert2';

interface Kelas {
    id: number;
    nama_kelas: string;
    spp: string;
}

interface Siswa {
    id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    kelas?: Kelas;
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
    kelas: Kelas;
}

interface Props {
    siswa: Siswa;
    pembayaran: Pembayaran[];
}

export default function PembayaranIndex({ siswa, pembayaran }: Props) {
    const [selectedPembayaran, setSelectedPembayaran] = useState<Pembayaran | null>(null);
    const [viewBukti, setViewBukti] = useState<string | null>(null);
    const { data, setData, post, processing, reset } = useForm({
        bukti_bayar: null as File | null,
        tanggal_bayar: new Date().toISOString().split('T')[0],
    });

    const handleUpload: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedPembayaran) return;

        post(`/orangtua/pembayaran/${selectedPembayaran.id}/upload`, {
            onSuccess: () => {
                setSelectedPembayaran(null);
                reset();
                Swal.fire('Berhasil!', 'Bukti pembayaran berhasil diupload', 'success');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Belum Bayar
                    </Badge>
                );
            case 'menunggu_verifikasi':
                return (
                    <Badge variant="outline" className="border-yellow-500 bg-yellow-50 text-yellow-700">
                        <Clock className="mr-1 h-3 w-3" />
                        Menunggu Verifikasi
                    </Badge>
                );
            case 'diterima':
                return (
                    <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Lunas
                    </Badge>
                );
            case 'ditolak':
                return (
                    <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Ditolak
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
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

    // Hitung statistik
    const totalTagihan = pembayaran.filter(p => p.status_bayar === 'pending' || p.status_bayar === 'ditolak').length;
    const totalLunas = pembayaran.filter(p => p.status_bayar === 'diterima').length;
    const totalMenunggu = pembayaran.filter(p => p.status_bayar === 'menunggu_verifikasi').length;

    return (
        <>
            <Head title="Pembayaran SPP" />
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-background pb-safe pb-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 pb-8 pt-safe-top pt-6 text-white">
                    <div className="mb-4 flex items-center gap-3">
                        <Link href="/dashboard">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">Pembayaran SPP</h1>
                            <p className="text-sm opacity-90">{siswa.nama_panggilan}</p>
                        </div>
                    </div>

                    {/* Info Card */}
                    <Card className="border-0 bg-white/95 shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100">
                                    <Wallet className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">SPP per Bulan</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {siswa.kelas ? formatRupiah(siswa.kelas.spp) : '-'}
                                    </p>
                                    <p className="text-xs text-gray-500">Kelas: {siswa.kelas?.nama_kelas || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Cards */}
                <div className="-mt-4 grid grid-cols-3 gap-3 px-4">
                    <Card className="border-2 border-red-200 bg-red-50">
                        <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-red-600">{totalTagihan}</p>
                            <p className="text-xs text-red-700">Belum Bayar</p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-yellow-200 bg-yellow-50">
                        <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-yellow-600">{totalMenunggu}</p>
                            <p className="text-xs text-yellow-700">Menunggu</p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-green-600">{totalLunas}</p>
                            <p className="text-xs text-green-700">Lunas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Daftar Pembayaran */}
                <div className="mt-4 space-y-3 px-4">
                    {pembayaran.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <CreditCard className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Belum ada tagihan pembayaran</p>
                            </CardContent>
                        </Card>
                    ) : (
                        pembayaran.map((item) => (
                            <Card 
                                key={item.id}
                                className={`border-2 ${
                                    item.status_bayar === 'diterima' 
                                        ? 'border-green-200 bg-green-50/50' 
                                        : item.status_bayar === 'ditolak'
                                        ? 'border-red-200 bg-red-50/50'
                                        : item.status_bayar === 'menunggu_verifikasi'
                                        ? 'border-yellow-200 bg-yellow-50/50'
                                        : 'border-gray-200'
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <CreditCard className="h-4 w-4 text-gray-600" />
                                                <h3 className="font-bold text-gray-800">{formatBulan(item.bulan)}</h3>
                                            </div>
                                            <p className="text-2xl font-bold text-green-600">
                                                {formatRupiah(item.biaya)}
                                            </p>
                                        </div>
                                        {getStatusBadge(item.status_bayar)}
                                    </div>

                                    {item.tanggal_bayar && (
                                        <div className="mb-2 rounded-lg bg-white/50 p-2">
                                            <p className="text-xs text-gray-600">
                                                Dibayar: {new Date(item.tanggal_bayar).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {item.catatan_admin && (
                                        <div className="mb-2 rounded-lg bg-red-100 p-2">
                                            <p className="text-xs font-medium text-red-700">
                                                Catatan Admin: {item.catatan_admin}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        {(item.status_bayar === 'pending' || item.status_bayar === 'ditolak') && (
                                            <Button
                                                size="sm"
                                                onClick={() => setSelectedPembayaran(item)}
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                            >
                                                <Upload className="mr-1 h-4 w-4" />
                                                Upload Bukti
                                            </Button>
                                        )}
                                        {item.bukti_bayar && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setViewBukti(item.bukti_bayar)}
                                                className={item.status_bayar === 'pending' || item.status_bayar === 'ditolak' ? '' : 'flex-1'}
                                            >
                                                <Eye className="mr-1 h-4 w-4" />
                                                Lihat Bukti
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Upload Modal */}
                <Dialog open={!!selectedPembayaran} onOpenChange={(open) => !open && setSelectedPembayaran(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5 text-green-600" />
                                Upload Bukti Pembayaran
                            </DialogTitle>
                            {selectedPembayaran && (
                                <p className="text-sm text-muted-foreground">
                                    {formatBulan(selectedPembayaran.bulan)} - {formatRupiah(selectedPembayaran.biaya)}
                                </p>
                            )}
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tanggal Bayar</Label>
                                <Input
                                    type="date"
                                    value={data.tanggal_bayar}
                                    onChange={(e) => setData('tanggal_bayar', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Bukti Pembayaran (Foto/Screenshot)</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('bukti_bayar', e.target.files?.[0] || null)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload foto transfer atau bukti pembayaran lainnya
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing} className="flex-1 bg-green-600 hover:bg-green-700">
                                    {processing ? 'Mengupload...' : 'Upload'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedPembayaran(null);
                                        reset();
                                    }}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* View Bukti Modal */}
                <Dialog open={!!viewBukti} onOpenChange={(open) => !open && setViewBukti(null)}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-green-600" />
                                Bukti Pembayaran
                            </DialogTitle>
                        </DialogHeader>
                        {viewBukti && (
                            <div className="flex justify-center">
                                <img
                                    src={`/assets/images/bukti_bayar/${viewBukti}`}
                                    alt="Bukti Pembayaran"
                                    className="max-h-[70vh] w-auto rounded-lg border-2 border-green-200"
                                />
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
