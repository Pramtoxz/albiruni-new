<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Menu Mingguan - {{ $menuMingguan->nama_menu }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            padding: 15px;
        }

        .header {
            text-align: center;
            margin-bottom: 12px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
        }

        .logo {
            width: 100px;
            height: 100px;
            margin: 0 auto 6px;
        }

        .header h1 {
            font-size: 20px;
            color: #1e40af;
            margin-bottom: 4px;
        }

        .header h2 {
            font-size: 14px;
            color: #64748b;
            font-weight: normal;
        }

        .info-box {
            background: #f1f5f9;
            padding: 6px 12px;
            margin-bottom: 12px;
            font-size: 9px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        th {
            background: #2563eb;
            color: white;
            padding: 6px 5px;
            border: 1px solid #1e40af;
            font-size: 10px;
        }

        td {
            padding: 5px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
            font-size: 9px;
            line-height: 1.5;
        }

        .day-header {
            background: #dbeafe;
            font-weight: bold;
            color: #1e40af;
            text-align: center;
        }

        .meal-time {
            background: #f8fafc;
            font-weight: bold;
        }

        .kategori-label {
            font-weight: bold;
            color: #1e40af;
        }

        .signature-section {
            margin-top: 15px;
            display: table;
            width: 100%;
        }

        .signature-box {
            display: table-cell;
            text-align: center;
            width: 33%;
            font-size: 9px;
        }

        .signature-line {
            margin-top: 35px;
            border-top: 1px solid #333;
            padding-top: 4px;
            display: inline-block;
            min-width: 130px;
        }

        @media print {
            body {
                padding: 10px;
            }

            .no-print {
                display: none !important;
            }
        }
    </style>
</head>

<body>
    <div class="header">
        @php
            $logoPath = public_path('assets/images/albiruni/logoalbiruni.webp');
            $logoSrc = '';

            if (file_exists($logoPath)) {
                if (isset($showDownloadButton)) {
                    // For browser preview, use base64 encoded image
                    $imageData = base64_encode(file_get_contents($logoPath));
                    $logoSrc = 'data:image/webp;base64,' . $imageData;
                } else {
                    // For PDF download, use file path
                    $logoSrc = $logoPath;
                }
            }
        @endphp
        @if ($logoSrc)
            <img src="{{ $logoSrc }}" alt="Logo" class="logo">
        @endif
        <h1>Daftar Menu Mingguan Al Biruni Preschool And Daycare</h1>
        <h2>{{ $menuMingguan->nama_menu }}</h2>
    </div>

    <div class="info-box">
        <strong>Periode:</strong> {{ \Carbon\Carbon::parse($menuMingguan->tanggal_mulai)->format('d M Y') }} -
        {{ \Carbon\Carbon::parse($menuMingguan->tanggal_selesai)->format('d M Y') }}
        &nbsp;&nbsp;&nbsp;
        <strong>Dicetak:</strong> {{ \Carbon\Carbon::now()->format('d M Y H:i') }}
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 8%;">Hari</th>
                <th style="width: 12%;">Waktu</th>
                <th style="width: 80%;">Menu</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($days as $day)
                @php
                    $dayMenus = $menuMingguan->menuHarian->where('hari', $day);
                    $rowCount = 0;
                    foreach ($waktuMakan as $waktu) {
                        if ($dayMenus->where('waktu_makan', $waktu)->isNotEmpty()) {
                            $rowCount++;
                        }
                    }
                @endphp

                @if ($rowCount > 0)
                    @php $firstRow = true; @endphp
                    @foreach ($waktuMakan as $waktu)
                        @php $waktuMenus = $dayMenus->where('waktu_makan', $waktu); @endphp
                        @if ($waktuMenus->isNotEmpty())
                            <tr>
                                @if ($firstRow)
                                    <td rowspan="{{ $rowCount }}" class="day-header">{{ ucfirst($day) }}</td>
                                    @php $firstRow = false; @endphp
                                @endif
                                <td class="meal-time">
                                    @if ($waktu === 'sarapan')
                                        Sarapan
                                    @elseif($waktu === 'makan_siang')
                                        Makan Siang
                                    @else
                                        Snack
                                    @endif
                                </td>
                                <td>
                                    @if ($waktu === 'snack')
                                        @foreach ($waktuMenus as $menu)
                                            {{ $menu->nama_menu }}@if (!$loop->last)
                                                ,
                                            @endif
                                        @endforeach
                                    @else
                                        @foreach ($waktuMenus as $menu)
                                            <span class="kategori-label">{{ ucfirst($menu->kategori) }}:</span>
                                            {{ $menu->nama_menu }}@if (!$loop->last)
                                                |
                                            @endif
                                        @endforeach
                                    @endif
                                </td>
                            </tr>
                        @endif
                    @endforeach
                @else
                    <tr>
                        <td class="day-header">{{ ucfirst($day) }}</td>
                        <td colspan="2" style="text-align: center; color: #94a3b8;">-</td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>

    <div class="signature-section">
        <div class="signature-box">
            <div>Dibuat Oleh,</div>
            <div class="signature-line">{{ $menuMingguan->creator->name ?? 'Admin' }}</div>
        </div>
        <div class="signature-box">
            <div>Diketahui,</div>
            <div class="signature-line">Kepala Daycare</div>
        </div>
        <div class="signature-box">
            <div>Kepala Koki,</div>
            <div class="signature-line">
                (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div>
        </div>
    </div>

    @if (isset($showDownloadButton) && $showDownloadButton)
        <div class="no-print"
            style="text-align: center; margin-top: 20px; padding: 15px; background: #f8fafc; border-top: 2px solid #e2e8f0;">
            <a href="?download=1"
                style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 12px;">
                Download PDF
            </a>
            <a href="/admin/menu-mingguan"
                style="display: inline-block; background: #64748b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 12px; margin-left: 10px;">
                ← Kembali
            </a>
        </div>
    @endif
</body>

</html>
