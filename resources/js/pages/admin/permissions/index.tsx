import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Shield, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/admin/permissions',
    },
];

interface AdminUser {
    id: number;
    name: string;
    email: string;
    active_permissions_count: number;
    total_permissions: number;
    permissions: string[];
}

interface Props {
    adminUsers: AdminUser[];
    availableMenus: Record<string, string>;
}

export default function PermissionsIndex({ adminUsers, availableMenus }: Props) {
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, put, processing, reset } = useForm<{
        permissions: string[];
    }>({
        permissions: [],
    });

    const handleEdit = (user: AdminUser) => {
        setSelectedUser(user);
        setData('permissions', user.permissions);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedUser) return;

        put(`/admin/permissions/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    const togglePermission = (menuKey: string) => {
        const currentPermissions = [...data.permissions];
        const index = currentPermissions.indexOf(menuKey);

        if (index > -1) {
            currentPermissions.splice(index, 1);
        } else {
            currentPermissions.push(menuKey);
        }

        setData('permissions', currentPermissions);
    };

    const menuGroups = {
        'Platform': ['dashboard', 'user-activity'],
        'Master Data': ['users.manage', 'guru.manage', 'kelas.manage', 'emosi.manage'],
        'Transaksi': ['siswa.pending', 'siswa.approved', 'pembayaran.manage', 'daily-report.view'],
        'Konten': ['menu-mingguan.manage', 'rencana-pembelajaran.manage', 'news.manage'],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions Management" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-3xl font-bold">Permissions Management</h1>
                    <p className="text-muted-foreground">
                        Kelola akses menu untuk setiap admin user
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Daftar Admin Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {adminUsers.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Tidak ada admin user yang perlu di-manage
                                </p>
                            ) : (
                                adminUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                            <div className="mt-2">
                                                <Badge variant="secondary">
                                                    {user.active_permissions_count} / {user.total_permissions} permissions
                                                </Badge>
                                            </div>
                                        </div>
                                        <Dialog open={isOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                                            setIsOpen(open);
                                            if (!open) {
                                                setSelectedUser(null);
                                                reset();
                                            }
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Edit Permissions
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <form onSubmit={handleSubmit}>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Permissions - {user.name}</DialogTitle>
                                                        <DialogDescription>
                                                            Pilih menu yang dapat diakses oleh user ini
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    
                                                    <div className="py-6 space-y-6">
                                                        {Object.entries(menuGroups).map(([groupName, menuKeys]) => (
                                                            <div key={groupName}>
                                                                <h3 className="font-semibold mb-3 text-sm">{groupName}</h3>
                                                                <div className="space-y-2 pl-4">
                                                                    {menuKeys.map((menuKey) => (
                                                                        <div key={menuKey} className="flex items-center space-x-2">
                                                                            <Checkbox
                                                                                id={`${user.id}-${menuKey}`}
                                                                                checked={data.permissions.includes(menuKey)}
                                                                                onCheckedChange={() => togglePermission(menuKey)}
                                                                            />
                                                                            <Label
                                                                                htmlFor={`${user.id}-${menuKey}`}
                                                                                className="text-sm font-normal cursor-pointer"
                                                                            >
                                                                                {availableMenus[menuKey]}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <DialogFooter>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setIsOpen(false)}
                                                            disabled={processing}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button type="submit" disabled={processing}>
                                                            Save Changes
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
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
