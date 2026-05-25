import { Check } from 'lucide-react'

interface Props {
  steps: Array<{ id: string; title: string; subtitle: string }>
  activeIndex: number
  onJumpTo?: (index: number) => void
}

export function WizardStepper({ steps, activeIndex, onJumpTo }: Props) {
  return (
    <ol
      style={{ animationDelay: '120ms' }}
      className="nymos-reveal opacity-0 grid grid-cols-3 gap-2 sm:gap-4"
    >
      {steps.map((step, i) => {
        const isActive = i === activeIndex
        const isComplete = i < activeIndex
        const canJump = isComplete && onJumpTo
        const Tag = canJump ? 'button' : 'div'

        return (
          <li key={step.id} className="relative">
            <Tag
              {...(canJump ? { type: 'button', onClick: () => onJumpTo!(i) } : {})}
              className={`
                relative w-full text-left flex items-start gap-3 p-3 sm:p-4 rounded-2xl border transition
                ${
                  isActive
                    ? 'border-teal-300 dark:border-teal-700 bg-teal-50/60 dark:bg-teal-950/30 shadow-[0_14px_36px_-20px_rgba(13,148,136,0.55)]'
                    : isComplete
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-teal-200 dark:hover:border-teal-900/60'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30'
                }
                ${canJump ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span
                className={`
                  flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-semibold transition
                  ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-[0_8px_18px_-6px_rgba(20,184,166,0.6)]'
                      : isComplete
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }
                `}
              >
                {isComplete ? <Check className="w-4 h-4" strokeWidth={2.75} /> : i + 1}
              </span>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Passo {i + 1} / {steps.length}
                </div>
                <div
                  className={`text-sm font-semibold tracking-tight mt-0.5 leading-tight ${
                    isActive
                      ? 'text-slate-900 dark:text-slate-50'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {step.title}
                </div>
                <div className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {step.subtitle}
                </div>
              </div>
            </Tag>

            {i < steps.length - 1 && (
              <div
                aria-hidden
                className={`
                  hidden sm:block absolute top-1/2 -right-2 w-4 h-px
                  ${isComplete ? 'bg-emerald-300 dark:bg-emerald-800' : 'bg-slate-200 dark:bg-slate-800'}
                `}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
