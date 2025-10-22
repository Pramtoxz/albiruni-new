# Panduan Mobile Webview untuk Flutter

## Dashboard Orang Tua - Mobile First Design

Dashboard orang tua telah dioptimasi untuk tampilan mobile dan webview Flutter dengan fitur:

### 🎨 Fitur UI Mobile-Friendly

1. **Header dengan Profil**
   - Avatar user
   - Nama dan greeting
   - Notifikasi button
   - Info card siswa dengan foto

2. **Quick Actions Grid**
   - 4 tombol aksi cepat (Rapor, Absensi, Tagihan, Notifikasi)
   - Icon berwarna untuk visual yang menarik
   - Touch-friendly dengan active state

3. **Content Cards**
   - Pengumuman terbaru
   - Aktivitas terkini siswa
   - Card dengan shadow dan border radius

4. **Bottom Navigation**
   - Fixed di bagian bawah
   - 5 menu utama: Beranda, Jadwal, Tugas, Pembayaran, Pesan
   - Active state indicator
   - Safe area untuk notch devices

### 📱 Optimasi Mobile

#### CSS Mobile-First
File: `resources/css/mobile.css`

- Smooth scrolling
- Touch-friendly buttons (no highlight)
- Safe area untuk notch devices (iPhone X+)
- Prevent text selection kecuali di input
- Active state animations
- Hide scrollbar tapi tetap bisa scroll

#### Responsive Design
- Gradient background
- Card-based layout
- Touch target minimal 44x44px
- Spacing yang cukup untuk jari
- Font size yang readable di mobile

### 🔧 Integrasi dengan Flutter WebView

#### 1. Setup WebView di Flutter

```dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class OrangtuaDashboard extends StatefulWidget {
  @override
  _OrangtuaDashboardState createState() => _OrangtuaDashboardState();
}

class _OrangtuaDashboardState extends State<OrangtuaDashboard> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {},
          onPageFinished: (String url) {},
          onWebResourceError: (WebResourceError error) {},
        ),
      )
      ..loadRequest(Uri.parse('https://yourapp.com/dashboard'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: WebViewWidget(controller: controller),
      ),
    );
  }
}
```

#### 2. Handle Authentication

```dart
// Simpan token setelah login
SharedPreferences prefs = await SharedPreferences.getInstance();
await prefs.setString('auth_token', token);

// Load dengan token
controller.loadRequest(
  Uri.parse('https://yourapp.com/dashboard'),
  headers: {
    'Authorization': 'Bearer $token',
  },
);
```

#### 3. JavaScript Bridge (Optional)

Untuk komunikasi Flutter ↔ WebView:

```dart
// Di Flutter
controller.addJavaScriptChannel(
  'FlutterChannel',
  onMessageReceived: (JavaScriptMessage message) {
    print('Received: ${message.message}');
  },
);

// Di JavaScript (Laravel)
window.FlutterChannel.postMessage('Hello from Web');
```

### 🎯 Fitur yang Sudah Diimplementasi

#### Dashboard Orang Tua (`/dashboard`)
- ✅ Header dengan profil user
- ✅ Info card siswa
- ✅ Quick actions (4 tombol)
- ✅ Pengumuman terbaru
- ✅ Aktivitas terkini
- ✅ Bottom navigation
- ✅ Responsive mobile-first
- ✅ Dark mode support

#### Form Pendaftaran Siswa (`/siswa/register`)
- ✅ Sticky header dengan gradient
- ✅ Form sections dengan emoji icons
- ✅ Mobile-friendly inputs
- ✅ Sticky submit button
- ✅ Touch-friendly spacing
- ✅ Card-based sections

### 🚀 Cara Testing

#### 1. Testing di Browser Mobile
```bash
# Jalankan dev server
npm run dev
php artisan serve

# Buka di browser mobile atau Chrome DevTools (F12 > Toggle Device Toolbar)
```

#### 2. Testing di Flutter
```bash
# Install dependencies
flutter pub add webview_flutter

# Run app
flutter run
```

### 📐 Design Specifications

#### Colors
- Primary: Sesuai theme Tailwind
- Background: Gradient dari primary/5 ke background
- Cards: White dengan shadow subtle

#### Spacing
- Padding container: 16px (p-4)
- Gap antar cards: 16px
- Touch target minimum: 44x44px

#### Typography
- Header: text-xl (20px)
- Card title: text-base (16px)
- Body text: text-sm (14px)
- Caption: text-xs (12px)

#### Icons
- Size: 20-24px (h-5 w-5 atau h-6 w-6)
- Lucide React icons

### 🔐 Security untuk WebView

1. **HTTPS Only**: Pastikan menggunakan HTTPS di production
2. **CORS**: Setup CORS untuk domain Flutter app
3. **CSP**: Content Security Policy headers
4. **Token**: Gunakan Bearer token untuk auth

### 📱 Viewport Meta Tag

Sudah ada di `resources/views/app.blade.php`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 🎨 Customization

Untuk mengubah warna primary, edit di `resources/css/app.css`:
```css
:root {
    --primary: oklch(0.205 0 0); /* Ubah nilai ini */
}
```

### 📝 Next Steps

1. Implementasi fitur-fitur di quick actions
2. Tambahkan real data dari database
3. Implementasi notifikasi push
4. Tambahkan offline mode
5. Implementasi chat/messaging
6. Tambahkan calendar view
7. Payment gateway integration

### 🐛 Troubleshooting

**Problem**: WebView tidak load
- Cek internet connection
- Cek CORS settings
- Cek SSL certificate

**Problem**: Bottom nav tertutup keyboard
- Gunakan `resizeToAvoidBottomInset: true` di Scaffold

**Problem**: Scroll tidak smooth
- Pastikan CSS mobile.css sudah di-import
- Cek `scroll-behavior: smooth` di CSS

### 📞 Support

Untuk pertanyaan atau issue, silakan hubungi tim development.
