import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
const WAKTU_MAKAN = ['sarapan', 'makan_siang', 'snack'];

const HARI_LABELS: Record<string, string> = {
    senin: 'Senin',
    selasa: 'Selasa',
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jumat',
};

const WAKTU_LABELS: Record<string, string> = {
    sarapan: 'Sarapan',
    makan_siang: 'Makan Siang',
    snack: 'Snack',
};

const KATEGORI_LABELS: Record<string, string> = {
    anak: 'Anak',
    bayi: 'Bayi',
    staff: 'Staff',
};

// Define which categories are available for each waktu_makan
const WAKTU_KATEGORI: Record<string, string[]> = {
    sarapan: ['anak', 'bayi'],
    makan_siang: ['anak', 'bayi', 'staff'],
    snack: ['anak'], // Snack sama untuk semua, jadi cukup 1 entry
};

export default function MenuMingguanCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_menu: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        is_active: false,
        menu_harian: [] as Array<{
            hari: string;
            waktu_makan: string;
            kategori: string;
            nama_menu: string;
        }>,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/menu-mingguan');
    };

    const updateMenuHarian = (hari: string, waktu: string, kategori: string, value: string) => {
        const newMenuHarian = [...data.menu_harian];
        const index = newMenuHarian.findIndex(
            (m) => m.hari === hari && m.waktu_makan === waktu && m.kategori === kategori
        );

        if (index >= 0) {
            newMenuHarian[index].nama_menu = value;
        } else {
            newMenuHarian.push({
                hari,
                waktu_makan: waktu,
                kategori,
                nama_menu: value,
            });
        }

        setData('menu_harian', newMenuHarian);
    };

    const getMenuValue = (hari: string, waktu: string, kategori: string) => {
        const menu = data.menu_harian.find(
            (m) => m.hari === hari && m.waktu_makan === waktu && m.kategori === kategori
        );
        return menu?.nama_menu || '';
    };

    return (
        <AppLayout>
            <Head title="Tambah Menu Mingguan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/menu-mingguan">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Tambah Menu Mingguan</h1>
                        <p className="text-muted-foreground mt-1">
                            Buat rencana menu untuk satu minggu
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Info Dasar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_menu">Nama Menu *</Label>
                                    <Input
                                        id="nama_menu"
                                        value={data.nama_menu}
                                        onChange={(e) => setData('nama_menu', e.target.value)}
                                        placeholder="Menu Minggu 1"
                                        required
                                    />
                                    {errors.nama_menu && (
                                        <p className="text-sm text-destructive">{errors.nama_menu}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal_mulai && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_mulai}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">Tanggal Selesai *</Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal_selesai && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_selesai}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked as boolean)
                                    }
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Set sebagai menu aktif
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Menu Harian */}
                    {HARI.map((hari) => (
                        <Card key={hari}>
                            <CardHeader>
                                <CardTitle>{HARI_LABELS[hari]}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {WAKTU_MAKAN.map((waktu) => (
                                        <div key={waktu} className="space-y-3">
                                            <h4 className="font-medium text-sm">
                                                {WAKTU_LABELS[waktu]}
                                                {waktu === 'snack' && (
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                        (Sama untuk semua kategori)
                                                    </span>
                                                )}
                                            </h4>
                                            <div className={`grid gap-3 ${waktu === 'snack' ? 'md:grid-cols-1' : 'md:grid-cols-3'}`}>
                                                {WAKTU_KATEGORI[waktu].map((kategori) => (
                                                    <div key={kategori} className="space-y-1">
                                                        <Label className="text-xs text-muted-foreground">
                                                            {waktu === 'snack' ? 'Menu Snack' : KATEGORI_LABELS[kategori]}
                                                        </Label>
                                                        <Input
                                                            value={getMenuValue(hari, waktu, kategori)}
                                                            onChange={(e) =>
                                                                updateMenuHarian(
                                                                    hari,
                                                                    waktu,
                                                                    kategori,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Nama menu..."
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link href="/admin/menu-mingguan">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Menu Mingguan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
