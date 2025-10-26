import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Siswa } from '@/types';
import { FormEventHandler } from 'react';

interface Props {
    siswa: Siswa;
}

export default function SiswaEdit({ siswa }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nama_lengkap: siswa.nama_lengkap || '',
        nama_panggilan: siswa.nama_panggilan || '',
        jenis_kelamin: siswa.jenis_kelamin || '',
        tempat_lahir: siswa.tempat_lahir || '',
        tanggal_lahir: siswa.tanggal_lahir || '',
        agama: siswa.agama || '',
        kewarganegaraan: siswa.kewarganegaraan || 'Indonesia',
        anak_ke: siswa.anak_ke?.toString() || '',
        jumlah_saudara_kandung: siswa.jumlah_saudara_kandung?.toString() || '',
        bahasa_sehari_hari: siswa.bahasa_sehari_hari || '',
        foto_siswa: null as File | null,
        berat_badan: siswa.berat_badan?.toString() || '',
        tinggi_badan: siswa.tinggi_badan?.toString() || '',
        golongan_darah: siswa.golongan_darah || '',
        riwayat_penyakit: siswa.riwayat_penyakit || '',
        alasan_rawat_inap: siswa.alasan_rawat_inap || '',
        riwayat_alergi_makanan: siswa.riwayat_alergi_makanan || '',
        ayah_nama_lengkap: siswa.ayah_nama_lengkap || '',
        ayah_tempat_tanggal_lahir: siswa.ayah_tempat_tanggal_lahir || '',
        ayah_pekerjaan: siswa.ayah_pekerjaan || '',
        ayah_pendidikan_terakhir: siswa.ayah_pendidikan_terakhir || '',
        ayah_nomor_identitas: siswa.ayah_nomor_identitas || '',
        ayah_alamat_rumah: siswa.ayah_alamat_rumah || '',
        ayah_telepon_rumah: siswa.ayah_telepon_rumah || '',
        ayah_alamat_kantor: siswa.ayah_alamat_kantor || '',
        ayah_telepon_kantor: siswa.ayah_telepon_kantor || '',
        ayah_no_hp: siswa.ayah_no_hp || '',
        ibu_nama_lengkap: siswa.ibu_nama_lengkap || '',
        ibu_tempat_tanggal_lahir: siswa.ibu_tempat_tanggal_lahir || '',
        ibu_pekerjaan: siswa.ibu_pekerjaan || '',
        ibu_pendidikan_terakhir: siswa.ibu_pendidikan_terakhir || '',
        ibu_nomor_identitas: siswa.ibu_nomor_identitas || '',
        ibu_alamat_rumah: siswa.ibu_alamat_rumah || '',
        ibu_telepon_rumah: siswa.ibu_telepon_rumah || '',
        ibu_alamat_kantor: siswa.ibu_alamat_kantor || '',
        ibu_telepon_kantor: siswa.ibu_telepon_kantor || '',
        ibu_no_hp: siswa.ibu_no_hp || '',
        kontak_darurat_nama_lengkap: siswa.kontak_darurat_nama_lengkap || '',
        kontak_darurat_hubungan: siswa.kontak_darurat_hubungan || '',
        kontak_darurat_pekerjaan: siswa.kontak_darurat_pekerjaan || '',
        kontak_darurat_nomor_identitas: siswa.kontak_darurat_nomor_identitas || '',
        kontak_darurat_alamat_rumah: siswa.kontak_darurat_alamat_rumah || '',
        kontak_darurat_telepon_rumah: siswa.kontak_darurat_telepon_rumah || '',
        kontak_darurat_alamat_kantor: siswa.kontak_darurat_alamat_kantor || '',
        kontak_darurat_telepon_kantor: siswa.kontak_darurat_telepon_kantor || '',
        kontak_darurat_no_hp: siswa.kontak_darurat_no_hp || '',
        lokasi_pendaftaran: siswa.lokasi_pendaftaran || '',
        tanggal_pendaftaran: siswa.tanggal_pendaftaran || '',
        jenis_pembayaran: siswa.jenis_pembayaran || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/siswa/${siswa.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Siswa - ${siswa.nama_lengkap}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/siswa/approved/list">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Data Siswa</h1>
                            <p className="text-muted-foreground mt-1">
                                {siswa.nama_lengkap}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Foto Siswa */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Foto Siswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {siswa.foto_siswa && (
                                <div className="flex justify-center">
                                    <img
                                        src={`/assets/images/foto_siswa/${siswa.foto_siswa}`}
                                        alt={siswa.nama_lengkap}
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-border"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="foto_siswa">Upload Foto Baru (Opsional)</Label>
                                <Input
                                    id="foto_siswa"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData('foto_siswa', e.target.files?.[0] || null)
                                    }
                                />
                                {errors.foto_siswa && (
                                    <p className="text-sm text-destructive">{errors.foto_siswa}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informasi Umum */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Umum Siswa</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                                <Input
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                />
                                {errors.nama_lengkap && (
                                    <p className="text-sm text-destructive">{errors.nama_lengkap}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama_panggilan">Nama Panggilan</Label>
                                <Input
                                    id="nama_panggilan"
                                    value={data.nama_panggilan}
                                    onChange={(e) => setData('nama_panggilan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Jenis Kelamin *</Label>
                                <Select
                                    value={data.jenis_kelamin}
                                    onValueChange={(value: string) => setData('jenis_kelamin', value as 'Laki-laki' | 'Perempuan')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis_kelamin && (
                                    <p className="text-sm text-destructive">{errors.jenis_kelamin}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                <Input
                                    id="tempat_lahir"
                                    value={data.tempat_lahir}
                                    onChange={(e) => setData('tempat_lahir', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="agama">Agama</Label>
                                <Input
                                    id="agama"
                                    value={data.agama}
                                    onChange={(e) => setData('agama', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kewarganegaraan">Kewarganegaraan</Label>
                                <Input
                                    id="kewarganegaraan"
                                    value={data.kewarganegaraan}
                                    onChange={(e) => setData('kewarganegaraan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="anak_ke">Anak Ke</Label>
                                <Input
                                    id="anak_ke"
                                    type="number"
                                    value={data.anak_ke}
                                    onChange={(e) => setData('anak_ke', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jumlah_saudara_kandung">Jumlah Saudara Kandung</Label>
                                <Input
                                    id="jumlah_saudara_kandung"
                                    type="number"
                                    value={data.jumlah_saudara_kandung}
                                    onChange={(e) => setData('jumlah_saudara_kandung', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bahasa_sehari_hari">Bahasa Sehari-hari</Label>
                                <Input
                                    id="bahasa_sehari_hari"
                                    value={data.bahasa_sehari_hari}
                                    onChange={(e) => setData('bahasa_sehari_hari', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informasi Kesehatan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kesehatan</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="berat_badan">Berat Badan (kg)</Label>
                                <Input
                                    id="berat_badan"
                                    type="number"
                                    step="0.01"
                                    value={data.berat_badan}
                                    onChange={(e) => setData('berat_badan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tinggi_badan">Tinggi Badan (cm)</Label>
                                <Input
                                    id="tinggi_badan"
                                    type="number"
                                    step="0.01"
                                    value={data.tinggi_badan}
                                    onChange={(e) => setData('tinggi_badan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="golongan_darah">Golongan Darah</Label>
                                <Input
                                    id="golongan_darah"
                                    value={data.golongan_darah}
                                    onChange={(e) => setData('golongan_darah', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="riwayat_penyakit">Riwayat Penyakit</Label>
                                <Textarea
                                    id="riwayat_penyakit"
                                    value={data.riwayat_penyakit}
                                    onChange={(e) => setData('riwayat_penyakit', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="alasan_rawat_inap">Alasan Rawat Inap</Label>
                                <Textarea
                                    id="alasan_rawat_inap"
                                    value={data.alasan_rawat_inap}
                                    onChange={(e) => setData('alasan_rawat_inap', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="riwayat_alergi_makanan">Riwayat Alergi Makanan</Label>
                                <Textarea
                                    id="riwayat_alergi_makanan"
                                    value={data.riwayat_alergi_makanan}
                                    onChange={(e) => setData('riwayat_alergi_makanan', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Ayah */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Ayah</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ayah_nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="ayah_nama_lengkap"
                                    value={data.ayah_nama_lengkap}
                                    onChange={(e) => setData('ayah_nama_lengkap', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_tempat_tanggal_lahir">Tempat, Tanggal Lahir</Label>
                                <Input
                                    id="ayah_tempat_tanggal_lahir"
                                    value={data.ayah_tempat_tanggal_lahir}
                                    onChange={(e) => setData('ayah_tempat_tanggal_lahir', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_pekerjaan">Pekerjaan</Label>
                                <Input
                                    id="ayah_pekerjaan"
                                    value={data.ayah_pekerjaan}
                                    onChange={(e) => setData('ayah_pekerjaan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_pendidikan_terakhir">Pendidikan Terakhir</Label>
                                <Input
                                    id="ayah_pendidikan_terakhir"
                                    value={data.ayah_pendidikan_terakhir}
                                    onChange={(e) => setData('ayah_pendidikan_terakhir', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_nomor_identitas">Nomor Identitas</Label>
                                <Input
                                    id="ayah_nomor_identitas"
                                    value={data.ayah_nomor_identitas}
                                    onChange={(e) => setData('ayah_nomor_identitas', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_no_hp">No. HP</Label>
                                <Input
                                    id="ayah_no_hp"
                                    value={data.ayah_no_hp}
                                    onChange={(e) => setData('ayah_no_hp', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="ayah_alamat_rumah">Alamat Rumah</Label>
                                <Textarea
                                    id="ayah_alamat_rumah"
                                    value={data.ayah_alamat_rumah}
                                    onChange={(e) => setData('ayah_alamat_rumah', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Ibu */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Ibu</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ibu_nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="ibu_nama_lengkap"
                                    value={data.ibu_nama_lengkap}
                                    onChange={(e) => setData('ibu_nama_lengkap', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_tempat_tanggal_lahir">Tempat, Tanggal Lahir</Label>
                                <Input
                                    id="ibu_tempat_tanggal_lahir"
                                    value={data.ibu_tempat_tanggal_lahir}
                                    onChange={(e) => setData('ibu_tempat_tanggal_lahir', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_pekerjaan">Pekerjaan</Label>
                                <Input
                                    id="ibu_pekerjaan"
                                    value={data.ibu_pekerjaan}
                                    onChange={(e) => setData('ibu_pekerjaan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_pendidikan_terakhir">Pendidikan Terakhir</Label>
                                <Input
                                    id="ibu_pendidikan_terakhir"
                                    value={data.ibu_pendidikan_terakhir}
                                    onChange={(e) => setData('ibu_pendidikan_terakhir', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_nomor_identitas">Nomor Identitas</Label>
                                <Input
                                    id="ibu_nomor_identitas"
                                    value={data.ibu_nomor_identitas}
                                    onChange={(e) => setData('ibu_nomor_identitas', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_no_hp">No. HP</Label>
                                <Input
                                    id="ibu_no_hp"
                                    value={data.ibu_no_hp}
                                    onChange={(e) => setData('ibu_no_hp', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="ibu_alamat_rumah">Alamat Rumah</Label>
                                <Textarea
                                    id="ibu_alamat_rumah"
                                    value={data.ibu_alamat_rumah}
                                    onChange={(e) => setData('ibu_alamat_rumah', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak Darurat */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak Darurat</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="kontak_darurat_nama_lengkap"
                                    value={data.kontak_darurat_nama_lengkap}
                                    onChange={(e) => setData('kontak_darurat_nama_lengkap', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_hubungan">Hubungan</Label>
                                <Input
                                    id="kontak_darurat_hubungan"
                                    value={data.kontak_darurat_hubungan}
                                    onChange={(e) => setData('kontak_darurat_hubungan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_no_hp">No. HP</Label>
                                <Input
                                    id="kontak_darurat_no_hp"
                                    value={data.kontak_darurat_no_hp}
                                    onChange={(e) => setData('kontak_darurat_no_hp', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informasi Pendaftaran */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pendaftaran</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="lokasi_pendaftaran">Lokasi Pendaftaran</Label>
                                <Input
                                    id="lokasi_pendaftaran"
                                    value={data.lokasi_pendaftaran}
                                    onChange={(e) => setData('lokasi_pendaftaran', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggal_pendaftaran">Tanggal Pendaftaran</Label>
                                <Input
                                    id="tanggal_pendaftaran"
                                    type="date"
                                    value={data.tanggal_pendaftaran}
                                    onChange={(e) => setData('tanggal_pendaftaran', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
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
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/siswa/approved/list">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
