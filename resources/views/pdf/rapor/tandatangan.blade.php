<div class="signature-wrap">

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
