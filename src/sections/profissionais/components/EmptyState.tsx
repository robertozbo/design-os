import { Search, RotateCcw } from 'lucide-react'
import type { EmptyStateContent } from '@/../product/sections/profissionais/types'

interface Props {
  content: EmptyStateContent
  onReset?: () => void
}

export function EmptyState({ content, onReset }: Props) {
  return (
    <div className="col-span-full text-center py-20 px-4">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700/30 to-slate-800/20 ring-1 ring-white/5 grid place-items-center mb-5">
        <Search className="w-7 h-7 text-slate-500" strokeWidth={1.8} />
      </div>
      <h3 className="text-lg font-bold text-slate-200 tracking-tight mb-2">{content.title}</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">{content.description}</p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-teal-200 bg-teal-400/10 ring-1 ring-teal-400/30 hover:ring-teal-400/60 hover:bg-teal-400/15 transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.4} />
        {content.resetCtaLabel}
      </button>
    </div>
  )
}
