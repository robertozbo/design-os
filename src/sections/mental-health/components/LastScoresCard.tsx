import { ArrowUpRight, History, TrendingDown, TrendingUp } from 'lucide-react'
import type {
  AssessmentScore,
  AssessmentType,
  InterpretationTone,
  LastAssessmentScores,
} from '@/../product/sections/mental-health/types'

interface Props {
  scores: LastAssessmentScores
  onViewHistory?: (type: AssessmentType) => void
  revealIndex?: number
}

const toneBar: Record<InterpretationTone, string> = {
  good: 'bg-teal-500',
  caution: 'bg-amber-400',
  warning: 'bg-orange-500',
  critical: 'bg-rose-500',
}

const tonePill: Record<InterpretationTone, string> = {
  good: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
  caution: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  warning:
    'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
  critical: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
}

export function LastScoresCard({ scores, onViewHistory, revealIndex = 0 }: Props) {
  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <header className="flex items-center justify-between gap-4 p-5 pb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Últimos resultados
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            PHQ-9 & GAD-7
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Questionários clínicos validados
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
        <ScorePanel
          score={scores.phq9}
          fallbackName="PHQ-9"
          fallbackCopy="Ainda sem aplicação registrada."
          onViewHistory={() => onViewHistory?.('phq9')}
        />
        <ScorePanel
          score={scores.gad7}
          fallbackName="GAD-7"
          fallbackCopy="Ainda sem aplicação registrada."
          onViewHistory={() => onViewHistory?.('gad7')}
        />
      </div>
    </section>
  )
}

function ScorePanel({
  score,
  fallbackName,
  fallbackCopy,
  onViewHistory,
}: {
  score: AssessmentScore | null
  fallbackName: string
  fallbackCopy: string
  onViewHistory?: () => void
}) {
  if (!score) {
    return (
      <div className="p-5">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {fallbackName}
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {fallbackCopy}
        </p>
      </div>
    )
  }
  const pct = (score.scoreValue / score.scoreMax) * 100
  const deltaPositive = score.deltaLabel?.trim().startsWith('-') // lower score = improvement
  const DeltaIcon = deltaPositive ? TrendingDown : TrendingUp
  const deltaColor = deltaPositive
    ? 'text-teal-600 dark:text-teal-400'
    : 'text-rose-600 dark:text-rose-400'

  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {score.name}
            </span>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.14em] font-semibold ${tonePill[score.interpretationTone]}`}
            >
              {score.interpretation}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
              {score.scoreValue}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              / {score.scoreMax}
            </span>
          </div>
          {score.deltaLabel && (
            <div className={`mt-1 inline-flex items-center gap-1 text-[11px] font-medium ${deltaColor}`}>
              <DeltaIcon className="w-3 h-3" />
              <span>{score.deltaLabel}</span>
            </div>
          )}
        </div>
        {onViewHistory && (
          <button
            type="button"
            onClick={onViewHistory}
            aria-label={`Histórico de ${score.name}`}
            className="
              grid place-items-center shrink-0 w-8 h-8 rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:text-slate-700 dark:hover:text-slate-200
              transition-colors
            "
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${toneBar[score.interpretationTone]}`}
          style={{ width: `${Math.max(3, Math.min(100, pct))}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {score.description}
      </p>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500">
        <History className="w-3.5 h-3.5" />
        <span>Aplicado em {score.takenOnLabel}</span>
      </div>
    </div>
  )
}
