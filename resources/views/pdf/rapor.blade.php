<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rapor {{ $siswa->nama_lengkap }} - Semester {{ $rapor->semester }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 9px; padding: 15px; color: #1e293b; }

        .header { text-align: center; margin-bottom: 10px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
        .header h1 { font-size: 14px; color: #1e40af; margin-bottom: 2px; }
        .header h2 { font-size: 11px; color: #475569; font-weight: normal; }
        .logo { width: 70px; height: 70px; margin: 0 auto 5px; }

        .section { margin-bottom: 10px; }
        .section-title {
            background: #2563eb; color: white; padding: 3px 6px;
            font-size: 9px; font-weight: bold; margin-bottom: 5px;
        }

        table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
        th { background: #dbeafe; color: #1e40af; padding: 3px 5px; border: 1px solid #93c5fd; font-size: 8px; }
        td { padding: 3px 5px; border: 1px solid #cbd5e1; font-size: 8px; line-height: 1.4; }
        .info-label { color: #64748b; width: 30%; }
        .info-value { font-weight: bold; }

        .growth-charts { display: table; width: 100%; margin-bottom: 8px; }
        .chart-cell { display: table-cell; width: 33%; padding-right: 4px; vertical-align: top; }
        .chart-title { font-size: 7px; font-weight: bold; color: #1e40af; margin-bottom: 2px; text-align: center; }

        .aspek-row { margin-bottom: 4px; }
        .aspek-name { font-weight: bold; font-size: 8px; color: #1e293b; }
        .aspek-status { font-size: 7px; padding: 1px 5px; border-radius: 3px; display: inline-block; }
        .status-BB { background: #fee2e2; color: #991b1b; }
        .status-MB { background: #fef9c3; color: #92400e; }
        .status-BSH { background: #dbeafe; color: #1e40af; }
        .status-BSB { background: #dcfce7; color: #166534; }
        .aspek-narasi { font-size: 7.5px; color: #475569; margin-top: 1px; }

        .penutup { font-size: 8px; line-height: 1.6; }

        .signature-section { display: table; width: 100%; margin-top: 12px; }
        .signature-box { display: table-cell; text-align: center; width: 33%; font-size: 8px; }
        .signature-line { margin-top: 30px; border-top: 1px solid #333; padding-top: 3px; display: inline-block; min-width: 110px; }

        .chart-legend { font-size: 6px; }
        .legend-item { display: inline-block; margin-right: 6px; }
    </style>
</head>
<body>

{{-- Header --}}
<div class="header">
    @php
        $logoPath = public_path('assets/images/albiruni/logoalbiruni.webp');
        $logoSrc  = '';
        if (file_exists($logoPath)) {
            $logoSrc = 'data:image/webp;base64,' . base64_encode(file_get_contents($logoPath));
        }
    @endphp
    @if ($logoSrc)
        <img src="{{ $logoSrc }}" alt="Logo Al-Biruni" class="logo">
    @endif
    <h1>Laporan Perkembangan Anak</h1>
    <h2>Al-Biruni Preschool &amp; Daycare — Semester {{ $rapor->semester }} Tahun Ajaran {{ $rapor->tahun_ajaran }}</h2>
</div>

{{-- Identitas Siswa --}}
<div class="section">
    <div class="section-title">Identitas Anak</div>
    <table>
        <tr>
            <td class="info-label">Nama Lengkap</td>
            <td class="info-value">{{ $siswa->nama_lengkap }}</td>
            <td class="info-label">Nama Panggilan</td>
            <td class="info-value">{{ $siswa->nama_panggilan ?? '-' }}</td>
        </tr>
        <tr>
            <td class="info-label">Kelas</td>
            <td class="info-value">{{ $siswa->kelas->nama_kelas ?? '-' }}</td>
            <td class="info-label">Jenis Kelamin</td>
            <td class="info-value">{{ ucfirst($siswa->jenis_kelamin) }}</td>
        </tr>
        <tr>
            <td class="info-label">Tanggal Lahir</td>
            <td class="info-value">
                {{ $siswa->tanggal_lahir ? \Carbon\Carbon::parse($siswa->tanggal_lahir)->locale('id')->isoFormat('D MMMM Y') : '-' }}
            </td>
            <td class="info-label">Guru Kelas</td>
            <td class="info-value">{{ $rapor->guru_kelas ?? '-' }}</td>
        </tr>
    </table>
</div>

{{-- Bagian A: Grafik Pertumbuhan --}}
<div class="section">
    <div class="section-title">A. Grafik Pertumbuhan (Kurva WHO)</div>

    @php
        // ------------------------------------------------------------------
        // Kalibrasi pixel WHO chart images.
        // Update nilai ini dengan hasil python srcp/06_calibrate_who_charts.py
        // ------------------------------------------------------------------
        $whoCalibration = [
            'wfa'  => [
                'boys'  => ['imgW' => 2339, 'imgH' => 1654, 'plotX0' => 157, 'plotX1' => 1989, 'plotY0' => 138, 'plotY1' => 1519, 'xMin' => 0, 'xMax' => 60, 'yMin' => 0,  'yMax' => 32],
                'girls' => ['imgW' => 2339, 'imgH' => 1654, 'plotX0' => 157, 'plotX1' => 1989, 'plotY0' => 138, 'plotY1' => 1519, 'xMin' => 0, 'xMax' => 60, 'yMin' => 0,  'yMax' => 28],
            ],
            'lhfa' => [
                'boys'  => ['imgW' => 2339, 'imgH' => 1654, 'plotX0' => 157, 'plotX1' => 1989, 'plotY0' => 138, 'plotY1' => 1519, 'xMin' => 0, 'xMax' => 60, 'yMin' => 40, 'yMax' => 120],
                'girls' => ['imgW' => 2339, 'imgH' => 1654, 'plotX0' => 157, 'plotX1' => 1989, 'plotY0' => 138, 'plotY1' => 1519, 'xMin' => 0, 'xMax' => 60, 'yMin' => 40, 'yMax' => 120],
            ],
            'hcfa' => [
                'boys'  => ['imgW' => 2198, 'imgH' => 1550, 'plotX0' => 136, 'plotX1' => 2058, 'plotY0' => 115, 'plotY1' => 1479, 'xMin' => 0, 'xMax' => 60, 'yMin' => 30, 'yMax' => 57],
                'girls' => ['imgW' => 2198, 'imgH' => 1550, 'plotX0' => 136, 'plotX1' => 2058, 'plotY0' => 115, 'plotY1' => 1479, 'xMin' => 0, 'xMax' => 60, 'yMin' => 30, 'yMax' => 56],
            ],
        ];

        // ------------------------------------------------------------------
        // Fungsi: SVG dengan WHO PNG asli + overlay titik data anak
        // ------------------------------------------------------------------
        if (!function_exists('buildWhoChartSvg')) {
            function buildWhoChartSvg(string $imgData, array $cal, array $pertumbuhans, int $usiaAwal, string $indicator, float $svgW): string
            {
                $imgW = $cal['imgW'];
                $imgH = $cal['imgH'];
                $svgH = round($svgW * $imgH / $imgW);

                $xRange = $cal['xMax'] - $cal['xMin'];
                $yRange = $cal['yMax'] - $cal['yMin'];

                $toX = fn($month) => $cal['plotX0'] + ($month - $cal['xMin']) / $xRange * ($cal['plotX1'] - $cal['plotX0']);
                $toY = fn($value) => $cal['plotY0'] + (1 - ($value - $cal['yMin']) / $yRange) * ($cal['plotY1'] - $cal['plotY0']);

                // Build data points dari pertumbuhan array
                $points = [];
                foreach ($pertumbuhans as $i => $pt) {
                    $val = $pt[$indicator];
                    if ($val !== null) {
                        $age  = $usiaAwal + $i;
                        $points[] = ['px' => $toX($age), 'py' => $toY((float)$val)];
                    }
                }

                // Ukuran elemen SVG dalam pixel gambar:
                // scale ≈ svgW/imgW ≈ 0.079 → r=30 ≈ 2.4px display
                $r  = 30;
                $sw = 14;

                $svg  = "<svg width=\"{$svgW}\" height=\"{$svgH}\" viewBox=\"0 0 {$imgW} {$imgH}\"";
                $svg .= " preserveAspectRatio=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n";

                // Gambar WHO asli
                $svg .= "  <image href=\"{$imgData}\" x=\"0\" y=\"0\" width=\"{$imgW}\" height=\"{$imgH}\" />\n";

                // Highlight semester window
                $winX0 = $toX($usiaAwal);
                $winX1 = $toX(min($usiaAwal + 6, $cal['xMax']));
                $winH  = $cal['plotY1'] - $cal['plotY0'];
                $svg .= "  <rect x=\"{$winX0}\" y=\"{$cal['plotY0']}\" width=\"" . ($winX1 - $winX0) . "\" height=\"{$winH}\"";
                $svg .= "  fill=\"#3b82f6\" fill-opacity=\"0.07\" stroke=\"#3b82f6\" stroke-width=\"8\" stroke-dasharray=\"24 12\" />\n";

                // Garis penghubung
                if (count($points) > 1) {
                    $pts = implode(' ', array_map(fn($p) => "{$p['px']},{$p['py']}", $points));
                    $svg .= "  <polyline points=\"{$pts}\" fill=\"none\" stroke=\"#1d4ed8\" stroke-width=\"{$sw}\"";
                    $svg .= "  stroke-linejoin=\"round\" stroke-linecap=\"round\" />\n";
                }

                // Titik data
                foreach ($points as $p) {
                    $svg .= "  <circle cx=\"{$p['px']}\" cy=\"{$p['py']}\" r=\"" . ($r + 5) . "\" fill=\"white\" fill-opacity=\"0.75\" />\n";
                    $svg .= "  <circle cx=\"{$p['px']}\" cy=\"{$p['py']}\" r=\"{$r}\" fill=\"#2563eb\" stroke=\"white\" stroke-width=\"7\" />\n";
                }

                $svg .= "</svg>\n";
                return $svg;
            }
        }

        // ------------------------------------------------------------------
        // Fungsi fallback: SVG custom (tanpa gambar WHO)
        // ------------------------------------------------------------------
        if (!function_exists('buildSvgChart')) {
            function buildSvgChart(array $whoData, array $pertumbuhans, int $usiaAwal, string $indicator): string
            {
                $W = 195; $H = 130;
                $ml = 28; $mr = 8; $mt = 8; $mb = 22;
                $cw = $W - $ml - $mr;
                $ch = $H - $mt - $mb;
                $months = range($usiaAwal, $usiaAwal + 5);
                $whoFiltered = array_values(array_filter($whoData, fn($p) => in_array($p[0], $months)));
                if (empty($whoFiltered)) {
                    return "<svg width=\"{$W}\" height=\"{$H}\"><text x=\"10\" y=\"50\" font-size=\"8\" fill=\"#94a3b8\">Data tidak tersedia</text></svg>";
                }
                $allY = [];
                foreach ($whoFiltered as $p) { $allY[] = $p[1]; $allY[] = $p[4]; }
                foreach ($pertumbuhans as $pt) { if ($pt[$indicator] !== null) $allY[] = (float)$pt[$indicator]; }
                $yMin = min($allY) * 0.96;
                $yMax = max($allY) * 1.04;
                $toX = fn($m) => $ml + ($m - $usiaAwal) / 5 * $cw;
                $toY = fn($v) => $mt + (1 - ($v - $yMin) / ($yMax - $yMin)) * $ch;
                $svg = "<svg width=\"{$W}\" height=\"{$H}\" xmlns=\"http://www.w3.org/2000/svg\">\n";
                $svg .= "<rect x=\"{$ml}\" y=\"{$mt}\" width=\"{$cw}\" height=\"{$ch}\" fill=\"#f8fafc\" />\n";
                $steps = 4;
                for ($i = 0; $i <= $steps; $i++) {
                    $y = $toY($yMin + ($yMax - $yMin) * $i / $steps);
                    $svg .= "<line x1=\"{$ml}\" y1=\"{$y}\" x2=\"" . ($W - $mr) . "\" y2=\"{$y}\" stroke=\"#e2e8f0\" stroke-width=\"0.5\" />\n";
                    $label = number_format($yMin + ($yMax - $yMin) * $i / $steps, 1);
                    $svg .= "<text x=\"" . ($ml - 2) . "\" y=\"" . ($y + 2) . "\" font-size=\"5\" fill=\"#64748b\" text-anchor=\"end\">{$label}</text>\n";
                }
                foreach ($months as $m) {
                    $x = $toX($m);
                    $svg .= "<line x1=\"{$x}\" y1=\"{$mt}\" x2=\"{$x}\" y2=\"" . ($mt + $ch) . "\" stroke=\"#e2e8f0\" stroke-width=\"0.5\" />\n";
                    $svg .= "<text x=\"{$x}\" y=\"" . ($H - 6) . "\" font-size=\"5\" fill=\"#64748b\" text-anchor=\"middle\">{$m}</text>\n";
                }
                foreach ([[1,'#ef4444','2,1'],[2,'#f97316','2,1'],[3,'#22c55e','0'],[4,'#f97316','2,1'],[5,'#ef4444','2,1']] as [$ci,$color,$dash]) {
                    $points = [];
                    foreach ($whoFiltered as $p) { $points[] = $toX($p[0]) . ',' . $toY($p[$ci]); }
                    $sd = $dash !== '0' ? "stroke-dasharray=\"{$dash}\"" : '';
                    $svg .= "<polyline points=\"" . implode(' ', $points) . "\" fill=\"none\" stroke=\"{$color}\" stroke-width=\"0.8\" {$sd} />\n";
                }
                $pertMap = [];
                foreach ($pertumbuhans as $i => $pt) { $pertMap[$usiaAwal + $i] = $pt; }
                $childPts = [];
                foreach ($months as $m) {
                    if (isset($pertMap[$m]) && $pertMap[$m][$indicator] !== null) {
                        $x = $toX($m); $y = $toY((float)$pertMap[$m][$indicator]);
                        $childPts[] = "{$x},{$y}";
                        $svg .= "<circle cx=\"{$x}\" cy=\"{$y}\" r=\"2.5\" fill=\"#2563eb\" stroke=\"white\" stroke-width=\"0.5\" />\n";
                    }
                }
                if (count($childPts) > 1) $svg .= "<polyline points=\"" . implode(' ', $childPts) . "\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"1.2\" />\n";
                $svg .= "<line x1=\"{$ml}\" y1=\"{$mt}\" x2=\"{$ml}\" y2=\"" . ($mt + $ch) . "\" stroke=\"#475569\" stroke-width=\"0.8\" />\n";
                $svg .= "<line x1=\"{$ml}\" y1=\"" . ($mt + $ch) . "\" x2=\"" . ($W - $mr) . "\" y2=\"" . ($mt + $ch) . "\" stroke=\"#475569\" stroke-width=\"0.8\" />\n";
                $svg .= "<text x=\"" . ($ml + $cw / 2) . "\" y=\"" . ($H - 1) . "\" font-size=\"5\" fill=\"#64748b\" text-anchor=\"middle\">Bulan</text>\n";
                $svg .= "</svg>\n";
                return $svg;
            }
        }

        // ------------------------------------------------------------------
        // Load WHO PNG sebagai base64 (jika ada)
        // ------------------------------------------------------------------
        $whoChartDir  = public_path('assets/who-charts');
        $pngAvailable = false;
        $whoBase64    = [];
        foreach (['wfa', 'lhfa', 'hcfa'] as $_ind) {
            $_path = "{$whoChartDir}/{$_ind}-{$sex}-zscore.png";
            if (file_exists($_path)) {
                $whoBase64[$_ind] = 'data:image/png;base64,' . base64_encode(file_get_contents($_path));
                $pngAvailable = true;
            }
        }
        unset($_ind, $_path);

        $svgW = 192; // display width per chart (pixel PDF)

        // Build pertumbuhan array
        $pertumbuhanArr = [];
        foreach ($rapor->pertumbuhans as $pt) {
            $pertumbuhanArr[] = [
                'berat_badan'    => $pt->berat_badan,
                'tinggi_badan'   => $pt->tinggi_badan,
                'lingkar_kepala' => $pt->lingkar_kepala,
            ];
        }
    @endphp

    <div class="growth-charts">
        <div class="chart-cell">
            <div class="chart-title">Berat Badan / Umur (BB/U)</div>
            @if ($pngAvailable && isset($whoBase64['wfa']))
                {!! buildWhoChartSvg($whoBase64['wfa'], $whoCalibration['wfa'][$sex], $pertumbuhanArr, $usiaAwalSemester, 'berat_badan', $svgW) !!}
            @else
                {!! buildSvgChart($whoData['wfa'], $pertumbuhanArr, $usiaAwalSemester, 'berat_badan') !!}
            @endif
            <div class="chart-legend">
                <span class="legend-item" style="color:#ef4444">—— ±3SD</span>
                <span class="legend-item" style="color:#f97316">—— ±2SD</span>
                <span class="legend-item" style="color:#22c55e">—— Median</span>
                <span class="legend-item" style="color:#2563eb">●● Anak</span>
            </div>
        </div>
        <div class="chart-cell">
            <div class="chart-title">Tinggi Badan / Umur (TB/U)</div>
            @if ($pngAvailable && isset($whoBase64['lhfa']))
                {!! buildWhoChartSvg($whoBase64['lhfa'], $whoCalibration['lhfa'][$sex], $pertumbuhanArr, $usiaAwalSemester, 'tinggi_badan', $svgW) !!}
            @else
                {!! buildSvgChart($whoData['lhfa'], $pertumbuhanArr, $usiaAwalSemester, 'tinggi_badan') !!}
            @endif
            <div class="chart-legend">
                <span class="legend-item" style="color:#ef4444">—— ±3SD</span>
                <span class="legend-item" style="color:#f97316">—— ±2SD</span>
                <span class="legend-item" style="color:#22c55e">—— Median</span>
                <span class="legend-item" style="color:#2563eb">●● Anak</span>
            </div>
        </div>
        <div class="chart-cell" style="padding-right: 0;">
            <div class="chart-title">Lingkar Kepala / Umur (LK/U)</div>
            @if ($pngAvailable && isset($whoBase64['hcfa']))
                {!! buildWhoChartSvg($whoBase64['hcfa'], $whoCalibration['hcfa'][$sex], $pertumbuhanArr, $usiaAwalSemester, 'lingkar_kepala', $svgW) !!}
            @else
                {!! buildSvgChart($whoData['hcfa'], $pertumbuhanArr, $usiaAwalSemester, 'lingkar_kepala') !!}
            @endif
            <div class="chart-legend">
                <span class="legend-item" style="color:#ef4444">—— ±3SD</span>
                <span class="legend-item" style="color:#f97316">—— ±2SD</span>
                <span class="legend-item" style="color:#22c55e">—— Median</span>
                <span class="legend-item" style="color:#2563eb">●● Anak</span>
            </div>
        </div>
    </div>

    {{-- Tabel data pertumbuhan --}}
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
            <tr><td colspan="4" style="text-align:center;color:#94a3b8;">Belum ada data</td></tr>
            @endforelse
        </tbody>
    </table>
</div>

{{-- Bagian B: Perkembangan --}}
<div class="section">
    <div class="section-title">B. Perkembangan Anak</div>
    <table>
        <thead>
            <tr>
                <th style="width:30%;">Aspek</th>
                <th style="width:15%;">Status</th>
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

    {{-- Keterangan status --}}
    <div style="font-size:7px; color:#64748b; margin-top:2px;">
        <strong>Keterangan:</strong>
        BB = Belum Berkembang &nbsp;|&nbsp;
        MB = Mulai Berkembang &nbsp;|&nbsp;
        BSH = Berkembang Sesuai Harapan &nbsp;|&nbsp;
        BSB = Berkembang Sangat Baik
    </div>
</div>

{{-- Bagian D: Penutup --}}
@if ($rapor->penutup)
<div class="section">
    <div class="section-title">D. Penutup</div>
    <p class="penutup">{{ $rapor->penutup }}</p>
</div>
@endif

{{-- Tanda Tangan --}}
<div class="signature-section">
    <div class="signature-box">
        <div>Mengetahui,<br>Orang Tua/Wali</div>
        <div class="signature-line">( _________________ )</div>
    </div>
    <div class="signature-box">
        <div>Padang, {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}</div>
        <div style="margin-top:4px;">Guru Kelas,</div>
        <div class="signature-line">{{ $rapor->guru_kelas ?? '( _________________ )' }}</div>
    </div>
    <div class="signature-box">
        <div>Kepala Sekolah,</div>
        <div class="signature-line">( _________________ )</div>
    </div>
</div>

</body>
</html>
