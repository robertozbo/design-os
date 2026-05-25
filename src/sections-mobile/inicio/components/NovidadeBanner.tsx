import type { Novidade } from '@/../product-mobile/sections/inicio/types'
import { ChevronRight, X } from 'lucide-react'
import { getIcon } from './_shared'

interface NovidadeBannerProps {
  novidade: Novidade
  onClick?: (novidade: Novidade) => void
  onDismiss?: (id: string) => void
}

export function NovidadeBanner({ novidade, onClick, onDismiss }: NovidadeBannerProps) {
  const Icon = getIcon(novidade.iconeNome)
  return (
    <div className="mx-4 mb-3">
      <div className="flex items-center gap-3 rounded-2xl bg-sky-400/10 border-l-[3px] border-sky-400 px-3 py-3">
        <button
          onClick={() => onClick?.(novidade)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-400/15 flex items-center justify-center text-sky-400 shrink-0">
            <Icon size={18} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-slate-100 font-medium text-[14px] truncate">{novidade.titulo}</div>
            <div className="text-slate-400 text-[12px] truncate">{novidade.subtitulo}</div>
          </div>
          <ChevronRight size={18} className="text-sky-400 shrink-0" />
        </button>
        <button
          onClick={() => onDismiss?.(novidade.id)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 shrink-0"
          aria-label="Dispensar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
