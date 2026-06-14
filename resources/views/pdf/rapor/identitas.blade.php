@include('pdf.rapor.kop')
<div class="doc-title">
    <h1>Identitas Peserta Didik</h1>
</div>
<div style="border-bottom: 1px solid #e2e8f0; margin: 6px 0 12px;"></div>

<div style="display:table; width:100%;">

    <div style="display:table-cell; vertical-align:top; padding-right:10px;">

        <div class="id-row">
            <span class="id-label">a. Nama Lengkap</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->nama_lengkap }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">b. Nama Panggilan</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->nama_panggilan ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">c. No. Induk</span><span class="id-sep">:</span>
            <span class="id-value">{{ $noInduk }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">d. Tempat, Tanggal Lahir</span><span class="id-sep">:</span>
            <span class="id-value">
                {{ $siswa->tempat_lahir ?? '-' }},
                {{ $siswa->tanggal_lahir ? \Carbon\Carbon::parse($siswa->tanggal_lahir)->locale('id')->isoFormat('D MMMM Y') : '-' }}
            </span>
        </div>
        <div class="id-row">
            <span class="id-label">e. Jenis Kelamin</span><span class="id-sep">:</span>
            <span class="id-value">{{ ucfirst($siswa->jenis_kelamin) }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">f. Agama</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->agama ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">g. Kewarganegaraan</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->kewarganegaraan ?? 'Indonesia' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">h. Anak ke / Jml Saudara</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->anak_ke ?? '-' }} / {{ $siswa->jumlah_saudara_kandung ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">i. Bahasa Sehari-hari</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->bahasa_sehari_hari ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">j. Kelas</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->kelas->nama_kelas ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">k. Guru Kelas</span><span class="id-sep">:</span>
            <span class="id-value">{{ $rapor->guru_kelas ?? '-' }}</span>
        </div>

        <div class="id-group">Data Ayah</div>
        <div class="id-row">
            <span class="id-label">Nama Ayah</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->ayah_nama_lengkap ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">Pekerjaan</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->ayah_pekerjaan ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">No. HP</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->ayah_no_hp ?? '-' }}</span>
        </div>

        <div class="id-group">Data Ibu</div>
        <div class="id-row">
            <span class="id-label">Nama Ibu</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->ibu_nama_lengkap ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">Pekerjaan</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->ibu_pekerjaan ?? '-' }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">No. HP</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->ibu_no_hp ?? '-' }}</span>
        </div>

        <div class="id-group">Alamat &amp; Kontak Darurat</div>
        <div class="id-row">
            <span class="id-label">Alamat Rumah</span><span class="id-sep">:</span>
            <span class="id-value">{{ $siswa->ayah_alamat_rumah ?? ($siswa->ibu_alamat_rumah ?? '-') }}</span>
        </div>
        <div class="id-row">
            <span class="id-label">Kontak Darurat</span><span class="id-sep">:</span>
            <span class="id-value">
                {{ $siswa->kontak_darurat_nama_lengkap ?? '-' }}
                @if ($siswa->kontak_darurat_hubungan) ({{ $siswa->kontak_darurat_hubungan }}) @endif
                @if ($siswa->kontak_darurat_no_hp) — {{ $siswa->kontak_darurat_no_hp }} @endif
            </span>
        </div>

    </div>

    <div style="display:table-cell; width:96px; vertical-align:top; text-align:center; padding-left:4px;">
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
        <p style="font-size:7px; color:#64748b; margin-top:3px;">Pas Foto</p>
    </div>

</div>

<div class="sign-block">
    <div class="sign-spacer"></div>
    <div class="sign-right-cell">
        <p class="kepsek-date">Padang, {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}</p>
        <p class="kepsek-title">Kepala Sekolah,</p>
        <div style="height:36px;"></div>
        <div class="kepsek-line">{{ $namaKepsek }}</div>
    </div>
</div>
<div class="page-break"></div>
