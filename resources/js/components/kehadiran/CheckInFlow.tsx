import { useState } from 'react';
import axios from 'axios';
import PilihKelas from '@/components/kehadiran/PilihKelas';
import PilihSiswa from '@/components/kehadiran/PilihSiswa';
import InteraksiStep from '@/components/kehadiran/InteraksiStep';
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

interface CheckInFlowProps {
    cabang: Cabang;
    onModeChange: (mode: 'checkin' | 'checkout') => void;
}

export default function CheckInFlow({ cabang, onModeChange }: CheckInFlowProps) {
    const [step, setStep] = useState<'kelas' | 'siswa' | 'interaksi' | 'success'>('kelas');
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [siswaList, setSiswaList] = useState<Siswa[]>([]);
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
    const [jenisInteraksi, setJenisInteraksi] = useState<'tos' | 'tinju' | null>(null);

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
                    exclude_hadir: true
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
        const random = Math.random() > 0.5 ? 'tos' : 'tinju';
        setJenisInteraksi(random);
        setStep('interaksi');
    };

    const handleSubmit = async (siswaId: number, jenis: 'tos' | 'tinju') => {
        try {
            await axios.post('/kehadiran/api/hadir', {
                siswa_id: siswaId,
                jenis_interaksi: jenis,
            });
            setStep('success');
            setTimeout(() => resetFlow(), 3000);
        } catch (error) {
            console.error('Error submitting kehadiran:', error);
            resetFlow();
        }
    };

    const resetFlow = () => {
        setStep('kelas');
        setSelectedSiswa(null);
        setJenisInteraksi(null);
        setSiswaList([]);
    };

    if (step === 'kelas') {
        return (
            <PilihKelas
                mode="checkin"
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
                mode="checkin"
                siswaList={siswaList}
                onSelectSiswa={handleSelectSiswa}
                onBack={() => setStep('kelas')}
            />
        );
    }

    if (step === 'interaksi' && jenisInteraksi && selectedSiswa) {
        return (
            <InteraksiStep
                mode="checkin"
                siswa={selectedSiswa}
                jenisInteraksi={jenisInteraksi}
                onSubmit={handleSubmit}
            />
        );
    }

    if (step === 'success' && selectedSiswa) {
        return <SuccessStep mode="checkin" siswa={selectedSiswa} />;
    }

    return null;
}
