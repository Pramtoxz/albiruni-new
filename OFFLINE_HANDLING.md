# Offline Handling untuk Flutter WebView

## 🔌 Fitur Offline Detection

Sistem sudah dilengkapi dengan offline detection yang otomatis mendeteksi status koneksi internet.

### Komponen yang Dibuat:

1. **useOnlineStatus Hook** (`resources/js/hooks/use-online-status.tsx`)
   - Hook React untuk mendeteksi status online/offline
   - Menggunakan `navigator.onLine` API
   - Auto-update saat koneksi berubah

2. **OfflineIndicator Component** (`resources/js/components/offline-indicator.tsx`)
   - Banner merah di bagian bawah layar saat offline
   - Muncul otomatis saat tidak ada koneksi
   - Hilang otomatis saat koneksi kembali

3. **Offline Page** (`resources/js/pages/offline.tsx`)
   - Halaman khusus untuk menampilkan pesan offline
   - Tombol "Coba Lagi" untuk reload
   - Tips troubleshooting koneksi

## 📱 Integrasi dengan Flutter WebView

### 1. Deteksi Koneksi di Flutter

```dart
import 'package:connectivity_plus/connectivity_plus.dart';

class WebViewScreen extends StatefulWidget {
  @override
  _WebViewScreenState createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late WebViewController _controller;
  bool _isOnline = true;
  
  @override
  void initState() {
    super.initState();
    _checkConnectivity();
    _listenToConnectivity();
  }
  
  void _checkConnectivity() async {
    var connectivityResult = await Connectivity().checkConnectivity();
    setState(() {
      _isOnline = connectivityResult != ConnectivityResult.none;
    });
  }
  
  void _listenToConnectivity() {
    Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
      setState(() {
        _isOnline = result != ConnectivityResult.none;
      });
      
      if (_isOnline) {
        _controller.reload();
      }
    });
  }
  
  @override
  Widget build(BuildContext context) {
    if (!_isOnline) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.wifi_off, size: 64, color: Colors.red),
              SizedBox(height: 16),
              Text('Tidak Ada Koneksi Internet'),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: _checkConnectivity,
                child: Text('Coba Lagi'),
              ),
            ],
          ),
        ),
      );
    }
    
    return WebView(
      initialUrl: 'https://your-domain.com',
      javascriptMode: JavascriptMode.unrestricted,
      onWebViewCreated: (controller) {
        _controller = controller;
      },
    );
  }
}
```

### 2. Cache Data Penting

Untuk menyimpan data penting saat offline:

```dart
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class CacheManager {
  static Future<void> saveDailyReports(List<dynamic> reports) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('cached_reports', jsonEncode(reports));
  }
  
  static Future<List<dynamic>> getCachedReports() async {
    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString('cached_reports');
    if (cached != null) {
      return jsonDecode(cached);
    }
    return [];
  }
  
  static Future<void> saveStudentData(Map<String, dynamic> student) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('cached_student', jsonEncode(student));
  }
  
  static Future<Map<String, dynamic>?> getCachedStudent() async {
    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString('cached_student');
    if (cached != null) {
      return jsonDecode(cached);
    }
    return null;
  }
}
```

### 3. Queue untuk Form Submission

Untuk menyimpan form yang belum terkirim:

```dart
class OfflineQueue {
  static Future<void> addToQueue(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> queue = prefs.getStringList('offline_queue') ?? [];
    queue.add(jsonEncode(data));
    await prefs.setStringList('offline_queue', queue);
  }
  
  static Future<void> processQueue() async {
    final prefs = await SharedPreferences.getInstance();
    List<String> queue = prefs.getStringList('offline_queue') ?? [];
    
    for (String item in queue) {
      try {
        Map<String, dynamic> data = jsonDecode(item);
        // Kirim data ke server
        await sendToServer(data);
      } catch (e) {
        print('Error processing queue item: $e');
      }
    }
    
    // Clear queue setelah berhasil
    await prefs.remove('offline_queue');
  }
  
  static Future<void> sendToServer(Map<String, dynamic> data) async {
    // Implementasi HTTP request
  }
}
```

## 🎯 Best Practices

### 1. Auto-Retry Mechanism
```javascript
// Di Laravel/Inertia
const submitForm = async (data) => {
  try {
    await router.post('/endpoint', data);
  } catch (error) {
    if (!navigator.onLine) {
      // Simpan ke localStorage untuk retry nanti
      localStorage.setItem('pending_submission', JSON.stringify(data));
      alert('Data akan dikirim saat koneksi kembali');
    }
  }
};

// Auto-retry saat online
window.addEventListener('online', () => {
  const pending = localStorage.getItem('pending_submission');
  if (pending) {
    const data = JSON.parse(pending);
    router.post('/endpoint', data);
    localStorage.removeItem('pending_submission');
  }
});
```

### 2. Service Worker untuk PWA (Optional)
```javascript
// public/service-worker.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 3. Loading States
Tambahkan loading indicator saat menunggu koneksi:

```typescript
const [isLoading, setIsLoading] = useState(false);
const isOnline = useOnlineStatus();

useEffect(() => {
  if (!isOnline) {
    setIsLoading(true);
  } else {
    setIsLoading(false);
  }
}, [isOnline]);
```

## 📦 Dependencies Flutter

Tambahkan di `pubspec.yaml`:

```yaml
dependencies:
  connectivity_plus: ^5.0.0
  shared_preferences: ^2.2.0
  webview_flutter: ^4.4.0
```

## 🔄 Flow Offline Handling

1. **User membuka app** → Check koneksi
2. **Jika offline** → Tampilkan cached data atau offline page
3. **User submit form** → Simpan ke queue
4. **Koneksi kembali** → Auto-process queue
5. **Success** → Clear queue & update UI

## ⚠️ Catatan Penting

- Offline indicator muncul otomatis di semua halaman
- Data form yang belum terkirim harus disimpan di localStorage/SharedPreferences
- Foto yang diupload saat offline perlu di-queue dan dikirim saat online
- Pastikan Flutter app handle WebView error dengan baik
- Test dengan mode pesawat untuk memastikan offline handling bekerja

## 🧪 Testing

1. **Test di Browser**: Buka DevTools → Network → Offline
2. **Test di Flutter**: Enable mode pesawat
3. **Test Auto-Retry**: Offline → Submit form → Online → Check data terkirim
