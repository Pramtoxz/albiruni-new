<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: Arial, sans-serif;
        font-size: 10px;
        color: #1e293b;
        margin: 4cm 3cm 3cm 4cm;
    }

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

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
    }

    thead {
        display: table-header-group;
    }

    tr {
        page-break-inside: avoid;
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

    .tbl-perkembangan th {
        font-size: 11px;
        padding: 9px 8px;
    }

    .tbl-perkembangan td {
        font-size: 11px;
        line-height: 1.95;
        padding: 16px 12px;
        height: 165px;
        vertical-align: top;
    }

    .tbl-perkembangan .aspek-name {
        font-size: 12px;
    }

    .tbl-perkembangan .aspek-status {
        font-size: 11px;
        padding: 4px 12px;
    }

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

    .cover-frame {
        border: 3px double #1e3a8a;
        padding: 34px 28px;
        text-align: center;
    }

    .cover-eyebrow {
        font-size: 11px;
        letter-spacing: 0.2em;
        color: #475569;
        text-transform: uppercase;
    }

    .cover-logo {
        width: 140px;
        height: 140px;
        margin: 18px auto;
    }

    .cover-title {
        font-size: 26px;
        font-weight: bold;
        color: #1e3a8a;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        line-height: 1.3;
    }

    .cover-sub {
        font-size: 12px;
        color: #475569;
        margin-top: 6px;
        font-style: italic;
    }

    .cover-school {
        font-size: 18px;
        font-weight: bold;
        color: #1e3a8a;
        margin-top: 28px;
        text-transform: uppercase;
    }

    .cover-tagline {
        font-size: 10px;
        color: #475569;
        margin-top: 4px;
        font-style: italic;
    }

    .cover-idbox {
        margin: 26px auto 0;
        width: 82%;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 8px 16px;
    }

    .cover-idbox table {
        width: 100%;
        margin: 0;
    }

    .cover-idbox td {
        border: none;
        padding: 3px 2px;
        font-size: 10px;
        color: #1e293b;
    }

    .cover-idbox td.lbl {
        width: 34%;
        color: #64748b;
    }

    .cover-namebox {
        margin: 30px auto 0;
        width: 78%;
        border-top: 2px solid #1e3a8a;
        border-bottom: 2px solid #1e3a8a;
        padding: 12px 8px;
    }

    .cover-name-label {
        font-size: 9px;
        letter-spacing: 0.15em;
        color: #64748b;
        text-transform: uppercase;
    }

    .cover-name {
        font-size: 18px;
        font-weight: bold;
        color: #1e293b;
        margin-top: 4px;
    }

    .cover-nis {
        font-size: 11px;
        color: #475569;
        margin-top: 3px;
    }

    .petunjuk-list {
        font-size: 10.5px;
        line-height: 1.75;
        color: #1e293b;
        padding-left: 20px;
    }

    .petunjuk-list li {
        margin-bottom: 8px;
        text-align: justify;
    }

    .id-group {
        background: #f1f5f9;
        padding: 4px 8px;
        margin: 10px 0 2px;
        font-size: 9px;
        font-weight: bold;
        color: #475569;
        letter-spacing: 0.03em;
    }

    .sign-block {
        display: table;
        width: 100%;
        margin-top: 26px;
    }

    .sign-spacer {
        display: table-cell;
        width: 55%;
    }

    .sign-right-cell {
        display: table-cell;
        width: 45%;
        text-align: center;
        vertical-align: top;
    }

    .id-head {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 12px;
    }

    .id-head td {
        border: 1px solid #cbd5e1;
        font-size: 9px;
        padding: 4px 7px;
        line-height: 1.4;
    }

    .id-head td.k {
        width: 17%;
        color: #64748b;
        background: #f1f5f9;
    }

    .id-head td.v {
        width: 33%;
        font-weight: bold;
        color: #1e293b;
    }

    .page-break {
        page-break-after: always;
    }
</style>
