import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, UtensilsCrossed } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormEventHandler, useState } from 'react';

interface MenuMakanan {
    id: number;
    nama_menu: string;
    jenis: 'sarapan' | 'makan_siang' | 'snack';
    is_active: boolean;
    created_at: string;
}

interface Props {
    menuMakanan: {
        data: MenuMakanan[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function MenuMakananIndex({ menuMakanan }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        nama_menu: '',
        jenis: '' as 'sarapan' | 'makan_siang' | 'snack' | '',
    });

    const editForm = useForm({
        nama_menu: '',
        jenis: '' as 'sarapan' | 'makan_siang' | 'snack',
        is_active: true,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/menu-makanan', {
            onSuccess: () => reset(),
        });
    };

    const handleEdit = (menu: MenuMakanan) => {
        setEditingId(menu.id);
        editForm.setData({
            nama_menu: menu.nama_menu,
            jenis: menu.jenis,
            is_active: menu.is_active,
        });
    };

    const handleUpdate = (id: number) => {
        editForm.put(`/admin/menu-makanan/${id}`, {
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus menu "${nama}"?`)) {
            router.delete(`/admin/menu-makanan/${id}`);
        }
    };

    const getJenisBadge = (jenis: string) => {
        const badges = {
            sarapan: <Badge variant="default">Sarapan</Badge>,
            makan_siang: <Badge variant="secondary">Makan Siang</Badge>,
            snack: <Badge variant="outline">Snack</Badge>,
        };
        return badges[jenis as keyof typeof badges] || jenis;
    };

    const groupedMenu = {
        sarapan: menuMakanan.data.filter((m) => m.jenis === 'sarapan'),
        makan_siang: menuMakanan.data.filter((m) => m.jenis === 'makan_siang'),
        snack: menuMakanan.data.filter((m) => m.jenis === 'snack'),
    };

    return (
        <AppLayout>
            <Head title="Menu Makanan" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Menu Makanan</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola daftar menu makanan untuk daily report
                    </p>
                </div>

                {/* Form Tambah Menu */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Menu Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="nama_menu">Nama Menu *</Label>
                                <Input
                                    id="nama_menu"
                                    value={data.nama_menu}
                                    onChange={(e) => setData('nama_menu', e.target.value)}
                                    placeholder="Nasi goreng"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Jenis *</Label>
                                <Select
                                    value={data.jenis}
                                    onValueChange={(value: string) =>
                                        setData('jenis', value as 'sarapan' | 'makan_siang' | 'snack')
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sarapan">Sarapan</SelectItem>
                                        <SelectItem value="makan_siang">Makan Siang</SelectItem>
                                        <SelectItem value="snack">Snack</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button type="submit" disabled={processing} className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Menu
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Tabel Menu - Grouped by Jenis */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Sarapan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UtensilsCrossed className="h-5 w-5" />
                                Sarapan ({groupedMenu.sarapan.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {groupedMenu.sarapan.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada menu
                                    </p>
                                ) : (
                                    groupedMenu.sarapan.map((menu) => (
                                        <div
                                            key={menu.id}
                                            className="flex items-center justify-between p-2 rounded border bg-background"
                                        >
                                            {editingId === menu.id ? (
                                                <div className="flex-1 flex gap-2">
                                                    <Input
                                                        value={editForm.data.nama_menu}
                                                        onChange={(e) =>
                                                            editForm.setData('nama_menu', e.target.value)
                                                        }
                                                        className="h-8"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleUpdate(menu.id)}
                                                        disabled={editForm.processing}
                                                    >
                                                        Simpan
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-sm">{menu.nama_menu}</span>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(menu)}
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(menu.id, menu.nama_menu)
                                                            }
                                                        >
                                                            <Trash2 className="h-3 w-3 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Makan Siang */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UtensilsCrossed className="h-5 w-5" />
                                Makan Siang ({groupedMenu.makan_siang.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {groupedMenu.makan_siang.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada menu
                                    </p>
                                ) : (
                                    groupedMenu.makan_siang.map((menu) => (
                                        <div
                                            key={menu.id}
                                            className="flex items-center justify-between p-2 rounded border bg-background"
                                        >
                                            {editingId === menu.id ? (
                                                <div className="flex-1 flex gap-2">
                                                    <Input
                                                        value={editForm.data.nama_menu}
                                                        onChange={(e) =>
                                                            editForm.setData('nama_menu', e.target.value)
                                                        }
                                                        className="h-8"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleUpdate(menu.id)}
                                                        disabled={editForm.processing}
                                                    >
                                                        Simpan
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-sm">{menu.nama_menu}</span>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(menu)}
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(menu.id, menu.nama_menu)
                                                            }
                                                        >
                                                            <Trash2 className="h-3 w-3 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Snack */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UtensilsCrossed className="h-5 w-5" />
                                Snack ({groupedMenu.snack.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {groupedMenu.snack.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada menu
                                    </p>
                                ) : (
                                    groupedMenu.snack.map((menu) => (
                                        <div
                                            key={menu.id}
                                            className="flex items-center justify-between p-2 rounded border bg-background"
                                        >
                                            {editingId === menu.id ? (
                                                <div className="flex-1 flex gap-2">
                                                    <Input
                                                        value={editForm.data.nama_menu}
                                                        onChange={(e) =>
                                                            editForm.setData('nama_menu', e.target.value)
                                                        }
                                                        className="h-8"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleUpdate(menu.id)}
                                                        disabled={editForm.processing}
                                                    >
                                                        Simpan
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-sm">{menu.nama_menu}</span>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(menu)}
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(menu.id, menu.nama_menu)
                                                            }
                                                        >
                                                            <Trash2 className="h-3 w-3 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
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
