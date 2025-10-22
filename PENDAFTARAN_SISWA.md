# Sistem Pendaftaran Siswa

## Fitur yang Sudah Dibuat

### 1. Database & Models
- **Migration**: `create_siswa_table` dengan semua field yang diminta
- **Model Siswa**: Relasi dengan User (belongsTo)
- **Model User**: Relasi dengan Siswa (hasOne)

### 2. Middleware
- **CheckSiswaRegistration**: Mengecek apakah user dengan role 'orangtua' sudah mendaftar siswa
  - Jika belum, redirect ke halaman pendaftaran siswa
  - Admin tidak terpengaruh middleware ini

### 3. Controllers
- **SiswaController**: 
  - `create()`: Menampilkan form pendaftaran
  - `store()`: Menyimpan data siswa dengan validasi lengkap

### 4. Routes
- `/siswa/register` (GET & POST): Form pendaftaran siswa
- `/dashboard`: Dashboard yang terpisah untuk admin dan orangtua

### 5. Frontend (React + Inertia.js)
- **Dashboard Admin**: `resources/js/pages/dashboard/admin.tsx`
- **Dashboard Orang Tua**: `resources/js/pages/dashboard/orangtua.tsx`
- **Form Pendaftaran Siswa**: `resources/js/pages/siswa/register.tsx`
  - Form lengkap dengan semua field yang diminta
  - Menggunakan Shadcn UI components
  - Upload foto siswa

### 6. Komponen UI
- **Textarea**: Component baru untuk input text area

## Field Tabel Siswa

### A. Informasi Umum Siswa
- nama_lengkap, nama_panggilan, jenis_kelamin
- tempat_lahir, tanggal_lahir, agama, kewarganegaraan
- anak_ke, jumlah_saudara_kandung, bahasa_sehari_hari
- foto_siswa (upload)

### B. Informasi Kesehatan
- berat_badan, tinggi_badan, golongan_darah
- riwayat_penyakit, alasan_rawat_inap, riwayat_alergi_makanan

### C. Data Ayah
- ayah_nama_lengkap, ayah_tempat_tanggal_lahir
- ayah_pekerjaan, ayah_pendidikan_terakhir, ayah_nomor_identitas
- ayah_alamat_rumah, ayah_telepon_rumah
- ayah_alamat_kantor, ayah_telepon_kantor, ayah_no_hp

### D. Data Ibu
- ibu_nama_lengkap, ibu_tempat_tanggal_lahir
- ibu_pekerjaan, ibu_pendidikan_terakhir, ibu_nomor_identitas
- ibu_alamat_rumah, ibu_telepon_rumah
- ibu_alamat_kantor, ibu_telepon_kantor, ibu_no_hp

### E. Kontak Darurat
- kontak_darurat_nama_lengkap, kontak_darurat_hubungan
- kontak_darurat_pekerjaan, kontak_darurat_nomor_identitas
- kontak_darurat_alamat_rumah, kontak_darurat_telepon_rumah
- kontak_darurat_alamat_kantor, kontak_darurat_telepon_kantor
- kontak_darurat_no_hp

### F. Persetujuan
- lokasi_pendaftaran, tanggal_pendaftaran

## Alur Kerja

1. **Register/Login**:
   - User register atau login dengan OTP
   - Sistem cek role user

2. **Pengecekan Data Siswa**:
   - Jika role = 'admin': Langsung ke dashboard admin
   - Jika role = 'orangtua' dan belum ada data siswa: Redirect ke form pendaftaran
   - Jika role = 'orangtua' dan sudah ada data siswa: Ke dashboard orangtua

3. **Pendaftaran Siswa**:
   - Orangtua mengisi form lengkap
   - Data disimpan ke database
   - Redirect ke dashboard orangtua

## Akun Admin Default
- Email: admin@schalbiruni.com
- Password: password
- No HP: 081234567890

## Cara Menjalankan

```bash
# Jalankan migration
php artisan migrate

# Jalankan seeder admin (sudah dijalankan)
php artisan db:seed --class=AdminUserSeeder

# Build frontend
npm run build

# Atau development
npm run dev
```

## Testing
1. Login sebagai admin: Akan masuk ke dashboard admin
2. Register sebagai orangtua baru: Akan diarahkan ke form pendaftaran siswa
3. Setelah mengisi form: Akan masuk ke dashboard orangtua

## Dashboard Mobile-Friendly untuk Webview Flutter

Dashboard orang tua telah dioptimasi untuk tampilan mobile dengan:
- ✅ Mobile-first design
- ✅ Touch-friendly buttons (44x44px minimum)
- ✅ Bottom navigation
- ✅ Quick actions grid
- ✅ Card-based layout
- ✅ Safe area untuk notch devices
- ✅ Smooth animations
- ✅ Dark mode support

Lihat `MOBILE_WEBVIEW_GUIDE.md` untuk panduan lengkap integrasi dengan Flutter WebView.
