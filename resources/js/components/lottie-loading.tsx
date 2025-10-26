import Lottie from 'lottie-react';
import astroAnimation from '@/assets/home/astro.json';

export function LottieLoading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-64 h-64 animate-in zoom-in-95 duration-300">
                <Lottie
                    animationData={astroAnimation}
                    loop={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <div className="mt-4 text-center animate-in slide-in-from-bottom-4 duration-500">
                <p className="text-lg font-semibold text-primary">Sedang Menerbangkan...</p>
            </div>
        </div>
    );
}
