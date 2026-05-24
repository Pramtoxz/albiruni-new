import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import ConfirmDialog from '@/components/confirm-dialog';
import { useState } from 'react';

interface Event {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    start_date: string;
    end_date: string;
    is_active: boolean;
    priority: number;
    created_by: string;
    created_at: string;
}

interface Props {
    events: Event[];
}

export default function EventsIndex({ events }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        id: number | null;
        title: string;
    }>({
        open: false,
        id: null,
        title: '',
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/events/${id}/toggle-active`);
    };

    const handleDelete = () => {
        if (deleteDialog.id) {
            router.delete(`/admin/events/${deleteDialog.id}`);
            setDeleteDialog({ open: false, id: null, title: '' });
        }
    };

    return (
        <AppLayout>
            <Head title="Kelola Event" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Kelola Event</h1>
                        <p className="text-muted-foreground mt-1">Kelola event dan pengumuman untuk orang tua</p>
                    </div>
                    <Link href="/admin/events/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Event
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Gambar</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Periode</TableHead>
                                <TableHead>Urutan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Dibuat Oleh</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Belum ada event
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>
                                            {event.image_url ? (
                                                <img
                                                    src={`/assets/images/events/${event.image_url}`}
                                                    alt={event.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium max-w-xs">
                                            <div className="truncate">{event.title}</div>
                                            <div className="text-sm text-muted-foreground truncate">{event.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {formatDate(event.start_date)} - {formatDate(event.end_date)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{event.priority}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={event.is_active}
                                                    onCheckedChange={() => handleToggleActive(event.id)}
                                                />
                                                <span className="text-sm">
                                                    {event.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{event.created_by}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/events/${event.id}/edit`}>
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
                                                            id: event.id,
                                                            title: event.title,
                                                        })
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
                description={`Apakah Anda yakin ingin menghapus event <strong>"${deleteDialog.title}"</strong>?<br /><br />Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                variant="destructive"
            />
        </AppLayout>
    );
}
