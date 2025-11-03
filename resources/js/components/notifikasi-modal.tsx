import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { Bell, FileText, CreditCard, Clock } from 'lucide-react';

interface Notifikasi {
    id: number;
    type: string;
    title: string;
    message: string;
    updated_at: string;
    url: string;
}

interface NotifikasiModalProps {
    open: boolean;
    onClose: () => void;
    notifikasi: Notifikasi[];
}

export function NotifikasiModal({ open, onClose, notifikasi }: NotifikasiModalProps) {
    const getIcon = (type: string) => {
        if (type === 'daily_report') {
            return <FileText className="h-5 w-5 text-blue-600" />;
        }
        return <CreditCard className="h-5 w-5 text-orange-600" />;
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Baru saja';
        if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} hari yang lalu`;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Bell className="h-6 w-6 text-purple-600" />
                        Notifikasi
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-3 mt-4">
                    {notifikasi && notifikasi.length > 0 ? (
                        notifikasi.map((notif) => (
                            <Link
                                key={`${notif.type}-${notif.id}`}
                                href={notif.url}
                                onClick={onClose}
                                className="block"
                            >
                                <div className="flex gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-pink-50 transition-all cursor-pointer border border-gray-200 hover:border-purple-300">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">
                                            {notif.title}
                                        </p>
                                        <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Clock className="h-3 w-3 text-gray-400" />
                                            <p className="text-xs text-gray-500">
                                                {getTimeAgo(notif.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                                <Bell className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600">Belum ada notifikasi</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
