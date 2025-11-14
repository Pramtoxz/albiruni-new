import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface News {
    id: number;
    title: string;
    excerpt: string;
    image: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}

interface Props {
    news: {
        data: News[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function NewsIndex({ news }: Props) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Hapus berita "${title}"?`)) {
            router.delete(`/admin/news/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Kelola Berita" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Kelola Berita</h1>
                        <p className="text-muted-foreground mt-1">Kelola berita dan artikel</p>
                    </div>
                    <Link href="/admin/news/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Berita
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Gambar</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Excerpt</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal Publish</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Belum ada berita
                                    </TableCell>
                                </TableRow>
                            ) : (
                                news.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.image ? (
                                                <img
                                                    src={`/assets/images/berita/${item.image}`}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                                                    No Image
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{item.excerpt}</TableCell>
                                        <TableCell>
                                            {item.is_published ? (
                                                <Badge variant="default">Published</Badge>
                                            ) : (
                                                <Badge variant="secondary">Draft</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{formatDate(item.published_at ?? undefined)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/news/${item.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id, item.title)}
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

                {news.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {news.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
