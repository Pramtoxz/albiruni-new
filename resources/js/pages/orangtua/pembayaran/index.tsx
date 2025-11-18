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
import { Upload, CheckCircle, XCircle, Clock, AlertCircle, Eye, ArrowLeft, CreditCard, Wallet, Star, Sparkles } from 'lucide-react';
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
    metode_bayar: 'cash' | 'transfer' | null;
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
    
    const getTodayDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const { data, setData, post, processing, reset } = useForm({
        bukti_bayar: null as File | null,
        tanggal_bayar: getTodayDate(),
        metode_bayar: 'transfer' as 'transfer',
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
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20"></div>
                <div className="absolute top-40 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-20"></div>

                {/* Floating Stars Decoration */}
                <div className="absolute top-8 right-8 animate-bounce">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 opacity-40" />
                </div>
                <div className="absolute top-24 left-12 animate-pulse">
                    <Sparkles className="h-5 w-5 text-pink-400 opacity-40" />
                </div>

                {/* Content with integrated back button */}
                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard">
                            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                                <ArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">Pembayaran SPP 💰</h1>
                            <p className="text-sm text-gray-600">{siswa.nama_panggilan}</p>
                        </div>
                    </div>

                    {/* Info Card */}
                    <Card className="border-0 bg-white shadow-xl rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-bl-full opacity-50"></div>
                        <CardContent className="p-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-200 to-emerald-300 shadow-lg">
                                        <Wallet className="h-8 w-8 text-green-700" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1.5 border-2 border-white shadow-md">
                                        <Star className="h-3 w-3 text-white fill-white" />
                                    </div>
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-100 to-red-200">
                            <CardContent className="p-3 text-center">
                                <p className="text-2xl font-bold text-red-700">{totalTagihan}</p>
                                <p className="text-xs text-red-800 font-medium">Belum Bayar</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200">
                            <CardContent className="p-3 text-center">
                                <p className="text-2xl font-bold text-yellow-700">{totalMenunggu}</p>
                                <p className="text-xs text-yellow-800 font-medium">Menunggu</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
                            <CardContent className="p-3 text-center">
                                <p className="text-2xl font-bold text-green-700">{totalLunas}</p>
                                <p className="text-xs text-green-800 font-medium">Lunas</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Daftar Pembayaran */}
                    <div className="space-y-3">
                        {pembayaran.length === 0 ? (
                            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
                                <CardContent className="py-12 text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full mb-4 shadow-lg">
                                        <CreditCard className="h-10 w-10 text-green-700" />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">Belum ada tagihan pembayaran</p>
                                    <p className="text-xs text-gray-500 mt-1">Tagihan akan muncul di sini</p>
                                </CardContent>
                            </Card>
                        ) : (
                            pembayaran.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`border-0 shadow-lg rounded-3xl overflow-hidden ${item.status_bayar === 'diterima'
                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                                        : item.status_bayar === 'ditolak'
                                            ? 'bg-gradient-to-r from-red-50 to-pink-50'
                                            : item.status_bayar === 'menunggu_verifikasi'
                                                ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
                                                : 'bg-white'
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
                                                {item.metode_bayar && (
                                                    <p className="text-xs text-gray-600">
                                                        Metode: {item.metode_bayar === 'cash' ? 'Cash' : 'Transfer'}
                                                    </p>
                                                )}
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
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md"
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
                                                    className={`border-2 ${item.status_bayar === 'pending' || item.status_bayar === 'ditolak' ? '' : 'flex-1'}`}
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
                                <Label>Metode Pembayaran</Label>
                                <Input
                                    type="text"
                                    value="Transfer"
                                    disabled
                                    className="bg-gray-100"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Pembayaran melalui mobile hanya bisa via transfer
                                </p>
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
                                <Button type="submit" disabled={processing} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md">
                                    {processing ? 'Mengupload...' : 'Upload'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedPembayaran(null);
                                        reset();
                                    }}
                                    className="border-2"
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
