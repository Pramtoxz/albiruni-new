# CLAUDE.md — Al-Biruni Preschool & Daycare Management System

Dokumen ini adalah panduan wajib untuk setiap sesi Claude Code di project ini.
Baca seluruhnya sebelum menyentuh kode apapun.

---

## Identitas Project

- **Nama:** schalbiruni (Al-Biruni Preschool & Daycare)
- **Domain produksi:** https://albiruni.sch.id
- **Lokasi:** Padang, Sumatera Barat, Indonesia (2 cabang: Ulak Karang & Marapalam)
- **Timezone:** `Asia/Jakarta` (wajib digunakan untuk semua logika tanggal/waktu)
- **Database:** `schalbiruni` (MySQL via Laragon lokal)
- **Branch utama:** `main`

---

## Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 12, PHP 8.2+ |
| Auth | Laravel Fortify (OTP-based) |
| Frontend | React 19 + Inertia.js v2 (SSR aktif) |
| UI | Tailwind CSS 4.0, Radix UI, Lucide, Framer Motion, Recharts |
| Build | Vite 6.0 |
| Testing | Pest v3.8 |
| DB driver | MySQL; session/cache/queue via `database` driver |
| Notifikasi | Firebase FCM + WhatsApp Gateway |
| PDF | barryvdh/laravel-dompdf |
| Sitemap | spatie/laravel-sitemap |
| Route typing | laravel/wayfinder (auto-generate TypeScript actions) |

---

## Cara Menjalankan Lokal

```bash
# Dev (PHP server + queue + Vite HMR)
composer dev

# Dev dengan SSR
composer dev:ssr

# Build frontend saja
npm run build

# Build SSR
npm run build:ssr
```

**Jangan jalankan `php artisan migrate --fresh` tanpa izin eksplisit user** — data produksi bisa hilang.

---

## Struktur Folder Penting

```
app/
  Console/Commands/     # GenerateSitemap
  Constants/            # WhoGrowthStandards (data WHO z-score)
  Enums/                # OtpType enum
  Events/               # SiswaHadir (broadcast)
  Http/
    Controllers/
      Admin/            # 13 controller khusus admin (termasuk RaporController)
      Auth/             # OtpController, dll
      Guru/             # KehadiranController, RencanaPembelajaranController, RaporController
      Settings/         # Profile, Password, TwoFactor
    Middleware/         # 6 middleware (lihat bagian Middleware)
    Requests/           # Form request validation
    Responses/          # LogoutResponse
  Mail/                 # OtpCodeMail
  Models/               # 22 Eloquent model (termasuk Rapor, RaporPertumbuhan, RaporPerkembangan)
  Providers/            # 5 service provider + Firebase credentials JSON
  Services/             # OtpService, NotificationService, FcmService

routes/
  web.php               # Public + shared auth routes
  admin.php             # Semua route /admin/*
  auth.php              # OTP send & login
  guru.php              # Route guru (di-include dalam web.php)
  orangtua.php          # Route orangtua (di-include dalam web.php)
  settings.php          # Profile, password, 2FA

resources/js/
  pages/                # React pages (admin/, guru/, orangtua/, kehadiran/, auth/, settings/, berita/)
  components/           # Reusable components (termasuk who-chart-overlay.tsx)
  actions/              # Auto-generated TypeScript dari wayfinder (JANGAN diedit manual)
  layouts/
  lib/                  # whoGrowthStandards.ts

resources/views/
  app.blade.php         # Root Inertia template
  emails/               # Mail templates
  pdf/                  # PDF templates (dompdf) — termasuk rapor.blade.php

database/
  migrations/           # 34 file migrasi
  seeders/              # 5 seeder (termasuk RaporSeeder)

srcp/                   # Python scripts untuk pipeline WHO data
  05_download_who_charts.py   # Download PDF WHO → PNG
  06_calibrate_who_charts.py  # Auto-kalibrasi koordinat plot dari PNG
  who_data/
    calibration.json          # Hasil kalibrasi terakhir
    calibration_ts.txt        # TypeScript const siap paste
    charts/debug/             # PNG debug kalibrasi (kotak merah = area terdeteksi)

public/assets/who-charts/     # 6 PNG chart WHO resmi (siap pakai di web & PDF)
```

---

## Sistem Autentikasi

**PENTING: Project ini menggunakan OTP, bukan password login tradisional.**

- `POST /otp/send` → kirim OTP ke WhatsApp/Email
- `POST /login/otp` → verifikasi OTP dan login
- OTP dikelola oleh `OtpService` dan `OtpController`
- Format nomor HP: `08xxx` otomatis dinormalisasi ke `628xxx`
- OTP expire: 5 menit; rate limit: 5x/menit
- Dev bypass: set `BYPASS_OTP_IN_DEV=true` di `.env` (default false di production)

**Jangan tambahkan form login email/password** — sengaja tidak ada.

### Two-Factor Authentication (2FA)
- Laravel Fortify TOTP (QR code)
- User bisa enable/disable via `/settings`

### Session
- Driver: `database`
- Lifetime: 120 menit
- Webview: session regenerasi setiap 30 menit (untuk stabilitas Flutter/Android app)

---

## Roles & Permissions

### Tiga Role User (`users.role`)

| Role | Akses |
|------|-------|
| `admin` | Panel admin, manajemen seluruh data |
| `guru` | Daily report, rencana pembelajaran, absensi guru |
| `orangtua` | Laporan anak, pembayaran SPP, kegiatan harian |

### Admin: Sistem Permission Granular

- Admin dengan `users.is_it = true` → **bypass semua permission check** (akses penuh otomatis)
- Admin non-IT → permission berbasis `menu_key` di tabel `user_permissions`
- Permission diperiksa via `User::hasPermission(string $menuKey)`
- Dikelola hanya oleh IT admin via `/admin/permissions`

**Menu keys yang tersedia:**
```
dashboard, user-activity, users.manage, guru.manage, kelas.manage,
emosi.manage, siswa.pending, siswa.approved, pembayaran.manage,
daily-report.view, menu-mingguan.manage, rencana-pembelajaran.manage,
news.manage, events.manage
```

**Cara check admin di controller** (pola yang dipakai di project ini):
```php
// Controller menggunakan private method, bukan middleware
private function checkAdmin(string $permission): void
{
    if (!auth()->user()->hasPermission($permission)) {
        abort(403);
    }
}
```

### Guru: Hierarki Guru Utama & Pendamping

- `guru_utama_id IS NULL` → guru utama (mengajar kelas sendiri)
- `guru_utama_id IS NOT NULL` → guru pendamping (akses siswa dari guru utama)
- Gunakan `Guru::getAccessibleSiswa()` untuk ambil siswa yang bisa diakses
- Gunakan `Guru::getMainGuruId()` untuk daily report dan kehadiran

---

## Middleware

| Nama | Alias | Fungsi |
|------|-------|--------|
| `EnsureUserIsAdmin` | `admin` | Cek role admin |
| `CheckSiswaRegistration` | `check.siswa` | Redirect orangtua jika belum daftarkan siswa |
| `ForceCanonicalUrl` | — | SEO canonical URL |
| `HandleAppearance` | — | Cookie light/dark mode |
| `HandleInertiaRequests` | — | Inertia props, webview detection, permissions |
| `OptimizeSessionForWebview` | — | Session stability untuk mobile app |

`check.siswa` middleware dipakai di prefix `orangtua` dan route `dashboard`.

---

## Models Utama

| Model | Tabel | Catatan |
|-------|-------|---------|
| `User` | `users` | Auth, role, is_it, 2FA |
| `UserPermission` | `user_permissions` | Granular admin permission |
| `Guru` | `gurus` | Relasi ke User, Kelas, hierarki pendamping |
| `Siswa` | `siswas` | 60+ field (data lengkap murid + orang tua) |
| `Kelas` | `kelas` | Kelas dengan kategori dan harga SPP |
| `DailyReport` | `daily_reports` | Laporan harian murid ke orang tua |
| `Emosi` | `emosis` | Many-to-many dengan DailyReport |
| `Kehadiran` | `kehadirans` | Absensi murid (tablet/TV) |
| `GuruKehadiran` | `guru_kehadirans` | Absensi guru |
| `PembayaranSpp` | `pembayaran_spps` | Tagihan & bukti bayar SPP |
| `RencanaPembelajaran` | `rencana_pembelajarans` | Kurikulum per kelas |
| `KegiatanHarian` | `kegiatan_harians` | Aktivitas harian dari rencana belajar |
| `MenuMingguan` | `menu_mingguans` | Menu makanan mingguan |
| `MenuHarian` | `menu_harians` | Detail menu per hari/waktu makan |
| `DeviceToken` | `device_tokens` | FCM push notification token |
| `Otp` | `otp_codes` | OTP records dengan expiry |
| `Cabang` | `cabangs` | Cabang sekolah |
| `Event` | `events` | Acara sekolah |
| `News` | `news` | Artikel/berita publik |
| `Rapor` | `rapors` | Rapor semester anak |
| `RaporPertumbuhan` | `rapor_pertumbuhans` | Data BB/TB/LK per bulan; punya `$appends=['nama_bulan']` |
| `RaporPerkembangan` | `rapor_perkembangans` | Perkembangan per aspek (BB/MB/BSH/BSB) |
| `RaporPerkembanganTemplate` | `rapor_perkembangan_templates` | Template narasi Section B per kelas |
| `RaporPenutupTemplate` | `rapor_penutup_templates` | Template narasi Section C per kelas (3 kategori) |

---

## Services

| Service | Fungsi |
|---------|--------|
| `OtpService` | Normalisasi HP, generate/validasi OTP, kirim email |
| `NotificationService` | WhatsApp notifikasi daily report & SPP |
| `FcmService` | Firebase push notification (multitoken) |

---

## Frontend (React + Inertia)

- **Semua page ada di** `resources/js/pages/` terorganisir per role
- **Jangan edit manual** file di `resources/js/actions/` — auto-generated oleh `composer wayfinder:generate`
- Flash message: `flash.success` dan `flash.error` sudah di-share via `HandleInertiaRequests`
- Auth user: `auth.user` (includes `permissions` array untuk non-IT admin)
- Webview info: `webview.isWebview` (true jika Flutter/Android WebView)

### Regenerasi action types (jalankan setelah ubah route/controller):
```bash
php artisan wayfinder:generate
```

---

## Aturan Keamanan & Production Safety

### DILARANG tanpa izin eksplisit:
- `php artisan migrate:fresh` atau `migrate:rollback` di production
- Mengubah struktur tabel yang sudah ada tanpa migrasi baru
- Menghapus kolom dari tabel yang sudah berisi data
- `git push --force` ke branch `main`
- Mengubah `APP_KEY` di `.env` production (akan merusak semua session & enkripsi)
- Mengubah `SESSION_DRIVER` atau struktur session
- Memodifikasi file Firebase credentials JSON (`app/Providers/albiruni-pre-school-firebase-adminsdk-*.json`)

### Wajib diperhatikan:
- Selalu buat migrasi baru untuk perubahan skema (jangan edit migrasi lama yang sudah jalan)
- Kolom baru di tabel yang ada: gunakan `->nullable()` atau `->default(...)` agar tidak error di production
- SEO routes (`/`, `/berita`, `/sitemap.xml`, `/robots.txt`) adalah public — jangan tambahkan auth
- Route kehadiran (`/kehadiran/*`) adalah public — diakses oleh tablet & TV tanpa login
- WhatsApp notification delay: 2 detik antar pesan (lihat `WHATSAPP_NOTIFICATION_DELAY`) — jangan hapus
- Session cookie di production: `SESSION_SAME_SITE=none` + `SESSION_SECURE_COOKIE=true` (HTTPS)

---

## Konvensi Kode

### PHP/Laravel:
- Controller admin menggunakan `private checkAdmin(string $menuKey)` — **tidak pakai middleware** di route admin (lihat `routes/admin.php`)
- Nama route: `admin.resource.action`, `guru.resource.action`, `orangtua.resource.action`
- Form validation: gunakan `Request` class di `app/Http/Requests/`
- Tanggal selalu gunakan Carbon dengan locale Indonesia (`Carbon::setLocale('id')`)

### Passing tanggal ke Inertia dari Eloquent model (PENTING):
Eloquent **re-cast** atribut datetime ke UTC saat `toArray()` dipanggil. Jangan assign string ke atribut model lalu kirim model ke Inertia — hasilnya tetap UTC.

```php
// SALAH — created_at tetap UTC setelah toArray()
$rapor->created_at = $rapor->created_at->setTimezone('Asia/Jakarta')->isoFormat(...);
return Inertia::render('...', ['rapor' => $rapor]);

// BENAR — format dulu, override setelah toArray()
$createdAt = $rapor->created_at->setTimezone('Asia/Jakarta')->isoFormat('D MMMM Y, HH:mm');
return Inertia::render('...', [
    'rapor' => array_merge($rapor->toArray(), ['created_at' => $createdAt]),
]);
```

### React/TypeScript:
- Component UI dari Radix UI (`@/components/ui/`)
- Navigasi Inertia: `router.get()`, `router.post()` — jangan `fetch()` langsung kecuali untuk API kehadiran
- Icon dari `lucide-react`
- Animasi dari `framer-motion`
- Chart dari `recharts` (khusus halaman admin — JANGAN dipakai di halaman guru)
- Konfirmasi aksi penting: gunakan `sweetalert2` (Swal) — sudah dipakai di semua halaman guru

### Layout Halaman Guru (WAJIB):
Halaman guru adalah **mobile-first**, diakses dari HP/tablet. **TIDAK pakai `AppLayout`**.
Pattern yang benar:

```tsx
export default function GuruXxxPage(...) {
    return (
        <>
            <Head title="Judul" />
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
                <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12" />

                <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
                    {/* Back button */}
                    <button onClick={() => window.history.back()}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg ...">
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    {/* Cards: shadow-lg rounded-3xl bg-white */}
                    {/* Buttons: bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl */}
                </div>
            </div>
        </>
    );
}
```

Lihat `resources/js/pages/guru/daily-report-list.tsx` sebagai referensi utama.

### Layout & Padding Halaman Admin:
Setiap page admin memiliki **dua pola wrapper** — keduanya wajib pakai `p-4 md:p-6`:

```tsx
// Pola 1 — halaman dengan tabel/list (emosi, kelas, pembayaran, dll)
<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 md:p-6">

// Pola 2 — halaman dengan form/konten vertikal (users, guru, siswa, berita, dll)
<div className="space-y-6 p-4 md:p-6">

// Pola 2b — form terbatas lebar
<div className="max-w-2xl space-y-6 p-4 md:p-6">
```

**Jangan pakai** `rounded-xl` di wrapper konten — sudah ditangani oleh `SidebarInset`.
**Jangan pakai** `p-4` saja tanpa `md:p-6` — akan mepet ke sidebar di layar besar.

### Database:
- Soft delete tidak digunakan — hapus adalah permanen
- Timestamps (`created_at`, `updated_at`) aktif di semua tabel
- Foreign key: selalu `constrained()->cascadeOnDelete()` atau sesuaikan dengan kebutuhan bisnis

---

## Environment Variables Kritis

```env
APP_TIMEZONE=Asia/Jakarta          # JANGAN ubah
SESSION_DRIVER=database            # JANGAN ubah
QUEUE_CONNECTION=database          # JANGAN ubah
BYPASS_OTP_IN_DEV=false            # false di production, true untuk dev
SESSION_SAME_SITE=none             # production (HTTPS)
SESSION_SECURE_COOKIE=true         # production (HTTPS)
WHATSAPP_NOTIFICATION_DELAY=2      # delay antar WA blast (detik)
FIREBASE_CREDENTIALS=app/Providers/albiruni-pre-school-firebase-adminsdk-*.json
```

---

## Alur Kerja Fitur Baru

1. **Route** → tambah di file route sesuai role (`admin.php`, `guru.php`, `orangtua.php`, `web.php`)
2. **Controller** → buat di namespace yang sesuai (`Admin/`, `Guru/`, dll)
3. **Model + Migration** → buat migrasi baru (nullable/default untuk kolom baru di tabel lama)
4. **React Page** → buat di `resources/js/pages/<role>/`
5. **Wayfinder** → `php artisan wayfinder:generate` (update TypeScript actions)
6. **Build** → `npm run build` sebelum deploy

---

## Fitur Rapor Digital — STATUS: SELESAI (kecuali Template Rapor admin, halaman orangtua & notifikasi)

Fitur laporan tumbuh kembang anak semester (pengganti rapor Word manual).

### Semua Yang Sudah Selesai
- **Pipeline WHO data** di `srcp/` + konstanta `app/Constants/WhoGrowthStandards.php` + `resources/js/lib/whoGrowthStandards.ts`
- **Migration:** `2026_05_21_000001_create_rapors_table` (3 kolom Section C), `_000002_create_rapor_pertumbuhans_table`, `_000003_create_rapor_perkembangans_table`, `2026_05_22_000002_create_rapor_perkembangan_templates_table`, `2026_05_22_000003_create_rapor_penutup_templates_table`
- **Models:** `Rapor`, `RaporPertumbuhan` (dengan `$appends=['nama_bulan']`), `RaporPerkembangan`, `RaporPerkembanganTemplate`, `RaporPenutupTemplate`
- **Controller Guru:** `app/Http/Controllers/Guru/RaporController` — index, create, store, show, edit, update, finalize, pdf
- **Controller Admin:** `app/Http/Controllers/Admin/RaporController` — index (filter+paginate+setting rapor aktif), show, updateSetting
- **Routes:** `guru/rapor/*` (8 routes) + `admin/rapor/*` (3 routes termasuk `POST rapor/setting`)
- **React Pages Guru:** `resources/js/pages/guru/rapor/{index,create,edit,show}.tsx` — mobile-first layout (NO AppLayout)
  - `create.tsx`: semester + TA otomatis dari setting admin, guru_kelas otomatis dari auth user, Section B pill buttons + auto-fill narasi dari template
  - `edit.tsx`: Section B pill buttons + auto-fill narasi dari template, warning jika template belum diisi
  - `show.tsx`: tampilkan usia anak (fixed di awal semester, format "X thn Y bln")
- **React Pages Admin:** `resources/js/pages/admin/rapor/{index,show}.tsx` — AppLayout dengan WHO chart overlay
  - `index.tsx`: toggle aktif/nonaktif + setting periode rapor (semester + tahun ajaran) dalam satu card
- **PDF Template:** `resources/views/pdf/rapor.blade.php` — SVG grafik WHO server-side + tanda tangan
- **Sidebar:** menu "Rapor Digital" di grup Transaksi (admin) + grup Akademik (guru)
- **Seeder:** `database/seeders/RaporSeeder.php` — siswa aktif, mix draft/final, data pertumbuhan + perkembangan + 3 kolom Section C

### WHO Growth Chart Images (SUDAH DIINTEGRASIKAN & DIKALIBRASI)
- **6 PNG** chart resmi WHO tersimpan di `public/assets/who-charts/`:
  - `wfa-boys-zscore.png`, `wfa-girls-zscore.png` (2339×1654px)
  - `lhfa-boys-zscore.png`, `lhfa-girls-zscore.png` (2339×1654px)
  - `hcfa-boys-zscore.png`, `hcfa-girls-zscore.png` (2198×1550px)
- **Script download:** `srcp/05_download_who_charts.py` — PyMuPDF, download PDF WHO → PNG
- **Script kalibrasi:** `srcp/06_calibrate_who_charts.py` — **otomatis** (deteksi warna frame border blue/pink), output JSON + TypeScript const. Jalankan ulang jika PNG diganti.
- **Komponen overlay:** `resources/js/components/who-chart-overlay.tsx` — `<img>` WHO + `<svg>` absolute overlay titik data + highlight semester window
- **Kalibrasi aktif** (dari script, bukan estimasi):
  - WFA/LHFA: `x0=307, x1=2049, y0=219, y1=1408`
  - HCFA boys: `x0=296, x1=1927, y0=291, y1=1325`
  - HCFA girls: `x0=296, x1=1927, y0=292, y1=1323`
- **Web guru show:** 3 chart overlay (WFA, LHFA, HCFA) + tabel data pertumbuhan
- **Web admin show:** 3 chart overlay dalam grid (ganti Recharts)
- **PDF:** `buildWhoChartSvg()` embed PNG WHO dalam SVG, fallback ke custom SVG jika PNG tidak ada

### Bug Yang Sudah Diperbaiki
- **WHO data format mismatch:** `WhoGrowthStandards::get()` → indexed array → `w.month` undefined di JS. **Fix:** `WhoGrowthStandards::getObjects()` return associative array, dipakai di kedua controller Inertia.
- **Guru layout salah:** halaman guru rapor pakai `AppLayout`. **Fix:** rewrite 4 halaman dengan mobile-first pattern.
- **`nama_bulan` tidak muncul:** accessor tidak di-serialize ke JSON. **Fix:** `$appends = ['nama_bulan']` di `RaporPertumbuhan`.
- **UTC date di show page:** `$rapor->created_at = string` lalu pass model ke Inertia → Eloquent re-cast ke UTC saat `toArray()`. **Fix:** `array_merge($rapor->toArray(), ['created_at' => $createdAt])` di kedua controller show().
- **Auto-fill Section B tidak muncul:** Template hanya ada untuk `kelas_id=4` (TK) di DB. Semua siswa yang ditest dari kelas lain → `perkembanganTemplates[kelasId]` = undefined. **Fix:** Tambahkan indikator `hasTemplate` + amber warning banner jika template belum diisi untuk kelas tersebut.
- **Placeholder `{nama_lengkap}` tidak terganti:** Template di DB memakai `{nama_lengkap}` tapi kode hanya handle `{nama_anak}`. **Fix:** `replacePlaceholders()` support keduanya di `create.tsx` dan `edit.tsx`.

### Database Schema Aktif
```
rapors
  id, siswa_id (FK→siswa), created_by (unsignedBigInteger, no FK karena users=MyISAM)
  semester (tinyint: 1|2), tahun_ajaran (varchar 20)
  status: draft | final
  guru_kelas (string, nullable)
  penutup_umum (text, nullable)           ← Section C: Penutup Umum
  penutup_motivasi_orangtua (text, nullable) ← Section C: Motivasi untuk Orang Tua
  penutup_penguatan_positif (text, nullable) ← Section C: Penguatan Positif
  UNIQUE: (siswa_id, semester, tahun_ajaran)
  CATATAN: kolom `penutup` lama dihapus dari migration (belum deploy ke production)
           Digantikan 3 kolom Section C di atas

rapor_pertumbuhans
  id, rapor_id (FK→rapors cascade), bulan (tinyint)
  berat_badan, tinggi_badan, lingkar_kepala (decimal 5,2, nullable)
  UNIQUE: (rapor_id, bulan)

rapor_perkembangans
  id, rapor_id (FK→rapors cascade)
  aspek (enum: agama_moral|motorik_kasar|motorik_halus|kognitif|bahasa|sosial_emosional|kemandirian)
  status (enum: BB|MB|BSH|BSB, nullable), narasi (text, nullable)
  UNIQUE: (rapor_id, aspek)

rapor_perkembangan_templates  ← Template Section B per kelas
  id
  kelas_id (FK→kelas cascade)
  aspek (string — 7 aspek seperti di rapor_perkembangans)
  indikator (string, nullable)          ← "Hafalan doa, perilaku sopan"
  contoh_narasi (text, nullable)        ← Narasi singkat contoh
  narasi_bsb (text, nullable)           ← Template narasi status BSB
  narasi_bsh (text, nullable)           ← Template narasi status BSH
  narasi_mb (text, nullable)            ← Template narasi status MB
  narasi_bb (text, nullable)            ← Template narasi status BB
  UNIQUE: (kelas_id, aspek)

rapor_penutup_templates  ← Template Section C per kelas
  id
  kelas_id (FK→kelas cascade)
  kategori (enum: penutup_umum|motivasi_orangtua|penguatan_positif)
  narasi_template (text, nullable)      ← Boleh pakai placeholder {nama_anak}
  UNIQUE: (kelas_id, kategori)
```

### Catatan Teknis Penting
- **users tabel = MyISAM** → FK ke users tidak bisa dibuat dari InnoDB; `created_by` pakai `unsignedBigInteger` biasa
- PDF download hanya tersedia setelah rapor difinalisasi (status = final)
- Guru hanya bisa akses rapor siswa kelasnya (via `getAccessibleSiswaIds()`)
- Permission admin: reuse `daily-report.view`
- `WhoGrowthStandards::get()` → raw indexed array (dipakai di PDF Blade template)
- `WhoGrowthStandards::getObjects()` → associative array (dipakai di Inertia controller untuk frontend)
- **Setting rapor aktif** disimpan via `AppSetting` model: key `rapor_aktif`, `rapor_semester`, `rapor_tahun_ajaran`. Route `POST admin/rapor/setting` harus di-declare **sebelum** `admin/rapor/{rapor}` agar tidak terinterferensi.
- **Placeholder template:** DB bisa pakai `{nama_anak}` (→ `nama_panggilan`) atau `{nama_lengkap}` (→ `nama_lengkap`). Keduanya di-replace oleh `replacePlaceholders()` di `create.tsx` dan `edit.tsx` client-side.
- **Template auto-fill Section B:** lookup via `perkembanganTemplates[String(siswa.kelas_id)]` di create, atau `perkembanganTemplates[aspek]` di edit (sudah di-group per aspek oleh controller). Jika template belum diisi → amber warning, narasi tetap kosong, guru isi manual.
- **Migration rapor DIEDIT LANGSUNG** (bukan migrasi baru) karena belum deploy ke production:
  - `2026_05_21_000001_create_rapors_table.php` — hapus `penutup`, tambah 3 kolom penutup
  - `2026_05_22_000002_create_rapor_perkembangan_templates_table.php` — table baru
  - `2026_05_22_000003_create_rapor_penutup_templates_table.php` — table baru

### Struktur Section Rapor

| Section | Nama | Isi |
|---------|------|-----|
| A | Pertumbuhan Anak | Data BB/TB/LK per bulan + grafik WHO |
| B | Tumbuh Kembang Anak | 7 aspek × 4 status (BB/MB/BSH/BSB) + narasi |
| C | Narasi Emosional | 3 kategori: Penutup Umum, Motivasi Orang Tua, Penguatan Positif |

### Sistem Template Rapor (Admin → Guru)

Admin menyediakan template narasi per kelas lewat menu **"Template Rapor"** (menu terpisah dari "Rapor Digital" di sidebar admin).

**Placeholder `{nama_anak}`** — admin tulis `{nama_anak}` di template, diganti client-side dengan `siswa.nama_panggilan` di React saat guru mengisi form.

**Section B — Tumbuh Kembang (rapor_perkembangan_templates):**
- UI guru: 4 pill button per aspek (`BB | MB | BSH | BSB`) — bukan dropdown
- Tap pill → status ter-set + narasi auto-fill dari template kelas siswa
- Jika template belum diisi admin → narasi tetap kosong, guru isi manual
- Guru **boleh edit** narasi setelah auto-fill
- Ganti status → narasi di-overwrite dengan template status baru

**Section C — Narasi Emosional (rapor_penutup_templates):**
- 3 kategori fixed: `penutup_umum`, `motivasi_orangtua`, `penguatan_positif`
- Auto-fill otomatis saat form dibuka (kelas siswa sudah diketahui dari siswa yang dipilih)
- Guru **boleh edit** setelah auto-fill
- Data disimpan di 3 kolom rapors: `penutup_umum`, `penutup_motivasi_orangtua`, `penutup_penguatan_positif`

**Admin pages "Template Rapor" (menu terpisah dari Rapor Digital):**
- Index: daftar kelas + status kelengkapan template (berapa aspek sudah terisi)
- Klik kelas → halaman edit template kelas tersebut (Section B + Section C dalam satu halaman)
- **Export Excel**: download 1 file `.xlsx` per kelas, 2 sheet (Sheet 1: Section B, Sheet 2: Section C)
  - Jika template kosong → export hanya header saja (sebagai panduan format untuk admin)
  - Format Sheet 1: `Aspek | Indikator | Contoh Narasi | BSB | BSH | MB | BB`
  - Format Sheet 2: `Kategori | Narasi Template`
- **Import Excel**: upload file `.xlsx` → replace semua template kelas tersebut
- Routes: GET `admin/template-rapor`, GET `admin/template-rapor/{kelas}`, PUT `admin/template-rapor/{kelas}`, GET `admin/template-rapor/{kelas}/export`, POST `admin/template-rapor/{kelas}/import`
- Permission: reuse `daily-report.view`
- Package Excel: `maatwebsite/excel` (cek dulu apakah sudah terinstall)

### Yang Belum Dibuat (Next Session)
1. **Install maatwebsite/excel** — `composer require maatwebsite/excel` (belum terinstall)
2. **Admin: Template Rapor** — Controller + Routes + Pages (index daftar kelas, edit template per kelas, export Excel, import Excel)
   - Routes: `GET admin/template-rapor`, `GET/PUT admin/template-rapor/{kelas}`, `GET admin/template-rapor/{kelas}/export`, `POST admin/template-rapor/{kelas}/import`
   - Permission: reuse `daily-report.view`
   - Export format Sheet 1: `Aspek | Indikator | Contoh Narasi | BSB | BSH | MB | BB`; Sheet 2: `Kategori | Narasi Template`
3. **Guru create/edit Section C** — auto-fill 3 narasi (`penutup_umum`, `penutup_motivasi_orangtua`, `penutup_penguatan_positif`) dari `rapor_penutup_templates` saat siswa dipilih (create) atau saat form dibuka (edit, jika field masih kosong)
4. **Halaman orangtua** — `resources/js/pages/orangtua/rapor/` (index + show read-only, mobile-first seperti guru)
5. **Route orangtua** — tambah di `routes/orangtua.php`
6. **Notifikasi finalisasi** — FCM + WhatsApp ke orangtua saat rapor difinalisasi

---

## Informasi Deployment

- Hosting: VPS (aaPanel atau AWS)
- SSL: aktif di production → `SESSION_SECURE_COOKIE=true`
- Queue: harus `php artisan queue:listen` berjalan (untuk notifikasi async)
- SSR: `php artisan inertia:start-ssr` untuk mode SSR
