import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEventHandler } from 'react';

interface News {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string | null;
    is_published: boolean;
    published_at: string | null;
}

interface Props {
    news: News;
}

export default function EditNews({ news }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: news.title,
        excerpt: news.excerpt,
        content: news.content,
        image: null as File | null,
        is_published: news.is_published,
        published_at: news.published_at ? new Date(news.published_at).toISOString().slice(0, 16) : '',
        _method: 'PUT',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/news/${news.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Berita" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Berita</h1>
                    <p className="text-muted-foreground mt-1">Update berita atau artikel</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt / Ringkasan *</Label>
                                <Textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    rows={3}
                                    required
                                />
                                {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Konten *</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={10}
                                    required
                                />
                                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Gambar</Label>
                                {news.image && !data.image && (
                                    <div className="mb-2">
                                        <img
                                            src={`/assets/images/berita/${news.image}`}
                                            alt="Current"
                                            className="h-32 w-auto rounded border"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('image', file);
                                    }}
                                />
                                {data.image && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(data.image)}
                                            alt="Preview"
                                            className="h-32 w-auto rounded border"
                                        />
                                    </div>
                                )}
                                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_published"
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                />
                                <Label htmlFor="is_published" className="cursor-pointer">
                                    Publish
                                </Label>
                            </div>

                            {data.is_published && (
                                <div className="space-y-2">
                                    <Label htmlFor="published_at">Tanggal Publish</Label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Kosongkan untuk menggunakan waktu sekarang
                                    </p>
                                    {errors.published_at && <p className="text-sm text-red-500">{errors.published_at}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update Berita'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
