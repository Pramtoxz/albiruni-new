import { useEffect } from 'react';
import pulangImage from '@/assets/absen/pulang.webp';

interface Siswa {
    id: number;
    nama: string;
    foto: string | null;
}

interface RatingStepProps {
    siswa: Siswa;
    onSelectRating: (rating: 'like' | 'no') => void;
}

export default function RatingStep({ siswa, onSelectRating }: RatingStepProps) {
    useEffect(() => {
        // Text-to-Speech
        setTimeout(() => {
            const greeting = `Bagaimana hari mu ${siswa.nama}? Silahkan pilih`;
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

            window.speechSynthesis.speak(utterance);
        }, 500);
    }, []);

    return (
        <div
            className="flex flex-col items-center justify-center h-screen"
            style={{
                backgroundImage: `url(${pulangImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex gap-12">
                {/* Tombol Like */}
                <button
                    onClick={() => onSelectRating('like')}
                    className="bg-white/95 backdrop-blur-sm rounded-full p-12 shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-3xl"
                >
                    <div className="text-center">
                        <div className="text-9xl mb-4">👍</div>
                        <p className="text-4xl font-bold text-green-600">Like</p>
                    </div>
                </button>

                {/* Tombol No */}
                <button
                    onClick={() => onSelectRating('no')}
                    className="bg-white/95 backdrop-blur-sm rounded-full p-12 shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-3xl"
                >
                    <div className="text-center">
                        <div className="text-9xl mb-4">👎</div>
                        <p className="text-4xl font-bold text-red-600">No</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
