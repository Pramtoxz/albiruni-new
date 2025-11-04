interface Siswa {
    id: number;
    nama: string;
    foto: string | null;
}

interface PilihSiswaProps {
    mode: 'checkin' | 'checkout';
    siswaList: Siswa[];
    onSelectSiswa: (siswa: Siswa) => void;
    onBack: () => void;
}

export default function PilihSiswa({ mode, siswaList, onSelectSiswa, onBack }: PilihSiswaProps) {
    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={onBack}
                className="mb-6 px-6 py-3 bg-white/80 rounded-full text-xl font-semibold hover:bg-white transition"
            >
                ← Kembali
            </button>
            <h1 className="text-6xl font-bold text-black text-center mb-12 drop-shadow-lg">
                {mode === 'checkin' ? 'Pilih Namamu' : 'Sampai Jumpa'}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {siswaList.map((siswa) => (
                    <button
                        key={siswa.id}
                        onClick={() => onSelectSiswa(siswa)}
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
                            <p className="text-2xl font-bold text-gray-800 text-center">{siswa.nama}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
