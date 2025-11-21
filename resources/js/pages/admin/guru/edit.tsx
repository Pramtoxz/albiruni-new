import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Guru {
    id: number;
    nip: string | null;
    nama_lengkap: string;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    jenis_kelamin: string | null;
    alamat: string | null;
    pendidikan_terakhir: string | null;
    foto_guru: string | null;
    kelas_id: number | null;
    guru_utama_id: number | null;
    user: {
        id: number;
        name: string;
        email: string;
        nohp: string;
    };
    guru_utama: {
        id: number;
        nama_lengkap: string;
    } | null;
}

interface GuruUtama {
    id: number;
    user_id: number;
    nama_lengkap: string;
    kelas_id: number | null;
    kelas: {
        id: number;
        nama_kelas: string;
    } | null;
}

interface Props {
    guru: Guru;
    kelas: Kelas[];
    guruUtamaList: GuruUtama[];
}

export default function GuruEdit({ guru, kelas, guruUtamaList }: Props) {
    const [guruType, setGuruType] = useState<'utama' | 'pendamping'>(
        guru.guru_utama_id ? 'pendamping' : 'utama'
    );
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        guru_utama_id: guru.guru_utama_id?.toString() || '',
        nip: guru.nip || '',
        nama_lengkap: guru.nama_lengkap,
        kelas_id: guru.kelas_id?.toString() || '',
        tempat_lahir: guru.tempat_lahir || '',
        tanggal_lahir: guru.tanggal_lahir || '',
        jenis_kelamin: guru.jenis_kelamin || '',
        alamat: guru.alamat || '',
        pendidikan_terakhir: guru.pendidikan_terakhir || '',
        foto_guru: null as File | null,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/guru/${guru.id}`);
    };

    const handleGuruTypeChange = (value: string) => {
        setGuruType(value as 'utama' | 'pendamping');
        if (value === 'utama') {
            setData('guru_utama_id', '');
        } else {
            // Reset kelas_id when switching to pendamping
            setData('kelas_id', '');
        }
    };

    return (
        <AppLayout>
            <Head title={`Edit - ${guru.nama_lengkap}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/guru">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Guru</h1>
                        <p className="text-muted-foreground mt-1">
                            Update data guru {guru.nama_lengkap}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Info Akun */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Akun</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        value={guru.user.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email tidak dapat diubah. Ubah di menu User Management jika diperlukan.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>No. HP</Label>
                                    <Input
                                        value={guru.user.nohp}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        No. HP tidak dapat diubah. Ubah di menu User Management jika diperlukan.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Tipe Guru *</Label>
                                <RadioGroup value={guruType} onValueChange={handleGuruTypeChange}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="utama" id="utama" />
                                        <Label htmlFor="utama" className="font-normal cursor-pointer">
                                            Guru Utama
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="pendamping" id="pendamping" />
                                        <Label htmlFor="pendamping" className="font-normal cursor-pointer">
                                            Guru Pendamping
                                        </Label>
                                    </div>
                                </RadioGroup>
                                <p className="text-xs text-muted-foreground">
                                    Guru pendamping membantu guru utama mengelola siswa dan daily report
                                </p>
                            </div>

                            {guruType === 'pendamping' && (
                                <div className="space-y-2">
                                    <Label htmlFor="guru_utama_id">Guru Utama yang Dibantu *</Label>
                                    <Select
                                        value={data.guru_utama_id}
                                        onValueChange={(value) => {
                                            setData('guru_utama_id', value);
                                            // Auto-set kelas_id from guru utama
                                            const selectedGuru = guruUtamaList.find(g => g.id.toString() === value);
                                            if (selectedGuru && selectedGuru.kelas_id) {
                                                setData('kelas_id', selectedGuru.kelas_id.toString());
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih guru utama" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {guruUtamaList.length === 0 ? (
                                                <div className="p-2 text-sm text-muted-foreground">
                                                    Belum ada guru utama. Buat guru utama terlebih dahulu.
                                                </div>
                                            ) : (
                                                guruUtamaList.map((guruUtama) => (
                                                    <SelectItem key={guruUtama.id} value={guruUtama.id.toString()}>
                                                        {guruUtama.nama_lengkap}
                                                        {guruUtama.kelas && ` - ${guruUtama.kelas.nama_kelas}`}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.guru_utama_id && (
                                        <p className="text-sm text-destructive">{errors.guru_utama_id}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Guru pendamping akan dapat mengakses dan mengelola siswa dari guru utama
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Data Pribadi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pribadi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                        <p className="text-sm text-destructive">{errors.nama_lengkap}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP</Label>
                                    <Input
                                        id="nip"
                                        value={data.nip}
                                        onChange={(e) => setData('nip', e.target.value)}
                                    />
                                    {errors.nip && (
                                        <p className="text-sm text-destructive">{errors.nip}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                <Select
                                    value={data.jenis_kelamin}
                                    onValueChange={(value) => setData('jenis_kelamin', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L">Laki-laki</SelectItem>
                                        <SelectItem value="P">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea
                                    id="alamat"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="foto_guru">Foto Guru</Label>
                                <Input
                                    id="foto_guru"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData('foto_guru', e.target.files?.[0] || null)
                                    }
                                />
                                {errors.foto_guru && (
                                    <p className="text-sm text-destructive">{errors.foto_guru}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Kepegawaian */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Kepegawaian</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={guruType === 'pendamping' ? '' : 'grid gap-4 md:grid-cols-2'}>
                                <div className="space-y-2">
                                    <Label htmlFor="pendidikan_terakhir">Pendidikan Terakhir</Label>
                                    <Input
                                        id="pendidikan_terakhir"
                                        value={data.pendidikan_terakhir}
                                        onChange={(e) =>
                                            setData('pendidikan_terakhir', e.target.value)
                                        }
                                        placeholder="S1 Pendidikan"
                                    />
                                </div>

                                {guruType === 'utama' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="kelas_id">Kelas yang Diajar</Label>
                                        <Select
                                            value={data.kelas_id}
                                            onValueChange={(value) => setData('kelas_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kelas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {kelas.map((k) => (
                                                    <SelectItem key={k.id} value={k.id.toString()}>
                                                        {k.nama_kelas}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            Opsional - dapat diatur nanti
                                        </p>
                                    </div>
                                )}
                            </div>
                            {guruType === 'pendamping' && (
                                <p className="text-sm text-muted-foreground">
                                    Guru pendamping akan mengikuti kelas dari guru utama yang dibantu
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/guru">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update Data Guru'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
