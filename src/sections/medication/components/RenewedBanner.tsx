import { Sparkles, X } from 'lucide-react'
import type { ReceitaRenovada } from '@/../product/sections/medication/types'

interface Props {
  receita: ReceitaRenovada
  onDispensar: () => void
  onAbrir: (medicacaoId: string) => void
}

export function RenewedBanner({ receita, onDispensar, onAbrir }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 dark:border-emerald-400/40 dark:bg-emerald-500/10">
      <Sparkles
        size={18}
        className="shrink-0 text-emerald-600 dark:text-emerald-300"
        strokeWidth={2.2}
      />
      <div className="flex-1">
        <p className="text-[13.5px] font-medium text-emerald-900 dark:text-emerald-100">
          Receita de {receita.nomeMed} renovada
        </p>
        <p className="text-[12px] text-emerald-700 dark:text-emerald-200/80">
          {receita.haLabel} · disponível no Memed
        </p>
      </div>
      <button
        onClick={() => onAbrir(receita.medicacaoId)}
        className="rounded-full bg-emerald-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
      >
        Abrir Memed
      </button>
      <button
        onClick={onDispensar}
        className="rounded-full p-1.5 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
        aria-label="Dispensar"
      >
        <X size={14} strokeWidth={2.4} />
      </button>
    </div>
  )
}
