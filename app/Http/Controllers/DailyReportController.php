<?php

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\Siswa;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyReportController extends Controller
{
    public function index(): Response
    {
        /** @var User $user */
        $user = auth()->user();

        $reports = DailyReport::with(['siswa', 'user'])
            ->where('user_id', $user->id)
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

        $menuMakanan = \App\Models\MenuMakanan::where('is_active', true)
            ->orderBy('jenis')
            ->orderBy('nama_menu')
            ->get()
            ->groupBy('jenis');

        return Inertia::render('guru/daily-report-create', [
            'siswaList' => $siswaList,
            'menuMakanan' => $menuMakanan,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'tanggal' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($request) {
                    $exists = DailyReport::where('siswa_id', $request->siswa_id)
                        ->whereDate('tanggal', $value)
                        ->exists();

                    if ($exists) {
                        $fail('Daily report untuk siswa ini pada tanggal tersebut sudah ada.');
                    }
                },
            ],
            'mood' => 'nullable|string|max:50',
            'activity' => 'nullable|string',

            // Menu
            'sarapan_pagi' => 'nullable|string|max:255',
            'sarapan_status' => 'nullable|integer|min:0|max:5',
            'makan_siang' => 'nullable|string|max:255',
            'makan_siang_status' => 'nullable|integer|min:0|max:5',
            'snack_sore' => 'nullable|string|max:255',
            'snack_status' => 'nullable|integer|min:0|max:5',

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
            $file = $request->file('foto_kegiatan');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/daily_reports'), $filename);
            $validated['foto_kegiatan'] = $filename;
        }

        /** @var User $user */
        $user = auth()->user();
        $validated['user_id'] = $user->id;

        $report = DailyReport::create($validated);

        // Send WhatsApp notification to parent
        $notificationService = app(NotificationService::class);
        $notificationService->sendDailyReportToParent($report);

        // Send FCM push notification
        $siswa = $report->siswa;
        $fcmService = app(\App\Services\FcmService::class);
        $fcmService->sendToUser(
            userId: $siswa->user_id,
            title: 'Daily Report Baru',
            body: "Laporan harian {$siswa->nama_lengkap} tersedia",
            url: "/orangtua/daily-report/{$report->id}",
            extraData: [
                'type' => 'daily_report',
                'siswa_id' => $siswa->id,
                'report_id' => $report->id,
            ]
        );

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
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->first();

        if (! $siswa) {
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
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->first();

        if (! $siswa || $dailyReport->siswa_id !== $siswa->id) {
            abort(403, 'Unauthorized');
        }

        $dailyReport->load(['siswa', 'user']);

        return Inertia::render('orangtua/daily-report-show', [
            'report' => $dailyReport,
        ]);
    }
}
