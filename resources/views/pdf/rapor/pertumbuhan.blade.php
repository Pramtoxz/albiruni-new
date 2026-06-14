@include('pdf.rapor.kop')
<div class="doc-title">
    <h1>Laporan Perkembangan Anak</h1>
    <p>Semester {{ $rapor->semester }} &bull; Tahun Ajaran {{ $rapor->tahun_ajaran }}</p>
</div>
<div style="border-bottom: 1px solid #e2e8f0; margin: 6px 0 10px;"></div>

<table class="id-head">
    <tr>
        <td class="k">Nama Peserta Didik</td><td class="v">{{ $siswa->nama_lengkap }}</td>
        <td class="k">Kelas</td><td class="v">{{ $siswa->kelas->nama_kelas ?? '-' }}</td>
    </tr>
    <tr>
        <td class="k">Nomor Induk / NISN</td><td class="v">{{ $noInduk }}</td>
        <td class="k">Semester</td><td class="v">{{ $rapor->semester }}</td>
    </tr>
    <tr>
        <td class="k">Nama Sekolah</td><td class="v">Al-Biruni Preschool &amp; Daycare</td>
        <td class="k">Tahun Pelajaran</td><td class="v">{{ $rapor->tahun_ajaran }}</td>
    </tr>
    <tr>
        <td class="k">Guru Kelas</td><td class="v">{{ $rapor->guru_kelas ?? '-' }}</td>
        <td class="k">Usia Awal Semester</td>
        <td class="v">{{ intdiv($usiaAwalSemester, 12) }} th {{ $usiaAwalSemester % 12 }} bln</td>
    </tr>
</table>

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
                <th style="width:5%;">No.</th>
                <th>Bulan</th>
                <th>Berat Badan (kg)</th>
                <th>Tinggi Badan (cm)</th>
                <th>Lingkar Kepala (cm)</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($rapor->pertumbuhans as $pt)
                <tr>
                    <td style="text-align:center;">{{ $loop->iteration }}</td>
                    <td>{{ $pt->nama_bulan }}</td>
                    <td style="text-align:center;">{{ $pt->berat_badan ?? '-' }}</td>
                    <td style="text-align:center;">{{ $pt->tinggi_badan ?? '-' }}</td>
                    <td style="text-align:center;">{{ $pt->lingkar_kepala ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align:center;color:#94a3b8;">Belum ada data</td>
                </tr>
            @endforelse
        </tbody>
    </table>
    <div style="font-size:7px;color:#64748b;margin-top:2px;">
        Garis biru pada grafik = data pertumbuhan anak. Garis hijau = median WHO; garis merah = ±2 SD (batas normal); garis hitam = ±3 SD.
    </div>
</div>
