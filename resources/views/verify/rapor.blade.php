<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Tanda Tangan — Al-Biruni</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #eff6ff 0%, #fdf2f8 50%, #f0fdf4 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            max-width: 420px;
            width: 100%;
            overflow: hidden;
        }
        .card-header {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            padding: 24px 20px;
            text-align: center;
            color: white;
        }
        .card-header .verified-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 20px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .card-header h1 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .card-header p { font-size: 12px; opacity: 0.85; }

        .card-body { padding: 24px 20px; }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 11px; color: #64748b; font-weight: 500; }
        .info-value { font-size: 13px; color: #1e293b; font-weight: 600; text-align: right; max-width: 60%; }

        .signature-section {
            margin-top: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 16px;
            background: #f8fafc;
        }
        .signature-label {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            text-align: center;
        }
        .signature-img-wrap {
            position: relative;
            background: white;
            border-radius: 10px;
            border: 1px dashed #cbd5e1;
            padding: 12px;
            text-align: center;
            overflow: hidden;
        }
        .signature-img-wrap img {
            max-width: 200px;
            max-height: 100px;
            object-fit: contain;
        }
        .watermark {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }
        .watermark-text {
            font-size: 11px;
            font-weight: 700;
            color: rgba(37, 99, 235, 0.12);
            transform: rotate(-25deg);
            white-space: nowrap;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            line-height: 1.8;
            text-align: center;
        }
        .kepsek-name {
            margin-top: 10px;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
        }
        .kepsek-title {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
        }

        .footer {
            padding: 16px 20px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            text-align: center;
        }
        .footer p { font-size: 10px; color: #94a3b8; line-height: 1.6; }
        .footer .domain { font-weight: 600; color: #64748b; }
    </style>
</head>
<body>
    <div class="card">
        <div class="card-header">
            <div class="verified-badge">
                &#10003; Dokumen Terverifikasi
            </div>
            <h1>Tanda Tangan Resmi</h1>
            <p>Al-Biruni Preschool &amp; Daycare</p>
        </div>

        <div class="card-body">
            <div class="info-row">
                <span class="info-label">Nama Anak</span>
                <span class="info-value">{{ $rapor->siswa->nama_lengkap }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Kelas</span>
                <span class="info-value">{{ $rapor->siswa->kelas->nama_kelas ?? '-' }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Semester</span>
                <span class="info-value">Semester {{ $rapor->semester }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tahun Ajaran</span>
                <span class="info-value">{{ $rapor->tahun_ajaran }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value" style="color:#16a34a;">&#10003; Final / Sah</span>
            </div>

            <div class="signature-section">
                <div class="signature-label">Tanda Tangan Kepala Sekolah</div>
                <div class="signature-img-wrap">
                    @if ($kepsekSrc)
                        <img src="{{ $kepsekSrc }}" alt="Tanda Tangan Kepala Sekolah" />
                    @else
                        <p style="font-size:11px;color:#94a3b8;padding:20px 0;">Tanda tangan tidak tersedia</p>
                    @endif
                    <div class="watermark">
                        <div class="watermark-text">
                            RAPOR {{ strtoupper($rapor->siswa->nama_lengkap) }}<br>
                            SEM {{ $rapor->semester }} &#x2022; {{ $rapor->tahun_ajaran }}<br>
                            AL-BIRUNI
                        </div>
                    </div>
                </div>
                <div class="kepsek-name">
                    {{ $namaKepsek }}
                    <div class="kepsek-title">Kepala Sekolah</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>
                Dokumen ini diterbitkan secara resmi oleh<br>
                <span class="domain">albiruni.sch.id</span><br>
                Jika Anda menerima dokumen ini dan tanda tangan tidak sesuai,<br>
                hubungi sekolah untuk konfirmasi.
            </p>
        </div>
    </div>
</body>
</html>
