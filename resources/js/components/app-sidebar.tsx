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
} from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavGroup[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role;

    const navGroups: NavGroup[] = [];

    if (userRole === 'admin') {
        navGroups.push({
            title: 'Platform',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
                {
                    title: 'User Activity',
                    href: '/admin/user-activity',
                    icon: Activity,
                },
            ],
        });

        navGroups.push({
            title: 'Master Data',
            items: [
                {
                    title: 'Manajemen User',
                    href: '/admin/users',
                    icon: Users,
                },
                {
                    title: 'Data Guru',
                    href: '/admin/guru',
                    icon: UserCog,
                },
                {
                    title: 'Kelas',
                    href: '/admin/kelas',
                    icon: School,
                },
                {
                    title: 'Emosi',
                    href: '/admin/emosi',
                    icon: Smile,
                },
            ],
        });

        navGroups.push({
            title: 'Transaksi',
            items: [
                {
                    title: 'Pendaftaran Siswa',
                    href: '/admin/siswa',
                    icon: UserCheck,
                },
                {
                    title: 'Data Siswa',
                    href: '/admin/siswa/approved/list',
                    icon: CheckCircle2,
                },
                {
                    title: 'Pembayaran SPP',
                    href: '/admin/pembayaran',
                    icon: CreditCard,
                },
                {
                    title: 'Daily Report',
                    href: '/admin/daily-report',
                    icon: FileText,
                },
            ],
        });

        navGroups.push({
            title: 'Konten',
            items: [
                {
                    title: 'Menu Mingguan',
                    href: '/admin/menu-mingguan',
                    icon: UtensilsCrossed,
                },
                {
                    title: 'Rencana Pembelajaran',
                    href: '/admin/rencana-pembelajaran',
                    icon: GraduationCap,
                },
                {
                    title: 'Berita',
                    href: '/admin/news',
                    icon: Newspaper,
                },
            ],
        });
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
