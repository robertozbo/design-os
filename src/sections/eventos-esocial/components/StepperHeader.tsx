import { Check, User2, FileEdit, Paperclip, ShieldCheck } from 'lucide-react'
import type { StepIndex } from '@/../product/sections/eventos-esocial/types'

interface Props {
  current: StepIndex
  completed: Set<StepIndex>
  onJump?: (step: StepIndex) => void
}

const STEPS = [
  { idx: 0 as StepIndex, label: 'Trabalhador', sub: 'Quem', Icon: User2 },
  { idx: 1 as StepIndex, label: 'Dados específicos', sub: 'O quê', Icon: FileEdit },
  { idx: 2 as StepIndex, label: 'Anexos', sub: 'Provas', Icon: Paperclip },
  { idx: 3 as StepIndex, label: 'Revisão XSD', sub: 'Validar', Icon: ShieldCheck },
]

export function StepperHeader({ current, completed, onJump }: Props) {
  return (
    <ol
      style={{ animationDelay: '60ms' }}
      className="nymos-reveal opacity-0 flex items-stretch gap-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40"
    >
      {STEPS.map((step, idx) => {
        const isCurrent = step.idx === current
        const isDone = completed.has(step.idx) && !isCurrent
        const isFuture = !isCurrent && !isDone
        const canJump = !isFuture || completed.size > 0

        return (
          <li key={step.idx} className="flex-1 min-w-0 relative">
            <button
              type="button"
              onClick={() => canJump && onJump?.(step.idx)}
              disabled={!canJump}
              className={`
                w-full h-full px-3 sm:px-4 py-3 flex items-center gap-3 text-left transition
                ${
                  isCurrent
                    ? 'bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/30 dark:to-slate-900/40'
                    : isDone
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      : 'opacity-60 cursor-not-allowed'
                }
              `}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={`
                  shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl text-[12px] font-semibold transition
                  ${
                    isCurrent
                      ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.55)]'
                      : isDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }
                `}
              >
                {isDone ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <step.Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                )}
              </span>
              <div className="min-w-0 hidden sm:block">
                <p
                  className={`text-[10px] uppercase tracking-[0.14em] font-medium ${
                    isCurrent
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Passo {idx + 1} · {step.sub}
                </p>
                <p
                  className={`text-[13px] font-medium truncate ${
                    isCurrent
                      ? 'text-slate-900 dark:text-slate-50'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </button>
            {idx < STEPS.length - 1 && (
              <span
                className="absolute right-0 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 pointer-events-none"
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
