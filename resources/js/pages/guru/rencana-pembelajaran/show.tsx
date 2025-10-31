import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, BookOpen, Download, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface KegiatanHarian {
    id: number;
    hari: string;
    tanggal: string;
    nama_aktivitas: string;
    deskripsi: string;
    target_perkembangan: string;
    alat_bahan: string;
    instruksi: string;
    foto_kegiatan: string | null;
    video_url: string | null;
    file_materi: string | null;
}

interface RencanaPembelajaran {
    id: number;
    nama_rencana: string;
    tema: string;
    sub_tema: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    is_active: boolean;
    kelas: {
        id: number;
        nama_kelas: string;
    };
    creator: {
        id: number;
        name: string;
    };
    kegiatan_harian: KegiatanHarian[];
}

interface Props {
    rencanaPembelajaran: RencanaPembelajaran;
}

const HARI_LABELS: Record<string, string> = {
    senin: 'Senin',
    selasa: 'Selasa',
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jumat',
};

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;

    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle youtube.com/watch format
    if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const videoId = urlParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle youtube.com/embed format (already embedded)
    if (url.includes('youtube.com/embed/')) {
        return url;
    }

    return null;
};

export default function GuruRencanaPembelajaranShow({ rencanaPembelajaran }: Props) {
    const sortedKegiatan = [...rencanaPembelajaran.kegiatan_harian].sort((a, b) => {
        const hariOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
        return hariOrder.indexOf(a.hari) - hariOrder.indexOf(b.hari);
    });

    return (
        <AppLayout>
            <Head title={`Detail - ${rencanaPembelajaran.nama_rencana}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/guru/rencana-pembelajaran">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{rencanaPembelajaran.nama_rencana}</h1>
                            {rencanaPembelajaran.is_active && (
                                <Badge variant="default">Aktif</Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Rencana pembelajaran untuk {rencanaPembelajaran.kelas.nama_kelas}
                        </p>
                    </div>
                </div>

                {/* Info Rencana */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Rencana</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Tema</p>
                                <p className="font-medium flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    {rencanaPembelajaran.tema}
                                </p>
                            </div>
                            {rencanaPembelajaran.sub_tema && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Sub Tema</p>
                                    <p className="font-medium">{rencanaPembelajaran.sub_tema}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Periode</p>
                            <p className="font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(rencanaPembelajaran.tanggal_mulai), 'dd MMMM yyyy', { locale: id })}
                                {' - '}
                                {format(new Date(rencanaPembelajaran.tanggal_selesai), 'dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Dibuat oleh</p>
                            <p className="font-medium">{rencanaPembelajaran.creator.name}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Kegiatan Harian */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Kegiatan Harian</h2>

                    {sortedKegiatan.length === 0 ? (
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-center text-muted-foreground">
                                    Belum ada kegiatan yang direncanakan
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        sortedKegiatan.map((kegiatan) => (
                            <Card key={kegiatan.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            {HARI_LABELS[kegiatan.hari]}
                                            <span className="text-sm font-normal text-muted-foreground">
                                                - {format(new Date(kegiatan.tanggal), 'dd MMMM yyyy', { locale: id })}
                                            </span>
                                        </CardTitle>
                                    </div>
                                    <p className="text-lg font-semibold text-primary mt-2">
                                        {kegiatan.nama_aktivitas}
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Foto Kegiatan */}
                                    {kegiatan.foto_kegiatan && (
                                        <div>
                                            <img
                                                src={`/assets/images/kegiatan/${kegiatan.foto_kegiatan}`}
                                                alt={kegiatan.nama_aktivitas}
                                                className="w-full max-w-md rounded-lg shadow-md"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="font-semibold mb-2">Deskripsi</h4>
                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                            {kegiatan.deskripsi}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">🎯 Target Perkembangan</h4>
                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                            {kegiatan.target_perkembangan}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">🛠️ Alat dan Bahan</h4>
                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                            {kegiatan.alat_bahan}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">📋 Instruksi</h4>
                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                            {kegiatan.instruksi}
                                        </p>
                                    </div>

                                    {/* Video YouTube */}
                                    {kegiatan.video_url && getYouTubeEmbedUrl(kegiatan.video_url) && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <Video className="h-5 w-5" />
                                                Video Pembelajaran
                                            </h4>
                                            <div className="aspect-video w-full max-w-2xl">
                                                <iframe
                                                    src={getYouTubeEmbedUrl(kegiatan.video_url) || ''}
                                                    title="Video Pembelajaran"
                                                    className="w-full h-full rounded-lg"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* File Materi */}
                                    {kegiatan.file_materi && (
                                        <div className="border-t pt-4">
                                            <a
                                                href={`/assets/documents/kegiatan/${kegiatan.file_materi}`}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button variant="outline" className="gap-2">
                                                    <Download className="h-4 w-4" />
                                                    Download Materi
                                                </Button>
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
