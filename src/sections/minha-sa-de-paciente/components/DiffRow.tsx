import { ArrowRight, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { MetricDiff } from '@/../product/sections/minha-sa-de-paciente/types'

interface DiffRowProps {
  diff: MetricDiff
}

function formatNumber(value: number | null, decimals = 0): string {
  if (value == null) return '—'
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function formatDelta(
  delta: number | null,
  deltaPercent: number | null,
  decimals = 1,
): string {
  if (delta == null) return ''
  const sign = delta > 0 ? '+' : ''
  const value = `${sign}${formatNumber(delta, decimals)}`
  if (deltaPercent == null) return value
  const pct = `${sign}${formatNumber(deltaPercent, 1)}%`
  return `${value} (${pct})`
}

export function DiffRow({ diff }: DiffRowProps) {
  const { label, unit, valueA, valueB, delta, deltaPercent, direction, decimals } = diff
  const accent =
    direction === 'good'
      ? 'text-emerald-600 dark:text-emerald-400'
      : direction === 'bad'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-slate-500 dark:text-slate-400'

  const Trend =
    delta == null || delta === 0
      ? Minus
      : (direction === 'good') === delta > 0
        ? TrendingUp
        : TrendingDown

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      {/* Label */}
      <span className="truncate text-sm text-slate-700 dark:text-slate-200">
        {label}
      </span>

      {/* Value A */}
      <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
        {formatNumber(valueA, decimals)}
        {unit && (
          <span className="ml-0.5 text-xs text-slate-400 dark:text-slate-500">
            {unit}
          </span>
        )}
      </span>

      {/* Arrow */}
      <ArrowRight
        className="h-4 w-4 text-slate-400 dark:text-slate-600"
        aria-hidden
      />

      {/* Value B */}
      <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
        {formatNumber(valueB, decimals)}
        {unit && (
          <span className="ml-0.5 text-xs text-slate-400 dark:text-slate-500">
            {unit}
          </span>
        )}
      </span>

      {/* Delta */}
      <div className={`flex items-center justify-end gap-1 font-mono text-xs ${accent}`}>
        <Trend className="h-3 w-3" aria-hidden />
        <span>{formatDelta(delta, deltaPercent, decimals ?? 1)}</span>
      </div>
    </div>
  )
}
