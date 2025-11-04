import { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import jumpAnimation from '@/assets/absen/jump.json';
import yeySound from '@/assets/absen/yey.mp3';

interface Siswa {
    id: number;
    nama: string;
    foto: string | null;
}

interface SuccessStepProps {
    mode: 'checkin' | 'checkout';
    siswa: Siswa;
}

export default function SuccessStep({ mode, siswa }: SuccessStepProps) {
    const yeyAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (yeyAudioRef.current) {
            yeyAudioRef.current.play();
        }
    }, []);

    return (
        <>
            <audio ref={yeyAudioRef} src={yeySound} preload="auto" />
            <div className="flex items-center justify-center h-screen">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12">
                    <div className="w-50 h-50 mx-auto">
                        <Lottie animationData={jumpAnimation} loop={true} />
                    </div>
                    <p className="text-4xl text-blue mt-4 drop-shadow-lg">
                        {mode === 'checkin' ? 'Selamat Datang' : 'Hati-hati di Jalan'}
                    </p>
                    <h2 className="text-7xl font-bold text-blue mt-8 drop-shadow-lg animate-pulse">{siswa.nama}</h2>
                </div>
            </div>
        </>
    );
}
