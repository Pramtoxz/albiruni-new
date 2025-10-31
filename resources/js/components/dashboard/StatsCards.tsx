import { Card, CardContent } from '@/components/ui/card';

interface Stat {
    label: string;
    value: string;
    total: string;
    color: string;
    emoji: string;
}

interface StatsCardsProps {
    stats: Stat[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-3 gap-3 relative z-10">
            {stats.map((stat, index) => (
                <Card key={index} className="border-0 bg-white/95 backdrop-blur shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform">
                    <CardContent className="p-3 text-center">
                        <div className="text-3xl mb-1">{stat.emoji}</div>
                        <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                            {stat.value}
                            <span className="text-sm text-gray-400">/{stat.total}</span>
                        </p>
                        <p className="text-[10px] text-gray-600 font-medium leading-tight mt-1">{stat.label}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
