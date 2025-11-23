import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import ConfirmDialog from '@/components/confirm-dialog';

interface User {
    id: number;
    name: string;
    email: string;
    nohp: string;
    role: 'guru' | 'orangtua';
    siswa?: {
        nama: string;
    };
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

export default function UsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        id: number | null;
        name: string;
    }>({
        open: false,
        id: null,
        name: '',
    });

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            '/admin/users',
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    }, 500);

    useEffect(() => {
        if (search !== filters.search) {
            debouncedSearch(search);
        }
    }, [search]);

    const handleDelete = () => {
        if (deleteDialog.id) {
            router.delete(`/admin/users/${deleteDialog.id}`);
            setDeleteDialog({ open: false, id: null, name: '' });
        }
    };

    const getRoleBadge = (role: string) => {
        if (role === 'guru') {
            return <Badge variant="default">Guru</Badge>;
        }
        return <Badge variant="secondary">Orang Tua</Badge>;
    };

    return (
        <AppLayout>
            <Head title="Manajemen User" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen User</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola akun guru dan orang tua
                        </p>
                    </div>
                    <Link href="/admin/users/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah User
                        </Button>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari nama, email, atau nomor HP..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearch('')}
                        >
                            Reset
                        </Button>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>No. HP</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Siswa</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                        <p className="mt-2 text-muted-foreground">
                                            Belum ada user
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.nohp}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>
                                            {user.siswa ? (
                                                <span className="text-sm">
                                                    {user.siswa.nama}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                >
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleteDialog({
                                                            open: true,
                                                            id: user.id,
                                                            name: user.name,
                                                        })
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {users.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url, {
                                    preserveState: true,
                                })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    setDeleteDialog({ ...deleteDialog, open })
                }
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
                description={`Apakah Anda yakin ingin menghapus user <strong>"${deleteDialog.name}"</strong>?<br /><br />Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                variant="destructive"
            />
        </AppLayout>
    );
}
