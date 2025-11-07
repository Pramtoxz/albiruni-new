import { useState } from 'react';
import axios from 'axios';
import PilihKelas from '@/components/kehadiran/PilihKelas';
import PilihSiswa from '@/components/kehadiran/PilihSiswa';
import RatingStep from '@/components/kehadiran/RatingStep';
import SuccessStep from '@/components/kehadiran/SuccessStep';

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Siswa {
    id: number;
    nama: string;
    foto: string | null;
}

interface Cabang {
    id: number;
    nama_cabang: string;
}

interface CheckOutFlowProps {
    cabang: Cabang;
    onModeChange: (mode: 'checkin' | 'checkout') => void;
}

export default function CheckOutFlow({ cabang, onModeChange }: CheckOutFlowProps) {
    const [step, setStep] = useState<'kelas' | 'siswa' | 'rating' | 'success'>('kelas');
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [siswaList, setSiswaList] = useState<Siswa[]>([]);
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);

    const loadKelas = async () => {
        try {
            const response = await axios.get(`/kehadiran/api/kelas/${cabang.id}`);
            setKelasList(response.data);
        } catch (error) {
            console.error('Error loading kelas:', error);
        }
    };

    const handleSelectKelas = async (kelasId: number) => {
        try {
            const response = await axios.get(`/kehadiran/api/siswa/${cabang.id}/${kelasId}`, {
                params: {
                    only_hadir: true
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
        setStep('rating');
    };

    const handleRatingSelect = async (selectedRating: 'like' | 'no') => {
        if (!selectedSiswa) return;

        try {
            console.log('Sending checkout request:', {
                siswa_id: selectedSiswa.id,
                rating: selectedRating,
            });

            const response = await axios.post('/kehadiran/api/pulang', {
                siswa_id: selectedSiswa.id,
                rating: selectedRating,
            });

            console.log('Checkout response:', response.data);

            setStep('success');
            setTimeout(() => resetFlow(), 3000);
        } catch (error) {
            console.error('Error submitting pulang:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response error:', error.response?.data);
            }
            resetFlow();
        }
    };

    const resetFlow = () => {
        setStep('kelas');
        setSelectedSiswa(null);
        setSiswaList([]);
    };

    if (step === 'kelas') {
        return (
            <PilihKelas
                mode="checkout"
                kelasList={kelasList}
                onSelectKelas={handleSelectKelas}
                onLoadKelas={loadKelas}
                onModeChange={onModeChange}
            />
        );
    }

    if (step === 'siswa') {
        return (
            <PilihSiswa
                mode="checkout"
                siswaList={siswaList}
                onSelectSiswa={handleSelectSiswa}
                onBack={() => setStep('kelas')}
            />
        );
    }

    if (step === 'rating' && selectedSiswa) {
        return <RatingStep siswa={selectedSiswa} onSelectRating={handleRatingSelect} />;
    }

    if (step === 'success' && selectedSiswa) {
        return <SuccessStep mode="checkout" siswa={selectedSiswa} />;
    }

    return null;
}
