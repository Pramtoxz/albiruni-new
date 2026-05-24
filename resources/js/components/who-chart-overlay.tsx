/**
 * WHO Growth Chart Overlay
 * ========================
 * Menampilkan gambar kurva WHO resmi (PNG) dengan titik data anak
 * di-overlay sebagai SVG transparan di atasnya.
 *
 * KALIBRASI:
 * Nilai-nilai di bawah adalah ESTIMASI awal. Untuk nilai akurat:
 *   cd srcp && python 06_calibrate_who_charts.py
 * Lalu paste hasil output ke konstanta CALIBRATION di bawah.
 *
 * Koordinat:
 *   imgW/imgH  = dimensi gambar PNG asli (pixel)
 *   x0/x1      = pixel X untuk bulan xMin dan xMax
 *   y0/y1      = pixel Y untuk nilai yMax (atas) dan yMin (bawah)
 *   xMin/xMax  = rentang bulan pada sumbu X (biasanya 0-60)
 *   yMin/yMax  = rentang nilai pada sumbu Y (bervariasi per indikator)
 */

// ---------------------------------------------------------------------------
// Calibration constants — auto-detected via srcp/06_calibrate_who_charts.py
// ---------------------------------------------------------------------------
const CALIBRATION = {
    wfa: {
        boys:  { imgW: 2339, imgH: 1654, x0: 307, x1: 2049, y0: 219, y1: 1408, xMin: 0, xMax: 60, yMin: 0,  yMax: 32  },
        girls: { imgW: 2339, imgH: 1654, x0: 307, x1: 2049, y0: 219, y1: 1408, xMin: 0, xMax: 60, yMin: 0,  yMax: 28  },
    },
    lhfa: {
        boys:  { imgW: 2339, imgH: 1654, x0: 307, x1: 2049, y0: 219, y1: 1408, xMin: 0, xMax: 60, yMin: 40, yMax: 120 },
        girls: { imgW: 2339, imgH: 1654, x0: 307, x1: 2049, y0: 219, y1: 1408, xMin: 0, xMax: 60, yMin: 40, yMax: 120 },
    },
    hcfa: {
        boys:  { imgW: 2198, imgH: 1550, x0: 296, x1: 1927, y0: 291, y1: 1325, xMin: 0, xMax: 60, yMin: 30, yMax: 57  },
        girls: { imgW: 2198, imgH: 1550, x0: 296, x1: 1927, y0: 292, y1: 1323, xMin: 0, xMax: 60, yMin: 30, yMax: 56  },
    },
} as const;

type Indicator = keyof typeof CALIBRATION;
type Sex = 'boys' | 'girls';

export interface WhoDataPoint {
    month: number;
    value: number | null;
}

interface Props {
    indicator: Indicator;
    sex: Sex;
    dataPoints: WhoDataPoint[];
    /** Bulan awal semester (usia anak dalam bulan) — untuk highlight window */
    usiaAwal: number;
    title: string;
    unit: string;
    className?: string;
}

export default function WhoChartOverlay({
    indicator,
    sex,
    dataPoints,
    usiaAwal,
    title,
    unit,
    className = '',
}: Props) {
    const cal = CALIBRATION[indicator][sex];

    // -----------------------------------------------------------------------
    // Helper: konversi nilai data → koordinat pixel dalam image
    // -----------------------------------------------------------------------
    const toX = (month: number): number =>
        cal.x0 + ((month - cal.xMin) / (cal.xMax - cal.xMin)) * (cal.x1 - cal.x0);

    const toY = (value: number): number =>
        cal.y0 + (1 - (value - cal.yMin) / (cal.yMax - cal.yMin)) * (cal.y1 - cal.y0);

    // -----------------------------------------------------------------------
    // Data points yang valid (nilai tidak null/NaN dan dalam rentang Y)
    // -----------------------------------------------------------------------
    const plotPoints = dataPoints
        .filter((p) => p.value !== null && !isNaN(p.value as number))
        .map((p) => ({
            month: p.month,
            value: p.value as number,
            px: toX(p.month),
            py: toY(p.value as number),
        }));

    const polylinePoints = plotPoints.map((p) => `${p.px},${p.py}`).join(' ');

    // -----------------------------------------------------------------------
    // Semester window highlight (rectangel transparan)
    // -----------------------------------------------------------------------
    const windowX0 = toX(usiaAwal);
    const windowX1 = toX(Math.min(usiaAwal + 6, cal.xMax));
    const windowW  = windowX1 - windowX0;

    // -----------------------------------------------------------------------
    // Ukuran elemen SVG — dalam pixel image (viewBox = image dimensions)
    // Scale ~1px display ≈ 5-6 image pixels, jadi:
    //   r=18      → ~3px circle radius di display
    //   sw=10     → ~2px stroke width
    //   font=22   → ~4px (untuk label nilai di atas titik)
    // -----------------------------------------------------------------------
    const R  = 18;
    const SW = 10;
    const FONT = 24;

    const imgSrc = `/assets/who-charts/${indicator}-${sex}-zscore.png`;

    return (
        <div className={className}>
            {/* Judul chart */}
            <p className="text-center text-xs font-semibold text-blue-800 mb-1 leading-tight">
                {title}
            </p>

            {/* Container: aspect-ratio agar SVG overlay persis sama ukuran dengan img */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: `${cal.imgW} / ${cal.imgH}`,
                    overflow: 'hidden',
                }}
            >
                {/* Gambar WHO resmi */}
                <img
                    src={imgSrc}
                    alt={title}
                    style={{ width: '100%', height: '100%', display: 'block', objectFit: 'fill' }}
                    loading="lazy"
                />

                {/* SVG overlay — koordinat dalam pixel image */}
                <svg
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'visible',
                    }}
                    viewBox={`0 0 ${cal.imgW} ${cal.imgH}`}
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Highlight semester window */}
                    {windowW > 0 && (
                        <rect
                            x={windowX0}
                            y={cal.y0}
                            width={windowW}
                            height={cal.y1 - cal.y0}
                            fill="rgba(59,130,246,0.07)"
                            stroke="#3b82f6"
                            strokeWidth="6"
                            strokeDasharray="24 12"
                            rx="4"
                        />
                    )}

                    {/* Garis penghubung antar titik data */}
                    {plotPoints.length > 1 && (
                        <polyline
                            points={polylinePoints}
                            fill="none"
                            stroke="#1d4ed8"
                            strokeWidth={SW}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Titik data anak */}
                    {plotPoints.map((p, i) => (
                        <g key={i}>
                            {/* Halo putih di belakang agar kontras */}
                            <circle cx={p.px} cy={p.py} r={R + 4} fill="white" opacity={0.7} />
                            <circle cx={p.px} cy={p.py} r={R} fill="#2563eb" stroke="white" strokeWidth={5} />
                            {/* Label nilai di atas titik */}
                            <text
                                x={p.px}
                                y={p.py - R - 6}
                                textAnchor="middle"
                                fontSize={FONT}
                                fill="#1e40af"
                                fontWeight="bold"
                                fontFamily="Arial, sans-serif"
                                stroke="white"
                                strokeWidth="6"
                                paintOrder="stroke"
                            >
                                {Number(p.value).toFixed(1)}
                            </text>
                            {/* Tooltip SVG native */}
                            <title>Bulan {p.month}: {p.value} {unit}</title>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[10px] mt-1 text-gray-600">
                <span><span style={{ color: '#2563eb' }}>●</span> Data Anak</span>
                <span><span style={{ color: '#22c55e' }}>─</span> Median</span>
                <span><span style={{ color: '#f97316' }}>‒‒</span> ±2SD</span>
                <span><span style={{ color: '#ef4444' }}>‒‒</span> ±3SD</span>
                <span><span style={{ color: '#3b82f6' }}>□</span> Semester</span>
            </div>
        </div>
    );
}
