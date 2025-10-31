import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Sparkles, Star, Award } from 'lucide-react';

interface DashboardHeaderProps {
    userName: string;
    userRole: 'guru' | 'orangtua';
    onLogout: () => void;
    subtitle?: string;
}

export default function DashboardHeader({ userName, userRole, onLogout, subtitle }: DashboardHeaderProps) {
    const colors = userRole === 'guru' 
        ? 'from-blue-500 via-purple-500 to-pink-500'
        : 'from-pink-400 via-purple-400 to-blue-400';
    
    const avatarColors = userRole === 'guru'
        ? 'from-blue-400 to-purple-500'
        : 'from-yellow-300 to-orange-400';

    const greeting = userRole === 'guru' ? 'Selamat Datang, Guru 👋' : 'Halo, Ayah/Bunda 👋';
    const Icon = userRole === 'guru' ? Award : Star;

    return (
        <div className={`relative bg-gradient-to-r ${colors} px-4 pb-12 pt-12 text-white shadow-lg`}>
            {/* Floating Stars Decoration */}
            <div className="absolute top-4 right-4 animate-bounce">
                <Icon className="h-6 w-6 text-yellow-300 fill-yellow-300" />
            </div>
            <div className="absolute top-12 left-8 animate-pulse">
                <Sparkles className="h-5 w-5 text-yellow-200" />
            </div>

            <div className="mb-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-14 w-14 border-4 border-white shadow-lg ring-4 ring-yellow-300/50">
                            <AvatarImage src="" />
                            <AvatarFallback className={`bg-gradient-to-br ${avatarColors} text-white text-xl font-bold`}>
                                {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-white">
                            <Star className="h-3 w-3 text-white fill-white" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium opacity-90 flex items-center gap-1">
                            {greeting}
                        </p>
                        <h1 className="text-xl font-bold drop-shadow-md">{userName}</h1>
                        {subtitle && <p className="text-xs opacity-90 mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full h-10 w-10 relative"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                        onClick={onLogout}
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
