import { useState } from 'react'
import {
  Scale,
  TestTubes,
  HeartPulse,
  Moon,
  Apple,
  Flame,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  AlertOctagon,
  type LucideIcon,
} from 'lucide-react'
import type {
  DimensionAggregate,
  DimensionId,
  DimensionKpi,
  GapLevel,
} from '@/../product/sections/minha-sa-de-paciente/types'
import { SerieChart } from './SerieChart'

const DIMENSION_ICON: Record<DimensionId, LucideIcon> = {
  body: Scale,
  metabolic: TestTubes,
  vitals: HeartPulse,
  sleep: Moon,
  nutrition: Apple,
  activity: Flame,
  hydration: Droplets,
}

// Accent classes for each dimension — used for icon bg, sparkline color, left border
const DIMENSION_ACCENT: Record<
  DimensionId,
  {
    border: string
    iconBg: string
    iconColor: string
    sparkline: string
  }
> = {
  body: {
    border: 'before:bg-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-700 dark:text-emerald-300',
    sparkline: 'text-emerald-500',
  },
  metabolic: {
    border: 'before:bg-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-500/15',
    iconColor: 'text-rose-700 dark:text-rose-300',
    sparkline: 'text-rose-500',
  },
  vitals: {
    border: 'before:bg-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-500/15',
    iconColor: 'text-rose-700 dark:text-rose-300',
    sparkline: 'text-rose-500',
  },
  sleep: {
    border: 'before:bg-sky-500',
    iconBg: 'bg-sky-50 dark:bg-sky-500/15',
    iconColor: 'text-sky-700 dark:text-sky-300',
    sparkline: 'text-sky-500',
  },
  nutrition: {
    border: 'before:bg-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconColor: 'text-amber-700 dark:text-amber-300',
    sparkline: 'text-amber-500',
  },
  activity: {
    border: 'before:bg-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-700 dark:text-emerald-300',
    sparkline: 'text-emerald-500',
  },
  hydration: {
    border: 'before:bg-sky-500',
    iconBg: 'bg-sky-50 dark:bg-sky-500/15',
    iconColor: 'text-sky-700 dark:text-sky-300',
    sparkline: 'text-sky-500',
  },
}

const GAP_STYLES: Record<GapLevel, string> = {
  info: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  warn: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  danger:
    'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
}

const GAP_ICONS: Record<GapLevel, LucideIcon> = {
  info: Info,
  warn: AlertTriangle,
  danger: AlertOctagon,
}

function formatRelative(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days}d`
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatKpiValue(kpi: DimensionKpi): string {
  if (kpi.value == null) return '—'
  if (kpi.decimals != null) return kpi.value.toFixed(kpi.decimals)
  if (Number.isInteger(kpi.value)) return kpi.value.toLocaleString('pt-BR')
  return kpi.value.toFixed(1)
}

function formatHistoryDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

function KpiMiniSparkline({
  history,
  accentClass,
  decimals,
}: {
  history: Array<{ date: string; value: number | null }>
  accentClass: string
  decimals?: number
}) {
  const numeric = history
    .map((p) => p.value)
    .filter((v): v is number => v != null)
  if (numeric.length < 2) return null
  const min = Math.min(...numeric)
  const max = Math.max(...numeric)
  const range = max - min || 1
  const W = 240
  const H = 48
  const PAD = 4
  const stepX = (W - PAD * 2) / Math.max(history.length - 1, 1)

  const dPath = history
    .map((p, i) => {
      if (p.value == null) return ''
      const x = PAD + i * stepX
      const y = H - PAD - ((p.value - min) / range) * (H - PAD * 2)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .filter(Boolean)
    .join(' ')

  const last = history[history.length - 1]
  const lastX = PAD + (history.length - 1) * stepX
  const lastY =
    last.value != null
      ? H - PAD - ((last.value - min) / range) * (H - PAD * 2)
      : null

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`h-12 w-full ${accentClass}`}
      aria-hidden
    >
      <path
        d={dPath}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {lastY != null && (
        <>
          <circle cx={lastX} cy={lastY} r="3.5" fill="currentColor" />
          <circle cx={lastX} cy={lastY} r="7" fill="currentColor" opacity="0.2" />
        </>
      )}
    </svg>
  )
}

interface KpiRowProps {
  kpi: DimensionKpi
  index: number
  isOpen: boolean
  onToggle: () => void
  accentSparkline: string
  totalKpis: number
}

function KpiRow({ kpi, index, isOpen, onToggle, accentSparkline, totalKpis }: KpiRowProps) {
  const DeltaIcon =
    kpi.delta == null
      ? Minus
      : kpi.delta > 0
        ? TrendingUp
        : kpi.delta < 0
          ? TrendingDown
          : Minus

  const deltaColor =
    kpi.direction === 'good'
      ? 'text-emerald-600 dark:text-emerald-400'
      : kpi.direction === 'bad'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-slate-500 dark:text-slate-400'

  const hasHistory = kpi.history && kpi.history.length > 0

  const lastValues = hasHistory ? kpi.history!.slice(-5).reverse() : []
  const firstValue = hasHistory
    ? kpi.history!.find((p) => p.value != null)?.value ?? null
    : null
  const lastValue = kpi.value

  return (
    <div className={index < totalKpis - 1 ? 'border-b border-slate-100 dark:border-slate-800/60' : ''}>
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasHistory}
        aria-expanded={isOpen}
        aria-label={`${kpi.label} — ${hasHistory ? 'expandir histórico' : 'sem histórico'}`}
        className={`flex w-full items-baseline justify-between gap-3 py-1.5 text-left transition-colors ${hasHistory ? 'cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-lg' : 'cursor-default'}`}
      >
        <p className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          {kpi.label}
          {hasHistory && (
            <ChevronDown
              className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {formatKpiValue(kpi)}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {kpi.unit}
          </span>
          {kpi.delta != null && kpi.delta !== 0 && (
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${deltaColor}`}
              aria-label={`Variação ${kpi.deltaPercent}%`}
            >
              <DeltaIcon className="h-3 w-3" strokeWidth={3} />
              {kpi.deltaPercent != null && Math.abs(kpi.deltaPercent).toFixed(1)}%
            </span>
          )}
        </div>
      </button>

      {isOpen && hasHistory && (
        <div className="mt-1 mb-2 -mx-2 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
          <KpiMiniSparkline
            history={kpi.history!}
            accentClass={accentSparkline}
            decimals={kpi.decimals}
          />
          <div className="mt-2 flex items-center justify-between gap-3 border-b border-slate-200/70 pb-2 text-[10px] dark:border-slate-700/70">
            <div>
              <span className="block uppercase tracking-wider text-slate-400">
                Início
              </span>
              <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">
                {firstValue != null
                  ? kpi.decimals != null
                    ? firstValue.toFixed(kpi.decimals)
                    : firstValue.toString()
                  : '—'}{' '}
                {kpi.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="block uppercase tracking-wider text-slate-400">
                Atual
              </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {formatKpiValue(kpi)} {kpi.unit}
              </span>
            </div>
          </div>
          <ul className="mt-2 space-y-0.5">
            {lastValues.map((p, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 font-mono text-[11px]"
              >
                <span className="text-slate-500 dark:text-slate-400">
                  {formatHistoryDate(p.date)}
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {p.value != null
                    ? kpi.decimals != null
                      ? p.value.toFixed(kpi.decimals)
                      : p.value.toLocaleString('pt-BR')
                    : '—'}
                  <span className="ml-1 text-[10px] font-normal text-slate-400">
                    {kpi.unit}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface DimensionCardProps {
  dimension: DimensionAggregate
  onDrillRoute?: (id: DimensionId, href: string) => void
  onGapAction?: (id: DimensionId, href: string) => void
  onToggleInline?: (id: DimensionId, open: boolean) => void
}

export function DimensionCard({
  dimension,
  onDrillRoute,
  onGapAction,
  onToggleInline,
}: DimensionCardProps) {
  const [inlineOpen, setInlineOpen] = useState(false)
  const [openKpiIndex, setOpenKpiIndex] = useState<number | null>(null)
  const Icon = DIMENSION_ICON[dimension.id]
  const accent = DIMENSION_ACCENT[dimension.id]

  const isInline = dimension.drill.kind === 'inline'
  const isHealthy = dimension.state === 'healthy'
  const isPartial = dimension.state === 'partial'
  const isEmpty = dimension.state === 'empty'
  const isLoading = dimension.state === 'loading'

  function handleToggleInline() {
    const next = !inlineOpen
    setInlineOpen(next)
    onToggleInline?.(dimension.id, next)
  }

  function handleDrillRoute() {
    if (dimension.drill.kind === 'route') {
      onDrillRoute?.(dimension.id, dimension.drill.href)
    }
  }

  const cardBaseClass = `group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${accent.border}`

  if (isLoading) {
    return (
      <article className={`${cardBaseClass} animate-pulse`}>
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-2 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="mt-4 h-[70px] rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </article>
    )
  }

  return (
    <article className={cardBaseClass}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent.iconBg} ${accent.iconColor}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {dimension.title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {dimension.lastMeasuredAt
                ? `Último: ${formatRelative(dimension.lastMeasuredAt)}`
                : 'Sem dados ainda'}
            </p>
          </div>
          {isPartial && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
              Parcial
            </span>
          )}
          {isHealthy && dimension.trend && (
            <span
              className={`inline-flex shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                dimension.trend === 'up'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : dimension.trend === 'down'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
              aria-label={`Tendência ${dimension.trend}`}
            >
              {dimension.trend === 'up' ? '↑' : dimension.trend === 'down' ? '↓' : '='}
            </span>
          )}
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="mt-4 flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nenhum dado registrado ainda
            </p>
            <button
              type="button"
              onClick={handleDrillRoute}
              className="text-xs font-semibold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
            >
              Adicionar primeira medição →
            </button>
          </div>
        )}

        {!isEmpty && (
          <>
            {/* KPIs */}
            <div className="mt-3">
              {dimension.headlineKpis.map((kpi, idx) => (
                <KpiRow
                  key={kpi.label}
                  kpi={kpi}
                  index={idx}
                  totalKpis={dimension.headlineKpis.length}
                  isOpen={openKpiIndex === idx}
                  onToggle={() =>
                    setOpenKpiIndex(openKpiIndex === idx ? null : idx)
                  }
                  accentSparkline={accent.sparkline}
                />
              ))}
            </div>

            {/* SerieChart */}
            <div className="mt-3 -mx-1">
              <SerieChart viz={dimension.viz} accentClass={accent.sparkline} />
            </div>

            {/* Gaps */}
            {dimension.gaps.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {dimension.gaps.map((gap, i) => {
                  const GapIcon = GAP_ICONS[gap.level]
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        gap.actionHref &&
                        onGapAction?.(dimension.id, gap.actionHref)
                      }
                      disabled={!gap.actionHref}
                      className={`flex w-full items-start gap-2 rounded-xl px-2.5 py-1.5 text-left text-[11px] ring-1 transition ${GAP_STYLES[gap.level]} ${gap.actionHref ? 'hover:brightness-95 cursor-pointer' : 'cursor-default'}`}
                    >
                      <GapIcon className="mt-0.5 h-3 w-3 shrink-0" />
                      <span className="flex-1 leading-snug">{gap.message}</span>
                      {gap.actionHref && (
                        <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Drill action */}
        {!isEmpty && !isLoading && (
          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            {isInline ? (
              <button
                type="button"
                onClick={handleToggleInline}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
              >
                {inlineOpen ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Ocultar detalhes
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    Ver detalhes da semana
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDrillRoute}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
              >
                Ver evolução completa
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* Inline expansion */}
        {isInline && inlineOpen && (
          <div className="mt-3 -mx-5 -mb-5 rounded-b-3xl bg-sky-50/40 px-5 py-4 dark:bg-sky-500/5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Últimos 7 dias
            </p>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {dimension.viz.series.slice(-7).map((p, i) => {
                const values = dimension.viz.series
                  .map((s) => s.value)
                  .filter((v): v is number => v != null)
                const max = Math.max(...values, 1)
                const value = p.value
                const height = value == null ? 6 : (value / max) * 56
                const date = new Date(p.date)
                const dayLabel = date.toLocaleDateString('pt-BR', {
                  weekday: 'short',
                })
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="flex h-14 w-full items-end">
                      <div
                        className={`w-full rounded-md ${value == null ? 'bg-sky-200/40 dark:bg-sky-500/10' : 'bg-sky-500/70 dark:bg-sky-400/70'}`}
                        style={{ height: `${height}px` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 dark:text-slate-400">
                      {dayLabel.slice(0, 3)}
                    </span>
                  </div>
                )
              })}
            </div>
            {dimension.id === 'sleep' && (
              <p className="mt-2 text-[10px] text-sky-700/80 dark:text-sky-300/80">
                Média 7d em horas dormidas — alvo 7-9h
              </p>
            )}
            {dimension.id === 'hydration' && (
              <p className="mt-2 text-[10px] text-sky-700/80 dark:text-sky-300/80">
                Volume diário em ml — meta diária recomendada
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
