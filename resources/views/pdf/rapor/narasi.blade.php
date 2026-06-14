@if ($rapor->penutup_umum || $rapor->penutup_motivasi_orangtua || $rapor->penutup_penguatan_positif)
    <div class="page-break"></div>
    @include('pdf.rapor.kop')
    <div style="height:6px;"></div>

    <div class="section">
        <div class="section-title">C. Narasi Emosional</div>
        <table class="tbl-perkembangan">
            <thead>
                <tr>
                    <th style="width:5%;">No.</th>
                    <th style="width:30%;">Aspek Narasi</th>
                    <th>Deskripsi / Narasi</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="text-align:center;">1</td>
                    <td class="aspek-name">Penutup Umum</td>
                    <td>{{ $rapor->penutup_umum ?: '-' }}</td>
                </tr>
                <tr>
                    <td style="text-align:center;">2</td>
                    <td class="aspek-name">Motivasi untuk Orang Tua</td>
                    <td>{{ $rapor->penutup_motivasi_orangtua ?: '-' }}</td>
                </tr>
                <tr>
                    <td style="text-align:center;">3</td>
                    <td class="aspek-name">Penguatan Positif</td>
                    <td>{{ $rapor->penutup_penguatan_positif ?: '-' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
@endif
