<div class="page-break"></div>
@include('pdf.rapor.kop')
<div style="height:6px;"></div>

<div class="section">
    <div class="section-title">B. Perkembangan Anak</div>
    <table class="tbl-perkembangan">
        <thead>
            <tr>
                <th style="width:5%;">No.</th>
                <th style="width:26%;">Aspek Perkembangan</th>
                <th style="width:12%;">Capaian</th>
                <th>Deskripsi / Narasi</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($aspekLabels as $key => $label)
                @php $p = $rapor->perkembangans->firstWhere('aspek', $key); @endphp
                <tr>
                    <td style="text-align:center;">{{ $loop->iteration }}</td>
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
