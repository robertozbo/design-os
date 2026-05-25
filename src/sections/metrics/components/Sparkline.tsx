import type { MetricSeriesPoint } from '@/../product/sections/metrics/types'

export interface SparklineProps {
  series: MetricSeriesPoint[]
  accent?: 'teal' | 'emerald' | 'coral' | 'slate'
  height?: number
  showArea?: boolean
}

type AccentColors = { stroke: string; fill: string; dot: string }

const ACCENT_COLORS: Record<NonNullable<SparklineProps['accent']>, AccentColors> = {
  teal: {
    stroke: 'rgb(20, 184, 166)',
    fill: 'rgba(20, 184, 166, 0.18)',
    dot: 'rgb(20, 184, 166)',
  },
  emerald: {
    stroke: 'rgb(16, 185, 129)',
    fill: 'rgba(16, 185, 129, 0.16)',
    dot: 'rgb(16, 185, 129)',
  },
  coral: {
    stroke: 'rgb(244, 63, 94)',
    fill: 'rgba(244, 63, 94, 0.18)',
    dot: 'rgb(244, 63, 94)',
  },
  slate: {
    stroke: 'rgb(100, 116, 139)',
    fill: 'rgba(100, 116, 139, 0.15)',
    dot: 'rgb(100, 116, 139)',
  },
}

function toNumber(v: number | string): number | null {
  if (typeof v === 'number') return v
  // For blood pressure ("122/80") use systolic only
  if (typeof v === 'string' && v.includes('/')) {
    const [sys] = v.split('/')
    const n = Number(sys)
    return Number.isFinite(n) ? n : null
  }
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export function Sparkline({
  series,
  accent = 'teal',
  height = 44,
  showArea = true,
}: SparklineProps) {
  const points = series
    .map((p) => toNumber(p.v))
    .filter((v): v is number => v !== null)

  if (points.length < 2) {
    return (
      <div
        className="w-full rounded-md bg-slate-100/60 dark:bg-slate-800/40"
        style={{ height }}
        aria-hidden="true"
      />
    )
  }

  const width = 200
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const pad = 4
  const stepX = (width - pad * 2) / (points.length - 1)

  const coords = points.map((v, i) => {
    const x = pad + i * stepX
    const y = pad + (1 - (v - min) / range) * (height - pad * 2)
    return [x, y] as const
  })

  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')

  const areaPath =
    `${linePath} L${coords[coords.length - 1][0].toFixed(1)},${(height - pad).toFixed(1)} ` +
    `L${coords[0][0].toFixed(1)},${(height - pad).toFixed(1)} Z`

  const lastX = coords[coords.length - 1][0]
  const lastY = coords[coords.length - 1][1]

  const colors = ACCENT_COLORS[accent]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
      role="img"
      aria-label="Mini gráfico de tendência"
    >
      {showArea && <path d={areaPath} fill={colors.fill} stroke="none" />}
      <path
        d={linePath}
        stroke={colors.stroke}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastX}
        cy={lastY}
        r="2.5"
        stroke={colors.dot}
        strokeWidth="1.5"
        className="fill-white dark:fill-slate-900"
      />
    </svg>
  )
}
