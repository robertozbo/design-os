import {
  TrendingUp,
  TrendingDown,
  Minus,
  Maximize2,
  Sparkles,
  CheckCircle2,
  Wand2,
  Smartphone,
  Bluetooth,
  type LucideIcon,
} from 'lucide-react'
import type {
  BioMetric,
  BioMetricKey,
  BioMetricTone,
  BioReadingView,
  EvaluationSource,
} from '@/../product/sections/bioimped-ncia-paciente/types'

interface LatestReadingCardProps {
  reading: BioReadingView | null
  onOpen?: (id: string) => void
}

const TONE_TILE: Record<
  BioMetricTone,
  { bg: string; text: string; spark: string }
> = {
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-800 dark:text-slate-100',
    spark: 'text-slate-400 dark:text-slate-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-800 dark:text-amber-200',
    spark: 'text-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-800 dark:text-emerald-200',
    spark: 'text-emerald-500',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    text: 'text-sky-800 dark:text-sky-200',
    spark: 'text-sky-500',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-800 dark:text-rose-200',
    spark: 'text-rose-500',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    text: 'text-violet-800 dark:text-violet-200',
    spark: 'text-violet-500',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-500/10',
    text: 'text-teal-800 dark:text-teal-200',
    spark: 'text-teal-500',
  },
}

const SOURCE_BADGE: Record<
  EvaluationSource,
  { label: string; Icon: LucideIcon; cls: string }
> = {
  ia: {
    label: 'IA',
    Icon: Wand2,
    cls: 'bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/30',
  },
  manual: {
    label: 'Manual',
    Icon: Smartphone,
    cls: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-700/40 dark:text-slate-200 dark:ring-slate-600/40',
  },
  device: {
    label: 'Device',
    Icon: Bluetooth,
    cls: 'bg-teal-100 text-teal-700 ring-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-500/30',
  },
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} · ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function formatMetricValue(m: BioMetric): string {
  return m.value.toFixed(m.decimals)
}

function DeltaPill({ direction, deltaPercent, delta }: BioMetric) {
  const Icon: LucideIcon =
    delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus
  const color =
    direction === 'good'
      ? 'text-emerald-600 dark:text-emerald-400'
      : direction === 'bad'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-slate-500 dark:text-slate-400'

  if (delta === 0) return null
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${color}`}
      aria-label={`Variação ${deltaPercent}%`}
    >
      <Icon className="h-3 w-3" strokeWidth={3} />
      {Math.abs(deltaPercent).toFixed(1)}%
    </span>
  )
}

function MetricTile({
  metricKey,
  metric,
}: {
  metricKey: BioMetricKey
  metric: BioMetric
}) {
  const tone = TONE_TILE[metric.tone]
  return (
    <div className={`relative overflow-hidden rounded-2xl p-3 ${tone.bg}`}>
      <p
        className={`text-[10px] font-bold uppercase tracking-wider opacity-70 ${tone.text}`}
      >
        {metric.label}
      </p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-mono text-xl font-bold leading-none ${tone.text}`}>
          {formatMetricValue(metric)}
        </span>
        <span className={`text-[10px] font-medium opacity-70 ${tone.text}`}>
          {metric.unit}
        </span>
      </div>
      <div className="mt-1.5">
        <DeltaPill {...metric} />
      </div>
    </div>
  )
}

export function LatestReadingCard({
  reading,
  onOpen,
}: LatestReadingCardProps) {
  if (!reading) {
    return (
      <section className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/40 p-8 text-center dark:border-slate-700 dark:bg-slate-800/30">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Nenhuma leitura ainda
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Tire uma foto do display da sua balança pra começar
        </p>
      </section>
    )
  }

  const metricEntries = Object.entries(reading.metrics) as Array<
    [BioMetricKey, BioMetric]
  >

  const sourceBadge = SOURCE_BADGE[reading.source]
  const isImage = reading.fileMimeType?.startsWith('image/') ?? true

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Última leitura
          </h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-mono">{formatDateTime(reading.date)}</span>
            {reading.deviceBrand && (
              <>
                <span>·</span>
                <span>
                  {reading.deviceBrand}
                  {reading.deviceModel && ` ${reading.deviceModel}`}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${sourceBadge.cls}`}
            title={`Fonte: ${sourceBadge.label}`}
          >
            <sourceBadge.Icon className="h-3 w-3" />
            {sourceBadge.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Pronto
          </span>
        </div>
      </header>

      <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto]">
        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {metricEntries.map(([key, metric]) => (
            <MetricTile key={key} metricKey={key} metric={metric} />
          ))}
        </div>

        {/* File preview */}
        {reading.fileUrl && (
          <div className="relative shrink-0 self-start">
            <div className="relative h-32 w-24 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700">
              {isImage ? (
                <img
                  src={reading.fileUrl}
                  alt="Foto da balança"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <span className="font-mono text-[10px] font-bold uppercase">
                    PDF
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <button
                type="button"
                onClick={() => onOpen?.(reading.id)}
                className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 transition hover:bg-white"
                aria-label="Ampliar"
              >
                <Maximize2 className="h-3 w-3" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[9px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Display
            </p>
          </div>
        )}
      </div>

      {/* AI summary (campos opcionais de extractedData) */}
      {reading.summary && (
        <div className="border-t border-slate-100 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 px-5 py-4 dark:border-slate-800 dark:from-emerald-500/5 dark:via-slate-900 dark:to-teal-500/5">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
              {reading.summary}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpen?.(reading.id)}
            className="mt-2 text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
          >
            Ver leitura completa →
          </button>
        </div>
      )}
    </section>
  )
}
