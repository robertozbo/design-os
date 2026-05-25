import { Clock3, ListChecks, Send, X } from 'lucide-react'
import type {
  AssessmentType,
  ScheduledAssessment,
} from '@/../product/sections/mental-health/types'

interface Props {
  assessment: ScheduledAssessment
  onOpen?: (type: AssessmentType) => void
  onDismiss?: (type: AssessmentType) => void
  revealIndex?: number
}

export function ScheduledAssessmentCard({
  assessment,
  onOpen,
  onDismiss,
  revealIndex = 0,
}: Props) {
  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        relative overflow-hidden rounded-2xl
        border border-violet-200 dark:border-violet-900/50
        bg-gradient-to-br from-violet-50 via-white to-teal-50/60
        dark:from-violet-500/10 dark:via-slate-900/80 dark:to-teal-500/10
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-5 p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="
            grid place-items-center w-12 h-12 shrink-0 rounded-xl
            bg-violet-600 text-white
            shadow-[0_10px_24px_-12px_rgba(124,58,237,0.7)]
          "
        >
          <ListChecks className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.14em] font-semibold bg-violet-600 text-white">
              <Send className="w-2.5 h-2.5" />
              {assessment.requestedBy} pediu
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-violet-700 dark:text-violet-300">
              {assessment.name}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {assessment.fullName}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            {assessment.purpose}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5" />~{assessment.estimatedMinutes} min
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {assessment.questionCount} perguntas
            </span>
            {assessment.lastCompletedISO && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Última aplicação{' '}
                  {new Date(assessment.lastCompletedISO).toLocaleDateString(
                    'pt-BR',
                    { day: '2-digit', month: 'short' }
                  )}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch lg:self-auto">
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(assessment.type)}
              aria-label="Adiar questionário"
              className="
                grid place-items-center w-9 h-9 rounded-lg
                text-slate-500 dark:text-slate-400
                hover:bg-white/60 dark:hover:bg-slate-800/70
                hover:text-slate-700 dark:hover:text-slate-200
                transition-colors
              "
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpen?.(assessment.type)}
            className="
              inline-flex items-center gap-2 px-4 py-2
              rounded-lg text-sm font-semibold
              bg-violet-600 text-white
              hover:bg-violet-500
              active:bg-violet-700
              transition-colors
              shadow-[0_8px_20px_-10px_rgba(124,58,237,0.7)]
            "
          >
            Começar
          </button>
        </div>
      </div>
    </section>
  )
}
