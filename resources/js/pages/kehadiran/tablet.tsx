import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import CheckInFlow from '@/components/kehadiran/CheckInFlow';
import CheckOutFlow from '@/components/kehadiran/CheckOutFlow';
import kelasBackground from '@/assets/absen/kelas.webp';

export default function TabletKehadiran() {
    const [mode, setMode] = useState<'checkin' | 'checkout'>('checkin');
    const lokasi = localStorage.getItem('lokasi_cabang') || '';

    useEffect(() => {
        if (!lokasi) {
            window.location.href = '/kehadiran/setup';
            return;
        }

        // Load voices untuk TTS
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener('voiceschanged', () => {
                window.speechSynthesis.getVoices();
            });
        }

        // Request fullscreen
        const enterFullscreen = () => {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch((err) => {
                    console.log('Fullscreen request failed:', err);
                });
            }
        };

        setTimeout(enterFullscreen, 500);
    }, []);

    return (
        <>
            <Head title="Kehadiran Siswa" />

            <div
                className="min-h-screen p-8"
                style={{
                    backgroundImage: `url(${kelasBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {mode === 'checkin' ? (
                    <CheckInFlow lokasi={lokasi} onModeChange={setMode} />
                ) : (
                    <CheckOutFlow lokasi={lokasi} onModeChange={setMode} />
                )}
            </div>
        </>
    );
}
