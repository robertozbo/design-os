import type { ExameHistorico } from '@/../product-clinico/sections/pacientes/types'
import { formatDataBR, ALERT_NIVEL_STYLE } from './helpers'
import { Sparkline } from './Sparkline'

interface Props {
  exames: ExameHistorico[]
  onAbrirExame?: (id: string) => void
}

export function ExamesTab({ exames, onAbrirExame }: Props) {
  if (exames.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-sm italic text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Nenhum exame recebido ainda.
      </div>
    )
  }

  // Agrupar por mês
  const grupos = new Map<string, ExameHistorico[]>()
  for (const e of exames) {
    const d = new Date(e.dataColeta + 'T12:00:00')
    const chave = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    const arr = grupos.get(chave) || []
    arr.push(e)
    grupos.set(chave, arr)
  }

  return (
    <div className="space-y-6">
      {Array.from(grupos.entries()).map(([mes, lista]) => (
        <section key={mes}>
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {mes.replace(/^./, (c) => c.toUpperCase())}
          </h3>
          <div className="space-y-3">
            {lista.map((e) => (
              <article
                key={e.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      {e.tipo}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {e.laboratorio} · {formatDataBR(e.dataColeta)}
                    </p>
                  </div>
                  <button
                    onClick={() => onAbrirExame?.(e.id)}
                    className="
                      shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600
                      transition-colors hover:bg-slate-50
                      dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
                    "
                  >
                    Abrir laudo
                  </button>
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {e.biomarkers.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/60 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-950/40"
                    >
                      <div>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {b.nome}
                        </p>
                        <p className="text-[10px] text-slate-400">Ref. {b.faixaReferencia}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkline values={b.historico} ariaLabel={`Tendência ${b.nome}`} />
                        <span
                          className={`font-mono text-sm font-medium tabular-nums ${
                            ALERT_NIVEL_STYLE[b.alertNivel]
                          }`}
                        >
                          {b.valor}
                          <span className="ml-0.5 text-[10px] text-slate-400">{b.unidade}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
