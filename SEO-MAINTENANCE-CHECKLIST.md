# Checklist Maintenance SEO - Al-Biruni Preschool & Daycare

Dokumen ini berisi panduan untuk memelihara dan memantau SEO website Al-Biruni Preschool & Daycare.

## 1. Update Informasi Bisnis di Structured Data

### Kapan Melakukan Update
- Saat ada perubahan alamat cabang
- Saat ada penambahan atau pengurangan cabang
- Saat ada perubahan nomor telepon
- Saat ada perubahan deskripsi bisnis

### Cara Update Informasi Organisasi

**Lokasi File:** `resources/js/pages/Home.tsx`

1. Buka file `resources/js/pages/Home.tsx`
2. Cari bagian `organizationData` di dalam komponen
3. Update informasi yang diperlukan:

```tsx
const organizationData = {
  name: "Al-Biruni Preschool & Daycare",
  url: "https://albiruni.sch.id",
  logo: "https://albiruni.sch.id/logo.svg",
  description: "Preschool dan daycare terbaik di Padang...", // Update deskripsi di sini
  branches: [
    {
      name: "Al-Biruni Preschool Cabang Utama",
      address: {
        streetAddress: "Jl. Contoh No. 123", // Update alamat di sini
        addressLocality: "Padang",
        addressRegion: "Sumatera Barat",
        postalCode: "25000",
        addressCountry: "ID"
      },
      telephone: "+62-751-123456", // Update telepon di sini
      geo: {
        latitude: -0.9471,  // Update koordinat di sini
        longitude: 100.4172
      }
    }
    // Tambahkan cabang baru di sini jika diperlukan
  ]
};
```

4. Untuk menambah cabang baru, copy struktur branch dan tambahkan ke array `branches`
5. Simpan file dan deploy perubahan

### Cara Mendapatkan Koordinat Geo
1. Buka Google Maps
2. Cari alamat cabang
3. Klik kanan pada lokasi → "What's here?"
4. Copy koordinat yang muncul (format: latitude, longitude)

---

## 2. Verifikasi SEO Setelah Update Konten

### Checklist Verifikasi untuk Setiap Halaman Baru/Update

#### A. Meta Tags
- [ ] Title tag ada dan panjangnya 50-60 karakter
- [ ] Meta description ada dan panjangnya 150-160 karakter
- [ ] Canonical URL sudah benar dan menggunakan HTTPS
- [ ] Keywords relevan dengan konten halaman (jika ada)

#### B. Open Graph Tags (untuk Social Media)
- [ ] og:title sudah diset
- [ ] og:description sudah diset
- [ ] og:image sudah diset dan ukuran 1200x630px
- [ ] og:type sudah benar ('website' atau 'article')
- [ ] Untuk artikel: articlePublishedTime dan articleModifiedTime sudah diset

#### C. Structured Data
- [ ] Structured data sudah ditambahkan (organization atau article)
- [ ] Data yang diisi sudah lengkap dan akurat
- [ ] Tidak ada error di Google Rich Results Test

### Cara Verifikasi Manual

#### 1. Cek Meta Tags di Browser
1. Buka halaman yang ingin dicek
2. Klik kanan → "View Page Source" atau tekan `Ctrl+U`
3. Cari tag `<title>`, `<meta name="description">`, dan `<link rel="canonical">`
4. Pastikan semua sudah ada dan isinya benar

#### 2. Test dengan Google Rich Results Test
1. Buka https://search.google.com/test/rich-results
2. Masukkan URL halaman atau paste HTML source
3. Klik "Test URL" atau "Test Code"
4. Periksa hasil:
   - ✅ Hijau = Valid
   - ⚠️ Kuning = Warning (sebaiknya diperbaiki)
   - ❌ Merah = Error (harus diperbaiki)

#### 3. Test dengan Facebook Sharing Debugger
1. Buka https://developers.facebook.com/tools/debug/
2. Masukkan URL halaman
3. Klik "Debug"
4. Periksa preview dan pastikan gambar, title, description muncul dengan benar

#### 4. Jalankan Script Validasi Otomatis
```bash
# Validasi meta tags
node scripts/validate-meta-tags.js

# Validasi structured data
node scripts/validate-structured-data.js

# Validasi sitemap
node scripts/validate-sitemap.js

# Validasi robots.txt
node scripts/validate-robots.js
```

---

## 3. Monitoring Google Search Console

### Setup Awal (Jika Belum)
1. Buka https://search.google.com/search-console
2. Login dengan akun Google
3. Tambahkan property website (https://albiruni.sch.id)
4. Verifikasi kepemilikan website (gunakan metode HTML tag atau DNS)

### Monitoring Rutin (Mingguan/Bulanan)

#### A. Performance Report
**Lokasi:** Search Console → Performance

Pantau metrik berikut:
- **Total Clicks:** Jumlah klik dari hasil pencarian
- **Total Impressions:** Berapa kali website muncul di hasil pencarian
- **Average CTR:** Click-through rate (target: >3%)
- **Average Position:** Posisi rata-rata di hasil pencarian (target: <10)

**Action Items:**
- Jika CTR rendah: Perbaiki title dan description agar lebih menarik
- Jika position tinggi (>20): Tingkatkan kualitas konten dan backlink
- Identifikasi halaman dengan impressions tinggi tapi clicks rendah → perbaiki meta tags

#### B. Coverage Report
**Lokasi:** Search Console → Coverage

Periksa:
- **Valid pages:** Halaman yang berhasil diindex (harus meningkat seiring waktu)
- **Error pages:** Halaman dengan error (harus 0 atau minimal)
- **Valid with warnings:** Halaman dengan warning (sebaiknya diperbaiki)
- **Excluded pages:** Halaman yang tidak diindex (pastikan sesuai dengan robots.txt)

**Action Items:**
- Jika ada error: Klik untuk melihat detail dan perbaiki masalahnya
- Jika halaman penting tidak terindex: Periksa robots.txt dan sitemap.xml
- Submit sitemap jika belum: `https://albiruni.sch.id/sitemap.xml`

#### C. Enhancements Report
**Lokasi:** Search Console → Enhancements

Periksa:
- **Structured Data:** Pastikan tidak ada error pada structured data
- **Mobile Usability:** Pastikan website mobile-friendly
- **Core Web Vitals:** Pantau performa loading website

**Action Items:**
- Perbaiki error structured data segera
- Jika ada masalah mobile usability: Test di berbagai device dan perbaiki
- Jika Core Web Vitals buruk: Optimasi gambar dan loading speed

#### D. Sitemaps Report
**Lokasi:** Search Console → Sitemaps

Periksa:
- Sitemap sudah disubmit: `https://albiruni.sch.id/sitemap.xml`
- Status: "Success" (hijau)
- Discovered URLs vs Indexed URLs (idealnya sama atau mendekati)

**Action Items:**
- Jika sitemap error: Periksa format XML dan perbaiki
- Jika banyak URL tidak terindex: Periksa kualitas konten dan robots.txt
- Submit ulang sitemap setelah ada perubahan besar

### Monitoring Khusus untuk Berita/Artikel Baru

Setelah publish artikel baru:
1. **Hari 1-3:** Submit URL ke Google Search Console
   - Buka Search Console → URL Inspection
   - Masukkan URL artikel baru
   - Klik "Request Indexing"

2. **Minggu 1:** Periksa apakah artikel sudah terindex
   - Buka Search Console → URL Inspection
   - Masukkan URL artikel
   - Lihat status: "URL is on Google" = sudah terindex

3. **Minggu 2-4:** Pantau performance artikel
   - Lihat clicks, impressions, dan position
   - Jika performance buruk: Perbaiki title, description, atau konten

---

## 4. Checklist Update Konten Berita

Setiap kali membuat atau update berita, pastikan:

### Saat Membuat Berita Baru
- [ ] Title menarik dan mengandung keyword (50-60 karakter)
- [ ] Excerpt/description informatif (150-160 karakter)
- [ ] Featured image berkualitas tinggi (min 1200x630px)
- [ ] Slug URL SEO-friendly (gunakan huruf kecil, pisah dengan dash)
- [ ] Konten minimal 300 kata
- [ ] Gunakan heading (H2, H3) untuk struktur konten
- [ ] Tambahkan alt text pada semua gambar

### Saat Update Berita
- [ ] Update tanggal modified
- [ ] Periksa apakah meta description masih relevan
- [ ] Jika ada perubahan besar: Submit ulang URL ke Search Console

### Setelah Publish
- [ ] Test URL di browser (pastikan SEO tags muncul)
- [ ] Test dengan Google Rich Results Test
- [ ] Submit URL ke Google Search Console untuk indexing cepat
- [ ] Share di social media (test preview di Facebook/Twitter)

---

## 5. Troubleshooting Umum

### Masalah: Halaman Tidak Muncul di Google
**Solusi:**
1. Periksa robots.txt - pastikan halaman tidak di-block
2. Periksa sitemap.xml - pastikan URL ada di sitemap
3. Submit URL manual di Search Console
4. Tunggu 1-2 minggu untuk indexing

### Masalah: Structured Data Error
**Solusi:**
1. Test dengan Google Rich Results Test
2. Lihat error message dan perbaiki field yang bermasalah
3. Pastikan semua required fields sudah diisi
4. Pastikan format tanggal menggunakan ISO 8601

### Masalah: Meta Tags Tidak Muncul di Social Media
**Solusi:**
1. Periksa Open Graph tags di source code
2. Clear cache Facebook: https://developers.facebook.com/tools/debug/
3. Pastikan og:image menggunakan URL lengkap (bukan relative path)
4. Pastikan gambar bisa diakses publik (tidak ada authentication)

### Masalah: Sitemap Error
**Solusi:**
1. Test sitemap di browser: https://albiruni.sch.id/sitemap.xml
2. Pastikan format XML valid
3. Pastikan semua URL menggunakan HTTPS
4. Pastikan tidak ada URL yang return 404

---

## 6. Kontak dan Resources

### Tools yang Digunakan
- **Google Search Console:** https://search.google.com/search-console
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
- **Schema.org Documentation:** https://schema.org/

### Script Validasi
- `scripts/validate-meta-tags.js` - Validasi meta tags
- `scripts/validate-structured-data.js` - Validasi structured data
- `scripts/validate-sitemap.js` - Validasi sitemap
- `scripts/validate-robots.js` - Validasi robots.txt

### Dokumentasi Komponen
- `resources/js/components/seo/SEOHead.tsx` - Komponen meta tags
- `resources/js/components/seo/StructuredData.tsx` - Komponen structured data
- `resources/js/components/seo/types.ts` - TypeScript interfaces

---

## 7. Schedule Maintenance

### Harian
- Monitor error di Google Search Console (jika ada notifikasi)

### Mingguan
- Periksa Performance Report di Search Console
- Review artikel baru yang sudah terindex
- Periksa Coverage Report untuk error baru

### Bulanan
- Review keseluruhan metrik SEO (clicks, impressions, CTR, position)
- Analisa keyword performance
- Update konten lama yang performance-nya menurun
- Periksa dan update informasi bisnis jika ada perubahan

### Triwulanan
- Audit lengkap semua halaman dengan script validasi
- Review dan update strategi SEO
- Analisa kompetitor
- Update structured data jika ada perubahan bisnis

---

**Terakhir diupdate:** November 2024
**Versi:** 1.0
