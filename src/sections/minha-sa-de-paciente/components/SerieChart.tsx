import type { DimensionViz } from '@/../product/sections/minha-sa-de-paciente/types'

interface SerieChartProps {
  viz: DimensionViz
  accentClass: string // e.g. 'text-emerald-500'
  width?: number
  height?: number
}

const W = 320
const H = 70
const PAD = 4

export function SerieChart({
  viz,
  accentClass,
  width = W,
  height = H,
}: SerieChartProps) {
  if (viz.series.length === 0) {
    return (
      <div
        className="flex h-[70px] items-center justify-center text-[11px] italic text-slate-400 dark:text-slate-500"
        aria-hidden
      >
        sem dados
      </div>
    )
  }

  // Extract numeric values, handle nulls
  const values = viz.series.map((p) => p.value)
  const numericValues = values.filter((v): v is number => v != null)
  if (numericValues.length === 0) {
    return (
      <div className="flex h-[70px] items-center justify-center text-[11px] italic text-slate-400 dark:text-slate-500">
        sem dados
      </div>
    )
  }
  const min = Math.min(...numericValues)
  const max = Math.max(...numericValues)
  const range = max - min || 1

  const stepX = (width - PAD * 2) / Math.max(viz.series.length - 1, 1)

  function toX(i: number): number {
    if (viz.series.length === 1) return width / 2
    return PAD + i * stepX
  }

  function toY(v: number): number {
    return height - PAD - ((v - min) / range) * (height - PAD * 2)
  }

  if (viz.kind === 'line') {
    const points = viz.series.map((p, i) => ({
      x: toX(i),
      y: toY(p.value),
      raw: p,
    }))

    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ')
    const areaPath = `${path} L ${points[points.length - 1].x.toFixed(1)} ${height - PAD} L ${points[0].x.toFixed(1)} ${height - PAD} Z`

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className={`h-[70px] w-full ${accentClass}`}
        aria-hidden
      >
        <defs>
          <linearGradient
            id="sparkline-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#sparkline-gradient)" />
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Last point dot */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="3"
          fill="currentColor"
        />
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="6"
          fill="currentColor"
          opacity="0.18"
        />
      </svg>
    )
  }

  // Bar chart
  const barWidth = (width - PAD * 2) / viz.series.length - 2

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`h-[70px] w-full ${accentClass}`}
      aria-hidden
    >
      {viz.series.map((p, i) => {
        const x = toX(i) - barWidth / 2
        if (p.value == null) {
          // Ghost bar for missing data
          return (
            <rect
              key={i}
              x={x}
              y={height - PAD - (height - PAD * 2) * 0.15}
              width={barWidth}
              height={(height - PAD * 2) * 0.15}
              fill="currentColor"
              opacity="0.12"
              rx="2"
            />
          )
        }
        const barHeight = ((p.value - min) / range) * (height - PAD * 2)
        return (
          <rect
            key={i}
            x={x}
            y={height - PAD - barHeight}
            width={barWidth}
            height={Math.max(barHeight, 1.5)}
            fill="currentColor"
            opacity={i === viz.series.length - 1 ? 1 : 0.55}
            rx="2"
          />
        )
      })}
    </svg>
  )
}
