import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table';
import { Eye, Search, BookOpen, Lock, Save } from 'lucide-react';
import { useState } from 'react';

interface Rapor {
    id: number;
    siswa: { id: number; nama_lengkap: string; nama_panggilan: string; kelas: { nama_kelas: string } | null };
    semester: number;
    tahun_ajaran: string;
    status: 'draft' | 'final';
    guru_kelas: string | null;
    created_at: string;
    created_by: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface PaginatedRapors {
    data: Rapor[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    rapors: PaginatedRapors;
    kelasList: Kelas[];
    tahunAjaranList: string[];
    raporAktif: boolean;
    raporSemester: string;
    raporTahunAjaran: string;
    filters: {
        tahun_ajaran?: string;
        semester?: string;
        kelas_id?: string;
        search?: string;
    };
}

export default function AdminRaporIndex({ rapors, kelasList, tahunAjaranList, raporAktif, raporSemester, raporTahunAjaran, filters }: Props) {
    const [search, setSearch]                   = useState(filters.search ?? '');
    const [tahunAjaran, setTahunAjaran]         = useState(filters.tahun_ajaran ?? 'all');
    const [semester, setSemester]               = useState(filters.semester ?? 'all');
    const [kelasId, setKelasId]                 = useState(filters.kelas_id ?? 'all');
    const [toggling, setToggling]               = useState(false);
    const [settingSemester, setSettingSemester] = useState(raporSemester);
    const [settingTA, setSettingTA]             = useState(raporTahunAjaran);
    const [savingSetting, setSavingSetting]     = useState(false);

    const applyFilter = () => {
        router.get('/admin/rapor', {
            search: search || undefined,
            tahun_ajaran: tahunAjaran !== 'all' ? tahunAjaran : undefined,
            semester: semester !== 'all' ? semester : undefined,
            kelas_id: kelasId !== 'all' ? kelasId : undefined,
        }, { preserveState: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') applyFilter();
    };

    const handleToggle = () => {
        setToggling(true);
        router.post('/admin/rapor/toggle-aktif', {}, {
            onFinish: () => setToggling(false),
        });
    };

    const handleSaveSetting = () => {
        setSavingSetting(true);
        router.post('/admin/rapor/setting', { semester: settingSemester, tahun_ajaran: settingTA }, {
            onFinish: () => setSavingSetting(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Rapor Digital" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Rapor Digital</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Daftar laporan tumbuh kembang anak semester
                        </p>
                    </div>

                    {/* Settings rapor */}
                    <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm shrink-0 min-w-[280px]">
                        {/* Toggle aktif */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {raporAktif
                                    ? <BookOpen className="h-4 w-4 text-green-600" />
                                    : <Lock className="h-4 w-4 text-muted-foreground" />
                                }
                                <div>
                                    <p className="text-sm font-medium leading-none">Pengisian Rapor</p>
                                    <p className={`text-xs mt-0.5 ${raporAktif ? 'text-green-600' : 'text-muted-foreground'}`}>
                                        {raporAktif ? 'Aktif' : 'Nonaktif'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggle}
                                disabled={toggling}
                                aria-label="Toggle pengisian rapor"
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${
                                    raporAktif ? 'bg-green-600' : 'bg-input'
                                }`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                    raporAktif ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>

                        <div className="border-t pt-3 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Periode Rapor Aktif</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Semester</p>
                                    <Select value={settingSemester} onValueChange={setSettingSemester}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Semester 1</SelectItem>
                                            <SelectItem value="2">Semester 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Tahun Ajaran</p>
                                    <Input
                                        className="h-8 text-xs"
                                        value={settingTA}
                                        onChange={(e) => setSettingTA(e.target.value)}
                                        placeholder="2024/2025"
                                    />
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="w-full h-8 text-xs"
                                onClick={handleSaveSetting}
                                disabled={savingSetting}
                            >
                                <Save className="h-3 w-3 mr-1" />
                                {savingSetting ? 'Menyimpan...' : 'Simpan Periode'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-8 w-48"
                            placeholder="Cari siswa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <Select value={tahunAjaran} onValueChange={setTahunAjaran}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Tahun Ajaran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua TA</SelectItem>
                            {tahunAjaranList.map((ta) => (
                                <SelectItem key={ta} value={ta}>{ta}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Semester</SelectItem>
                            <SelectItem value="1">Semester 1</SelectItem>
                            <SelectItem value="2">Semester 2</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={kelasId} onValueChange={setKelasId}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kelas</SelectItem>
                            {kelasList.map((k) => (
                                <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={applyFilter}>
                        <Search className="mr-1 h-4 w-4" /> Cari
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Siswa</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>Tahun Ajaran</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat Oleh</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rapors.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Tidak ada data rapor
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rapors.data.map((rapor) => (
                                    <TableRow key={rapor.id}>
                                        <TableCell>
                                            <div className="font-medium">{rapor.siswa.nama_lengkap}</div>
                                            <div className="text-muted-foreground text-xs">{rapor.siswa.nama_panggilan}</div>
                                        </TableCell>
                                        <TableCell>{rapor.siswa.kelas?.nama_kelas ?? '-'}</TableCell>
                                        <TableCell>Semester {rapor.semester}</TableCell>
                                        <TableCell>{rapor.tahun_ajaran}</TableCell>
                                        <TableCell>
                                            <Badge variant={rapor.status === 'final' ? 'default' : 'secondary'}>
                                                {rapor.status === 'final' ? 'Final' : 'Draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{rapor.created_by}</div>
                                            <div className="text-muted-foreground text-xs">{rapor.created_at}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/rapor/${rapor.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination info */}
                {rapors.total > 0 && (
                    <p className="text-sm text-muted-foreground">
                        Menampilkan {rapors.data.length} dari {rapors.total} rapor
                    </p>
                )}
            </div>
        </AppLayout>
    );
}
