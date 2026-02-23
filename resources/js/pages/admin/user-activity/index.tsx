import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Users, Activity, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Activity',
        href: '/admin/user-activity',
    },
];

interface UserActivity {
    id: number | null;
    name: string;
    email: string;
    role: string;
    child_name: string | null;
    last_activity: string | null;
    session_count: number;
    is_guest: boolean;
}

interface Stats {
    total_users: number;
    total_guests: number;
    total_sessions: number;
}

interface Filters {
    start_date: string;
    end_date: string;
}

interface Props {
    activities: UserActivity[];
    filters: Filters;
    stats: Stats;
}

export default function UserActivityIndex({ activities, filters, stats }: Props) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date,
        end_date: filters.end_date,
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        get('/admin/user-activity', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Tidak aktif dalam periode ini';
        
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'guru':
                return 'default';
            case 'orangtua':
                return 'secondary';
            case 'guest':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'guru':
                return 'Guru';
            case 'orangtua':
                return 'Orang Tua';
            case 'guest':
                return 'Guest';
            default:
                return role;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Activity" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-3xl font-bold">Aktivitas User</h1>
                    <p className="text-muted-foreground">
                        Monitor aktivitas user dan pengunjung sistem
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total User Aktif
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                User terdaftar yang aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pengunjung Guest
                            </CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_guests}</div>
                            <p className="text-xs text-muted-foreground">
                                Sesi pengunjung tanpa login
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Sesi
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_sessions}</div>
                            <p className="text-xs text-muted-foreground">
                                Total sesi dalam periode
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Periode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilter} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Label htmlFor="start_date">Tanggal Mulai</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="end_date">Tanggal Akhir</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <Button type="submit" disabled={processing}>
                                Filter
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Aktivitas User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activities.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Tidak ada aktivitas dalam periode ini
                                </p>
                            ) : (
                                activities.map((activity, index) => (
                                    <div
                                        key={activity.id ?? `guest-${index}`}
                                        className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-sm">
                                                    {activity.name}
                                                </p>
                                                <Badge variant={getRoleBadgeVariant(activity.role)}>
                                                    {getRoleLabel(activity.role)}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.role === 'orangtua' && activity.child_name
                                                    ? `Anak: ${activity.child_name}`
                                                    : activity.email
                                                }
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(activity.last_activity)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
