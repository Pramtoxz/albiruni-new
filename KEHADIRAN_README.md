# 🎉 Sistem Kehadiran Interaktif untuk Anak-Anak

## Cara Menggunakan:

### 1. **Tablet di Pintu** (untuk anak-anak)
Buka: `http://localhost/kehadiran/tablet`

**Flow:**
1. Anak pilih kelas mereka
2. Anak pilih nama mereka
3. Sistem random tos/tinju dengan animasi
4. Animasi jump + sound "yey!"
5. Auto reset ke awal

### 2. **TV Display** (di ruang kelas/lobby)
Buka: `http://localhost/kehadiran/display`

**Fitur:**
- Tampilkan semua anak yang sudah hadir hari ini
- Animasi jump + foto anak saat ada yang baru hadir
- Update otomatis setiap 3 detik (polling)
- Background kehadiran.webp

## Assets yang Digunakan:
✅ `resources/js/assets/absen/kelas.webp` - Background pilih kelas
✅ `resources/js/assets/absen/tos.webp` - Gambar tos
✅ `resources/js/assets/absen/tinju.webp` - Gambar tinju
✅ `resources/js/assets/absen/tos.mp3` - Sound tos/tinju
✅ `resources/js/assets/absen/yey.mp3` - Sound success
✅ `resources/js/assets/absen/jump.json` - Lottie animation
✅ `resources/js/assets/absen/kehadiran.webp` - Background TV display

## Testing:

1. **Build assets:**
```bash
npm run build
# atau untuk development:
npm run dev
```

2. **Buka 2 browser/tab:**
- Tab 1: `http://localhost/kehadiran/tablet` (simulasi tablet)
- Tab 2: `http://localhost/kehadiran/display` (simulasi TV)

3. **Test flow:**
- Di tablet: pilih kelas → pilih nama siswa
- Lihat di TV: animasi jump muncul + nama siswa masuk list

## Upgrade ke Real-time (Optional):

Jika ingin pakai Echo untuk real-time tanpa polling:

1. Setup Pusher atau Laravel Reverb
2. Update `.env`:
```env
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=mt1
```

3. Uncomment code di `resources/js/echo.ts`
4. Restart `npm run dev`

## Database:
Table `kehadiran`:
- siswa_id
- tanggal
- waktu_hadir
- jenis_interaksi (tos/tinju)

## API Endpoints:
- GET `/kehadiran/api/kelas` - List kelas
- GET `/kehadiran/api/siswa/{kelasId}` - List siswa per kelas
- POST `/kehadiran/api/hadir` - Simpan kehadiran
- GET `/kehadiran/api/hari-ini` - Kehadiran hari ini

## Tips:
- Tablet: gunakan mode fullscreen (F11)
- TV: gunakan browser fullscreen + auto-refresh
- Pastikan sound enabled di browser
- Untuk production: gunakan tablet Android dengan kiosk mode
