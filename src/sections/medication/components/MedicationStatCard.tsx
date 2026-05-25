import {
  ExternalLink,
  Minus,
  Pill,
  Plus,
  Syringe,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import type { MedicacaoAtiva } from '@/../product/sections/medication/types'
import { Sparkline } from './Sparkline'

export interface MedicationStatCardProps {
  medicacao: MedicacaoAtiva
  /** Série pra sparkline (adesão últimos N dias ou nível PK). */
  series: number[]
  /** Delta % vs período anterior, ex 1.2 (sobe) ou -3.4 (cai). */
  trendPercent?: number
  /** Quantos dias atrás foi a última dose (ou "hoje", "ontem"). */
  ultimaDoseLabel: string
  /** Label customizada do "número grande" (ex: "em 2d", "tomado", "75mcg"). */
  bigValue: string
  /** Unit abaixo do número (ex: "até próxima", "diário", "mcg"). */
  bigUnit: string
  /** "ÚLTIMA · sex 15/05" no canto direito. */
  summary?: { label: string; value: string; unit?: string }
  /** Card selecionado (highlight border teal). */
  isSelected?: boolean
  revealIndex?: number
  /** Click no card (selecionar). */
  onSelect?: (medicacaoId: string) => void
  onAplicarDose?: (medicacaoId: string) => void
  onMarcarComprimido?: (medicacaoId: string) => void
  onAbrirMemed?: (medicacaoId: string) => void
}

function pickAccent(trend?: number): 'teal' | 'emerald' | 'coral' | 'slate' {
  if (trend === undefined) return 'slate'
  if (trend > 1) return 'teal'
  if (trend < -1) return 'coral'
  return 'emerald'
}

function trendChip(trend?: number) {
  if (trend === undefined) return null
  const cls =
    trend > 1
      ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/10'
      : trend < -1
        ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-400/10'
        : 'text-slate-500 dark:text-slate-400 bg-slate-500/10 dark:bg-slate-400/10'
  const Icon = trend > 1 ? TrendingUp : trend < -1 ? TrendingDown : Minus
  const sign = trend > 0 ? '+' : trend < 0 ? '−' : ''
  return (
    <div
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium ${cls}`}
    >
      <Icon className="h-2.5 w-2.5" />
      {trend === 0 ? '0%' : `${sign}${Math.abs(trend).toFixed(1)}%`}
    </div>
  )
}

export function MedicationStatCard({
  medicacao,
  series,
  trendPercent,
  ultimaDoseLabel,
  bigValue,
  bigUnit,
  summary,
  isSelected = false,
  revealIndex = 0,
  onSelect,
  onAplicarDose,
  onMarcarComprimido,
  onAbrirMemed,
}: MedicationStatCardProps) {
  const isInjetavel =
    medicacao.categoria === 'glp1_injetavel' || medicacao.via === 'subcutanea'
  const isGLP1Oral = medicacao.categoria === 'glp1_oral'
  const Icon = isInjetavel ? Syringe : Pill
  const accent = pickAccent(trendPercent)

  const FREQ_LABEL: Record<string, string> = {
    diaria: 'diária',
    semanal: 'semanal',
    mensal: 'mensal',
  }
  const sourceLabel = isInjetavel
    ? 'MEMED · GLP-1 semanal'
    : isGLP1Oral
      ? 'MEMED · GLP-1 oral'
      : `MEMED · ${FREQ_LABEL[medicacao.frequencia ?? 'diaria'] ?? 'diária'}`

  const accentBg =
    accent === 'teal'
      ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300'
      : accent === 'coral'
        ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300'
        : accent === 'emerald'
          ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300'
          : 'bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300'

  return (
    <section
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect?.(medicacao.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(medicacao.id)
        }
      }}
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className={`nymos-reveal group relative flex flex-col rounded-2xl border bg-white/90 opacity-0 backdrop-blur-[2px] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_16px_40px_-16px_rgba(15,23,42,0.18)] dark:bg-slate-900/80 dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_20px_48px_-20px_rgba(0,0,0,0.7)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
        isSelected
          ? 'border-teal-500 ring-2 ring-teal-500/30 shadow-[0_2px_4px_rgba(15,23,42,0.05),0_16px_40px_-16px_rgba(15,23,42,0.18)] dark:border-teal-400 dark:ring-teal-400/30'
          : 'border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-2 px-4 pb-2 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${accentBg}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              {medicacao.nome}
            </h3>
            <div className="flex items-center gap-1 truncate text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              <span className="h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
              <span className="truncate">{sourceLabel}</span>
            </div>
          </div>
        </div>
        {trendChip(trendPercent)}
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 px-4 pb-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-1">
            <div className="font-mono text-[22px] font-semibold leading-none tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
              {bigValue}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {bigUnit}
            </div>
          </div>
          {summary && (
            <div className="shrink-0 text-right leading-tight">
              <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {summary.label}
              </div>
              <div className="font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
                {summary.value}
                {summary.unit && (
                  <span className="ml-0.5 text-[9px] text-slate-500 dark:text-slate-500">
                    {summary.unit}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <Sparkline series={series} accent={accent} height={32} />

        <div className="-mb-1 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {ultimaDoseLabel}
          </div>
          <div className="flex items-center gap-1">
            {isInjetavel && onAplicarDose && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onAplicarDose(medicacao.id)
                }}
                className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-teal-700 transition-colors hover:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-400/10"
              >
                <Syringe className="h-2.5 w-2.5" />
                Aplicar
              </button>
            )}
            {isGLP1Oral && onMarcarComprimido && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarcarComprimido(medicacao.id)
                }}
                className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-teal-700 transition-colors hover:bg-teal-500/10 dark:text-teal-300 dark:hover:bg-teal-400/10"
              >
                <Plus className="h-2.5 w-2.5" />
                Tomei
              </button>
            )}
            {onAbrirMemed && medicacao.memedId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onAbrirMemed(medicacao.id)
                }}
                className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-slate-600 transition-colors hover:bg-slate-500/10 dark:text-slate-400 dark:hover:bg-slate-500/10"
              >
                Receita
                <ExternalLink className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
