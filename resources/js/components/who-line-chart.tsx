/**
 * WHO Growth Line Chart
 * =====================
 * Menggantikan overlay titik di atas gambar PNG WHO.
 * Menggambar kurva referensi WHO (−3SD / −2SD / Median / +2SD / +3SD)
 * sebagai garis, lalu garis data anak (input guru) di-overlay di atasnya.
 *
 * Sumbu X = usia anak (bulan), rentang PENUH 0–60 bulan (0–5 tahun) persis
 * seperti grafik resmi WHO, agar lengkungan kurva terlihat (bukan garis lurus).
 * Titik data anak muncul di posisi usianya.
 */

import {
    CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import type { WhoZScorePoint } from '@/lib/whoGrowthStandards';

export interface WhoLinePoint {
    month: number;
    value: number | null;
}

interface Props {
    whoData: WhoZScorePoint[];
    dataPoints: WhoLinePoint[];
    /** Bulan awal semester (usia anak dalam bulan) */
    usiaAwal: number;
    title: string;
    unit: string;
    className?: string;
}

interface MergedRow {
    month: number;
    sd3neg: number;
    sd2neg: number;
    sd0: number;
    sd2: number;
    sd3: number;
    anak: number | null;
}

// Skema warna mengikuti grafik z-score WHO resmi:
//   median (0) hijau, ±2SD merah, ±3SD hitam. Data anak biru solid.
const COLORS = {
    sd3:  '#111827', // ±3SD hitam
    sd2:  '#ef4444', // ±2SD merah
    sd0:  '#16a34a', // median hijau
    anak: '#2563eb', // data anak biru
};

interface TooltipPayloadItem { dataKey: string; value: number | null }

function ChartTooltip({ active, payload, label, unit }: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: number;
    unit: string;
}) {
    if (!active || !payload?.length) return null;
    const get = (key: string) => payload.find((p) => p.dataKey === key)?.value;
    const anak = get('anak');
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg">
            <p className="font-semibold text-gray-700">Usia {label} bulan</p>
            {anak !== null && anak !== undefined && (
                <p className="text-blue-600 font-medium">
                    Anak: {Number(anak).toFixed(1)} {unit}
                </p>
            )}
            <p className="text-gray-400">Median: {Number(get('sd0')).toFixed(1)} {unit}</p>
            <p className="text-gray-400">
                Normal: {Number(get('sd2neg')).toFixed(1)}–{Number(get('sd2')).toFixed(1)} {unit}
            </p>
        </div>
    );
}

export default function WhoLineChart({
    whoData, dataPoints, usiaAwal, title, unit, className = '',
}: Props) {
    // Rentang penuh 0–60 bulan (seperti grafik WHO resmi)
    const childByMonth = new Map(
        dataPoints
            .filter((p) => p.value !== null && !isNaN(p.value as number))
            .map((p) => [p.month, p.value as number]),
    );

    const data: MergedRow[] = whoData
        .map((d) => ({
            month:  d.month,
            sd3neg: d.sd3neg,
            sd2neg: d.sd2neg,
            sd0:    d.sd0,
            sd2:    d.sd2,
            sd3:    d.sd3,
            anak:   childByMonth.get(d.month) ?? null,
        }));

    const hasChildData = childByMonth.size > 0;

    // Domain Y numerik (dibulatkan ke kelipatan 5) agar tick rapi & terurut
    const yValues = [
        ...data.map((d) => d.sd3neg),
        ...data.map((d) => d.sd3),
        ...childByMonth.values(),
    ];
    const yMin = Math.max(0, Math.floor(Math.min(...yValues) / 5) * 5);
    const yMax = Math.ceil(Math.max(...yValues) / 5) * 5;

    return (
        <div className={className}>
            <p className="text-center text-xs font-semibold text-blue-800 mb-1 leading-tight">
                {title}
            </p>

            <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="month"
                        type="number"
                        domain={[0, 60]}
                        ticks={[0, 12, 24, 36, 48, 60]}
                        tickFormatter={(m) => `${m / 12}th`}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <YAxis
                        width={30}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        domain={[yMin, yMax]}
                        allowDecimals={false}
                        tickCount={6}
                    />
                    <Tooltip content={<ChartTooltip unit={unit} />} />

                    {/* Highlight rentang semester ini */}
                    <ReferenceArea
                        x1={usiaAwal}
                        x2={Math.min(usiaAwal + 5, 60)}
                        fill="#3b82f6"
                        fillOpacity={0.08}
                        stroke="#3b82f6"
                        strokeOpacity={0.4}
                        strokeDasharray="4 3"
                    />

                    {/* Kurva referensi WHO */}
                    <Line dataKey="sd3"    name="+3SD"   type="monotone" stroke={COLORS.sd3} strokeWidth={1} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                    <Line dataKey="sd2"    name="+2SD"   type="monotone" stroke={COLORS.sd2} strokeWidth={1} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                    <Line dataKey="sd0"    name="Median" type="monotone" stroke={COLORS.sd0} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    <Line dataKey="sd2neg" name="−2SD"   type="monotone" stroke={COLORS.sd2} strokeWidth={1} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                    <Line dataKey="sd3neg" name="−3SD"   type="monotone" stroke={COLORS.sd3} strokeWidth={1} strokeDasharray="4 4" dot={false} isAnimationActive={false} />

                    {/* Data anak (input guru) */}
                    <Line
                        dataKey="anak"
                        name="Anak"
                        type="monotone"
                        stroke={COLORS.anak}
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 5 }}
                        connectNulls
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>

            {!hasChildData && (
                <p className="text-center text-[10px] text-gray-400 mt-1">Belum ada data anak untuk grafik ini</p>
            )}

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[10px] mt-1 text-gray-600">
                <span><span style={{ color: COLORS.anak }}>─</span> Data Anak</span>
                <span><span style={{ color: COLORS.sd0 }}>─</span> Median</span>
                <span><span style={{ color: COLORS.sd2 }}>‒‒</span> ±2SD</span>
                <span><span style={{ color: COLORS.sd3 }}>‒‒</span> ±3SD</span>
                <span className="text-gray-400">Sumbu X = usia (0–5 tahun)</span>
            </div>
        </div>
    );
}
