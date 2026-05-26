<?php

namespace App\Http\Controllers;

use App\Jobs\SendDailyReportNotification;
use App\Models\DailyReport;
use App\Models\Siswa;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyReportController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $guru = $user->guru;

        // Get month and year from request, default to current month
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $reportsQuery = DailyReport::with(['siswa.kelas', 'user'])
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month);

        // If guru exists, filter reports by their accessible students
        if ($guru) {
            $mainGuruId = $guru->getMainGuruId();
            
            $reportsQuery->whereHas('siswa', function ($query) use ($mainGuruId) {
                $query->where('guru_id', $mainGuruId);
            });
        }

        $reports = $reportsQuery
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        // Pre-fetch checkout status untuk semua report (1 query)
        $siswaIds = $reports->pluck('siswa_id');
        $tanggals  = $reports->pluck('tanggal')->map(fn ($t) => \Carbon\Carbon::parse($t)->toDateString());

        $checkoutKeys = \App\Models\Kehadiran::whereIn('siswa_id', $siswaIds)
            ->whereNotNull('waktu_pulang')
            ->get(['siswa_id', 'tanggal'])
            ->mapWithKeys(fn ($k) => [
                $k->siswa_id . '_' . \Carbon\Carbon::parse($k->tanggal)->toDateString() => true,
            ]);

        $reports->getCollection()->transform(function ($report) use ($checkoutKeys) {
            $key = $report->siswa_id . '_' . \Carbon\Carbon::parse($report->tanggal)->toDateString();
            $report->sudah_checkout = $checkoutKeys->has($key);
            return $report;
        });

        return Inertia::render('guru/daily-report-list', [
            'reports' => $reports,
            'filters' => [
                'month' => (int) $month,
                'year' => (int) $year,
            ],
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();
        $guru = $user->guru;

        // Filter siswa based on guru_id directly
        $siswaQuery = Siswa::with('kelas')
            ->select('id', 'nama_lengkap', 'nama_panggilan', 'kelas_id', 'guru_id')
            ->where('is_active', true);

        // If guru exists, show accessible students (guru utama or guru pendamping)
        if ($guru) {
            $mainGuruId = $guru->getMainGuruId();
            $siswaQuery->where('guru_id', $mainGuruId);
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

        $kegiatanHarian = \App\Models\KegiatanHarian::with('rencanaPembelajaran')
            ->whereDate('tanggal', $targetDate->toDateString())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($kegiatan) {
                return [
                    'id' => $kegiatan->id,
                    'nama_aktivitas' => $kegiatan->nama_aktivitas,
                    'deskripsi' => $kegiatan->deskripsi,
                    'kelas_id' => $kegiatan->kelas_id,
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
            'sarapan_status' => 'nullable|integer|min:-1|max:5',
            'makan_siang' => 'nullable|string|max:255',
            'makan_siang_status' => 'nullable|integer|min:-1|max:5',
            'snack_sore' => 'nullable|string|max:255',
            'snack_status' => 'nullable|integer|min:-1|max:5',

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

        $sudahCheckout = \App\Models\Kehadiran::where('siswa_id', $dailyReport->siswa_id)
            ->whereDate('tanggal', $dailyReport->tanggal)
            ->whereNotNull('waktu_pulang')
            ->exists();

        $missingFields = $dailyReport->getMissingFields();
        if ($dailyReport->emosis->isEmpty()) {
            $missingFields[] = 'Emosi Hari Ini';
        }

        return Inertia::render('guru/daily-report-show', [
            'report'        => $dailyReport,
            'sudahCheckout' => $sudahCheckout,
            'missingFields' => $missingFields,
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
            ->select('id', 'nama_lengkap', 'nama_panggilan', 'kelas_id', 'guru_id')
            ->where('is_active', true);

        // If guru exists, show accessible students (guru utama or guru pendamping)
        if ($guru) {
            $mainGuruId = $guru->getMainGuruId();
            $siswaQuery->where('guru_id', $mainGuruId);
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

        $kegiatanHarian = \App\Models\KegiatanHarian::with('rencanaPembelajaran')
            ->whereDate('tanggal', $targetDate->toDateString())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($kegiatan) {
                return [
                    'id' => $kegiatan->id,
                    'nama_aktivitas' => $kegiatan->nama_aktivitas,
                    'deskripsi' => $kegiatan->deskripsi,
                    'kelas_id' => $kegiatan->kelas_id,
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
            'sarapan_status' => 'nullable|integer|min:-1|max:5',
            'makan_siang' => 'nullable|string|max:255',
            'makan_siang_status' => 'nullable|integer|min:-1|max:5',
            'snack_sore' => 'nullable|string|max:255',
            'snack_status' => 'nullable|integer|min:-1|max:5',

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
        if ($dailyReport->is_final) {
            return back()->with('info', 'Daily report sudah final.');
        }

        // Jika siswa sudah pulang, hanya admin yang bisa kirim via "Kirim Terlambat"
        $sudahCheckout = \App\Models\Kehadiran::where('siswa_id', $dailyReport->siswa_id)
            ->whereDate('tanggal', $dailyReport->tanggal)
            ->whereNotNull('waktu_pulang')
            ->exists();

        if ($sudahCheckout) {
            return back()->with('error', 'Siswa sudah pulang. Hubungi admin untuk mengirimkan laporan ini.');
        }

        // Cek kelengkapan data sebelum finalisasi
        $missingFields = $dailyReport->getMissingFields();
        if ($dailyReport->emosis()->doesntExist()) {
            $missingFields[] = 'Emosi Hari Ini';
        }

        if (!empty($missingFields)) {
            return back()->with('error', 'Lengkapi data berikut sebelum finalisasi: ' . implode(', ', $missingFields));
        }

        $dailyReport->update(['is_final' => true]);

        return back()->with('success', 'Laporan difinalisasi. Notifikasi akan dikirim saat siswa checkout.');
    }

    public function orangtuaIndex(Request $request): Response
    {
        $user = auth()->user();
        $siswa = Siswa::where('user_id', $user->id)->first();

        // Get month and year from request, default to current month
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        if (! $siswa) {
            return Inertia::render('orangtua/daily-report-list', [
                'reports' => ['data' => []],
                'siswa' => null,
                'filters' => [
                    'month' => (int) $month,
                    'year' => (int) $year,
                ],
            ]);
        }

        $reports = DailyReport::with(['siswa', 'user'])
            ->where('siswa_id', $siswa->id)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        return Inertia::render('orangtua/daily-report-list', [
            'reports' => $reports,
            'siswa' => $siswa,
            'filters' => [
                'month' => (int) $month,
                'year' => (int) $year,
            ],
        ]);
    }

    public function orangtuaShow(DailyReport $dailyReport): Response
    {
        $user = auth()->user();
        
        // Authorization check berdasarkan role
        if ($user->role === 'orangtua') {
            // Orangtua: cek berdasarkan user_id di tabel siswa
            $siswaIds = Siswa::where('user_id', $user->id)->pluck('id')->toArray();

            if (empty($siswaIds)) {
                abort(403, 'Data siswa tidak ditemukan');
            }

            if (!in_array($dailyReport->siswa_id, $siswaIds)) {
                abort(403, 'Anda tidak memiliki akses ke laporan ini');
            }
        } elseif ($user->role === 'guru') {
            // Guru: cek berdasarkan guru_id di tabel siswa (termasuk guru pendamping)
            $guru = $user->guru;
            
            if ($guru) {
                $mainGuruId = $guru->getMainGuruId();
                $siswaIds = Siswa::where('guru_id', $mainGuruId)->pluck('id')->toArray();
                
                if (!in_array($dailyReport->siswa_id, $siswaIds)) {
                    abort(403, 'Daily report ini bukan untuk siswa yang Anda handle');
                }
            }
        }
        // Admin bisa akses semua

        $dailyReport->load(['siswa', 'user', 'emosis']);

        return Inertia::render('orangtua/daily-report-show', [
            'report' => $dailyReport,
        ]);
    }

    public function adminIndex(Request $request): Response
    {
        $tanggal = $request->input('tanggal', now()->toDateString());
        $kelasId = $request->input('kelas_id');
        $cabang = $request->input('cabang');
        $search = $request->input('search');
        $status = $request->input('status');

        $siswaQuery = Siswa::with(['kelas', 'user', 'guru'])
            ->where('is_active', true);

        if ($kelasId) {
            $siswaQuery->where('kelas_id', $kelasId);
        }

        if ($cabang) {
            $siswaQuery->where('lokasi_pendaftaran', $cabang);
        }

        if ($search) {
            $siswaQuery->where(function ($query) use ($search) {
                $query->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nama_panggilan', 'like', "%{$search}%");
            });
        }

        $siswaList = $siswaQuery->orderBy('nama_lengkap')->get();
        $siswaIds  = $siswaList->pluck('id');

        // Pre-fetch semua daily report + kehadiran untuk tanggal ini — hindari N+1
        $dailyReports = DailyReport::with(['user', 'emosis'])
            ->whereIn('siswa_id', $siswaIds)
            ->whereDate('tanggal', $tanggal)
            ->get()
            ->keyBy('siswa_id');

        $kehadirans = \App\Models\Kehadiran::whereIn('siswa_id', $siswaIds)
            ->whereDate('tanggal', $tanggal)
            ->get()
            ->keyBy('siswa_id');

        $data = $siswaList->map(function ($siswa, $index) use ($dailyReports, $kehadirans) {
            $dailyReport = $dailyReports->get($siswa->id);
            $kehadiran   = $kehadirans->get($siswa->id);

            $status = 'tidak_hadir';
            if ($dailyReport) {
                $status = 'ada_laporan';
            } elseif ($kehadiran) {
                $status = 'hadir_tanpa_laporan';
            }

            return [
                'number' => $index + 1,
                'siswa_id' => $siswa->id,
                'nama_lengkap' => $siswa->nama_lengkap,
                'nama_panggilan' => $siswa->nama_panggilan,
                'guru_nama' => $siswa->guru?->nama_lengkap ?? '-',
                'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : '-',
                'cabang' => $siswa->lokasi_pendaftaran ?? '-',
                'status' => $status,
                'daily_report' => $dailyReport ? [
                    'id'            => $dailyReport->id,
                    'tanggal'       => $dailyReport->tanggal->format('Y-m-d'),
                    'rating'        => $dailyReport->rating,
                    'is_final'      => $dailyReport->is_final,
                    'sudah_checkout' => $kehadiran?->waktu_pulang !== null,
                    'is_complete'   => $dailyReport->isComplete(),
                ] : null,
                'kehadiran' => $kehadiran ? [
                    'tanggal_hadir' => \Carbon\Carbon::parse($kehadiran->tanggal)->format('d-m-Y'),
                    'jenis_interaksi' => $kehadiran->jenis_interaksi,
                ] : null,
            ];
        });

        if ($status) {
            $data = $data->filter(function ($item) use ($status) {
                return $item['status'] === $status;
            })->values();
        }

        $kelasList = \App\Models\Kelas::orderBy('nama_kelas')->get();

        $summary = [
            'total' => $siswaList->count(),
            'ada_laporan' => $data->where('status', 'ada_laporan')->count(),
            'hadir_tanpa_laporan' => $data->where('status', 'hadir_tanpa_laporan')->count(),
            'tidak_hadir' => $data->where('status', 'tidak_hadir')->count(),
        ];

        return Inertia::render('admin/daily-report/index', [
            'data' => $data,
            'kelasList' => $kelasList,
            'filters' => [
                'tanggal' => $tanggal,
                'kelas_id' => $kelasId,
                'cabang' => $cabang,
                'search' => $search,
                'status' => $status,
            ],
            'summary' => $summary,
        ]);
    }

    public function adminShow(DailyReport $dailyReport): Response
    {
        $dailyReport->load(['siswa.kelas', 'user', 'emosis']);

        $sudahCheckout = \App\Models\Kehadiran::where('siswa_id', $dailyReport->siswa_id)
            ->whereDate('tanggal', $dailyReport->tanggal)
            ->whereNotNull('waktu_pulang')
            ->exists();

        $missingFields = $dailyReport->getMissingFields();
        if ($dailyReport->emosis->isEmpty()) {
            $missingFields[] = 'Emosi Hari Ini';
        }

        return Inertia::render('admin/daily-report/show', [
            'report'        => $dailyReport,
            'sudahCheckout' => $sudahCheckout,
            'missingFields' => $missingFields,
        ]);
    }

    public function adminSendTerlambat(DailyReport $dailyReport): RedirectResponse
    {
        if ($dailyReport->is_final) {
            return back()->with('info', 'Daily report sudah terkirim sebelumnya.');
        }

        $dailyReport->update(['is_final' => true]);

        SendDailyReportNotification::dispatch($dailyReport->id);

        return back()->with('success', "Daily report {$dailyReport->siswa->nama_lengkap} sedang dikirim ke orang tua.");
    }
}
