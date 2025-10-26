import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Siswa } from '@/types';
import { FormEventHandler } from 'react';

interface Props {
    siswa: Siswa;
}

export default function SiswaShow({ siswa }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        jenis_pembayaran: '' as 'transfer' | 'cash' | '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/siswa/${siswa.id}/approve`);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
        <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
            <div className="font-medium text-muted-foreground">{label}</div>
            <div className="col-span-2">{value || '-'}</div>
        </div>
    );

    return (
        <AppLayout>
            <Head title={`Detail Siswa - ${siswa.nama_lengkap}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/siswa">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{siswa.nama_lengkap}</h1>
                            <p className="text-muted-foreground mt-1">
                                Detail Pendaftaran Siswa
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informasi Umum */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Umum Siswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <InfoRow label="Nama Lengkap" value={siswa.nama_lengkap} />
                            <InfoRow label="Nama Panggilan" value={siswa.nama_panggilan} />
                            <InfoRow label="Jenis Kelamin" value={siswa.jenis_kelamin} />
                            <InfoRow label="Tempat Lahir" value={siswa.tempat_lahir} />
                            <InfoRow label="Tanggal Lahir" value={formatDate(siswa.tanggal_lahir)} />
                            <InfoRow label="Agama" value={siswa.agama} />
                            <InfoRow label="Kewarganegaraan" value={siswa.kewarganegaraan} />
                            <InfoRow label="Anak Ke" value={siswa.anak_ke} />
                            <InfoRow label="Jumlah Saudara" value={siswa.jumlah_saudara_kandung} />
                            <InfoRow label="Bahasa Sehari-hari" value={siswa.bahasa_sehari_hari} />
                        </CardContent>
                    </Card>

                    {/* Informasi Kesehatan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kesehatan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <InfoRow label="Berat Badan" value={siswa.berat_badan ? `${siswa.berat_badan} kg` : undefined} />
                            <InfoRow label="Tinggi Badan" value={siswa.tinggi_badan ? `${siswa.tinggi_badan} cm` : undefined} />
                            <InfoRow label="Golongan Darah" value={siswa.golongan_darah} />
                            <InfoRow label="Riwayat Penyakit" value={siswa.riwayat_penyakit} />
                            <InfoRow label="Alasan Rawat Inap" value={siswa.alasan_rawat_inap} />
                            <InfoRow label="Riwayat Alergi Makanan" value={siswa.riwayat_alergi_makanan} />
                        </CardContent>
                    </Card>

                    {/* Data Ayah */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Ayah</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <InfoRow label="Nama Lengkap" value={siswa.ayah_nama_lengkap} />
                            <InfoRow label="Tempat, Tanggal Lahir" value={siswa.ayah_tempat_tanggal_lahir} />
                            <InfoRow label="Pekerjaan" value={siswa.ayah_pekerjaan} />
                            <InfoRow label="Pendidikan Terakhir" value={siswa.ayah_pendidikan_terakhir} />
                            <InfoRow label="Nomor Identitas" value={siswa.ayah_nomor_identitas} />
                            <InfoRow label="Alamat Rumah" value={siswa.ayah_alamat_rumah} />
                            <InfoRow label="Telepon Rumah" value={siswa.ayah_telepon_rumah} />
                            <InfoRow label="Alamat Kantor" value={siswa.ayah_alamat_kantor} />
                            <InfoRow label="Telepon Kantor" value={siswa.ayah_telepon_kantor} />
                            <InfoRow label="No. HP" value={siswa.ayah_no_hp} />
                        </CardContent>
                    </Card>

                    {/* Data Ibu */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Ibu</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <InfoRow label="Nama Lengkap" value={siswa.ibu_nama_lengkap} />
                            <InfoRow label="Tempat, Tanggal Lahir" value={siswa.ibu_tempat_tanggal_lahir} />
                            <InfoRow label="Pekerjaan" value={siswa.ibu_pekerjaan} />
                            <InfoRow label="Pendidikan Terakhir" value={siswa.ibu_pendidikan_terakhir} />
                            <InfoRow label="Nomor Identitas" value={siswa.ibu_nomor_identitas} />
                            <InfoRow label="Alamat Rumah" value={siswa.ibu_alamat_rumah} />
                            <InfoRow label="Telepon Rumah" value={siswa.ibu_telepon_rumah} />
                            <InfoRow label="Alamat Kantor" value={siswa.ibu_alamat_kantor} />
                            <InfoRow label="Telepon Kantor" value={siswa.ibu_telepon_kantor} />
                            <InfoRow label="No. HP" value={siswa.ibu_no_hp} />
                        </CardContent>
                    </Card>

                    {/* Kontak Darurat */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak Darurat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <InfoRow label="Nama Lengkap" value={siswa.kontak_darurat_nama_lengkap} />
                            <InfoRow label="Hubungan" value={siswa.kontak_darurat_hubungan} />
                            <InfoRow label="Pekerjaan" value={siswa.kontak_darurat_pekerjaan} />
                            <InfoRow label="Nomor Identitas" value={siswa.kontak_darurat_nomor_identitas} />
                            <InfoRow label="Alamat Rumah" value={siswa.kontak_darurat_alamat_rumah} />
                            <InfoRow label="Telepon Rumah" value={siswa.kontak_darurat_telepon_rumah} />
                            <InfoRow label="Alamat Kantor" value={siswa.kontak_darurat_alamat_kantor} />
                            <InfoRow label="Telepon Kantor" value={siswa.kontak_darurat_telepon_kantor} />
                            <InfoRow label="No. HP" value={siswa.kontak_darurat_no_hp} />
                        </CardContent>
                    </Card>

                    {/* Informasi Pendaftaran */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pendaftaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <InfoRow label="Lokasi Pendaftaran" value={siswa.lokasi_pendaftaran} />
                            <InfoRow label="Tanggal Pendaftaran" value={formatDate(siswa.tanggal_pendaftaran)} />
                            <InfoRow label="Email Orang Tua" value={siswa.user?.email} />
                            <InfoRow label="Nama Akun" value={siswa.user?.name} />
                        </CardContent>
                    </Card>
                </div>

                {/* Approval Form */}
                {!siswa.status_siswa && (
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle>Persetujuan Pendaftaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Jenis Pembayaran *</Label>
                                    <RadioGroup
                                        value={data.jenis_pembayaran}
                                        onValueChange={(value: string) =>
                                            setData('jenis_pembayaran', value as 'transfer' | 'cash')
                                        }
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="transfer" id="transfer" />
                                            <Label htmlFor="transfer" className="font-normal cursor-pointer">
                                                Transfer Bank
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cash" id="cash" />
                                            <Label htmlFor="cash" className="font-normal cursor-pointer">
                                                Cash / Tunai
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                    {errors.jenis_pembayaran && (
                                        <p className="text-sm text-destructive">{errors.jenis_pembayaran}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || !data.jenis_pembayaran}
                                    className="w-full"
                                    size="lg"
                                >
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    {processing ? 'Memproses...' : 'Setujui Pendaftaran'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
