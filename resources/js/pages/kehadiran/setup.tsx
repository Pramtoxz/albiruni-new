import { Head, router } from '@inertiajs/react';
import kelasBackground from '@/assets/absen/kelas.webp';

interface Props {
    lokasiList: string[];
}

export default function SetupKehadiran({ lokasiList }: Props) {

    const handleSelectLokasi = (lokasi: string) => {
        // Simpan ke localStorage
        localStorage.setItem('lokasi_cabang', lokasi);
        
        // Redirect ke tablet
        router.visit('/kehadiran/tablet');
    };

    return (
        <>
            <Head title="Setup Kehadiran" />

            <div
                className="min-h-screen p-8 flex items-center justify-center"
                style={{
                    backgroundImage: `url(${kelasBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="max-w-4xl w-full">
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
                        <h1 className="text-5xl font-bold text-gray-800 text-center mb-4">
                            Setup Kehadiran 🎯
                        </h1>
                        <p className="text-xl text-gray-600 text-center mb-12">
                            Pilih cabang untuk hari ini
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {lokasiList.map((lokasi, index) => (
                                <button
                                    key={lokasi}
                                    onClick={() => handleSelectLokasi(lokasi)}
                                    className="bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-3xl p-8 shadow-xl hover:scale-105 transform transition-all duration-300"
                                >
                                    <p className="text-5xl mb-4">
                                        {index === 0 ? '🏢' : '🏫'}
                                    </p>
                                    <p className="text-4xl font-bold text-center">
                                        {lokasi}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                💡 Setup ini hanya perlu dilakukan sekali di awal hari
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
