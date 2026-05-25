export interface SparklineProps {
  series: number[]
  accent?: 'teal' | 'emerald' | 'coral' | 'slate' | 'amber'
  height?: number
  showArea?: boolean
}

const ACCENT_COLORS: Record<NonNullable<SparklineProps['accent']>, { stroke: string; fill: string }> = {
  teal: { stroke: 'rgb(20, 184, 166)', fill: 'rgba(20, 184, 166, 0.18)' },
  emerald: { stroke: 'rgb(16, 185, 129)', fill: 'rgba(16, 185, 129, 0.16)' },
  coral: { stroke: 'rgb(244, 63, 94)', fill: 'rgba(244, 63, 94, 0.18)' },
  slate: { stroke: 'rgb(100, 116, 139)', fill: 'rgba(100, 116, 139, 0.15)' },
  amber: { stroke: 'rgb(245, 158, 11)', fill: 'rgba(245, 158, 11, 0.18)' },
}

export function Sparkline({ series, accent = 'teal', height = 32, showArea = true }: SparklineProps) {
  if (series.length < 2) {
    return (
      <div
        className="w-full rounded-md bg-slate-100/60 dark:bg-slate-800/40"
        style={{ height }}
        aria-hidden="true"
      />
    )
  }

  const width = 200
  const min = Math.min(...series)
  const max = Math.max(...series)
  const range = max - min || 1
  const pad = 4
  const stepX = (width - pad * 2) / (series.length - 1)

  const coords = series.map((v, i) => {
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
      aria-label="Tendência"
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
        stroke={colors.stroke}
        strokeWidth="1.5"
        className="fill-white dark:fill-slate-900"
      />
    </svg>
  )
}
