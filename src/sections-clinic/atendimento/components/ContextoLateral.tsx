import { History } from 'lucide-react'
import type {
  AlertaContexto,
  ContextoItem,
} from '@/../product-clinic/sections/atendimento/types'
import { TOM_ALERTA } from './helpers'

interface Props {
  contexto: ContextoItem[]
  alertas: AlertaContexto[]
  /** Cartão específico da profissão que fica acima do histórico (escalas, curva de peso…). */
  destaque?: React.ReactNode
}

/**
 * A coluna que responde "o que já aconteceu com este paciente" — igual em toda profissão, porque
 * a pergunta é a mesma. Só o cartão de destaque muda.
 */
export function ContextoLateral({ contexto, alertas, destaque }: Props) {
  return (
    <>
      {alertas.length > 0 && (
        <div className="space-y-1.5">
          {alertas.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl px-3 py-2 text-[11px] leading-snug ${TOM_ALERTA[a.tom]}`}
            >
              {a.texto}
            </div>
          ))}
        </div>
      )}

      {destaque}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
          <History className="h-3.5 w-3.5 text-slate-400" /> Histórico
        </h2>
        <ul className="mt-3 space-y-3">
          {contexto.map((c) => (
            <li key={c.id} className="border-l-2 border-slate-200 pl-3 dark:border-slate-700">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {c.titulo}
                </span>
                <span className="text-[10px] text-slate-400">{c.quando}</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {c.resumo}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
