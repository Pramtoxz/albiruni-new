import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Lottie from 'lottie-react';
import jumpAnimation from '@/assets/absen/jump.json';
import sambutanAnimation from '@/assets/absen/sambutan.json';
import kelasBackground from '@/assets/absen/kelas.webp';
import tosImage from '@/assets/absen/tos.webp';
import tinjuImage from '@/assets/absen/tinju.webp';
import tosSound from '@/assets/absen/tos.mp3';
import yeySound from '@/assets/absen/yey.mp3';

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Siswa {
    id: number;
    nama: string;
    foto: string | null;
}

export default function TabletKehadiran() {
    const [step, setStep] = useState<'kelas' | 'siswa' | 'interaksi' | 'success'>('kelas');
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [siswaList, setSiswaList] = useState<Siswa[]>([]);
    const [selectedKelas, setSelectedKelas] = useState<number | null>(null);
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
    const [jenisInteraksi, setJenisInteraksi] = useState<'tos' | 'tinju' | null>(null);
    const [canTap, setCanTap] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const tosAudioRef = useRef<HTMLAudioElement>(null);
    const yeyAudioRef = useRef<HTMLAudioElement>(null);

    // Get lokasi from localStorage (sudah dipilih guru di setup)
    const lokasi = localStorage.getItem('lokasi_cabang') || '';

    useEffect(() => {
        // Redirect ke setup jika belum pilih cabang
        if (!lokasi) {
            window.location.href = '/kehadiran/setup';
            return;
        }
        loadKelas();

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
                elem.requestFullscreen().catch(err => {
                    console.log('Fullscreen request failed:', err);
                });
            }
        };

        // Delay sedikit untuk memastikan halaman sudah load
        setTimeout(enterFullscreen, 500);
    }, []);

    const loadKelas = async () => {
        try {
            const response = await axios.get('/kehadiran/api/kelas', {
                params: { lokasi }
            });
            setKelasList(response.data);
        } catch (error) {
            console.error('Error loading kelas:', error);
        }
    };

    const handleSelectKelas = async (kelasId: number) => {
        setSelectedKelas(kelasId);
        try {
            // Ambil daftar siswa yang belum hadir hari ini
            const response = await axios.get(`/kehadiran/api/siswa/${kelasId}`, {
                params: {
                    lokasi,
                    exclude_hadir: true // Parameter untuk filter siswa yang sudah hadir
                }
            });
            setSiswaList(response.data);
            setStep('siswa');
        } catch (error) {
            console.error('Error loading siswa:', error);
        }
    };

    const handleSelectSiswa = (siswa: Siswa) => {
        setSelectedSiswa(siswa);
        setCanTap(false);

        // Random tos atau tinju
        const random = Math.random() > 0.5 ? 'tos' : 'tinju';
        setJenisInteraksi(random);

        // Set speaking langsung dan pindah ke step interaksi
        setIsSpeaking(true);
        setStep('interaksi');

        // Delay 0.8s untuk voice
        setTimeout(() => {
            // Text-to-Speech: Ucapan selamat datang dengan suara wanita
            const greeting = ` Assalamualaikum Warahmatullahi Wabarakatuh ${siswa.nama}. Silahkan melakukan ${random}`;
            const utterance = new SpeechSynthesisUtterance(greeting);
            utterance.lang = 'id-ID';
            utterance.rate = 0.8; // Lebih lambat agar terdengar natural
            utterance.pitch = 1.5; // Higher pitch for more feminine voice

            // Cari voice wanita Indonesia
            const voices = window.speechSynthesis.getVoices();

            // Prioritas: cari voice dengan kata kunci female/wanita
            const femaleVoice = voices.find(voice =>
                (voice.lang.startsWith('id') || voice.lang.startsWith('ID')) &&
                (voice.name.toLowerCase().includes('female') ||
                    voice.name.toLowerCase().includes('wanita') ||
                    voice.name.toLowerCase().includes('damayanti') ||
                    voice.name.toLowerCase().includes('google') && voice.name.includes('id'))
            );

            // Fallback: ambil voice Indonesia pertama
            const indonesianVoice = voices.find(voice =>
                voice.lang.startsWith('id') || voice.lang.startsWith('ID')
            );

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            } else if (indonesianVoice) {
                utterance.voice = indonesianVoice;
            }

            utterance.onend = () => {
                setIsSpeaking(false);
                setCanTap(true);
            };

            window.speechSynthesis.speak(utterance);

            setTimeout(() => {
                setCanTap(true);
            }, 5000);
        }, 800);
    };

    const handleTapInteraksi = () => {
        if (!canTap) {
            return;
        }

        if (selectedSiswa && jenisInteraksi) {
            if (tosAudioRef.current) {
                tosAudioRef.current.play();
            }

            submitKehadiran(selectedSiswa.id, jenisInteraksi);
        }
    };

    const submitKehadiran = async (siswaId: number, jenis: 'tos' | 'tinju') => {
        try {
            await axios.post('/kehadiran/api/hadir', {
                siswa_id: siswaId,
                jenis_interaksi: jenis,
            });

            setStep('success');

            // Play success sound
            if (yeyAudioRef.current) {
                yeyAudioRef.current.play();
            }

            // Reset after 3 seconds
            setTimeout(() => {
                resetFlow();
            }, 3000);
        } catch (error) {
            console.error('Error submitting kehadiran:', error);
            resetFlow();
        }
    };

    const resetFlow = () => {
        setStep('kelas');
        setSelectedKelas(null);
        setSelectedSiswa(null);
        setJenisInteraksi(null);
        setSiswaList([]);
        setCanTap(false);
    };

    return (
        <>
            <Head title="Kehadiran Siswa" />

            {/* Audio elements */}
            <audio ref={tosAudioRef} src={tosSound} preload="auto" />
            <audio ref={yeyAudioRef} src={yeySound} preload="auto" />

            <div
                className="min-h-screen p-8"
                style={{
                    backgroundImage: `url(${kelasBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Step 1: Pilih Kelas */}
                {step === 'kelas' && (
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-black text-center mb-12 drop-shadow-lg">
                            Silahkan Pilih Kelas Mu
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {kelasList.map((kelas) => (
                                <button
                                    key={kelas.id}
                                    onClick={() => handleSelectKelas(kelas.id)}
                                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-3xl"
                                    style={{
                                        minHeight: '200px',
                                    }}
                                >
                                    <div className="bg-white/90 rounded-2xl p-6">
                                        <p className="text-4xl font-bold text-gray-800">
                                            {kelas.nama_kelas}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Pilih Nama */}
                {step === 'siswa' && (
                    <div className="max-w-6xl mx-auto">
                        <button
                            onClick={() => setStep('kelas')}
                            className="mb-6 px-6 py-3 bg-white/80 rounded-full text-xl font-semibold hover:bg-white transition"
                        >
                            ← Kembali
                        </button>
                        <h1 className="text-6xl font-bold text-white text-center mb-12 drop-shadow-lg">
                            Pilih Namamu! 👋
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {siswaList.map((siswa) => (
                                <button
                                    key={siswa.id}
                                    onClick={() => handleSelectSiswa(siswa)}
                                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl hover:scale-105 transform transition-all duration-300"
                                >
                                    <div className="bg-white/95 rounded-2xl p-4">
                                        {siswa.foto && (
                                            <img
                                                src={`/assets/images/foto_siswa/${siswa.foto}`}
                                                alt={siswa.nama}
                                                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-purple-300"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <p className="text-2xl font-bold text-gray-800 text-center">
                                            {siswa.nama}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Animasi Tos/Tinju */}
                {step === 'interaksi' && jenisInteraksi && (
                    <div
                        onClick={handleTapInteraksi}
                        className={`flex items-center justify-center h-screen ${canTap ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        style={{
                            backgroundImage: isSpeaking ? `url(${kelasBackground})` : `url(${jenisInteraksi === 'tos' ? tosImage : tinjuImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Animasi Robot Sambutan saat berbicara */}
                        {isSpeaking && (
                            <div className="flex items-center justify-center w-full h-full">
                                <div className="bg-white/95 rounded-3xl p-12 shadow-2xl max-w-2xl">
                                    <div className="w-80 h-80 mx-auto">
                                        <Lottie
                                            animationData={sambutanAnimation}
                                            loop={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Success Animation */}
                {step === 'success' && (
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12">
                            <div className="w-50 h-50 mx-auto">
                                <Lottie animationData={jumpAnimation} loop={true} />
                            </div>
                            <p className="text-4xl text-blue mt-4 drop-shadow-lg">
                                Selamat Datang
                            </p>
                            {selectedSiswa && (
                                <h2 className="text-7xl font-bold text-blue mt-8 drop-shadow-lg animate-pulse">
                                    {selectedSiswa.nama}
                                </h2>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
