import {
  Scale,
  TestTubes,
  HeartPulse,
  Moon,
  Apple,
  Flame,
  Droplets,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import type {
  DimensionEvolution,
  DimensionId,
  EvolutionPeriod,
  EvolutionPeriodOption,
  ScoreBand,
} from '@/../product/sections/minha-sa-de-paciente/types'

interface EvolucaoTabProps {
  period: EvolutionPeriod
  periodOptions: EvolutionPeriodOption[]
  dimensions: DimensionEvolution[]
  onPeriodChange?: (period: EvolutionPeriod) => void
  onOpenDimension?: (id: DimensionId) => void
}

const DIMENSION_ICON: Record<DimensionId, LucideIcon> = {
  body: Scale,
  metabolic: TestTubes,
  vitals: HeartPulse,
  sleep: Moon,
  nutrition: Apple,
  activity: Flame,
  hydration: Droplets,
}

const BAND_TEXT: Record<ScoreBand, string> = {
  good: 'text-emerald-600 dark:text-emerald-400',
  attention: 'text-amber-600 dark:text-amber-400',
  risk: 'text-rose-600 dark:text-rose-400',
}

const BAND_BG: Record<ScoreBand, string> = {
  good: 'bg-emerald-100 dark:bg-emerald-500/20',
  attention: 'bg-amber-100 dark:bg-amber-500/20',
  risk: 'bg-rose-100 dark:bg-rose-500/20',
}

const BAND_DOT: Record<ScoreBand, string> = {
  good: 'fill-emerald-500',
  attention: 'fill-amber-500',
  risk: 'fill-rose-500',
}

function formatDateShort(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

function DimensionEvolutionCard({
  dim,
  onOpen,
}: {
  dim: DimensionEvolution
  onOpen?: () => void
}) {
  const Icon = DIMENSION_ICON[dim.id] ?? Activity
  const isEmpty = dim.state === 'empty'
  const isSingle = dim.state === 'single'
  const band = dim.band

  return (
    <article
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isEmpty
                ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                : band
                  ? `${BAND_BG[band]} ${BAND_TEXT[band]}`
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {dim.title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {dim.pointsCount === 0
                ? '0 pontos no período'
                : dim.pointsCount === 1
                  ? '1 ponto no período'
                  : `${dim.pointsCount} pontos no período`}
            </p>
          </div>
        </div>
        {isEmpty ? (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            sem dados
          </span>
        ) : (
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold leading-none text-slate-900 dark:text-slate-50">
                {dim.currentScore}
              </span>
            </div>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              — {dim.trendText}
            </p>
          </div>
        )}
      </header>

      {/* Chart area */}
      <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/40">
        {isEmpty ? (
          <div className="flex h-24 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-xs italic text-slate-400 dark:border-slate-800 dark:text-slate-500">
            sem dados
          </div>
        ) : isSingle ? (
          <SingleDot
            label={formatDateShort(dim.points[0].date)}
            score={dim.currentScore ?? 0}
            band={band}
          />
        ) : (
          <MultiLine points={dim.points} band={band} />
        )}
      </div>
    </article>
  )
}

function SingleDot({
  label,
  score,
  band,
}: {
  label: string
  score: number
  band: ScoreBand | null
}) {
  const dotClass = band ? BAND_DOT[band] : 'fill-slate-400'
  return (
    <div className="relative flex h-24 items-center justify-center">
      {/* Dashed reference line */}
      <svg
        viewBox="0 0 320 60"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <line
          x1="8"
          y1="30"
          x2="312"
          y2="30"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          className="stroke-slate-300 dark:stroke-slate-700"
        />
        <circle cx="160" cy="30" r="5" className={dotClass} />
        <circle
          cx="160"
          cy="30"
          r="9"
          className={`${dotClass} opacity-30`}
        />
      </svg>
      <div className="relative -mt-1 text-center">
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
          {score}
        </span>
        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
          leitura única · {label}
        </p>
      </div>
    </div>
  )
}

function MultiLine({
  points,
  band,
}: {
  points: DimensionEvolution['points']
  band: ScoreBand | null
}) {
  const numeric = points
    .map((p) => p.value)
    .filter((v): v is number => v != null)
  const min = Math.min(...numeric, 0)
  const max = Math.max(...numeric, 100)
  const range = max - min || 1
  const W = 320
  const H = 60
  const stepX = (W - 16) / Math.max(points.length - 1, 1)

  function toY(v: number) {
    return H - 8 - ((v - min) / range) * (H - 16)
  }

  const dot = band ? BAND_DOT[band] : 'fill-slate-500'
  const stroke = band
    ? band === 'good'
      ? 'stroke-emerald-500'
      : band === 'attention'
        ? 'stroke-amber-500'
        : 'stroke-rose-500'
    : 'stroke-slate-500'

  const dPath = points
    .map((p, i) => {
      if (p.value == null) return ''
      const x = 8 + i * stepX
      const y = toY(p.value)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-24 w-full"
      aria-hidden
    >
      <path
        d={dPath}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={stroke}
      />
      {points.map((p, i) => {
        if (p.value == null) return null
        return (
          <circle
            key={i}
            cx={8 + i * stepX}
            cy={toY(p.value)}
            r="3"
            className={dot}
          />
        )
      })}
    </svg>
  )
}

export function EvolucaoTab({
  period,
  periodOptions,
  dimensions,
  onPeriodChange,
  onOpenDimension,
}: EvolucaoTabProps) {
  return (
    <div className="space-y-5">
      {/* Period chips */}
      <div className="flex flex-wrap gap-2">
        {periodOptions.map((opt) => {
          const active = opt.value === period
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPeriodChange?.(opt.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                active
                  ? 'bg-white text-slate-900 ring-2 ring-teal-500/20 shadow-sm dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Dimension cards */}
      <div className="space-y-4">
        {dimensions.map((dim) => (
          <DimensionEvolutionCard
            key={dim.id}
            dim={dim}
            onOpen={() => onOpenDimension?.(dim.id)}
          />
        ))}
      </div>
    </div>
  )
}
