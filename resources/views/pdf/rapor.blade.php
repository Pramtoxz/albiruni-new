<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Rapor {{ $siswa->nama_lengkap }} - Semester {{ $rapor->semester }}</title>
    @include('pdf.rapor.styles')
</head>

<body>
    @php
        $logoPath = public_path('assets/images/albiruni/logoalbiruni.webp');
        $logoSrc = file_exists($logoPath)
            ? 'data:image/webp;base64,' . base64_encode(file_get_contents($logoPath))
            : '';

        $fotoSiswaPath = $siswa->foto_siswa ? public_path('assets/images/foto_siswa/' . $siswa->foto_siswa) : null;
        $fotoSiswaSrc = $fotoSiswaPath && file_exists($fotoSiswaPath)
            ? 'data:image/jpeg;base64,' . base64_encode(file_get_contents($fotoSiswaPath))
            : null;

        $noInduk = str_pad((string) $siswa->id, 6, '0', STR_PAD_LEFT);
    @endphp

    @include('pdf.rapor.cover')
    @include('pdf.rapor.petunjuk')
    @include('pdf.rapor.identitas')
    @include('pdf.rapor.pertumbuhan')
    @include('pdf.rapor.perkembangan')
    @include('pdf.rapor.narasi')
    @include('pdf.rapor.tandatangan')
</body>

</html>
