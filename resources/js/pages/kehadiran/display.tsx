import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollDirectionRef = useRef<number>(1); // 1 = down, -1 = up
    const isPausedRef = useRef<boolean>(false);

    // Force Light Mode - Multiple strategies untuk TV Xiaomi
    useEffect(() => {
        // 1. Hapus class 'dark' dari <html>
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        
        // 2. Set inline style untuk force light background
        document.documentElement.style.colorScheme = 'light';
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
        
        // 3. Add class 'light' explicitly
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
        
        // 4. Override dengan !important via style tag
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            html, body {
                color-scheme: light !important;
                background-color: #ffffff !important;
                color: #000000 !important;
            }
            * {
                color-scheme: light !important;
            }
            /* Hide scrollbar but keep functionality */
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `;
        document.head.appendChild(styleTag);
        
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

    // Auto-scroll effect
    useEffect(() => {
        if (!isStarted || !scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollSpeed = 1; // pixels per frame

        const autoScroll = () => {
            if (!container || isPausedRef.current) return;

            const maxScroll = container.scrollHeight - container.clientHeight;
            const currentScroll = container.scrollTop;
            
            // Jika sudah di bawah, pause lalu balik arah ke atas
            if (currentScroll >= maxScroll - 5 && scrollDirectionRef.current === 1) {
                isPausedRef.current = true;
                setTimeout(() => {
                    scrollDirectionRef.current = -1;
                    isPausedRef.current = false;
                }, 2000);
                return;
            }
            
            // Jika sudah di atas, pause lalu balik arah ke bawah
            if (currentScroll <= 5 && scrollDirectionRef.current === -1) {
                isPausedRef.current = true;
                setTimeout(() => {
                    scrollDirectionRef.current = 1;
                    isPausedRef.current = false;
                }, 2000);
                return;
            }

            container.scrollTop += scrollDirectionRef.current * scrollSpeed;
        };

        const scrollInterval = setInterval(autoScroll, 30); // 30ms = smooth scroll

        return () => {
            clearInterval(scrollInterval);
        };
    }, [isStarted, kehadiranList]);

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
        // Tidak ada animation popup, hanya update list
        // Musik tetap berjalan
    };

    return (
        <>
            {/* --- PERUBAHAN 2: Tambahkan meta tag color-scheme --- */}
            <Head>
                <title>Display Kehadiran</title>
                {/* Ini memberi tahu browser untuk HANYA menggunakan mode terang */}
                <meta name="color-scheme" content="light" />
            </Head>

            {/* Audio element untuk musik sekolah */}
            <audio ref={musicRef} src={albiruniMusic} preload="auto" />

            {/* Start Button Overlay */}
            {!isStarted && (
                <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center z-50">
                    <div className="text-center">
                        <h1 className="text-8xl font-bold text-white mb-8 drop-shadow-2xl animate-pulse">
                            🏫 Display Kehadiran 🏫
                        </h1>
                        <p className="text-3xl text-white mb-12">
                            Klik tombol di bawah untuk memulai
                        </p>
                        <button
                            onClick={handleStart}
                            className="bg-white text-purple-600 px-16 py-8 rounded-full text-4xl font-bold shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-3xl"
                        >
                            🚀 Mulai Display
                        </button>
                    </div>
                </div>
            )}

            <div
                className="min-h-screen p-8 bg-white"
                style={{
                    backgroundImage: `url(${kehadiranBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#ffffff',
                    colorScheme: 'light',
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Daftar Kehadiran */}
                    <div className="h-[90vh] flex flex-col">
                        <div className="flex-shrink-0 flex justify-center mb-4">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg">
                                <p className="text-3xl text-center text-gray-800 font-semibold whitespace-nowrap">
                                    {new Date().toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="text-4xl font-bold text-center text-purple-600 mt-2 whitespace-nowrap">
                                    Total Hadir: {kehadiranList.length} Siswa
                                </p>
                            </div>
                        </div>

                        {kehadiranList.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-4xl text-white font-bold text-center bg-purple-600/80 backdrop-blur-sm px-12 py-8 rounded-3xl shadow-2xl">
                                    Belum ada siswa yang hadir
                                </p>
                            </div>
                        ) : (
                            <div 
                                ref={scrollContainerRef}
                                className="flex-1 overflow-y-auto scrollbar-hide"
                                style={{
                                    scrollBehavior: 'auto',
                                }}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-4">
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
                                                    // Sembunyikan gambar jika error
                                                    e.currentTarget.style.display = 'none';
                                                    // Dapatkan parent dan ganti dengan placeholder
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        // Buat div placeholder baru
                                                        const placeholder = document.createElement('div');
                                                        placeholder.className = "w-20 h-20 rounded-full mx-auto mb-3 bg-purple-300 flex items-center justify-center text-3xl";
                                                        placeholder.innerHTML = '👤';
                                                        // Ganti img dengan placeholder
                                                        parent.prepend(placeholder);
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}