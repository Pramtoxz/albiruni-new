import { useEffect } from 'react';

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface PilihKelasProps {
    mode: 'checkin' | 'checkout';
    kelasList: Kelas[];
    onSelectKelas: (kelasId: number) => void;
    onLoadKelas: () => void;
    onModeChange: (mode: 'checkin' | 'checkout') => void;
}

export default function PilihKelas({ mode, kelasList, onSelectKelas, onLoadKelas, onModeChange }: PilihKelasProps) {
    useEffect(() => {
        onLoadKelas();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Toggle Mode Check-in / Check-out */}
            <div className="flex justify-center mb-8">
                <div className="bg-white/90 rounded-full p-2 shadow-xl flex gap-2">
                    <button
                        onClick={() => onModeChange('checkin')}
                        className={`px-8 py-4 rounded-full text-2xl font-bold transition-all ${
                            mode === 'checkin'
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-transparent text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Masuk
                    </button>
                    <button
                        onClick={() => onModeChange('checkout')}
                        className={`px-8 py-4 rounded-full text-2xl font-bold transition-all ${
                            mode === 'checkout'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-transparent text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Pulang
                    </button>
                </div>
            </div>

            <h1 className="text-4xl font-bold text-black text-center mb-12 drop-shadow-lg">
                {mode === 'checkin' ? 'Silahkan Pilih Kelas Mu' : 'Pilih Kelas untuk Pulang'}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {kelasList.map((kelas) => (
                    <button
                        key={kelas.id}
                        onClick={() => onSelectKelas(kelas.id)}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-3xl"
                        style={{ minHeight: '200px' }}
                    >
                        <div className="bg-white/90 rounded-2xl p-6">
                            <p className="text-4xl font-bold text-gray-800">{kelas.nama_kelas}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
