import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    UserCheck,
    CheckCircle2,
    UtensilsCrossed,
    School,
    CreditCard,
    GraduationCap,
    UserCog,
    Smile,
    Newspaper,
    FileText,
    Activity,
    Calendar,
} from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavGroup[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role;
    const isIT = auth?.user?.is_it;
    const userPermissions = auth?.user?.permissions || [];

    const navGroups: NavGroup[] = [];

    if (userRole === 'admin') {
        const platformItems = [];
        const masterDataItems = [];
        const transaksiItems = [];
        const kontenItems = [];
        const itItems = [];

        if (isIT || userPermissions.includes('dashboard')) {
            platformItems.push({
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            });
        }

        if (isIT || userPermissions.includes('user-activity')) {
            platformItems.push({
                title: 'User Activity',
                href: '/admin/user-activity',
                icon: Activity,
            });
        }

        if (platformItems.length > 0) {
            navGroups.push({
                title: 'Platform',
                items: platformItems,
            });
        }

        if (isIT || userPermissions.includes('users.manage')) {
            masterDataItems.push({
                title: 'Manajemen User',
                href: '/admin/users',
                icon: Users,
            });
        }

        if (isIT || userPermissions.includes('guru.manage')) {
            masterDataItems.push({
                title: 'Data Guru',
                href: '/admin/guru',
                icon: UserCog,
            });
        }

        if (isIT || userPermissions.includes('kelas.manage')) {
            masterDataItems.push({
                title: 'Kelas',
                href: '/admin/kelas',
                icon: School,
            });
        }

        if (isIT || userPermissions.includes('emosi.manage')) {
            masterDataItems.push({
                title: 'Emosi',
                href: '/admin/emosi',
                icon: Smile,
            });
        }

        if (masterDataItems.length > 0) {
            navGroups.push({
                title: 'Master Data',
                items: masterDataItems,
            });
        }

        if (isIT || userPermissions.includes('siswa.pending')) {
            transaksiItems.push({
                title: 'Pendaftaran Siswa',
                href: '/admin/siswa',
                icon: UserCheck,
            });
        }

        if (isIT || userPermissions.includes('siswa.approved')) {
            transaksiItems.push({
                title: 'Data Siswa',
                href: '/admin/siswa/approved/list',
                icon: CheckCircle2,
            });
        }

        if (isIT || userPermissions.includes('pembayaran.manage')) {
            transaksiItems.push({
                title: 'Pembayaran SPP',
                href: '/admin/pembayaran',
                icon: CreditCard,
            });
        }

        if (isIT || userPermissions.includes('daily-report.view')) {
            transaksiItems.push({
                title: 'Daily Report',
                href: '/admin/daily-report',
                icon: FileText,
            });
        }

        if (transaksiItems.length > 0) {
            navGroups.push({
                title: 'Transaksi',
                items: transaksiItems,
            });
        }

        if (isIT || userPermissions.includes('menu-mingguan.manage')) {
            kontenItems.push({
                title: 'Menu Mingguan',
                href: '/admin/menu-mingguan',
                icon: UtensilsCrossed,
            });
        }

        if (isIT || userPermissions.includes('rencana-pembelajaran.manage')) {
            kontenItems.push({
                title: 'Rencana Pembelajaran',
                href: '/admin/rencana-pembelajaran',
                icon: GraduationCap,
            });
        }

        if (isIT || userPermissions.includes('news.manage')) {
            kontenItems.push({
                title: 'Berita',
                href: '/admin/news',
                icon: Newspaper,
            });
        }

        if (isIT || userPermissions.includes('events.manage')) {
            kontenItems.push({
                title: 'Events',
                href: '/admin/events',
                icon: Calendar,
            });
        }

        if (kontenItems.length > 0) {
            navGroups.push({
                title: 'Konten',
                items: kontenItems,
            });
        }

        if (isIT) {
            itItems.push({
                title: 'Permissions',
                href: '/admin/permissions',
                icon: Users,
            });

            navGroups.push({
                title: 'IT',
                items: itItems,
            });
        }
    } else {
        navGroups.push({
            title: 'Platform',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ],
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
