import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Lottie from 'lottie-react';
import jumpAnimation from '@/assets/home/astro.json';
import kehadiranBackground from '@/assets/absen/kehadiran.webp';
import albiruniMusic from '@/assets/absen/albiruni.mp3';

interface KehadiranItem {
    id: number;
    siswa_id: number;
    nama: string;
    foto: string | null;
    kelas: string;
    waktu: string;
    jenis_interaksi: 'tos' | 'tinju';
}

interface Cabang {
    id: number;
    nama_cabang: string;
}

interface Props {
    cabang: Cabang;
}

export default function DisplayKehadiran({ cabang }: Props) {
    const [kehadiranList, setKehadiranList] = useState<KehadiranItem[]>([]);
    const [latestKehadiran, setLatestKehadiran] = useState<KehadiranItem | null>(null);
    const [showAnimation, setShowAnimation] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [lastId, setLastId] = useState<number>(() => {
        // Load lastId dari localStorage
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('kehadiran_date');

        // Reset jika hari berbeda
        if (savedDate !== today) {
            localStorage.setItem('kehadiran_date', today);
            localStorage.setItem('kehadiran_last_id', '0');
            return 0;
        }

        return parseInt(localStorage.getItem('kehadiran_last_id') || '0');
    });

    const musicRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        loadKehadiranHariIni();

        if (isStarted) {
            // Polling setiap 3 detik untuk update
            const interval = setInterval(() => {
                checkNewKehadiran();
            }, 3000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [isStarted]);

    const handleStart = () => {
        // Play musik
        if (musicRef.current) {
            musicRef.current.loop = true;
            musicRef.current.volume = 0.3;
            musicRef.current.play();
        }

        // Request fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log('Fullscreen request failed:', err);
            });
        }

        setIsStarted(true);
    };

    const checkNewKehadiran = async () => {
        try {
            const response = await axios.get(`/kehadiran/api/hari-ini/${cabang.id}`);
            const newList: KehadiranItem[] = response.data;

            // Cek apakah ada kehadiran baru berdasarkan ID terbesar
            if (newList.length > 0) {
                const newestId = newList[0].id;

                // Jika ada ID baru yang lebih besar dari lastId
                if (newestId > lastId) {
                    setLastId(newestId);
                    // Simpan ke localStorage
                    localStorage.setItem('kehadiran_last_id', newestId.toString());
                    handleNewKehadiran(newList[0]);
                }
            }

            setKehadiranList(newList);
        } catch (error) {
            console.error('Error checking kehadiran:', error);
        }
    };

    const loadKehadiranHariIni = async () => {
        try {
            const response = await axios.get(`/kehadiran/api/hari-ini/${cabang.id}`);
            const data: KehadiranItem[] = response.data;
            setKehadiranList(data);

            // Set lastId ke ID terbesar saat ini jika belum ada di localStorage
            if (data.length > 0 && lastId === 0) {
                const newestId = data[0].id;
                setLastId(newestId);
                localStorage.setItem('kehadiran_last_id', newestId.toString());
            }
        } catch (error) {
            console.error('Error loading kehadiran:', error);
        }
    };

    const handleNewKehadiran = (kehadiran: KehadiranItem) => {
        setLatestKehadiran(kehadiran);
        setShowAnimation(true);

        // Musik tetap berjalan, tidak di-restart

        // Hide animation after 5 seconds
        setTimeout(() => {
            setShowAnimation(false);
            setLatestKehadiran(null);
        }, 5000);
    };

    return (
        <>
            <Head title="Display Kehadiran" />

            {/* Audio element untuk musik sekolah */}
            <audio ref={musicRef} src={albiruniMusic} preload="auto" />

            {/* Start Button Overlay */}
            {!isStarted && (
                <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center z-50">
                    <div className="text-center">
                        <h1 className="text-8xl font-bold text-white mb-8 drop-shadow-2xl animate-pulse">
                            🎉 Display Kehadiran 🎉
                        </h1>
                        <p className="text-3xl text-white mb-12">
                            Klik tombol di bawah untuk memulai
                        </p>
                        <button
                            onClick={handleStart}
                            className="bg-white text-purple-600 px-16 py-8 rounded-full text-4xl font-bold shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-3xl"
                        >
                            ▶ Mulai Display
                        </button>
                    </div>
                </div>
            )}

            <div
                className="min-h-screen p-8"
                style={{
                    backgroundImage: `url(${kehadiranBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Animation Overlay */}
                    {showAnimation && latestKehadiran && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-2xl">
                                <div className="w-64 h-64 mx-auto mb-6">
                                    <Lottie animationData={jumpAnimation} loop={true} />
                                </div>
                                {latestKehadiran.foto && (
                                    <img
                                        src={`/assets/images/foto_siswa/${latestKehadiran.foto}`}
                                        alt={latestKehadiran.nama}
                                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-8 border-purple-400"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                <h2 className="text-6xl font-bold text-gray-800 mb-4">
                                    {latestKehadiran.nama}
                                </h2>
                                {/* <p className="text-4xl text-purple-600 font-semibold mb-2">
                                    {latestKehadiran.kelas}
                                </p> */}
                                <p className="text-5xl font-bold text-green-600 animate-pulse">
                                    Sudah Hadir!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Daftar Kehadiran */}
                    <div className="bg-white/90 rounded-3xl p-8 shadow-2xl">
                        <p className="text-3xl text-center text-gray-600 mt-4">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p className="text-4xl font-bold text-center text-purple-600 mt-2">
                            Total Hadir: {kehadiranList.length} Siswa
                        </p>

                        {kehadiranList.length === 0 ? (
                            <p className="text-3xl text-gray-500 text-center py-12">
                                Belum ada siswa yang hadir
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {kehadiranList.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform"
                                    >
                                        {item.foto ? (
                                            <img
                                                src={`/assets/images/foto_siswa/${item.foto}`}
                                                alt={item.nama}
                                                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-white shadow-md"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = '<div class="w-20 h-20 rounded-full mx-auto mb-3 bg-purple-300 flex items-center justify-center text-3xl">👤</div>';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-purple-300 flex items-center justify-center text-3xl">
                                                👤
                                            </div>
                                        )}
                                        <p className="text-lg font-bold text-gray-800 text-center mb-1">
                                            {item.nama}
                                        </p>
                                        <p className="text-sm text-purple-600 text-center font-semibold">
                                            {item.kelas}
                                        </p>
                                        <p className="text-xs text-gray-500 text-center mt-1">
                                            {item.waktu}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
