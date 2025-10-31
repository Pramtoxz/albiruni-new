import { Link } from '@inertiajs/react';
import { Sparkles, LucideIcon } from 'lucide-react';

interface QuickAction {
    icon: LucideIcon;
    label: string;
    color: string;
    emoji: string;
    href: string;
}

interface QuickActionsProps {
    actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
    return (
        <div className="-mt-8 px-4 relative z-20">
            <div className="grid grid-cols-4 gap-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="group flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95"
                    >
                        <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:shadow-xl transition-all transform group-hover:-translate-y-1`}>
                            <span className="text-2xl">{action.emoji}</span>
                            <div className="absolute -top-1 -right-1 bg-yellow-300 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Sparkles className="h-3 w-3 text-yellow-600" />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-gray-700 text-center leading-tight">{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
