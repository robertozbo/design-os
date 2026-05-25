import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import type { DeltaMetrica } from '@/../product-personal/sections/avaliacoes/types'

interface MetricaDeltaProps {
  delta: DeltaMetrica
  unidade?: string
  compact?: boolean
}

export function MetricaDelta({ delta, unidade = '', compact }: MetricaDeltaProps) {
  const isZero = delta.delta === 0
  const isDown = delta.delta < 0
  const isPositive = isZero
    ? null
    : delta.positivoQuandoBaixa
      ? isDown
      : !isDown

  const tone = isZero
    ? 'text-slate-500 dark:text-slate-400'
    : isPositive
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400'

  const Icon = isZero ? Minus : isDown ? ArrowDown : ArrowUp
  const formatted = formatNumber(Math.abs(delta.delta))

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-0.5 font-mono text-[10px] font-semibold tabular-nums ${tone}`}>
        <Icon size={9} strokeWidth={3} />
        {formatted}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold tabular-nums ${tone}`}>
      <Icon size={11} strokeWidth={3} />
      {formatted}
      {unidade}
    </span>
  )
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(1)
}
