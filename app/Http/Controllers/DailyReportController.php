<?php

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\Siswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyReportController extends Controller
{
    public function index(): Response
    {
        $reports = DailyReport::with(['siswa', 'user'])
            ->where('user_id', auth()->id())
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        return Inertia::render('guru/daily-report-list', [
            'reports' => $reports,
        ]);
    }

    public function create(): Response
    {
        $siswaList = Siswa::select('id', 'nama_lengkap', 'nama_panggilan')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('guru/daily-report-create', [
            'siswaList' => $siswaList,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'tanggal' => 'required|date',
            'mood' => 'nullable|string|max:50',
            'activity' => 'nullable|string',
            
            // Menu
            'sarapan_pagi' => 'nullable|string|max:255',
            'sarapan_status' => 'nullable|in:habis,dimakan,tidak dimakan',
            'makan_siang' => 'nullable|string|max:255',
            'makan_siang_status' => 'nullable|in:habis,dimakan,tidak dimakan',
            'snack_sore' => 'nullable|string|max:255',
            'snack_status' => 'nullable|in:habis,dimakan,tidak dimakan',
            
            // Minum
            'minum_air_putih' => 'nullable|string|max:50',
            'minum_susu' => 'nullable|string|max:50',
            
            // Tidur & Toilet
            'tidur_siang' => 'nullable|boolean',
            'tidur_siang_durasi' => 'nullable|string|max:50',
            'bak' => 'nullable|boolean',
            'bak_frekuensi' => 'nullable|integer|min:0',
            'bab' => 'nullable|boolean',
            'bab_frekuensi' => 'nullable|integer|min:0',
            
            // Catatan
            'kebutuhan_besok' => 'nullable|string',
            'catatan_khusus' => 'nullable|string',
            'catatan_insiden' => 'nullable|string',
            
            // Foto
            'foto_kegiatan' => 'nullable|image|max:5120', // 5MB
        ]);

        // Handle foto upload
        if ($request->hasFile('foto_kegiatan')) {
            $validated['foto_kegiatan'] = $request->file('foto_kegiatan')->store('daily-reports', 'public');
        }

        $validated['user_id'] = auth()->id();

        DailyReport::create($validated);

        return redirect()->route('guru.daily-report.index')
            ->with('success', 'Daily report berhasil disimpan!');
    }

    public function show(DailyReport $dailyReport): Response
    {
        $dailyReport->load(['siswa', 'user']);

        return Inertia::render('guru/daily-report-show', [
            'report' => $dailyReport,
        ]);
    }

    public function orangtuaIndex(): Response
    {
        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        if (!$siswa) {
            return Inertia::render('orangtua/daily-report-list', [
                'reports' => ['data' => []],
                'siswa' => null,
            ]);
        }

        $reports = DailyReport::with(['siswa', 'user'])
            ->where('siswa_id', $siswa->id)
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        return Inertia::render('orangtua/daily-report-list', [
            'reports' => $reports,
            'siswa' => $siswa,
        ]);
    }

    public function orangtuaShow(DailyReport $dailyReport): Response
    {
        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->first();
        
        if (!$siswa || $dailyReport->siswa_id !== $siswa->id) {
            abort(403, 'Unauthorized');
        }

        $dailyReport->load(['siswa', 'user']);

        return Inertia::render('orangtua/daily-report-show', [
            'report' => $dailyReport,
        ]);
    }
}
