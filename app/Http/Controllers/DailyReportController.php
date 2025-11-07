<?php

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\Siswa;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyReportController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $guru = $user->guru;

        $reportsQuery = DailyReport::with(['siswa.kelas', 'user'])
            ->where('user_id', $user->id);

        // If guru exists, filter reports by their assigned students
        if ($guru) {
            $reportsQuery->whereHas('siswa', function ($query) use ($guru) {
                $query->where('guru_id', $guru->id);
            });
        }

        $reports = $reportsQuery
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        return Inertia::render('guru/daily-report-list', [
            'reports' => $reports,
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();
        $guru = $user->guru;

        // Filter siswa based on guru_id directly
        $siswaQuery = Siswa::with('kelas')
            ->select('id', 'nama_lengkap', 'nama_panggilan', 'kelas_id', 'guru_id');

        // If guru exists, only show their assigned students
        if ($guru) {
            $siswaQuery->where('guru_id', $guru->id);
        }

        $siswaList = $siswaQuery
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function ($siswa) {
                return [
                    'id' => $siswa->id,
                    'nama_lengkap' => $siswa->nama_lengkap,
                    'nama_panggilan' => $siswa->nama_panggilan,
                    'kelas_id' => $siswa->kelas_id,
                    'kelas' => $siswa->kelas ? [
                        'id' => $siswa->kelas->id,
                        'nama_kelas' => $siswa->kelas->nama_kelas,
                        'kategori_menu' => $siswa->kelas->kategori_menu,
                    ] : null,
                ];
            });

        // Get all emosi
        $emosis = \App\Models\Emosi::orderBy('nama_emosi')->get();

        $menuMingguan = \App\Models\MenuMingguan::with('menuHarian')
            ->where('is_active', true)
            ->first();

        $menuMakanan = [
            'sarapan' => [],
            'makan_siang' => [],
            'snack' => [],
        ];

        if ($menuMingguan) {
            // Get current day, if weekend use Friday's menu
            $now = \Carbon\Carbon::now();
            $dayOfWeek = $now->dayOfWeek; // 0 = Sunday, 6 = Saturday

            // If weekend, use Friday's menu
            if ($dayOfWeek == 0 || $dayOfWeek == 6) {
                $targetDay = 'jumat';
            } else {
                $targetDay = strtolower($now->locale('id')->dayName);
            }

            $todayMenu = $menuMingguan->menuHarian()
                ->where('hari', $targetDay)
                ->get()
                ->groupBy('waktu_makan');

            foreach ($todayMenu as $waktu => $menus) {
                $menuMakanan[$waktu] = $menus->map(function ($menu) {
                    return [
                        'id' => $menu->id,
                        'nama_menu' => $menu->nama_menu,
                        'kategori' => $menu->kategori,
                    ];
                })->values();

                if ($waktu === 'snack' && $menus->count() > 0) {
                    $snackMenu = $menus->first();
                    $menuMakanan[$waktu] = collect(['anak', 'bayi', 'staff'])->map(function ($kategori) use ($snackMenu) {
                        return [
                            'id' => $snackMenu->id,
                            'nama_menu' => $snackMenu->nama_menu,
                            'kategori' => $kategori,
                        ];
                    })->values();
                }
            }
        }

        // Get today's activities from kegiatan_harian, if weekend use Friday's activities
        $now = \Carbon\Carbon::now();
        $dayOfWeek = $now->dayOfWeek;

        // If weekend, get Friday's activities
        if ($dayOfWeek == 0 || $dayOfWeek == 6) {
            $targetDate = $now->copy()->previous(\Carbon\Carbon::FRIDAY);
        } else {
            $targetDate = $now;
        }

        $kegiatanHarian = \App\Models\KegiatanHarian::whereDate('tanggal', $targetDate->toDateString())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($kegiatan) {
                return [
                    'id' => $kegiatan->id,
                    'nama_aktivitas' => $kegiatan->nama_aktivitas,
                    'deskripsi' => $kegiatan->deskripsi,
                ];
            });

        return Inertia::render('guru/daily-report-create', [
            'siswaList' => $siswaList,
            'menuMakanan' => $menuMakanan,
            'menuMingguan' => $menuMingguan,
            'kegiatanHarian' => $kegiatanHarian,
            'emosis' => $emosis,
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

            'sarapan_pagi' => 'nullable|string|max:255',
            'sarapan_status' => 'nullable|integer|min:0|max:5',
            'makan_siang' => 'nullable|string|max:255',
            'makan_siang_status' => 'nullable|integer|min:0|max:5',
            'snack_sore' => 'nullable|string|max:255',
            'snack_status' => 'nullable|integer|min:0|max:5',

            'minum_air_putih' => 'nullable|string|max:50',
            'minum_susu' => 'nullable|string|max:50',

            'tidur_siang' => 'nullable|boolean',
            'tidur_siang_durasi' => 'nullable|string|max:50',
            'bak' => 'nullable|boolean',
            'bak_frekuensi' => 'nullable|integer|min:0',
            'bab' => 'nullable|boolean',
            'bab_frekuensi' => 'nullable|integer|min:0',

            'kebutuhan_besok' => 'nullable|string',
            'catatan_khusus' => 'nullable|string',
            'catatan_insiden' => 'nullable|string',

            'foto_kegiatan' => 'nullable|image|max:5120', // 5MB
            'emosi_ids' => 'nullable|array',
            'emosi_ids.*' => 'exists:emosis,id',
        ]);

        if ($request->hasFile('foto_kegiatan')) {
            $file = $request->file('foto_kegiatan');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/daily_reports'), $filename);
            $validated['foto_kegiatan'] = $filename;
        }

        $user = auth()->user();
        $validated['user_id'] = $user->id;

        $report = DailyReport::create($validated);

        // Attach emosis
        if (isset($validated['emosi_ids'])) {
            $report->emosis()->attach($validated['emosi_ids']);
        }

        return redirect()->route('guru.daily-report.index')
            ->with('success', 'Daily report berhasil disimpan!');
    }

    public function show(DailyReport $dailyReport): Response
    {
        $dailyReport->load(['siswa', 'user', 'emosis']);

        return Inertia::render('guru/daily-report-show', [
            'report' => $dailyReport,
        ]);
    }

    public function edit(DailyReport $dailyReport): Response|RedirectResponse
    {
        // Check if report is already finalized
        if ($dailyReport->is_final) {
            return redirect()->route('guru.daily-report.show', $dailyReport)
                ->with('error', 'Daily report sudah final dan tidak bisa diedit lagi.');
        }

        // Load siswa and emosis relationship
        $dailyReport->load(['siswa', 'emosis']);

        $user = auth()->user();
        $guru = $user->guru;

        // Filter siswa based on guru_id directly
        $siswaQuery = Siswa::with('kelas')
            ->select('id', 'nama_lengkap', 'nama_panggilan', 'kelas_id', 'guru_id');

        // If guru exists, only show their assigned students
        if ($guru) {
            $siswaQuery->where('guru_id', $guru->id);
        }

        $siswaList = $siswaQuery
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function ($siswa) {
                return [
                    'id' => $siswa->id,
                    'nama_lengkap' => $siswa->nama_lengkap,
                    'nama_panggilan' => $siswa->nama_panggilan,
                    'kelas_id' => $siswa->kelas_id,
                    'kelas' => $siswa->kelas ? [
                        'id' => $siswa->kelas->id,
                        'nama_kelas' => $siswa->kelas->nama_kelas,
                        'kategori_menu' => $siswa->kelas->kategori_menu,
                    ] : null,
                ];
            });

        $menuMingguan = \App\Models\MenuMingguan::with('menuHarian')
            ->where('is_active', true)
            ->first();

        $menuMakanan = [
            'sarapan' => [],
            'makan_siang' => [],
            'snack' => [],
        ];

        if ($menuMingguan) {
            // Get current day, if weekend use Friday's menu
            $now = \Carbon\Carbon::now();
            $dayOfWeek = $now->dayOfWeek; // 0 = Sunday, 6 = Saturday

            // If weekend, use Friday's menu
            if ($dayOfWeek == 0 || $dayOfWeek == 6) {
                $targetDay = 'jumat';
            } else {
                $targetDay = strtolower($now->locale('id')->dayName);
            }

            $todayMenu = $menuMingguan->menuHarian()
                ->where('hari', $targetDay)
                ->get()
                ->groupBy('waktu_makan');

            foreach ($todayMenu as $waktu => $menus) {
                $menuMakanan[$waktu] = $menus->map(function ($menu) {
                    return [
                        'id' => $menu->id,
                        'nama_menu' => $menu->nama_menu,
                        'kategori' => $menu->kategori,
                    ];
                })->values();

                if ($waktu === 'snack' && $menus->count() > 0) {
                    $snackMenu = $menus->first();
                    $menuMakanan[$waktu] = collect(['anak', 'bayi', 'staff'])->map(function ($kategori) use ($snackMenu) {
                        return [
                            'id' => $snackMenu->id,
                            'nama_menu' => $snackMenu->nama_menu,
                            'kategori' => $kategori,
                        ];
                    })->values();
                }
            }
        }

        // Get today's activities from kegiatan_harian, if weekend use Friday's activities
        $now = \Carbon\Carbon::now();
        $dayOfWeek = $now->dayOfWeek;

        // If weekend, get Friday's activities
        if ($dayOfWeek == 0 || $dayOfWeek == 6) {
            $targetDate = $now->copy()->previous(\Carbon\Carbon::FRIDAY);
        } else {
            $targetDate = $now;
        }

        $kegiatanHarian = \App\Models\KegiatanHarian::whereDate('tanggal', $targetDate->toDateString())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($kegiatan) {
                return [
                    'id' => $kegiatan->id,
                    'nama_aktivitas' => $kegiatan->nama_aktivitas,
                    'deskripsi' => $kegiatan->deskripsi,
                ];
            });

        // Get all emosi
        $emosis = \App\Models\Emosi::orderBy('nama_emosi')->get();

        return Inertia::render('guru/daily-report-edit', [
            'report' => $dailyReport,
            'siswaList' => $siswaList,
            'menuMakanan' => $menuMakanan,
            'menuMingguan' => $menuMingguan,
            'kegiatanHarian' => $kegiatanHarian,
            'emosis' => $emosis,
        ]);
    }

    public function update(Request $request, DailyReport $dailyReport): RedirectResponse
    {
        // Check if report is already finalized
        if ($dailyReport->is_final) {
            return redirect()->route('guru.daily-report.show', $dailyReport)
                ->with('error', 'Daily report sudah final dan tidak bisa diedit lagi.');
        }

        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'tanggal' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($request, $dailyReport) {
                    $exists = DailyReport::where('siswa_id', $request->siswa_id)
                        ->whereDate('tanggal', $value)
                        ->where('id', '!=', $dailyReport->id)
                        ->exists();

                    if ($exists) {
                        $fail('Daily report untuk siswa ini pada tanggal tersebut sudah ada.');
                    }
                },
            ],
            'mood' => 'nullable|string|max:50',
            'activity' => 'nullable|string',

            'sarapan_pagi' => 'nullable|string|max:255',
            'sarapan_status' => 'nullable|integer|min:0|max:5',
            'makan_siang' => 'nullable|string|max:255',
            'makan_siang_status' => 'nullable|integer|min:0|max:5',
            'snack_sore' => 'nullable|string|max:255',
            'snack_status' => 'nullable|integer|min:0|max:5',

            'minum_air_putih' => 'nullable|string|max:50',
            'minum_susu' => 'nullable|string|max:50',

            'tidur_siang' => 'nullable|boolean',
            'tidur_siang_durasi' => 'nullable|string|max:50',
            'bak' => 'nullable|boolean',
            'bak_frekuensi' => 'nullable|integer|min:0',
            'bab' => 'nullable|boolean',
            'bab_frekuensi' => 'nullable|integer|min:0',

            'kebutuhan_besok' => 'nullable|string',
            'catatan_khusus' => 'nullable|string',
            'catatan_insiden' => 'nullable|string',

            'foto_kegiatan' => 'nullable|image|max:5120', // 5MB
            'emosi_ids' => 'nullable|array',
            'emosi_ids.*' => 'exists:emosis,id',
        ]);

        // Handle photo upload
        if ($request->hasFile('foto_kegiatan')) {
            // Delete old photo if exists
            if ($dailyReport->foto_kegiatan) {
                $oldPhotoPath = public_path('assets/images/daily_reports/'.$dailyReport->foto_kegiatan);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                }
            }

            $file = $request->file('foto_kegiatan');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/daily_reports'), $filename);
            $validated['foto_kegiatan'] = $filename;
        }

        $dailyReport->update($validated);

        // Sync emosis
        if (isset($validated['emosi_ids'])) {
            $dailyReport->emosis()->sync($validated['emosi_ids']);
        } else {
            $dailyReport->emosis()->detach();
        }

        return redirect()->route('guru.daily-report.show', $dailyReport)
            ->with('success', 'Daily report berhasil diupdate!');
    }

    public function finalize(DailyReport $dailyReport): RedirectResponse
    {
        // Check if report is already finalized
        if ($dailyReport->is_final) {
            return redirect()->route('guru.daily-report.show', $dailyReport)
                ->with('info', 'Daily report sudah final.');
        }

        // Set report as final
        $dailyReport->update(['is_final' => true]);

        // Load siswa relationship
        $dailyReport->load('siswa');
        $siswa = $dailyReport->siswa;

        // Send notification to parent
        $notificationService = app(NotificationService::class);
        $notificationService->sendDailyReportToParent($dailyReport);

        // Send FCM push notification
        $fcmService = app(\App\Services\FcmService::class);
        $fcmService->sendToUser(
            userId: $siswa->user_id,
            title: 'Daily Report Tersedia',
            body: "Laporan harian {$siswa->nama_lengkap} sudah siap untuk dilihat",
            url: "/orangtua/daily-report/{$dailyReport->id}",
            extraData: [
                'type' => 'daily_report_final',
                'siswa_id' => $siswa->id,
                'report_id' => $dailyReport->id,
            ]
        );

        return redirect()->route('guru.daily-report.index')
            ->with('success', 'Daily report berhasil dikirim ke orang tua!');
    }

    public function orangtuaIndex(): Response
    {
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
        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->first();

        if (! $siswa || $dailyReport->siswa_id !== $siswa->id) {
            abort(403, 'Unauthorized');
        }

        $dailyReport->load(['siswa', 'user', 'emosis']);

        return Inertia::render('orangtua/daily-report-show', [
            'report' => $dailyReport,
        ]);
    }
}
