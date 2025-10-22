import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Download, Eye, FileText, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function MateriList() {
    const [searchQuery, setSearchQuery] = useState('');

    const materiList = [
        {
            id: 1,
            title: 'Mengenal Angka 1-10',
            subject: 'Matematika',
            class: 'TK A',
            type: 'PDF',
            size: '2.5 MB',
            uploadDate: '2024-10-20',
            downloads: 15,
        },
        {
            id: 2,
            title: 'Mengenal Huruf Vokal',
            subject: 'Bahasa Indonesia',
            class: 'TK B',
            type: 'PDF',
            size: '1.8 MB',
            uploadDate: '2024-10-19',
            downloads: 22,
        },
        {
            id: 3,
            title: 'Menggambar dan Mewarnai',
            subject: 'Seni',
            class: 'TK A',
            type: 'PDF',
            size: '3.2 MB',
            uploadDate: '2024-10-18',
            downloads: 18,
        },
        {
            id: 4,
            title: 'Mengenal Warna Dasar',
            subject: 'Seni',
            class: 'Kelompok Bermain',
            type: 'PDF',
            size: '1.5 MB',
            uploadDate: '2024-10-17',
            downloads: 12,
        },
    ];

    const filteredMateri = materiList.filter(
        (materi) =>
            materi.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            materi.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            materi.class.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const getSubjectColor = (subject: string) => {
        const colors: { [key: string]: string } = {
            Matematika: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
            'Bahasa Indonesia': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
            Seni: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
        };
        return colors[subject] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    };

    return (
        <>
            <Head title="Materi Pembelajaran" />
            <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-6">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 bg-primary px-4 py-4 text-primary-foreground shadow-md">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary-foreground/10">
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold">Materi Pembelajaran</h1>
                                <p className="text-sm opacity-90">{filteredMateri.length} materi tersedia</p>
                            </div>
                        </div>
                        <Link href="/guru/materi/create">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-9 gap-1 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                            >
                                <Plus className="h-4 w-4" />
                                Upload
                            </Button>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Cari materi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 border-primary-foreground/20 bg-primary-foreground/10 pl-10 text-primary-foreground placeholder:text-primary-foreground/60"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3 p-4">
                    {filteredMateri.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Tidak ada materi yang ditemukan
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredMateri.map((materi) => (
                            <Card key={materi.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{materi.title}</h3>
                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getSubjectColor(materi.subject)}`}
                                                >
                                                    {materi.subject}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    • {materi.class}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>{materi.type}</span>
                                                <span>•</span>
                                                <span>{materi.size}</span>
                                                <span>•</span>
                                                <span>{materi.downloads} downloads</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                                            <Eye className="h-4 w-4" />
                                            Lihat
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                                            <Download className="h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
