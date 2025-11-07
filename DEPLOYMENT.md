# Deployment Guide - AWS & aaPanel

## Session Configuration untuk Multi-Device Login

### Masalah yang Diselesaikan
Admin tidak bisa login di device lain ketika sudah login di device pertama karena konflik session cookie security settings.

### Solusi yang Diterapkan
Session configuration sekarang otomatis menyesuaikan dengan environment dan connection type (HTTP/HTTPS).

## Setup Production (AWS + aaPanel dengan HTTPS)

### 1. Environment Variables (.env)

Pastikan setting berikut di file `.env` production:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
SESSION_SAME_SITE=lax
SESSION_SECURE_COOKIE=false
SESSION_HTTP_ONLY=true
```

**Catatan:** 
- `SESSION_SECURE_COOKIE=false` di `.env` adalah default fallback
- Aplikasi akan otomatis detect HTTPS dan set `secure=true` untuk webview
- Untuk non-webview request, akan menggunakan setting dari `.env`

### 2. SSL/HTTPS Setup di aaPanel

Pastikan SSL certificate sudah terinstall:

1. Login ke aaPanel
2. Pilih website Anda
3. Klik tab "SSL"
4. Install SSL certificate (Let's Encrypt atau custom)
5. Enable "Force HTTPS"

### 3. AWS Load Balancer (jika pakai)

Jika menggunakan AWS ELB/ALB, pastikan:

1. Listener HTTPS (port 443) sudah dikonfigurasi
2. Target group mengarah ke instance dengan port 80 atau 443
3. Health check path: `/up`
4. Security group allow port 443

### 4. Verifikasi Session Working

Setelah deploy, test dengan:

1. **Login dari PC/Laptop** (Browser biasa)
   - Buka `https://yourdomain.com`
   - Login dengan OTP
   - Cek cookie di DevTools → Application → Cookies
   - Pastikan ada cookie `[app_name]_session`

2. **Login dari Device Lain** (Tablet/Mobile)
   - Buka `https://yourdomain.com` dari device berbeda
   - Login dengan OTP yang sama
   - Seharusnya berhasil login tanpa logout device pertama

3. **Cek Database Sessions**
   ```sql
   SELECT id, user_id, ip_address, user_agent, last_activity 
   FROM sessions 
   WHERE user_id = [admin_user_id]
   ORDER BY last_activity DESC;
   ```
   - Seharusnya ada multiple sessions untuk user yang sama
   - Setiap device punya session sendiri

## Cara Kerja Session Configuration

### Development (HTTP - localhost)
```
Request → isWebviewRequest() → Yes
       → isSecureConnection() → No (HTTP)
       → Config: same_site=lax, secure=false
```

### Production (HTTPS - AWS/aaPanel)
```
Request → isWebviewRequest() → Yes
       → isSecureConnection() → Yes (HTTPS detected)
       → Config: same_site=none, secure=true, lifetime=43200 (30 days)
```

### Detection Logic

**HTTPS Detection:**
1. `$_SERVER['HTTPS']` = 'on'
2. `$_SERVER['HTTP_X_FORWARDED_PROTO']` = 'https' (AWS ELB)
3. `$_SERVER['HTTP_X_FORWARDED_PORT']` = '443' (Load Balancer)
4. `APP_ENV` = 'production' (Force secure)

**Webview Detection:**
- User agent contains: `wv`, `WebView`, `Flutter`, `Mobile/`, `App/`
- Mobile device without browser strings (Chrome/, Firefox/, Safari/)

## Troubleshooting

### Issue: Admin masih tidak bisa login di device lain

**Cek 1: HTTPS aktif?**
```bash
curl -I https://yourdomain.com
# Harus return: HTTP/2 200 atau HTTP/1.1 200
# Bukan redirect atau error
```

**Cek 2: Session table ada?**
```sql
SHOW TABLES LIKE 'sessions';
```

**Cek 3: Session config di runtime**
```php
// Tambahkan temporary di route untuk debug
Route::get('/debug-session', function() {
    return [
        'driver' => config('session.driver'),
        'same_site' => config('session.same_site'),
        'secure' => config('session.secure'),
        'lifetime' => config('session.lifetime'),
        'is_https' => request()->secure(),
        'server_https' => $_SERVER['HTTPS'] ?? 'not set',
        'forwarded_proto' => $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? 'not set',
    ];
})->middleware('auth');
```

**Cek 4: Clear cache**
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### Issue: Cookie tidak ter-set di browser

**Solusi:**
1. Pastikan `SESSION_DOMAIN=null` di `.env` (bukan domain specific)
2. Clear browser cookies
3. Hard refresh (Ctrl+Shift+R)
4. Cek browser console untuk cookie errors

### Issue: Session expired terlalu cepat

**Solusi:**
1. Increase `SESSION_LIFETIME` di `.env` (default: 120 menit untuk browser biasa)
2. Untuk webview, lifetime otomatis 43200 menit (30 hari)
3. Set `SESSION_EXPIRE_ON_CLOSE=false`

## Best Practices

1. **Selalu gunakan HTTPS di production**
2. **Jangan hardcode `secure=true`** - biarkan auto-detect
3. **Monitor session table size** - cleanup old sessions berkala
4. **Set proper session lifetime** - balance antara security dan UX
5. **Test di multiple devices** sebelum deploy

## Session Cleanup (Penting!)

Session lama yang sudah expired perlu dibersihkan agar database tidak penuh.

### Automatic Cleanup (Sudah Dikonfigurasi)

Aplikasi sudah dikonfigurasi untuk cleanup otomatis setiap hari jam 2 pagi via Laravel Scheduler di `routes/console.php`:

```php
Schedule::command('session:gc')->dailyAt('02:00');
```

### Setup di Server (aaPanel)

Agar scheduler Laravel berjalan, tambahkan **1 cron job** di aaPanel:

**Langkah-langkah:**

1. Login ke aaPanel
2. Klik menu **Cron**
3. Klik **Add Cron**
4. Isi form:
   - **Name**: Laravel Scheduler
   - **Type**: Shell Script
   - **Execution Cycle**: Every minute (Setiap menit)
   - **Script Content**:
     ```bash
     cd /www/wwwroot/yourdomain.com && php artisan schedule:run >> /dev/null 2>&1
     ```
   - Ganti `/www/wwwroot/yourdomain.com` dengan path project Anda

5. Save

**Penjelasan:**
- Cron ini jalan **setiap menit**
- Laravel scheduler akan cek apakah ada task yang perlu dijalankan
- Session cleanup akan otomatis jalan setiap hari jam 2 pagi
- Semua scheduled task lain juga akan jalan otomatis

### Manual Cleanup (Jika Perlu)

Jika ingin cleanup manual, jalankan command ini via SSH:

```bash
cd /www/wwwroot/yourdomain.com
php artisan session:gc
```

### Verifikasi Scheduler Berjalan

Cek log scheduler:

```bash
# Lihat apakah scheduler berjalan
tail -f storage/logs/laravel.log

# Atau cek langsung jumlah session di database
mysql -u username -p database_name -e "SELECT COUNT(*) FROM sessions;"
```
