import {
  Activity,
  Footprints,
  Heart,
  Minus,
  Moon,
  Scale,
  TrendingDown,
  TrendingUp,
  Wind,
} from 'lucide-react'
import type {
  EvolucaoRangeOption,
  MetricaWearable,
  MetricasData,
  TrendDirection,
} from '@/../product/sections/pacientes/types'

interface MetricasTabProps {
  data: MetricasData
  onRangeChange?: (rangeId: string) => void
}

const ICON_MAP: Record<string, typeof Scale> = {
  scale: Scale,
  moon: Moon,
  heart: Heart,
  activity: Activity,
  footprints: Footprints,
  wind: Wind,
}

const TREND_ICON: Record<TrendDirection, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

const TREND_TONE: Record<TrendDirection, string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-orange-600 dark:text-orange-400',
  stable: 'text-slate-500 dark:text-slate-400',
}

export function MetricasTab({ data, onRangeChange }: MetricasTabProps) {
  return (
    <div className="space-y-5">
      {/* Range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Sinais do wearable
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            Dados sincronizados via Apple Health · Garmin · Health Connect
          </p>
        </div>
        <RangeToggle
          ranges={data.ranges}
          selected={data.selectedRange}
          onChange={onRangeChange}
        />
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.sinais.map((sinal) => (
          <MetricaCard key={sinal.id} sinal={sinal} />
        ))}
      </div>
    </div>
  )
}

function MetricaCard({ sinal }: { sinal: MetricaWearable }) {
  const Icon = ICON_MAP[sinal.icon] ?? Activity
  const TrendIcon = TREND_ICON[sinal.trend]

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700">
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <Icon size={14} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {sinal.label}
          </p>
        </div>
      </header>

      <div className="mt-4 flex items-baseline gap-2">
        <p className="font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {typeof sinal.current.value === 'number'
            ? sinal.current.value.toLocaleString('pt-BR')
            : sinal.current.value}
        </p>
        <span className="text-xs text-slate-500 dark:text-slate-400">{sinal.current.unit}</span>
      </div>

      <p
        className={`mt-1 inline-flex items-center gap-1 font-mono text-[11px] font-medium ${TREND_TONE[sinal.trend]}`}
      >
        <TrendIcon size={11} />
        {sinal.delta}
      </p>

      {/* Sparkline */}
      <div className="mt-4">
        <Sparkline data={sinal.miniSeries} trend={sinal.trend} />
      </div>
    </article>
  )
}

function Sparkline({ data, trend }: { data: number[]; trend: TrendDirection }) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 200
  const height = 40
  const padX = 2
  const chartW = width - padX * 2
  const chartH = height - 4

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * chartW
    const y = 2 + ((max - v) / range) * chartH
    return { x, y }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')
  const lastPoint = points[points.length - 1]

  const stroke =
    trend === 'down'
      ? 'rgb(234 88 12)'
      : trend === 'up'
      ? 'rgb(13 148 136)'
      : 'rgb(100 116 139)'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-10 w-full" preserveAspectRatio="none">
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastPoint.x} cy={lastPoint.y} r="2.5" fill={stroke} />
    </svg>
  )
}

function RangeToggle({
  ranges,
  selected,
  onChange,
}: {
  ranges: EvolucaoRangeOption[]
  selected: string
  onChange?: (id: string) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-950">
      {ranges.map((r) => {
        const active = r.id === selected
        return (
          <button
            key={r.id}
            onClick={() => onChange?.(r.id)}
            className={`rounded-md px-3 py-1 text-[11px] font-medium transition-colors ${
              active
                ? 'bg-teal-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {r.label}
          </button>
        )
      })}
    </div>
  )
}
