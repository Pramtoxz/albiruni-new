<div class="cover-frame">
    <div class="cover-eyebrow">Tahun Pelajaran {{ $rapor->tahun_ajaran }}</div>

    @if ($logoSrc)
        <img class="cover-logo" src="{{ $logoSrc }}" alt="Logo Al-Biruni" />
    @endif

    <div class="cover-title">Laporan<br>Perkembangan Anak</div>
    <div class="cover-sub">Rapor Tumbuh Kembang Peserta Didik</div>

    <div class="cover-school">Al-Biruni Preschool &amp; Daycare</div>
    <div class="cover-tagline">Tumbuh Bersama, Berkembang Berkarakter Di Rumah Al-Biruni</div>

    <div class="cover-idbox">
        <table>
            <tr><td class="lbl">Nama Sekolah</td><td>: Al-Biruni Preschool &amp; Daycare</td></tr>
            <tr><td class="lbl">Jenjang</td><td>: PAUD / TK &amp; Daycare</td></tr>
            <tr><td class="lbl">Alamat</td><td>: Jl. S. Parman No. 5, Ulak Karang &amp; Jl. Marapalam Raya, Padang</td></tr>
            <tr><td class="lbl">Provinsi</td><td>: Sumatera Barat</td></tr>
            <tr><td class="lbl">Telp / WA</td><td>: 08116689022</td></tr>
            <tr><td class="lbl">Website</td><td>: www.albiruni.sch.id</td></tr>
        </table>
    </div>

    <div class="cover-namebox">
        <div class="cover-name-label">Nama Peserta Didik</div>
        <div class="cover-name">{{ $siswa->nama_lengkap }}</div>
        <div class="cover-nis">No. Induk: {{ $noInduk }}</div>
    </div>
</div>
<div class="page-break"></div>
