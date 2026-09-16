import { ChevronRight, MapPin } from 'lucide-react'
import {
  SITIO_LABELS,
  type Glp1Aplicacao,
} from '@/../product-mobile/sections/glp1/types'

interface Props {
  aplicacoes: Glp1Aplicacao[]
  onVerTodas?: () => void
}

const DOR_COLOR = (n: number): string => {
  if (n <= 2) return 'bg-emerald-500/15 text-emerald-300'
  if (n <= 5) return 'bg-amber-500/15 text-amber-300'
  if (n <= 8) return 'bg-orange-500/15 text-orange-300'
  return 'bg-rose-500/15 text-rose-300'
}

function hora(iso: string): string {
  return iso.slice(11, 16)
}

function dia(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  void y
  return `${d}/${m}`
}

export function HistoricoAplicacoes({ aplicacoes, onVerTodas }: Props) {
  if (aplicacoes.length === 0) return null

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
          Aplicações
        </span>
        <span className="font-mono tabular-nums text-[10.5px] text-slate-500">
          {aplicacoes.length} registros
        </span>
      </div>

      <div className="divide-y divide-slate-800">
        {aplicacoes.slice(0, 5).map((a) => (
          <div key={a.id} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="shrink-0 text-center w-10">
                <div className="font-mono tabular-nums text-slate-100 text-[12.5px] font-medium">
                  {dia(a.aplicadaEm)}
                </div>
                <div className="font-mono tabular-nums text-slate-600 text-[10px]">
                  {hora(a.aplicadaEm)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-100 text-[13px] font-medium truncate">
                    {a.medicamentoNome}
                  </span>
                  <span className="font-mono tabular-nums text-teal-300 text-[11.5px] shrink-0">
                    {a.dose}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-slate-500 text-[11px]">
                  <MapPin size={9.5} className="shrink-0" />
                  <span className="truncate">{SITIO_LABELS[a.sitio]}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {a.pesoNoDiaKg && (
                  <span className="font-mono tabular-nums text-slate-400 text-[11.5px]">
                    {a.pesoNoDiaKg.toFixed(1).replace('.', ',')} kg
                  </span>
                )}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono tabular-nums text-[10px] font-medium ${DOR_COLOR(a.dor)}`}
                >
                  dor {a.dor}
                </span>
              </div>
            </div>
            {a.observacao && (
              <p className="mt-1.5 ml-[52px] text-slate-400 text-[11.5px] leading-snug">
                {a.observacao}
              </p>
            )}
          </div>
        ))}
      </div>

      {aplicacoes.length > 5 && (
        <button
          onClick={onVerTodas}
          className="w-full flex items-center justify-center gap-0.5 px-4 py-2.5 border-t border-slate-800 text-teal-300 text-[12.5px] font-medium hover:text-teal-200 active:bg-slate-800/40"
        >
          Ver todas as aplicações
          <ChevronRight size={13} strokeWidth={2.2} />
        </button>
      )}
    </div>
  )
}
