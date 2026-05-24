<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Rapor {{ $siswa->nama_lengkap }} - Semester {{ $rapor->semester }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            padding: 20px;
            color: #1e293b;
        }

        /* ── Kop Surat ───────────────────────────── */
        .kop {
            display: table;
            width: 100%;
            margin-bottom: 0;
        }

        .kop-logo-cell {
            display: table-cell;
            width: 85px;
            vertical-align: middle;
            text-align: center;
        }

        .kop-logo-cell img {
            width: 75px;
            height: 75px;
        }

        .kop-info {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            padding: 0 10px;
        }

        .kop-sekolah {
            font-size: 18px;
            font-weight: bold;
            color: #1e3a8a;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .kop-tagline {
            font-size: 10px;
            color: #475569;
            margin-top: 3px;
            font-style: italic;
        }

        .kop-alamat {
            font-size: 8.5px;
            color: #475569;
            margin-top: 5px;
            line-height: 1.9;
        }

        .kop-spacer {
            display: table-cell;
            width: 85px;
        }

        .kop-divider-top {
            border-top: 3px solid #1e3a8a;
            margin-top: 10px;
        }

        .kop-divider-bottom {
            border-top: 1px solid #1e3a8a;
            margin-top: 2px;
            margin-bottom: 12px;
        }

        .doc-title {
            text-align: center;
            margin: 8px 0 4px;
        }

        .doc-title h1 {
            font-size: 13px;
            font-weight: bold;
            color: #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .doc-title p {
            font-size: 10px;
            color: #475569;
            margin-top: 2px;
        }

        /* ── Section ─────────────────────────────── */
        .section {
            margin-bottom: 14px;
        }

        .section-title {
            background: #1e3a8a;
            color: white;
            padding: 5px 10px;
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        /* ── Identitas vertikal ──────────────────── */
        .id-row {
            display: table;
            width: 100%;
            padding: 5px 2px;
            border-bottom: 1px solid #e2e8f0;
        }

        .id-label {
            display: table-cell;
            width: 36%;
            font-size: 9.5px;
            color: #64748b;
        }

        .id-sep {
            display: table-cell;
            width: 3%;
            font-size: 9.5px;
            color: #94a3b8;
        }

        .id-value {
            display: table-cell;
            font-size: 9.5px;
            font-weight: bold;
            color: #1e293b;
        }

        /* ── Tabel ───────────────────────────────── */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }

        th {
            background: #dbeafe;
            color: #1e40af;
            padding: 5px 6px;
            border: 1px solid #93c5fd;
            font-size: 9px;
        }

        td {
            padding: 5px 6px;
            border: 1px solid #cbd5e1;
            font-size: 9px;
            line-height: 1.5;
        }

        /* ── Grafik WHO ──────────────────────────── */
        .growth-charts {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }

        .chart-cell {
            display: table-cell;
            width: 33%;
            padding-right: 5px;
            vertical-align: top;
        }

        .chart-cell:last-child {
            padding-right: 0;
        }

        .chart-title {
            font-size: 8px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 3px;
            text-align: center;
        }

        /* ── Perkembangan ────────────────────────── */
        .aspek-name {
            font-weight: bold;
            font-size: 9px;
        }

        .aspek-status {
            font-size: 8px;
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
        }

        .status-BB {
            background: #fee2e2;
            color: #991b1b;
        }

        .status-MB {
            background: #fef9c3;
            color: #92400e;
        }

        .status-BSH {
            background: #dbeafe;
            color: #1e40af;
        }

        .status-BSB {
            background: #dcfce7;
            color: #166534;
        }

        /* ── Penutup ─────────────────────────────── */
        .penutup-label {
            font-size: 9px;
            font-weight: bold;
            color: #475569;
            margin-bottom: 3px;
        }

        .penutup-text {
            font-size: 9px;
            color: #1e293b;
            line-height: 1.7;
            margin-bottom: 10px;
        }

        /* ── Tanda Tangan ────────────────────────── */
        .signature-wrap {
            display: table;
            width: 100%;
            margin-top: 20px;
        }

        .sig-left {
            display: table-cell;
            width: 48%;
            vertical-align: middle;
            padding-right: 10px;
        }

        .sig-right {
            display: table-cell;
            width: 52%;
            vertical-align: top;
            text-align: center;
        }

        .galeri-qr-box {
            border: 1px dashed #93c5fd;
            border-radius: 8px;
            padding: 8px;
            text-align: center;
            background: #f0f9ff;
        }

        .galeri-qr-title {
            font-size: 8px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 3px;
        }

        .galeri-qr-sub {
            font-size: 7px;
            color: #64748b;
            margin-top: 4px;
            line-height: 1.5;
        }

        .kepsek-date {
            font-size: 9px;
            color: #475569;
            margin-bottom: 3px;
        }

        .kepsek-title {
            font-size: 9px;
            margin-bottom: 5px;
        }

        .qr-label {
            font-size: 7px;
            color: #64748b;
            margin-bottom: 3px;
        }

        .qr-note {
            font-size: 6.5px;
            color: #94a3b8;
            margin-top: 3px;
        }

        .kepsek-line {
            border-top: 1px solid #333;
            padding-top: 4px;
            display: inline-block;
            min-width: 130px;
            font-size: 9px;
            font-weight: bold;
            margin-top: 5px;
        }

        /* ── Page break ──────────────────────────── */
        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>

    {{-- ═══════════════════════════════════════════ HALAMAN 1 ═══ --}}

    {{-- Kop Surat Resmi --}}
    @php
        $logoPath = public_path('assets/images/albiruni/logoalbiruni.webp');
        $logoSrc = file_exists($logoPath)
            ? 'data:image/webp;base64,' . base64_encode(file_get_contents($logoPath))
            : '';
    @endphp
    <div class="kop">
        <div class="kop-logo-cell">
            @if ($logoSrc)
                <img src="{{ $logoSrc }}" alt="Logo Al-Biruni" />
            @endif
        </div>
        <div class="kop-info">
            <div class="kop-sekolah">Al-Biruni Preschool &amp; Daycare</div>
            <div class="kop-tagline">Tumbuh Bersama, Berkembang Berkarakter Di Rumah Al-Biruni</div>
            <div class="kop-alamat">
                Jl. S. Parman No. 5, Ulak Karang, Padang &nbsp;&bull;&nbsp; Jl. Marapalam Raya, Marapalam, Padang<br>
                Sumatera Barat 25000 &nbsp;&bull;&nbsp; Telp/WA: 08116689022 &nbsp;&bull;&nbsp;
                www.albiruni.sch.id
            </div>
        </div>
        <div class="kop-spacer"></div>
    </div>
    <div class="kop-divider-top"></div>
    <div class="kop-divider-bottom"></div>

    {{-- Judul Dokumen --}}
    <div class="doc-title">
        <h1>Laporan Perkembangan Anak</h1>
        <p>Semester {{ $rapor->semester }} &bull; Tahun Ajaran {{ $rapor->tahun_ajaran }}</p>
    </div>
    <div style="border-bottom: 1px solid #e2e8f0; margin: 6px 0 10px;"></div>

    {{-- Identitas (vertikal + foto 3x4) --}}
    @php
        $fotoSiswaPath = $siswa->foto_siswa ? public_path('assets/images/foto_siswa/' . $siswa->foto_siswa) : null;
        $fotoSiswaSrc =
            $fotoSiswaPath && file_exists($fotoSiswaPath)
                ? 'data:image/jpeg;base64,' . base64_encode(file_get_contents($fotoSiswaPath))
                : null;
    @endphp
    <div class="section" style="margin-bottom: 40px;">
        <div class="section-title">Identitas Anak</div>

        <div style="display:table; width:100%;">

            {{-- Kolom kiri: data identitas --}}
            <div style="display:table-cell; vertical-align:top; padding-right:10px;">

                <div class="id-row">
                    <span class="id-label">Nama Lengkap</span><span class="id-sep">:</span>
                    <span class="id-value">{{ $siswa->nama_lengkap }}</span>
                </div>
                <div class="id-row">
                    <span class="id-label">Nama Panggilan</span><span class="id-sep">:</span>
                    <span class="id-value">{{ $siswa->nama_panggilan ?? '-' }}</span>
                </div>
                <div class="id-row">
                    <span class="id-label">Kelas</span><span class="id-sep">:</span>
                    <span class="id-value">{{ $siswa->kelas->nama_kelas ?? '-' }}</span>
                </div>
                <div class="id-row">
                    <span class="id-label">Jenis Kelamin</span><span class="id-sep">:</span>
                    <span class="id-value">{{ ucfirst($siswa->jenis_kelamin) }}</span>
                </div>
                <div class="id-row">
                    <span class="id-label">Tanggal Lahir</span><span class="id-sep">:</span>
                    <span class="id-value">
                        {{ $siswa->tanggal_lahir ? \Carbon\Carbon::parse($siswa->tanggal_lahir)->locale('id')->isoFormat('D MMMM Y') : '-' }}
                    </span>
                </div>
                <div class="id-row">
                    <span class="id-label">Guru Kelas</span><span class="id-sep">:</span>
                    <span class="id-value">{{ $rapor->guru_kelas ?? '-' }}</span>
                </div>

                {{-- Pemisah orang tua --}}
                <div
                    style="background:#f1f5f9; padding:4px 8px; margin-top:8px; margin-bottom:2px; font-size:9px; font-weight:bold; color:#475569; letter-spacing:0.03em;">
                    Data Orang Tua
                </div>

                {{-- Ayah --}}
                @if ($siswa->ayah_nama_lengkap)
                    <div class="id-row">
                        <span class="id-label">Nama Ayah</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ayah_nama_lengkap }}</span>
                    </div>
                @endif
                @if ($siswa->ayah_pekerjaan)
                    <div class="id-row">
                        <span class="id-label">Pekerjaan Ayah</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ayah_pekerjaan }}</span>
                    </div>
                @endif
                @if ($siswa->ayah_no_hp)
                    <div class="id-row">
                        <span class="id-label">No. HP Ayah</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ayah_no_hp }}</span>
                    </div>
                @endif
                @if ($siswa->ayah_telepon_rumah)
                    <div class="id-row">
                        <span class="id-label">Telp. Rumah</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ayah_telepon_rumah }}</span>
                    </div>
                @endif
                @if ($siswa->ayah_alamat_rumah)
                    <div class="id-row">
                        <span class="id-label">Alamat Rumah</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ayah_alamat_rumah }}</span>
                    </div>
                @endif
                @if ($siswa->ayah_alamat_kantor)
                    <div class="id-row">
                        <span class="id-label">Alamat Kantor Ayah</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ayah_alamat_kantor }}</span>
                    </div>
                @endif

                {{-- Ibu --}}
                @if ($siswa->ibu_nama_lengkap)
                    <div class="id-row">
                        <span class="id-label">Nama Ibu</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ibu_nama_lengkap }}</span>
                    </div>
                @endif
                @if ($siswa->ibu_pekerjaan)
                    <div class="id-row">
                        <span class="id-label">Pekerjaan Ibu</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ibu_pekerjaan }}</span>
                    </div>
                @endif
                @if ($siswa->ibu_no_hp)
                    <div class="id-row">
                        <span class="id-label">No. HP Ibu</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ibu_no_hp }}</span>
                    </div>
                @endif
                @if ($siswa->ibu_telepon_rumah)
                    <div class="id-row">
                        <span class="id-label">Telp. Rumah Ibu</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ibu_telepon_rumah }}</span>
                    </div>
                @endif
                @if ($siswa->ibu_alamat_kantor)
                    <div class="id-row">
                        <span class="id-label">Alamat Kantor Ibu</span><span class="id-sep">:</span>
                        <span class="id-value">{{ $siswa->ibu_alamat_kantor }}</span>
                    </div>
                @endif

            </div>{{-- /kolom kiri --}}

            {{-- Kolom kanan: foto 3x4 --}}
            <div
                style="display:table-cell; width:96px; vertical-align:top; text-align:center; padding-left:4px; padding-top:2px;">
                <div style="width:90px; height:120px; border:1px solid #cbd5e1; background:#f8fafc; overflow:hidden;">
                    @if ($fotoSiswaSrc)
                        <img src="{{ $fotoSiswaSrc }}" style="width:90px; height:120px;" />
                    @else
                        <div style="display:table; width:90px; height:120px;">
                            <div style="display:table-cell; vertical-align:middle; text-align:center;">
                                <p style="font-size:8px; color:#94a3b8; line-height:1.8;">Foto<br>3×4</p>
                            </div>
                        </div>
                    @endif
                </div>
                <p style="font-size:7px; color:#64748b; margin-top:3px; text-align:center;">Foto</p>
            </div>{{-- /kolom kanan --}}

        </div>{{-- /display:table --}}
        <div style="height:2px;"></div>
    </div>

    {{-- A. Grafik Pertumbuhan --}}
    <div class="section">
        <div class="section-title">A. Grafik Pertumbuhan (Kurva WHO)</div>

        @php
            $whoChartDir = public_path('assets/who-charts');
            $whoImgs = [];
            foreach (['wfa', 'lhfa', 'hcfa'] as $_ind) {
                $_path = "{$whoChartDir}/{$_ind}-{$sex}-zscore.png";
                $whoImgs[$_ind] = file_exists($_path)
                    ? 'data:image/png;base64,' . base64_encode(file_get_contents($_path))
                    : null;
            }
        @endphp

        <div class="growth-charts">
            <div class="chart-cell">
                <div class="chart-title">Berat Badan / Umur (BB/U)</div>
                @if ($whoImgs['wfa'])
                    <img src="{{ $whoImgs['wfa'] }}" style="width:100%;display:block;" />
                @else
                    <p style="font-size:7px;color:#94a3b8;text-align:center;">Tidak tersedia</p>
                @endif
            </div>
            <div class="chart-cell">
                <div class="chart-title">Tinggi Badan / Umur (TB/U)</div>
                @if ($whoImgs['lhfa'])
                    <img src="{{ $whoImgs['lhfa'] }}" style="width:100%;display:block;" />
                @else
                    <p style="font-size:7px;color:#94a3b8;text-align:center;">Tidak tersedia</p>
                @endif
            </div>
            <div class="chart-cell">
                <div class="chart-title">Lingkar Kepala / Umur (LK/U)</div>
                @if ($whoImgs['hcfa'])
                    <img src="{{ $whoImgs['hcfa'] }}" style="width:100%;display:block;" />
                @else
                    <p style="font-size:7px;color:#94a3b8;text-align:center;">Tidak tersedia</p>
                @endif
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Bulan</th>
                    <th>Berat Badan (kg)</th>
                    <th>Tinggi Badan (cm)</th>
                    <th>Lingkar Kepala (cm)</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($rapor->pertumbuhans as $pt)
                    <tr>
                        <td>{{ $pt->nama_bulan }}</td>
                        <td style="text-align:center;">{{ $pt->berat_badan ?? '-' }}</td>
                        <td style="text-align:center;">{{ $pt->tinggi_badan ?? '-' }}</td>
                        <td style="text-align:center;">{{ $pt->lingkar_kepala ?? '-' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" style="text-align:center;color:#94a3b8;">Belum ada data</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- ═══════════════ PAGE BREAK ═══════════════ --}}
    <div class="page-break"></div>

    {{-- ═══════════════════════════════════════════ HALAMAN 2 ═══ --}}
    <div style="height:18px;"></div>

    {{-- B. Perkembangan --}}
    <div class="section">
        <div class="section-title">B. Perkembangan Anak</div>
        <table>
            <thead>
                <tr>
                    <th style="width:28%;">Aspek</th>
                    <th style="width:13%;">Status</th>
                    <th>Narasi</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($aspekLabels as $key => $label)
                    @php $p = $rapor->perkembangans->firstWhere('aspek', $key); @endphp
                    <tr>
                        <td class="aspek-name">{{ $label }}</td>
                        <td style="text-align:center;">
                            @if ($p && $p->status)
                                <span class="aspek-status status-{{ $p->status }}">{{ $p->status }}</span>
                            @else
                                <span style="color:#94a3b8;">-</span>
                            @endif
                        </td>
                        <td>{{ $p->narasi ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <div style="font-size:7px;color:#64748b;margin-top:2px;">
            <strong>Keterangan:</strong>
            BB = Belum Berkembang &nbsp;|&nbsp;
            MB = Mulai Berkembang &nbsp;|&nbsp;
            BSH = Berkembang Sesuai Harapan &nbsp;|&nbsp;
            BSB = Berkembang Sangat Baik
        </div>
    </div>

    {{-- C. Narasi Emosional --}}
    @if ($rapor->penutup_umum || $rapor->penutup_motivasi_orangtua || $rapor->penutup_penguatan_positif)
        <div class="section">
            <div class="section-title">C. Narasi Emosional</div>
            @if ($rapor->penutup_umum)
                <p class="penutup-label">Penutup Umum</p>
                <p class="penutup-text">{{ $rapor->penutup_umum }}</p>
            @endif
            @if ($rapor->penutup_motivasi_orangtua)
                <p class="penutup-label">Motivasi untuk Orang Tua</p>
                <p class="penutup-text">{{ $rapor->penutup_motivasi_orangtua }}</p>
            @endif
            @if ($rapor->penutup_penguatan_positif)
                <p class="penutup-label">Penguatan Positif</p>
                <p class="penutup-text">{{ $rapor->penutup_penguatan_positif }}</p>
            @endif
        </div>
    @endif

    {{-- Tanda Tangan: kiri = QR Galeri | kanan = Kepsek + QR Verifikasi --}}
    <div class="signature-wrap">

        {{-- Kiri: QR Galeri Foto --}}
        <div class="sig-left">
            <div class="galeri-qr-box">
                <p class="galeri-qr-title">Galeri Foto Kegiatan</p>
                <p class="galeri-qr-sub">{{ $rapor->siswa->nama_panggilan ?: $rapor->siswa->nama_lengkap }}</p>
                @if (!empty($galeriQrPng))
                    <img src="{{ $galeriQrPng }}" style="width:90px;height:90px;display:block;margin:4px auto;" />
                @endif
                <p class="galeri-qr-sub">
                    Semester {{ $rapor->semester }} &bull; {{ $rapor->tahun_ajaran }}<br>
                    Scan untuk lihat foto kegiatan anak
                </p>
            </div>
        </div>

        {{-- Kanan: Kepala Sekolah + QR Verifikasi TTD --}}
        <div class="sig-right">
            <p class="kepsek-date">Padang, {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}</p>
            <p class="kepsek-title">Kepala Sekolah,</p>
            @if (!empty($qrCodePng))
                <p class="qr-label">Scan untuk verifikasi keaslian tanda tangan</p>
                <img src="{{ $qrCodePng }}" style="width:90px;height:90px;display:block;margin:2px auto;" />
                <p class="qr-note">albiruni.sch.id</p>
            @endif
            <div class="kepsek-line">{{ $namaKepsek }}</div>
        </div>

    </div>

</body>

</html>
