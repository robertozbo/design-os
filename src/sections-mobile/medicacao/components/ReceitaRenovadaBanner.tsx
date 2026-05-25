import { Sparkles, X } from 'lucide-react'
import type { ReceitaRenovada } from '@/../product-mobile/sections/medicacao/types'

interface Props {
  receita: ReceitaRenovada
  onDispensar?: () => void
  onAbrir?: (medicacaoId: string) => void
}

export function ReceitaRenovadaBanner({ receita, onDispensar, onAbrir }: Props) {
  return (
    <div className="mx-4 mb-3 rounded-2xl bg-teal-500/10 border-l-[3px] border-teal-400 px-3 py-2.5 flex items-center gap-2">
      <Sparkles size={14} className="text-teal-300 shrink-0" strokeWidth={2.2} />
      <button
        onClick={() => onAbrir?.(receita.medicacaoId)}
        className="flex-1 text-left text-slate-100 text-[12.5px] truncate"
      >
        Receita de <span className="font-semibold">{receita.nomeMed}</span> renovada{' '}
        <span className="text-teal-300 font-mono text-[11.5px]">{receita.haLabel}</span>
      </button>
      <button
        onClick={onDispensar}
        className="shrink-0 p-1 rounded-md text-slate-500 hover:text-slate-300"
        aria-label="Dispensar"
      >
        <X size={12} strokeWidth={2.4} />
      </button>
    </div>
  )
}
