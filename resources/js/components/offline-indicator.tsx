import { useOnlineStatus } from '@/hooks/use-online-status';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-20 left-0 right-0 z-50 mx-4 animate-in slide-in-from-bottom">
            <div className="rounded-lg bg-red-500 p-3 text-center text-white shadow-lg">
                <div className="flex items-center justify-center gap-2">
                    <WifiOff className="h-5 w-5" />
                    <span className="text-sm font-medium">Tidak ada koneksi internet</span>
                </div>
            </div>
        </div>
    );
}
