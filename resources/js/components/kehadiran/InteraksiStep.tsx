import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import sambutanAnimation from '@/assets/absen/sambutan.json';
import kelasBackground from '@/assets/absen/kelas.webp';
import tosImage from '@/assets/absen/tos.webp';
import tinjuImage from '@/assets/absen/tinju.webp';
import tosSound from '@/assets/absen/tos.mp3';

interface Siswa {
    id: number;
    nama: string;
    foto: string | null;
}

interface InteraksiStepProps {
    mode: 'checkin' | 'checkout';
    siswa: Siswa;
    jenisInteraksi: 'tos' | 'tinju';
    onSubmit: (siswaId: number, jenis: 'tos' | 'tinju') => void;
}

export default function InteraksiStep({ mode, siswa, jenisInteraksi, onSubmit }: InteraksiStepProps) {
    const [canTap, setCanTap] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(true);
    const tosAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setTimeout(() => {
            const greeting =
                mode === 'checkin'
                    ? ` Assalamualaikum Warahmatullahi Wabarakatuh ${siswa.nama}. Silahkan melakukan ${jenisInteraksi}`
                    : ` Wassalamualaikum Warahmatullahi Wabarakatuh ${siswa.nama}. Hati hati di jalan. Silahkan melakukan ${jenisInteraksi}`;

            const utterance = new SpeechSynthesisUtterance(greeting);
            utterance.lang = 'id-ID';
            utterance.rate = 0.8;
            utterance.pitch = 1.5;

            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(
                (voice) =>
                    (voice.lang.startsWith('id') || voice.lang.startsWith('ID')) &&
                    (voice.name.toLowerCase().includes('female') ||
                        voice.name.toLowerCase().includes('wanita') ||
                        voice.name.toLowerCase().includes('damayanti') ||
                        (voice.name.toLowerCase().includes('google') && voice.name.includes('id')))
            );

            const indonesianVoice = voices.find((voice) => voice.lang.startsWith('id') || voice.lang.startsWith('ID'));

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            } else if (indonesianVoice) {
                utterance.voice = indonesianVoice;
            }

            utterance.onend = () => {
                // Tunggu 1 detik setelah selesai bicara baru ganti background
                setTimeout(() => {
                    setIsSpeaking(false);
                    setCanTap(true);
                }, 1000);
            };

            window.speechSynthesis.speak(utterance);
        }, 800);
    }, []);

    const handleTap = () => {
        if (!canTap) return;

        if (tosAudioRef.current) {
            tosAudioRef.current.play();
        }

        onSubmit(siswa.id, jenisInteraksi);
    };

    return (
        <>
            <audio ref={tosAudioRef} src={tosSound} preload="auto" />
            <div
                onClick={handleTap}
                className={`flex items-center justify-center h-screen ${canTap ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                style={{
                    backgroundImage: isSpeaking
                        ? `url(${kelasBackground})`
                        : `url(${jenisInteraksi === 'tos' ? tosImage : tinjuImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {isSpeaking && (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="bg-white/95 rounded-3xl p-12 shadow-2xl max-w-2xl">
                            <div className="w-80 h-80 mx-auto">
                                <Lottie animationData={sambutanAnimation} loop={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
