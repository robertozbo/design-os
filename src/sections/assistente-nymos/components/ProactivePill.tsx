import type { ProactiveSuggestion } from '@/../product/sections/assistente-nymos/types'
import { Check, X } from 'lucide-react'

interface ProactivePillProps {
  suggestion: ProactiveSuggestion
  onAccept?: () => void
  onDismiss?: () => void
}

export function ProactivePill({ suggestion, onAccept, onDismiss }: ProactivePillProps) {
  return (
    <div
      className="relative max-w-md mx-auto font-mono"
      role="status"
      aria-label="Sugestão proativa do Nymos"
    >
      <div
        className="
          relative border border-orange-400/60 bg-orange-500/[0.05] backdrop-blur-md
          px-4 py-3
          shadow-[0_0_24px_-6px_rgba(251,146,60,0.5)]
        "
        style={{
          clipPath:
            'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
        }}
      >
        <div className="flex items-center gap-2 text-[9px] tracking-[0.22em] uppercase text-orange-300 mb-2">
          <span className="w-1 h-1 bg-orange-300 rounded-full animate-pulse" />
          Sugestão proativa · {suggestion.category}
        </div>
        <p className="text-sm sm:text-base text-orange-50 font-light leading-snug mb-3">
          {suggestion.message}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="
              flex-1 inline-flex items-center justify-center gap-1.5
              text-[10px] tracking-widest uppercase
              text-slate-950 bg-orange-300 hover:bg-orange-200
              py-2 transition-colors
            "
          >
            <Check className="w-3 h-3" />
            {suggestion.ctaAccept}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="
              inline-flex items-center justify-center gap-1.5
              text-[10px] tracking-widest uppercase
              text-orange-200/80 hover:text-orange-100
              border border-orange-400/40 hover:border-orange-300
              px-3 py-2 transition-colors
            "
          >
            <X className="w-3 h-3" />
            {suggestion.ctaDismiss}
          </button>
        </div>
      </div>
    </div>
  )
}
