import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { StarRating } from '@/components/star-rating';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler, useState, useRef } from 'react';
import Swal from 'sweetalert2';

interface Siswa {
    id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    kelas_id: number;
    kelas?: {
        id: number;
        nama_kelas: string;
        kategori_menu: string;
    };
}

interface MenuMakanan {
    id: number;
    nama_menu: string;
    kategori: string;
}

interface Props {
    siswaList: Siswa[];
    menuMakanan: {
        sarapan?: MenuMakanan[];
        makan_siang?: MenuMakanan[];
        snack?: MenuMakanan[];
    };
    menuMingguan?: any;
}

export default function DailyReportCreate({ siswaList, menuMakanan, menuMingguan }: Props) {
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);

    const { data, setData, processing } = useForm({
        siswa_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        mood: '',
        activity: '',
        sarapan_pagi: '',
        sarapan_status: 0,
        makan_siang: '',
        makan_siang_status: 0,
        snack_sore: '',
        snack_status: 0,
        minum_air_putih: '',
        minum_susu: '',
        tidur_siang: false,
        tidur_siang_durasi: '',
        bak: false,
        bak_frekuensi: '',
        bab: false,
        bab_frekuensi: '',
        kebutuhan_besok: '',
        catatan_khusus: '',
        catatan_insiden: '',
        foto_kegiatan: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const isSubmitting = useRef(false);

    // Filter menu based on selected siswa's kategori
    const getFilteredMenu = (waktuMakan: 'sarapan' | 'makan_siang' | 'snack') => {
        if (!selectedSiswa?.kelas?.kategori_menu) {
            return menuMakanan[waktuMakan] || [];
        }

        const kategori = selectedSiswa.kelas.kategori_menu;
        return (menuMakanan[waktuMakan] || []).filter(
            (menu) => menu.kategori === kategori
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Prevent double submit
        if (processing || isSubmitting.current) {
            return;
        }

        isSubmitting.current = true;

        router.post('/guru/daily-report', data, {
            preserveScroll: true,
            onSuccess: () => {
                isSubmitting.current = false;
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Daily report berhasil disimpan',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                });
            },
            onError: (errors) => {
                isSubmitting.current = false;
                const errorMessage = errors.tanggal || Object.values(errors)[0] || 'Terjadi kesalahan';
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: errorMessage,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK',
                });
            },
            onFinish: () => {
                isSubmitting.current = false;
            },
        });
    };

    return (
        <>
            <Head title="Buat Daily Report" />
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-6">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 bg-primary px-4 py-4 text-primary-foreground shadow-md">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary-foreground/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">Daily Report</h1>
                            <p className="text-sm opacity-90">Buat laporan kegiatan harian</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="mx-auto max-w-4xl space-y-4 p-4 pb-20">
                    {/* Siswa & Tanggal */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">Siswa & Tanggal</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Siswa *</Label>
                                <Select
                                    value={data.siswa_id}
                                    onValueChange={(value) => {
                                        setData('siswa_id', value);
                                        const siswa = siswaList.find(s => s.id.toString() === value);
                                        setSelectedSiswa(siswa || null);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih siswa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {siswaList.map((siswa) => (
                                            <SelectItem key={siswa.id} value={siswa.id.toString()}>
                                                {siswa.nama_lengkap}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal *</Label>
                                <Input
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mood & Activity */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">😊 Mood & Aktivitas</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Mood</Label>
                                <Select value={data.mood} onValueChange={(value) => setData('mood', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mood" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Happy">😊 Happy</SelectItem>
                                        <SelectItem value="Neutral">😐 Neutral</SelectItem>
                                        <SelectItem value="Sad">😢 Sad</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Aktivitas Hari Ini</Label>
                                <Textarea
                                    value={data.activity}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('activity', e.target.value)
                                    }
                                    placeholder="Jelaskan aktivitas hari ini..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Makanan */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">🍽️ Makanan & Minuman</h2>
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Sarapan Pagi</Label>
                                    <Select
                                        value={data.sarapan_pagi}
                                        onValueChange={(value) => setData('sarapan_pagi', value)}
                                        disabled={!selectedSiswa}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={selectedSiswa ? "Pilih menu sarapan" : "Pilih siswa terlebih dahulu"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getFilteredMenu('sarapan').map((menu) => (
                                                <SelectItem key={menu.id} value={menu.nama_menu}>
                                                    {menu.nama_menu}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Rating Sarapan</Label>
                                    <StarRating
                                        value={data.sarapan_status}
                                        onChange={(value) => setData('sarapan_status', value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {data.sarapan_status === 0 && 'Belum dinilai'}
                                        {data.sarapan_status === 1 && '⭐ Tidak dimakan'}
                                        {data.sarapan_status === 2 && '⭐⭐ Sedikit'}
                                        {data.sarapan_status === 3 && '⭐⭐⭐ Cukup'}
                                        {data.sarapan_status === 4 && '⭐⭐⭐⭐ Banyak'}
                                        {data.sarapan_status === 5 && '⭐⭐⭐⭐⭐ Habis'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Makan Siang</Label>
                                    <Select
                                        value={data.makan_siang}
                                        onValueChange={(value) => setData('makan_siang', value)}
                                        disabled={!selectedSiswa}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={selectedSiswa ? "Pilih menu makan siang" : "Pilih siswa terlebih dahulu"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getFilteredMenu('makan_siang').map((menu) => (
                                                <SelectItem key={menu.id} value={menu.nama_menu}>
                                                    {menu.nama_menu}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Rating Makan Siang</Label>
                                    <StarRating
                                        value={data.makan_siang_status}
                                        onChange={(value) => setData('makan_siang_status', value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {data.makan_siang_status === 0 && 'Belum dinilai'}
                                        {data.makan_siang_status === 1 && '⭐ Tidak dimakan'}
                                        {data.makan_siang_status === 2 && '⭐⭐ Sedikit'}
                                        {data.makan_siang_status === 3 && '⭐⭐⭐ Cukup'}
                                        {data.makan_siang_status === 4 && '⭐⭐⭐⭐ Banyak'}
                                        {data.makan_siang_status === 5 && '⭐⭐⭐⭐⭐ Habis'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Snack Sore</Label>
                                    <Select
                                        value={data.snack_sore}
                                        onValueChange={(value) => setData('snack_sore', value)}
                                        disabled={!selectedSiswa}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={selectedSiswa ? "Pilih menu snack" : "Pilih siswa terlebih dahulu"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getFilteredMenu('snack').map((menu) => (
                                                <SelectItem key={menu.id} value={menu.nama_menu}>
                                                    {menu.nama_menu}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Rating Snack</Label>
                                    <StarRating
                                        value={data.snack_status}
                                        onChange={(value) => setData('snack_status', value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {data.snack_status === 0 && 'Belum dinilai'}
                                        {data.snack_status === 1 && '⭐ Tidak dimakan'}
                                        {data.snack_status === 2 && '⭐⭐ Sedikit'}
                                        {data.snack_status === 3 && '⭐⭐⭐ Cukup'}
                                        {data.snack_status === 4 && '⭐⭐⭐⭐ Banyak'}
                                        {data.snack_status === 5 && '⭐⭐⭐⭐⭐ Habis'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Minum Air Putih</Label>
                                    <Input
                                        value={data.minum_air_putih}
                                        onChange={(e) => setData('minum_air_putih', e.target.value)}
                                        placeholder="3 gelas"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Minum Susu</Label>
                                    <Input
                                        value={data.minum_susu}
                                        onChange={(e) => setData('minum_susu', e.target.value)}
                                        placeholder="1 kotak"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tidur & Toilet */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">😴 Tidur & Toilet</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="tidur_siang"
                                    checked={data.tidur_siang}
                                    onCheckedChange={(checked) => setData('tidur_siang', Boolean(checked))}
                                />
                                <Label htmlFor="tidur_siang">Tidur Siang</Label>
                            </div>
                            {data.tidur_siang && (
                                <div className="space-y-2">
                                    <Label>Durasi Tidur</Label>
                                    <Input
                                        value={data.tidur_siang_durasi}
                                        onChange={(e) => setData('tidur_siang_durasi', e.target.value)}
                                        placeholder="1 jam"
                                    />
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="bak"
                                            checked={data.bak}
                                            onCheckedChange={(checked) => setData('bak', Boolean(checked))}
                                        />
                                        <Label htmlFor="bak">BAK</Label>
                                    </div>
                                    {data.bak && (
                                        <Input
                                            type="number"
                                            inputMode="numeric"
                                            value={data.bak_frekuensi}
                                            onChange={(e) => setData('bak_frekuensi', e.target.value)}
                                            placeholder="Frekuensi (contoh: 3)"
                                            min="0"
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="bab"
                                            checked={data.bab}
                                            onCheckedChange={(checked) => setData('bab', Boolean(checked))}
                                        />
                                        <Label htmlFor="bab">BAB</Label>
                                    </div>
                                    {data.bab && (
                                        <Input
                                            type="number"
                                            inputMode="numeric"
                                            value={data.bab_frekuensi}
                                            onChange={(e) => setData('bab_frekuensi', e.target.value)}
                                            placeholder="Frekuensi (contoh: 1)"
                                            min="0"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Catatan */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">📝 Catatan</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kebutuhan Besok</Label>
                                <Textarea
                                    value={data.kebutuhan_besok}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('kebutuhan_besok', e.target.value)
                                    }
                                    placeholder="Bawa baju ganti, dll"
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Catatan Khusus</Label>
                                <Textarea
                                    value={data.catatan_khusus}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('catatan_khusus', e.target.value)
                                    }
                                    placeholder="Catatan penting..."
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Catatan Insiden</Label>
                                <Textarea
                                    value={data.catatan_insiden}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('catatan_insiden', e.target.value)
                                    }
                                    placeholder="Jika ada insiden..."
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Foto */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">📸 Foto Kegiatan</h2>
                        <Input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setData('foto_kegiatan', file);

                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setPreviewUrl(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                } else {
                                    setPreviewUrl(null);
                                }
                            }}
                        />
                        {previewUrl && (
                            <div className="relative">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full rounded-lg shadow-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('foto_kegiatan', null);
                                        setPreviewUrl(null);
                                    }}
                                    className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="h-12 w-full text-base"
                        disabled={processing || isSubmitting.current || !data.siswa_id || !data.tanggal}
                    >
                        <Save className="mr-2 h-5 w-5" />
                        {(processing || isSubmitting.current) ? 'Menyimpan...' : 'Simpan Daily Report'}
                    </Button>

                    {(processing || isSubmitting.current) && (
                        <p className="text-center text-sm text-muted-foreground">
                            Mohon tunggu, sedang menyimpan data...
                        </p>
                    )}
                </form>
            </div>
        </>
    );
}
