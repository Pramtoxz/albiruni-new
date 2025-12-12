import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Attendance {
    id: number;
    tanggal: string;
    tanggal_formatted: string;
    check_in: string | null;
    check_out: string | null;
    catatan: string | null;
}

interface PageProps {
    todayAttendance: Attendance | null;
    recentAttendance: Attendance[];
    currentTime: string;
    [key: string]: any;
}

export default function GuruAbsensiIndex() {
    const { todayAttendance, recentAttendance } = usePage<PageProps>().props;
    const [currentTime, setCurrentTime] = useState(new Date());
    const [catatan, setCatatan] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleCheckIn = () => {
        Swal.fire({
            title: 'Check-In',
            html: `
                <p class="mb-4">Waktu: ${currentTime.toLocaleTimeString('id-ID')}</p>
                <textarea 
                    id="catatan-input" 
                    class="w-full p-2 border rounded-lg" 
                    placeholder="Catatan (opsional)"
                    rows="3"
                ></textarea>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Check-In',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const textarea = document.getElementById('catatan-input') as HTMLTextAreaElement;
                return textarea.value;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post('/guru/absensi/check-in', {
                    catatan: result.value
                }, {
                    onSuccess: () => {
                        Swal.fire('Berhasil!', 'Check-in berhasil dicatat', 'success');
                    },
                    onError: () => {
                        Swal.fire('Gagal!', 'Terjadi kesalahan', 'error');
                    }
                });
            }
        });
    };

    const handleCheckOut = () => {
        Swal.fire({
            title: 'Check-Out',
            html: `
                <p class="mb-4">Waktu: ${currentTime.toLocaleTimeString('id-ID')}</p>
                <textarea 
                    id="catatan-input" 
                    class="w-full p-2 border rounded-lg" 
                    placeholder="Catatan (opsional)"
                    rows="3"
                ></textarea>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Check-Out',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const textarea = document.getElementById('catatan-input') as HTMLTextAreaElement;
                return textarea.value;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post('/guru/absensi/check-out', {
                    catatan: result.value
                }, {
                    onSuccess: () => {
                        Swal.fire('Berhasil!', 'Check-out berhasil dicatat', 'success');
                    },
                    onError: () => {
                        Swal.fire('Gagal!', 'Terjadi kesalahan', 'error');
                    }
                });
            }
        });
    };

    const formatTime = (time: string | null) => {
        if (!time) return '-';
        return time.substring(0, 5); // HH:MM
    };



    return (
        <>
            <Head title="Absensi Guru" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-8">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 pb-8 pt-12 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <Link href="/dashboard">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Absensi Guru</h1>
                            <p className="text-sm text-white/90">Catat kehadiran Anda</p>
                        </div>
                    </div>

                    {/* Current Time Display */}
                    <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                            <Clock className="h-12 w-12 mx-auto mb-3 text-white" />
                            <div className="text-4xl font-bold mb-1">
                                {currentTime.toLocaleTimeString('id-ID')}
                            </div>
                            <div className="text-sm text-white/90">
                                {currentTime.toLocaleDateString('id-ID', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Check-In/Out Buttons */}
                <div className="px-4 -mt-4 mb-6">
                    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                        <CardContent className="p-6">
                            {!todayAttendance?.check_in ? (
                                <Button
                                    onClick={handleCheckIn}
                                    className="w-full h-16 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                                >
                                    <LogIn className="h-6 w-6 mr-2" />
                                    Check-In Sekarang
                                </Button>
                            ) : !todayAttendance?.check_out ? (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-700 mb-2">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-bold">Sudah Check-In</span>
                                        </div>
                                        <p className="text-sm text-green-600">
                                            Waktu: {formatTime(todayAttendance.check_in)}
                                        </p>
                                        {todayAttendance.catatan && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Catatan: {todayAttendance.catatan}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={handleCheckOut}
                                        className="w-full h-16 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                                    >
                                        <LogOut className="h-6 w-6 mr-2" />
                                        Check-Out Sekarang
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-700 mb-2">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-bold">Check-In</span>
                                        </div>
                                        <p className="text-sm text-green-600">
                                            Waktu: {formatTime(todayAttendance.check_in)}
                                        </p>
                                    </div>
                                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 text-orange-700 mb-2">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-bold">Check-Out</span>
                                        </div>
                                        <p className="text-sm text-orange-600">
                                            Waktu: {formatTime(todayAttendance.check_out)}
                                        </p>
                                    </div>
                                    {todayAttendance.catatan && (
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-bold">Catatan:</span> {todayAttendance.catatan}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Attendance History */}
                <div className="px-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        Riwayat Absensi
                    </h2>
                    <div className="space-y-3">
                        {recentAttendance.length > 0 ? (
                            recentAttendance.map((attendance) => (
                                <Card key={attendance.id} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="font-bold text-gray-800">
                                                    {attendance.tanggal_formatted}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {attendance.tanggal}
                                                </p>
                                            </div>
                                            {attendance.check_in && attendance.check_out && (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                    Lengkap
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-600 mb-1">Check-In</p>
                                                <p className="font-bold text-green-700">
                                                    {formatTime(attendance.check_in)}
                                                </p>
                                            </div>
                                            <div className="bg-orange-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-600 mb-1">Check-Out</p>
                                                <p className="font-bold text-orange-700">
                                                    {formatTime(attendance.check_out)}
                                                </p>
                                            </div>
                                        </div>
                                        {attendance.catatan && (
                                            <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 mb-1">Catatan</p>
                                                <p>{attendance.catatan}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-0 shadow-lg rounded-2xl">
                                <CardContent className="p-8 text-center text-gray-500">
                                    Belum ada riwayat absensi
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
