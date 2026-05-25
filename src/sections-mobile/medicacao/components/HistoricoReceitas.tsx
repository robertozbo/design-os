import { ChevronRight } from 'lucide-react'
import type { RegistroReceita } from '@/../product-mobile/sections/medicacao/types'

interface Props {
  registros: RegistroReceita[]
  onAbrirDetalhe?: (id: string) => void
  onVerTodas?: () => void
}

export function HistoricoReceitas({ registros, onAbrirDetalhe, onVerTodas }: Props) {
  if (registros.length === 0) return null
  return (
    <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <ul>
        {registros.map((r, i) => (
          <li
            key={r.id}
            className={`${i === registros.length - 1 ? '' : 'border-b border-slate-800'}`}
          >
            <button
              onClick={() => onAbrirDetalhe?.(r.id)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left active:bg-slate-800/40 transition-colors"
            >
              <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono tabular-nums text-slate-500 text-[11px]">
                    {r.data}
                  </span>
                  <span className="text-slate-100 text-[13px] font-medium truncate">
                    {r.titulo}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">{r.medicoNome}</div>
                {r.motivo && (
                  <p className="mt-1 text-slate-400 text-[12px] leading-snug line-clamp-1">
                    {r.motivo}
                  </p>
                )}
              </div>
              <ChevronRight size={14} className="text-slate-600 shrink-0 mt-1" strokeWidth={2} />
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={onVerTodas}
        className="w-full text-center text-teal-300 hover:text-teal-200 text-[12.5px] font-medium py-3 border-t border-slate-800 active:scale-[0.99] transition"
      >
        Ver todas as receitas →
      </button>
    </div>
  )
}
