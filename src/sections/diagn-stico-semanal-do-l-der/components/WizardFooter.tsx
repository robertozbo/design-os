import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

interface Props {
  activeIndex: number
  totalSteps: number
  canAdvance: boolean
  isFinalStep: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export function WizardFooter({
  activeIndex,
  totalSteps,
  canAdvance,
  isFinalStep,
  onBack,
  onNext,
  onSubmit,
}: Props) {
  return (
    <div
      className="
        sticky bottom-0 left-0 right-0 z-10
        border-t border-slate-200 dark:border-slate-800
        bg-white/85 dark:bg-slate-950/85 backdrop-blur
      "
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={activeIndex === 0}
            className="
              inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
              text-slate-700 dark:text-slate-200
              hover:bg-slate-100 dark:hover:bg-slate-800
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
              transition
            "
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
            Voltar
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`
                  block h-1.5 rounded-full transition-all
                  ${
                    i === activeIndex
                      ? 'w-8 bg-teal-500'
                      : i < activeIndex
                        ? 'w-4 bg-emerald-400'
                        : 'w-4 bg-slate-200 dark:bg-slate-800'
                  }
                `}
              />
            ))}
          </div>
        </div>

        {isFinalStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canAdvance}
            className="
              group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-teal-500 hover:bg-teal-400 text-slate-950
              dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
              text-sm font-semibold tracking-tight
              shadow-[0_14px_30px_-12px_rgba(20,184,166,0.55)]
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98] transition
            "
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            Concluir diagnóstico
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance}
            className="
              group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-slate-900 hover:bg-slate-800 text-white
              dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
              text-sm font-semibold tracking-tight
              shadow-[0_14px_30px_-12px_rgba(15,23,42,0.45)] dark:shadow-[0_14px_30px_-12px_rgba(20,184,166,0.5)]
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98] transition
            "
          >
            Próximo
            <ArrowRight
              className="w-4 h-4 -mr-0.5 transition-transform group-enabled:group-hover:translate-x-0.5"
              strokeWidth={2.25}
            />
          </button>
        )}
      </div>
    </div>
  )
}
