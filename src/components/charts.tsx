import { useId } from 'react';

// ----- LineChart (multi-series) -----
interface LineSeries {
  name: string;
  color: string;
  values: number[];
}
export function LineChart({ series, labels, height = 220, yMax = 10 }: { series: LineSeries[]; labels: string[]; height?: number; yMax?: number }) {
  const width = 600;
  const pad = { top: 16, right: 16, bottom: 28, left: 32 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const stepX = labels.length > 1 ? w / (labels.length - 1) : w;
  const x = (i: number) => pad.left + i * stepX;
  const y = (v: number) => pad.top + h - (v / yMax) * h;
  const gridLines = [0, 2.5, 5, 7.5, 10];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet" role="img">
      {gridLines.map((g) => (
        <g key={g}>
          <line x1={pad.left} y1={y(g)} x2={width - pad.right} y2={y(g)} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth={1} strokeDasharray={g === 0 ? '0' : '3 3'} />
          <text x={pad.left - 6} y={y(g) + 3} textAnchor="end" className="fill-slate-400 text-[9px]">{g}</text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={l + i} x={x(i)} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[9px]">{l}</text>
      ))}
      {series.map((s) => {
        const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
        const areaD = `${d} L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
        return (
          <g key={s.name}>
            <path d={areaD} fill={s.color} opacity={0.07} />
            <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={2.5} fill={s.color} className="opacity-0 hover:opacity-100" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ----- BarChart -----
export function BarChart({ data, height = 220, yMax }: { data: { label: string; value: number; color?: string }[]; height?: number; yMax?: number }) {
  const width = 600;
  const pad = { top: 16, right: 16, bottom: 28, left: 32 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const max = yMax ?? Math.max(...data.map((d) => d.value), 1);
  const bw = (w / data.length) * 0.6;
  const gap = (w / data.length) * 0.4;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={pad.left} y1={pad.top + h - (g / max) * h} x2={width - pad.right} y2={pad.top + h - (g / max) * h} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth={1} strokeDasharray={i === 0 ? '0' : '3 3'} />
          <text x={pad.left - 6} y={pad.top + h - (g / max) * h + 3} textAnchor="end" className="fill-slate-400 text-[9px]">{Math.round(g)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const bh = (d.value / max) * h;
        const bx = pad.left + i * (bw + gap) + gap / 2;
        const by = pad.top + h - bh;
        return (
          <g key={d.label}>
            <rect x={bx} y={by} width={bw} height={bh} rx={4} fill={d.color ?? '#3385ff'} opacity={0.9}>
              <animate attributeName="height" from="0" to={bh} dur="0.6s" fill="freeze" />
              <animate attributeName="y" from={pad.top + h} to={by} dur="0.6s" fill="freeze" />
            </rect>
            <text x={bx + bw / 2} y={height - 8} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[9px]">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ----- DonutChart -----
export function DonutChart({ data, size = 180, thickness = 28 }: { data: { label: string; value: number; color: string }[]; size?: number; thickness?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={thickness} className="stroke-slate-100 dark:stroke-slate-800" />
          {data.map((d) => {
            const len = (d.value / total) * circ;
            const seg = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={thickness}
                stroke={d.color}
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{total}</span>
          <span className="text-[10px] text-slate-400">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
            <span className="ml-auto font-semibold text-slate-900 dark:text-slate-100">{d.value}</span>
            <span className="text-slate-400">({((d.value / total) * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----- RadialBar (single score) -----
export function RadialBar({ value, max = 100, size = 120, color = '#3385ff', label }: { value: number; max?: number; size?: number; color?: string; label?: string }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const gid = useId();
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-slate-100 dark:stroke-slate-800" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} stroke={`url(#${gid})`} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{label ?? `${Math.round((value / max) * 100)}%`}</span>
      </div>
    </div>
  );
}

// ----- Sparkline -----
export function Sparkline({ values, color = '#3385ff', width = 100, height = 30 }: { values: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : width;
  const d = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * stepX},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
