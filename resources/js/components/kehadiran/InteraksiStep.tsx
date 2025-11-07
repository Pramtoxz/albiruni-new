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
        let fallbackTimeout: NodeJS.Timeout;
        let transitionTimeout: NodeJS.Timeout;

        const speakTimeout = setTimeout(() => {
            // Fallback timeout - PASTI akan dijalankan setelah 5 detik
            // Ini untuk handle kasus TTS tidak support atau gagal
            fallbackTimeout = setTimeout(() => {
                setIsSpeaking(false);
                setCanTap(true);
            }, 5000);

            try {
                // Cek apakah browser support speech synthesis
                if (!window.speechSynthesis) {
                    console.warn('Speech synthesis not supported');
                    return;
                }

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
                    // Clear fallback timeout karena TTS berhasil
                    clearTimeout(fallbackTimeout);
                    // Tunggu 1 detik setelah selesai bicara baru ganti background
                    transitionTimeout = setTimeout(() => {
                        setIsSpeaking(false);
                        setCanTap(true);
                    }, 1000);
                };

                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event);
                    // Jangan clear fallback, biarkan fallback yang handle
                };

                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Error in speech synthesis:', error);
                // Fallback timeout akan handle ini
            }
        }, 800);

        return () => {
            clearTimeout(speakTimeout);
            clearTimeout(fallbackTimeout);
            clearTimeout(transitionTimeout);
            // Stop speech jika component unmount
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [mode, siswa.nama, jenisInteraksi]);

    const handleTap = () => {
        if (!canTap) return;

        if (tosAudioRef.current) {
            tosAudioRef.current.play().catch((error) => {
                console.error('Audio play error:', error);
                // Lanjutkan meskipun audio gagal
            });
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
                                <Lottie 
                                    animationData={sambutanAnimation} 
                                    loop={true}
                                    rendererSettings={{
                                        preserveAspectRatio: 'xMidYMid slice',
                                        progressiveLoad: true
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
