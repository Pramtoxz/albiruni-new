<?php

namespace App\Http\Controllers;

use App\Models\PembayaranSpp;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Providers\WhatsAppGateway;
use Illuminate\Support\Facades\Log;

class PembayaranSppController extends Controller
{

      public function __construct(WhatsAppGateway $whatsApp)
    {
        $this->whatsApp = $whatsApp;
    }

    public function index()
    {
        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->with('kelas')->first();

        if (!$siswa || !$siswa->status_siswa) {
            return redirect()->route('dashboard')
                ->with('error', 'Data siswa belum disetujui atau belum terdaftar.');
        }

        $pembayaran = PembayaranSpp::where('siswa_id', $siswa->id)
            ->with(['kelas'])
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->get();

        return Inertia::render('orangtua/pembayaran/index', [
            'siswa' => $siswa,
            'pembayaran' => $pembayaran,
        ]);
    }

    public function upload(Request $request, PembayaranSpp $pembayaran)
    {
        $validated = $request->validate([
            'bukti_bayar' => 'required|image|max:2048',
            'tanggal_bayar' => 'required|date',
        ]);

        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->first();

        if (!$siswa || $pembayaran->siswa_id !== $siswa->id) {
            abort(403, 'Unauthorized');
        }

        if ($request->hasFile('bukti_bayar')) {
            if ($pembayaran->bukti_bayar) {
                $oldPath = public_path('assets/images/bukti_bayar/' . $pembayaran->bukti_bayar);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $file = $request->file('bukti_bayar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/images/bukti_bayar'), $filename);
            $validated['bukti_bayar'] = $filename;
        }

        $pembayaran->update([
            'bukti_bayar' => $validated['bukti_bayar'],
            'tanggal_bayar' => $validated['tanggal_bayar'],
            'status_bayar' => 'menunggu_verifikasi',
        ]);
        try {
                    $namaSiswa= $siswa->nama_lengkap;
                    $nomorTujuan = '6281918285109';
                    $pesan = "🔔 *Notifikasi Pembayaran Baru* 🔔\n\n" . 
                            "Orang tua dari siswa *{$namaSiswa}* telah mengunggah bukti pembayaran untuk SPP bulan *{$bulanBayar} {$tahunBayar}*.\n\n" .
                            "Mohon untuk segera melakukan verifikasi.";                 
                    
                 $this->whatsApp->sendText($nomorTujuan, $pesan);

                } catch (\Exception $waException) {
                    Log::error('Gagal mengirim notifikasi WhatsApp: ' . $waException->getMessage());
                }

        return redirect()->route('orangtua.pembayaran.index')
            ->with('success', 'Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.');
    }
}
