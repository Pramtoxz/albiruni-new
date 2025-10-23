import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { RefreshCw, WifiOff } from 'lucide-react';

export default function Offline() {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <>
            <Head title="Tidak Ada Koneksi" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <WifiOff className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Tidak Ada Koneksi</h1>
                        <p className="text-muted-foreground">
                            Sepertinya Anda sedang offline. Periksa koneksi internet Anda dan coba lagi.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button onClick={handleRetry} className="w-full" size="lg">
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Coba Lagi
                        </Button>

                        <div className="rounded-lg border bg-card p-4 text-left">
                            <p className="mb-2 text-sm font-medium">Tips:</p>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Pastikan WiFi atau data seluler aktif</li>
                                <li>• Periksa mode pesawat tidak aktif</li>
                                <li>• Coba pindah ke area dengan sinyal lebih baik</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
