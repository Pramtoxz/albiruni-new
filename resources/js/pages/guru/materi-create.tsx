import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, FileUp, Upload } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function MateriCreate() {
    const { data, setData, processing } = useForm({
        title: '',
        subject: '',
        class: '',
        description: '',
        file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post('/guru/materi', data);
    };

    return (
        <>
            <Head title="Upload Materi" />
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-6">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 bg-primary px-4 py-4 text-primary-foreground shadow-md">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary-foreground/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">Upload Materi</h1>
                            <p className="text-sm opacity-90">Tambah materi pembelajaran baru</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="mx-auto max-w-4xl space-y-4 p-4">
                    {/* Info Materi */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">📚 Informasi Materi</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Materi *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Contoh: Mengenal Angka 1-10"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Mata Pelajaran *</Label>
                                    <Select
                                        value={data.subject}
                                        onValueChange={(value) => setData('subject', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih mata pelajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Matematika">Matematika</SelectItem>
                                            <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                                            <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
                                            <SelectItem value="Seni">Seni & Kreativitas</SelectItem>
                                            <SelectItem value="Olahraga">Olahraga</SelectItem>
                                            <SelectItem value="Agama">Pendidikan Agama</SelectItem>
                                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="class">Kelas *</Label>
                                    <Select value={data.class} onValueChange={(value) => setData('class', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TK A">TK A</SelectItem>
                                            <SelectItem value="TK B">TK B</SelectItem>
                                            <SelectItem value="Kelompok Bermain">Kelompok Bermain</SelectItem>
                                            <SelectItem value="Semua Kelas">Semua Kelas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Jelaskan tentang materi ini..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Upload File */}
                    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">📎 Upload File</h2>

                        <div className="space-y-2">
                            <Label htmlFor="file">File Materi *</Label>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                                        onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                        className="flex-1"
                                        required
                                    />
                                    <Button type="button" size="icon" variant="outline">
                                        <FileUp className="h-5 w-5" />
                                    </Button>
                                </div>
                                {data.file && (
                                    <div className="rounded-lg border bg-muted/50 p-3">
                                        <p className="text-sm font-medium">{data.file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(data.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Format yang didukung: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG (Max 10MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="sticky bottom-0 bg-background/95 pt-4 pb-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <Button type="submit" className="h-12 w-full text-base" disabled={processing}>
                            <Upload className="mr-2 h-5 w-5" />
                            {processing ? 'Mengupload...' : 'Upload Materi'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
