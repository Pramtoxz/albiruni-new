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
import { FormEventHandler, useState, useRef, useEffect } from 'react';
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

interface KegiatanHarian {
    id: number;
    nama_aktivitas: string;
    deskripsi?: string;
}

interface DailyReport {
    id: number;
    siswa_id: number;
    tanggal: string;
    mood: string;
    activity: string;
    sarapan_pagi: string;
    sarapan_status: number;
    makan_siang: string;
    makan_siang_status: number;
    snack_sore: string;
    snack_status: number;
    minum_air_putih: string;
    minum_susu: string;
    tidur_siang: boolean;
    tidur_siang_durasi: string;
    bak: boolean;
    bak_frekuensi: number;
    bab: boolean;
    bab_frekuensi: number;
    kebutuhan_besok: string;
    catatan_khusus: string;
    catatan_insiden: string;
    foto_kegiatan: string;
    is_final: boolean;
}

interface Props {
    report: DailyReport;
    siswaList: Siswa[];
    menuMakanan: {
        sarapan?: MenuMakanan[];
        makan_siang?: MenuMakanan[];
        snack?: MenuMakanan[];
    };
    menuMingguan?: any;
    kegiatanHarian: KegiatanHarian[];
}

export default function DailyReportEdit({ report, siswaList, menuMakanan, kegiatanHarian }: Props) {
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);

    // Format date to YYYY-MM-DD for input[type="date"]
    const formatDate = (dateString: string) => {
        if (!dateString) return new Date().toISOString().split('T')[0];
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const { data, setData, processing } = useForm({
        siswa_id: report.siswa_id.toString(),
        tanggal: formatDate(report.tanggal),
        mood: report.mood || '',
        activity: report.activity || '',
        sarapan_pagi: report.sarapan_pagi || '',
        sarapan_status: report.sarapan_status || 0,
        makan_siang: report.makan_siang || '',
        makan_siang_status: report.makan_siang_status || 0,
        snack_sore: report.snack_sore || '',
        snack_status: report.snack_status || 0,
        minum_air_putih: report.minum_air_putih || '',
        minum_susu: report.minum_susu || '',
        tidur_siang: report.tidur_siang || false,
        tidur_siang_durasi: report.tidur_siang_durasi || '',
        bak: report.bak || false,
        bak_frekuensi: report.bak_frekuensi?.toString() || '',
        bab: report.bab || false,
        bab_frekuensi: report.bab_frekuensi?.toString() || '',
        kebutuhan_besok: report.kebutuhan_besok || '',
        catatan_khusus: report.catatan_khusus || '',
        catatan_insiden: report.catatan_insiden || '',
        foto_kegiatan: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        report.foto_kegiatan ? `/assets/images/daily_reports/${report.foto_kegiatan}` : null
    );
    const isSubmitting = useRef(false);

    // Set selected siswa on mount
    useEffect(() => {
        const siswa = siswaList.find(s => s.id === report.siswa_id);
        setSelectedSiswa(siswa || null);
    }, [report.siswa_id, siswaList]);

    // Auto-fill menu when siswa is selected
    const handleSiswaChange = (siswaId: string) => {
        const siswa = siswaList.find(s => s.id.toString() === siswaId);
        setSelectedSiswa(siswa || null);

        const updates: any = {
            siswa_id: siswaId,
        };

        if (siswa?.kelas?.kategori_menu) {
            const kategori = siswa.kelas.kategori_menu;

            const sarapan = menuMakanan.sarapan?.find(m => m.kategori === kategori);
            if (sarapan) {
                updates.sarapan_pagi = sarapan.nama_menu;
            }

            const makanSiang = menuMakanan.makan_siang?.find(m => m.kategori === kategori);
            if (makanSiang) {
                updates.makan_siang = makanSiang.nama_menu;
            }

            const snack = menuMakanan.snack?.find(m => m.kategori === kategori);
            if (snack) {
                updates.snack_sore = snack.nama_menu;
            }
        }

        if (kegiatanHarian && kegiatanHarian.length > 0) {
            const activities = kegiatanHarian.map(k => k.nama_aktivitas).join(', ');
            updates.activity = activities;
        }

        setData(prev => ({
            ...prev,
            ...updates
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (processing || isSubmitting.current) {
            return;
        }

        isSubmitting.current = true;

        router.post(`/guru/daily-report/${report.id}`, {
            ...data,
            _method: 'PUT',
        }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                isSubmitting.current = false;
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Daily report berhasil diupdate',
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
            <Head title="Edit Daily Report" />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12"></div>
                <div className="absolute bottom-40 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20"></div>

                {/* Content with integrated back button */}
                <div className="pt-12 pb-4 px-4 relative z-10">
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => window.history.back()}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">Edit Daily Report 📝</h1>
                            <p className="text-sm text-gray-600">Edit laporan kegiatan harian</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="mx-auto max-w-4xl space-y-4 pb-20">
                        {/* Siswa & Tanggal */}
                        <div className="space-y-4 rounded-3xl border-0 bg-white p-4 shadow-lg">
                            <h2 className="text-lg font-semibold">Siswa & Tanggal</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Siswa *</Label>
                                    <Select
                                        value={data.siswa_id}
                                        onValueChange={handleSiswaChange}
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
                        <div className="space-y-4 rounded-3xl border-0 bg-white p-4 shadow-lg">
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
                                        placeholder="Aktivitas akan terisi otomatis setelah memilih siswa..."
                                        rows={3}
                                    />
                                    {kegiatanHarian && kegiatanHarian.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            ✓ Aktivitas dari jadwal: {kegiatanHarian.map(k => k.nama_aktivitas).join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Makanan */}
                        <div className="space-y-4 rounded-3xl border-0 bg-white p-4 shadow-lg">
                            <h2 className="text-lg font-semibold">🍽️ Makanan & Minuman</h2>
                            <div className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Sarapan Pagi</Label>
                                        <Input
                                            value={data.sarapan_pagi}
                                            onChange={(e) => setData('sarapan_pagi', e.target.value)}
                                            placeholder="Nama menu sarapan"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Rating Sarapan *</Label>
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
                                        <Input
                                            value={data.makan_siang}
                                            onChange={(e) => setData('makan_siang', e.target.value)}
                                            placeholder="Nama menu makan siang"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Rating Makan Siang *</Label>
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
                                        <Input
                                            value={data.snack_sore}
                                            onChange={(e) => setData('snack_sore', e.target.value)}
                                            placeholder="Nama snack"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Rating Snack *</Label>
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
                        <div className="space-y-4 rounded-3xl border-0 bg-white p-4 shadow-lg">
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
                        <div className="space-y-4 rounded-3xl border-0 bg-white p-4 shadow-lg">
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
                        <div className="space-y-4 rounded-3xl border-0 bg-white p-4 shadow-lg">
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
                                            setPreviewUrl(report.foto_kegiatan ? `/assets/images/daily_reports/${report.foto_kegiatan}` : null);
                                        }}
                                        className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Upload foto baru untuk mengganti foto lama
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="h-12 w-full text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                            disabled={processing || isSubmitting.current || !data.siswa_id || !data.tanggal}
                        >
                            <Save className="mr-2 h-5 w-5" />
                            {(processing || isSubmitting.current) ? 'Menyimpan...' : 'Update Daily Report'}
                        </Button>

                        {(processing || isSubmitting.current) && (
                            <p className="text-center text-sm text-gray-600">
                                Mohon tunggu, sedang menyimpan data...
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
