import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function RegisterSiswa() {
    const { data, setData, post, processing, errors } = useForm({
        // Informasi Umum
        nama_lengkap: '',
        nama_panggilan: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        agama: '',
        kewarganegaraan: 'Indonesia',
        anak_ke: '',
        jumlah_saudara_kandung: '',
        bahasa_sehari_hari: '',
        foto_siswa: null as File | null,

        // Kesehatan
        berat_badan: '',
        tinggi_badan: '',
        golongan_darah: '',
        riwayat_penyakit: '',
        alasan_rawat_inap: '',
        riwayat_alergi_makanan: '',

        // Data Ayah
        ayah_nama_lengkap: '',
        ayah_tempat_lahir: '',
        ayah_tanggal_lahir: '',
        ayah_pekerjaan: '',
        ayah_pendidikan_terakhir: '',
        ayah_nomor_identitas: '',
        ayah_alamat_rumah: '',
        ayah_telepon_rumah: '',
        ayah_alamat_kantor: '',
        ayah_telepon_kantor: '',
        ayah_no_hp: '',

        // Data Ibu
        ibu_nama_lengkap: '',
        ibu_tempat_lahir: '',
        ibu_tanggal_lahir: '',
        ibu_pekerjaan: '',
        ibu_pendidikan_terakhir: '',
        ibu_nomor_identitas: '',
        ibu_alamat_rumah: '',
        ibu_telepon_rumah: '',
        ibu_alamat_kantor: '',
        ibu_telepon_kantor: '',
        ibu_no_hp: '',

        // Kontak Darurat
        kontak_darurat_nama_lengkap: '',
        kontak_darurat_hubungan: '',
        kontak_darurat_pekerjaan: '',
        kontak_darurat_nomor_identitas: '',
        kontak_darurat_alamat_rumah: '',
        kontak_darurat_telepon_rumah: '',
        kontak_darurat_alamat_kantor: '',
        kontak_darurat_telepon_kantor: '',
        kontak_darurat_no_hp: '',

        // Persetujuan
        lokasi_pendaftaran: '',
        tanggal_pendaftaran: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post('/siswa/register', data);
    };

    return (
        <>
            <Head title="Pendaftaran Siswa" />
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-6">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 bg-primary px-4 py-4 text-primary-foreground shadow-md">
                    <h1 className="text-xl font-bold">Pendaftaran Siswa</h1>
                    <p className="text-sm opacity-90">Lengkapi data siswa untuk melanjutkan</p>
                </div>

                <form onSubmit={submit} className="mx-auto max-w-4xl space-y-4 p-4">
                    {/* Informasi Umum Siswa */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">📋 Informasi Umum Siswa</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                                <Input
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    required
                                />
                                {errors.nama_lengkap && (
                                    <p className="text-sm text-red-500">{errors.nama_lengkap}</p>
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
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                                <Select
                                    value={data.jenis_kelamin}
                                    onValueChange={(value) => setData('jenis_kelamin', value)}
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
                                    <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>
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
                                <Select
                                    value={data.agama}
                                    onValueChange={(value) => setData('agama', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih agama" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Islam">Islam</SelectItem>
                                        <SelectItem value="Kristen">Kristen</SelectItem>
                                        <SelectItem value="Katolik">Katolik</SelectItem>
                                        <SelectItem value="Hindu">Hindu</SelectItem>
                                        <SelectItem value="Buddha">Buddha</SelectItem>
                                        <SelectItem value="Konghucu">Konghucu</SelectItem>
                                    </SelectContent>
                                </Select>
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

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="foto_siswa">Foto Siswa (3x4)</Label>
                                <Input
                                    id="foto_siswa"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('foto_siswa', file);
                                    }}
                                />
                                {data.foto_siswa && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(data.foto_siswa)}
                                            alt="Preview"
                                            className="h-32 w-24 rounded-lg border object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Informasi Kesehatan */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">🏥 Informasi Kesehatan Siswa</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="berat_badan">Berat Badan (kg)</Label>
                                <Input
                                    id="berat_badan"
                                    type="number"
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
                                <Select
                                    value={data.golongan_darah}
                                    onValueChange={(value) => setData('golongan_darah', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih golongan darah" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">A</SelectItem>
                                        <SelectItem value="B">B</SelectItem>
                                        <SelectItem value="AB">AB</SelectItem>
                                        <SelectItem value="O">O</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="riwayat_penyakit">Riwayat Penyakit</Label>
                                <Textarea
                                    id="riwayat_penyakit"
                                    value={data.riwayat_penyakit}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('riwayat_penyakit', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="alasan_rawat_inap">Alasan Pernah Dirawat di RS</Label>
                                <Textarea
                                    id="alasan_rawat_inap"
                                    value={data.alasan_rawat_inap}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('alasan_rawat_inap', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="riwayat_alergi_makanan">Riwayat Alergi Makanan</Label>
                                <Textarea
                                    id="riwayat_alergi_makanan"
                                    value={data.riwayat_alergi_makanan}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('riwayat_alergi_makanan', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Ayah */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">👨 Data Ayah</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ayah_nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="ayah_nama_lengkap"
                                    value={data.ayah_nama_lengkap}
                                    onChange={(e) => setData('ayah_nama_lengkap', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_tempat_lahir">Tempat Lahir</Label>
                                <Input
                                    id="ayah_tempat_lahir"
                                    value={data.ayah_tempat_lahir}
                                    onChange={(e) => setData('ayah_tempat_lahir', e.target.value)}
                                    placeholder="Contoh: Padang"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="ayah_tanggal_lahir"
                                    type="date"
                                    value={data.ayah_tanggal_lahir}
                                    onChange={(e) => setData('ayah_tanggal_lahir', e.target.value)}
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
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.ayah_nomor_identitas}
                                    onChange={(e) => setData('ayah_nomor_identitas', e.target.value)}
                                    placeholder="Contoh: 1371234567890123"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_no_hp">No Handphone</Label>
                                <Input
                                    id="ayah_no_hp"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.ayah_no_hp}
                                    onChange={(e) => setData('ayah_no_hp', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="ayah_alamat_rumah">Alamat Rumah</Label>
                                <Textarea
                                    id="ayah_alamat_rumah"
                                    value={data.ayah_alamat_rumah}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('ayah_alamat_rumah', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_telepon_rumah">Telepon Rumah</Label>
                                <Input
                                    id="ayah_telepon_rumah"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.ayah_telepon_rumah}
                                    onChange={(e) => setData('ayah_telepon_rumah', e.target.value)}
                                    placeholder="Contoh: 0751123456"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="ayah_alamat_kantor">Alamat Kantor</Label>
                                <Textarea
                                    id="ayah_alamat_kantor"
                                    value={data.ayah_alamat_kantor}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('ayah_alamat_kantor', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ayah_telepon_kantor">Telepon Kantor</Label>
                                <Input
                                    id="ayah_telepon_kantor"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.ayah_telepon_kantor}
                                    onChange={(e) => setData('ayah_telepon_kantor', e.target.value)}
                                    placeholder="Contoh: 0751123456"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Ibu */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">👩 Data Ibu</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ibu_nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="ibu_nama_lengkap"
                                    value={data.ibu_nama_lengkap}
                                    onChange={(e) => setData('ibu_nama_lengkap', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_tempat_lahir">Tempat Lahir</Label>
                                <Input
                                    id="ibu_tempat_lahir"
                                    value={data.ibu_tempat_lahir}
                                    onChange={(e) => setData('ibu_tempat_lahir', e.target.value)}
                                    placeholder="Contoh: Padang"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="ibu_tanggal_lahir"
                                    type="date"
                                    value={data.ibu_tanggal_lahir}
                                    onChange={(e) => setData('ibu_tanggal_lahir', e.target.value)}
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
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.ibu_nomor_identitas}
                                    onChange={(e) => setData('ibu_nomor_identitas', e.target.value)}
                                    placeholder="Contoh: 1371234567890123"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_no_hp">No Handphone</Label>
                                <Input
                                    id="ibu_no_hp"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.ibu_no_hp}
                                    onChange={(e) => setData('ibu_no_hp', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="ibu_alamat_rumah">Alamat Rumah</Label>
                                <Textarea
                                    id="ibu_alamat_rumah"
                                    value={data.ibu_alamat_rumah}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('ibu_alamat_rumah', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_telepon_rumah">Telepon Rumah</Label>
                                <Input
                                    id="ibu_telepon_rumah"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.ibu_telepon_rumah}
                                    onChange={(e) => setData('ibu_telepon_rumah', e.target.value)}
                                    placeholder="Contoh: 0751123456"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="ibu_alamat_kantor">Alamat Kantor</Label>
                                <Textarea
                                    id="ibu_alamat_kantor"
                                    value={data.ibu_alamat_kantor}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('ibu_alamat_kantor', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ibu_telepon_kantor">Telepon Kantor</Label>
                                <Input
                                    id="ibu_telepon_kantor"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.ibu_telepon_kantor}
                                    onChange={(e) => setData('ibu_telepon_kantor', e.target.value)}
                                    placeholder="Contoh: 0751123456"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kontak Darurat */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">🚨 Kontak Darurat</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_nama_lengkap">Nama Lengkap</Label>
                                <Input
                                    id="kontak_darurat_nama_lengkap"
                                    value={data.kontak_darurat_nama_lengkap}
                                    onChange={(e) => setData('kontak_darurat_nama_lengkap', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_hubungan">Hubungan dengan Siswa</Label>
                                <Input
                                    id="kontak_darurat_hubungan"
                                    value={data.kontak_darurat_hubungan}
                                    onChange={(e) => setData('kontak_darurat_hubungan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_pekerjaan">Pekerjaan</Label>
                                <Input
                                    id="kontak_darurat_pekerjaan"
                                    value={data.kontak_darurat_pekerjaan}
                                    onChange={(e) => setData('kontak_darurat_pekerjaan', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_nomor_identitas">Nomor Identitas</Label>
                                <Input
                                    id="kontak_darurat_nomor_identitas"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.kontak_darurat_nomor_identitas}
                                    onChange={(e) => setData('kontak_darurat_nomor_identitas', e.target.value)}
                                    placeholder="Contoh: 1371234567890123"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_no_hp">No Handphone</Label>
                                <Input
                                    id="kontak_darurat_no_hp"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.kontak_darurat_no_hp}
                                    onChange={(e) => setData('kontak_darurat_no_hp', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="kontak_darurat_alamat_rumah">Alamat Rumah</Label>
                                <Textarea
                                    id="kontak_darurat_alamat_rumah"
                                    value={data.kontak_darurat_alamat_rumah}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('kontak_darurat_alamat_rumah', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_telepon_rumah">Telepon Rumah</Label>
                                <Input
                                    id="kontak_darurat_telepon_rumah"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.kontak_darurat_telepon_rumah}
                                    onChange={(e) => setData('kontak_darurat_telepon_rumah', e.target.value)}
                                    placeholder="Contoh: 0751123456"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="kontak_darurat_alamat_kantor">Alamat Kantor</Label>
                                <Textarea
                                    id="kontak_darurat_alamat_kantor"
                                    value={data.kontak_darurat_alamat_kantor}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('kontak_darurat_alamat_kantor', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kontak_darurat_telepon_kantor">Telepon Kantor</Label>
                                <Input
                                    id="kontak_darurat_telepon_kantor"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.kontak_darurat_telepon_kantor}
                                    onChange={(e) => setData('kontak_darurat_telepon_kantor', e.target.value)}
                                    placeholder="Contoh: 0751123456"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Persetujuan */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">✅ Persetujuan</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="lokasi_pendaftaran">Lokasi Pendaftaran / Cabang *</Label>
                                <Select
                                    value={data.lokasi_pendaftaran}
                                    onValueChange={(value) => setData('lokasi_pendaftaran', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih cabang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ulak Karang">Ulak Karang</SelectItem>
                                        <SelectItem value="Marapalam">Marapalam</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.lokasi_pendaftaran && (
                                    <p className="text-sm text-red-500">{errors.lokasi_pendaftaran}</p>
                                )}
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
                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pt-4 pb-2">
                        <Button type="submit" className="w-full h-12 text-base" disabled={processing}>
                            {processing ? 'Menyimpan...' : '💾 Simpan Data Siswa'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
