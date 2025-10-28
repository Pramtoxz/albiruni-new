<?php

namespace App\Http\Controllers;

use App\Models\PembayaranSpp;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayaranSppController extends Controller
{
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

        // Check if pembayaran belongs to current user's siswa
        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->first();

        if (!$siswa || $pembayaran->siswa_id !== $siswa->id) {
            abort(403, 'Unauthorized');
        }

        // Handle file upload
        if ($request->hasFile('bukti_bayar')) {
            // Delete old file if exists
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

        return redirect()->route('orangtua.pembayaran.index')
            ->with('success', 'Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.');
    }
}
