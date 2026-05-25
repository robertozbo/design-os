import { Check } from 'lucide-react'
import type { WizardPasso } from '@/../product/sections/avalia-es-de-risco/types'

interface Props {
  passos: WizardPasso[]
  activeIndex: number
  onJumpTo?: (index: number) => void
}

export function AvaliacaoWizardStepper({ passos, activeIndex, onJumpTo }: Props) {
  return (
    <ol
      style={{ animationDelay: '120ms' }}
      className="nymos-reveal opacity-0 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3"
    >
      {passos.map((passo, i) => {
        const isActive = i === activeIndex
        const isComplete = i < activeIndex
        const canJump = isComplete && onJumpTo
        const Tag = canJump ? 'button' : 'div'
        return (
          <li key={passo.id} className="relative">
            <Tag
              {...(canJump ? { type: 'button' as const, onClick: () => onJumpTo!(i) } : {})}
              className={`
                relative w-full text-left flex items-start gap-2.5 p-3 rounded-2xl border transition
                ${
                  isActive
                    ? 'border-teal-300 dark:border-teal-700 bg-teal-50/60 dark:bg-teal-950/30 shadow-[0_14px_30px_-18px_rgba(13,148,136,0.55)]'
                    : isComplete
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-teal-200 dark:hover:border-teal-900/60'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30'
                }
                ${canJump ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span
                className={`
                  flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-semibold transition
                  ${
                    isActive
                      ? 'bg-teal-500 text-white'
                      : isComplete
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }
                `}
              >
                {isComplete ? <Check className="w-3.5 h-3.5" strokeWidth={2.75} /> : passo.id}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Passo {passo.id} / {passos.length}
                </div>
                <div className={`text-xs font-semibold mt-0.5 leading-tight ${isActive ? 'text-slate-900 dark:text-slate-50' : 'text-slate-700 dark:text-slate-300'}`}>
                  {passo.titulo}
                </div>
              </div>
            </Tag>
          </li>
        )
      })}
    </ol>
  )
}
