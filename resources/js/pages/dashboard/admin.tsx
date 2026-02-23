import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    FileText,
    UserCheck,
    ClipboardCheck,
    CreditCard,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: dashboard.url(),
    },
];

interface Stats {
    totalSiswa: number;
    totalGuru: number;
    totalUser: number;
    siswaPending: number;
    dailyReportToday: number;
    dailyReportFinal: number;
    kehadiranToday: number;
    pembayaranPending: number;
    pembayaranVerified: number;
    totalPendapatanBulanIni: number;
}

interface DailyReport {
    id: number;
    tanggal: string;
    siswa: {
        nama_lengkap: string;
    };
    user: {
        name: string;
    };
    created_at: string;
}

interface SiswaPending {
    id: number;
    nama_lengkap: string;
    tanggal_pendaftaran: string;
    user: {
        name: string;
    };
}

interface RecentUser {
    id: number | null;
    name: string;
    email: string;
    role: string;
    child_name: string | null;
    last_activity: string | null;
    is_guest: boolean;
    session_count?: number;
}

interface ChartData {
    dailyReportStats: Array<{ date: string; day: string; count: number }>;
    kehadiranStats: Array<{ date: string; day: string; count: number }>;
    pembayaranByMonth: Array<{ month: string; total: number }>;
}

interface Props {
    stats: Stats;
    dailyReportsRecent: DailyReport[];
    siswaPendingList: SiswaPending[];
    activeUsers: RecentUser[];
    charts: ChartData;
}

export default function AdminDashboard({
    stats,
    dailyReportsRecent,
    siswaPendingList,
    activeUsers,
    charts,
}: Props) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Admin</h1>
                    <p className="text-muted-foreground">
                        Ringkasan dan analisis data sekolah
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Siswa
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalSiswa}
                            </div>
                            {stats.siswaPending > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    <Link
                                        href="/admin/siswa"
                                        className="text-orange-600 hover:underline"
                                    >
                                        {stats.siswaPending} menunggu persetujuan
                                    </Link>
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Guru
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalGuru}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Guru aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Daily Report Hari Ini
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.dailyReportFinal}/{stats.dailyReportToday}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Terkirim dari total laporan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kehadiran Hari Ini
                            </CardTitle>
                            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.kehadiranToday}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Siswa hadir
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pendapatan Bulan Ini
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatRupiah(stats.totalPendapatanBulanIni)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pembayaranVerified} pembayaran terverifikasi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pembayaran Pending
                            </CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {stats.pembayaranPending}
                            </div>
                            <Link
                                href="/admin/pembayaran"
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                Lihat pembayaran →
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total User
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalUser}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Akun terdaftar
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Report (7 Hari Terakhir)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={charts.dailyReportStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        name="Laporan"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Kehadiran (7 Hari Terakhir)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={charts.kehadiranStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#82ca9d"
                                        name="Siswa Hadir"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Pendapatan SPP (6 Bulan Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={charts.pembayaranByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number | undefined) =>
                                        value !== undefined ? formatRupiah(value) : 'Rp 0'
                                    }
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#10b981"
                                    name="Pendapatan"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Daily Report Terbaru</span>
                                <Link
                                    href="/admin/daily-report"
                                    className="text-sm font-normal text-primary hover:underline"
                                >
                                    Lihat semua →
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {dailyReportsRecent.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada daily report
                                    </p>
                                ) : (
                                    dailyReportsRecent.map((report) => (
                                        <Link
                                            key={report.id}
                                            href={`/admin/daily-report/${report.id}`}
                                            className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">
                                                    {report.siswa.nama_lengkap}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    oleh {report.user.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(report.tanggal)}
                                                </p>
                                                <Badge
                                                    variant="default"
                                                    className="mt-1"
                                                >
                                                    Terkirim
                                                </Badge>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Pantau Aktivitas User</span>
                                <Link
                                    href="/admin/user-activity"
                                    className="text-sm font-normal text-primary hover:underline"
                                >
                                    Lihat semua →
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {activeUsers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada aktivitas user
                                    </p>
                                ) : (
                                    activeUsers.map((user) => (
                                        <div
                                            key={user.id ?? 'guest'}
                                            className="flex items-start justify-between p-3 rounded-lg border"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.is_guest
                                                        ? user.email
                                                        : user.role === 'orangtua' 
                                                            ? (user.child_name || 'Belum ada anak terdaftar')
                                                            : user.email
                                                    }
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={
                                                        user.is_guest 
                                                            ? 'outline' 
                                                            : user.role === 'guru' 
                                                                ? 'default' 
                                                                : 'secondary'
                                                    }
                                                    className="mb-1"
                                                >
                                                    {user.is_guest 
                                                        ? 'Guest' 
                                                        : user.role === 'guru' 
                                                            ? 'Guru' 
                                                            : 'Orang Tua'
                                                    }
                                                </Badge>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.last_activity
                                                        ? formatDate(user.last_activity)
                                                        : 'Belum aktif'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
