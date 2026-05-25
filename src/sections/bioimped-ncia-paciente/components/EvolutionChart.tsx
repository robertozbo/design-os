import { useMemo, useState } from 'react'
import type {
  BioMetricKey,
  BioMetricOption,
  BioPeriod,
  BioPeriodOption,
  BioSeries,
  BioSeriesMap,
} from '@/../product/sections/bioimped-ncia-paciente/types'

interface EvolutionChartProps {
  metricOptions: BioMetricOption[]
  periodOptions: BioPeriodOption[]
  series: BioSeriesMap
  activeMetric: BioMetricKey
  activePeriod: BioPeriod
  onMetricChange?: (key: BioMetricKey) => void
  onPeriodChange?: (period: BioPeriod) => void
}

const TONE_STROKE: Record<string, string> = {
  slate: 'stroke-slate-500',
  amber: 'stroke-amber-500',
  emerald: 'stroke-emerald-500',
  sky: 'stroke-sky-500',
  rose: 'stroke-rose-500',
  violet: 'stroke-violet-500',
  teal: 'stroke-teal-500',
}

const TONE_FILL: Record<string, string> = {
  slate: 'text-slate-500',
  amber: 'text-amber-500',
  emerald: 'text-emerald-500',
  sky: 'text-sky-500',
  rose: 'text-rose-500',
  violet: 'text-violet-500',
  teal: 'text-teal-500',
}

const TONE_BAND: Record<string, string> = {
  slate: 'fill-slate-300/20',
  amber: 'fill-amber-300/20',
  emerald: 'fill-emerald-300/20',
  sky: 'fill-sky-300/20',
  rose: 'fill-rose-300/20',
  violet: 'fill-violet-300/20',
  teal: 'fill-teal-300/20',
}

function formatDateShort(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

interface TooltipState {
  index: number
  x: number
  y: number
  value: number
  date: string
}

export function EvolutionChart({
  metricOptions,
  periodOptions,
  series,
  activeMetric,
  activePeriod,
  onMetricChange,
  onPeriodChange,
}: EvolutionChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const active = metricOptions.find((m) => m.key === activeMetric)
  const tone = active?.tone ?? 'teal'
  const data: BioSeries | undefined = series[activeMetric]

  const W = 720
  const H = 220
  const PAD_X = 24
  const PAD_Y = 24

  const layout = useMemo(() => {
    if (!data || data.points.length === 0) return null
    const values = data.points.map((p) => p.value)
    let min = Math.min(...values)
    let max = Math.max(...values)
    if (data.referenceBand) {
      min = Math.min(min, data.referenceBand.min)
      max = Math.max(max, data.referenceBand.max)
    }
    const range = max - min || 1
    const padded = range * 0.1
    min -= padded
    max += padded
    const adjRange = max - min
    const stepX = (W - PAD_X * 2) / Math.max(data.points.length - 1, 1)
    const toX = (i: number) =>
      data.points.length === 1 ? W / 2 : PAD_X + i * stepX
    const toY = (v: number) =>
      H - PAD_Y - ((v - min) / adjRange) * (H - PAD_Y * 2)
    return { min, max, toX, toY, stepX }
  }, [data])

  if (!data) return null

  const path = layout
    ? data.points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${layout.toX(i)} ${layout.toY(p.value)}`)
        .join(' ')
    : ''
  const areaPath = layout
    ? `${path} L ${layout.toX(data.points.length - 1)} ${H - PAD_Y} L ${layout.toX(0)} ${H - PAD_Y} Z`
    : ''

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Evolução
        </h2>
        <div className="flex gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          {periodOptions.map((opt) => {
            const isActive = opt.value === activePeriod
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPeriodChange?.(opt.value)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </header>

      <div className="-mx-1 flex gap-1 overflow-x-auto px-5 py-3 scrollbar-none">
        {metricOptions.map((opt) => {
          const isActive = opt.key === activeMetric
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onMetricChange?.(opt.key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${TONE_FILL[opt.tone]}`}
                style={{ background: 'currentColor' }}
                aria-hidden
              />
              {opt.label}
            </button>
          )
        })}
      </div>

      <div className="relative px-5 pb-5">
        {layout && (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="h-56 w-full md:h-64"
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient id={`grad-${activeMetric}`} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="currentColor"
                  stopOpacity="0.18"
                  className={TONE_FILL[tone]}
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0"
                  className={TONE_FILL[tone]}
                />
              </linearGradient>
            </defs>

            {/* Reference band */}
            {data.referenceBand && (
              <>
                <rect
                  x={PAD_X}
                  y={layout.toY(data.referenceBand.max)}
                  width={W - PAD_X * 2}
                  height={
                    layout.toY(data.referenceBand.min) -
                    layout.toY(data.referenceBand.max)
                  }
                  className={TONE_BAND[tone]}
                  rx="6"
                />
              </>
            )}

            {/* Area + line */}
            <path d={areaPath} fill={`url(#grad-${activeMetric})`} />
            <path
              d={path}
              fill="none"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className={TONE_STROKE[tone]}
            />

            {/* Dots */}
            {data.points.map((p, i) => {
              const x = layout.toX(i)
              const y = layout.toY(p.value)
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="11"
                    fill="transparent"
                    onMouseEnter={() =>
                      setTooltip({ index: i, x, y, value: p.value, date: p.date })
                    }
                    onClick={() =>
                      setTooltip({ index: i, x, y, value: p.value, date: p.date })
                    }
                    style={{ cursor: 'pointer' }}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={tooltip?.index === i ? 5 : 3.5}
                    className={`${TONE_FILL[tone]} fill-current transition-all`}
                    pointerEvents="none"
                  />
                  {tooltip?.index === i && (
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      fill="currentColor"
                      opacity="0.2"
                      className={TONE_FILL[tone]}
                      pointerEvents="none"
                    />
                  )}
                </g>
              )
            })}

            {/* Reference band label */}
            {data.referenceBand && (
              <text
                x={PAD_X + 4}
                y={layout.toY(data.referenceBand.max) - 6}
                className={`fill-current text-[8px] font-semibold uppercase tracking-wider ${TONE_FILL[tone]}`}
                opacity="0.7"
              >
                {data.referenceBand.label}
              </text>
            )}
          </svg>
        )}

        {/* X axis labels */}
        <div className="mt-1 flex justify-between px-1 font-mono text-[10px] text-slate-400">
          {data.points.length > 0 && (
            <>
              <span>{formatDateShort(data.points[0].date)}</span>
              {data.points.length > 2 && (
                <span>
                  {formatDateShort(
                    data.points[Math.floor(data.points.length / 2)].date,
                  )}
                </span>
              )}
              <span>{formatDateShort(data.points[data.points.length - 1].date)}</span>
            </>
          )}
        </div>

        {/* Tooltip */}
        {tooltip && layout && (
          <div
            className="pointer-events-none absolute rounded-xl bg-slate-900 px-2.5 py-1.5 text-[11px] text-white shadow-lg ring-1 ring-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-300"
            style={{
              left: `${(tooltip.x / W) * 100}%`,
              top: `${(tooltip.y / H) * 100}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <p className="font-mono text-[10px] opacity-70">
              {formatDateShort(tooltip.date)}
            </p>
            <p className="font-mono font-bold">
              {tooltip.value.toFixed(data.decimals)} {data.unit}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
