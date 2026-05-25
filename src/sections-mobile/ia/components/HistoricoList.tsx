import type { HistoricoItemUI } from '@/../product-mobile/sections/ia/types'
import { ChevronRight, Sparkles } from 'lucide-react'
import { getIcon, bgFromCor, textFromCor } from './_shared'

interface HistoricoListProps {
  items: HistoricoItemUI[]
  onClick?: (item: HistoricoItemUI) => void
}

export function HistoricoList({ items, onClick }: HistoricoListProps) {
  if (items.length === 0) return null
  return (
    <div className="px-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={11} className="text-slate-400" strokeWidth={2.4} />
        <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
          Recentes
        </span>
        <span className="text-slate-600 text-[10px] font-mono tabular-nums">{items.length}</span>
      </div>
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {items.map((h, i) => (
          <HistoricoRow
            key={h.item.id}
            item={h}
            onClick={onClick}
            isLast={i === items.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

interface HistoricoRowProps {
  item: HistoricoItemUI
  onClick?: (item: HistoricoItemUI) => void
  isLast?: boolean
}

function HistoricoRow({ item, onClick, isLast }: HistoricoRowProps) {
  const Icon = getIcon(item.iconeNome)
  const iconBg = bgFromCor(item.cor)
  const iconText = textFromCor(item.cor)
  return (
    <button
      onClick={() => onClick?.(item)}
      className={`w-full px-3.5 py-3 flex items-center gap-3 text-left hover:bg-slate-800/40 ${
        isLast ? '' : 'border-b border-slate-800/40'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconText} shrink-0`}>
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-100 font-semibold text-[13px] truncate">{item.label}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500 font-mono text-[10.5px] tabular-nums">
            {item.tempoRelativo}
          </span>
        </div>
        <div className="text-slate-400 text-[11.5px] truncate mt-0.5">{item.resumoExtraido}</div>
      </div>
      <ChevronRight size={14} className="text-slate-600 shrink-0" />
    </button>
  )
}
