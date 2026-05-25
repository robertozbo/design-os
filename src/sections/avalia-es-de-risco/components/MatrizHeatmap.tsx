import type { MatrizCelula, MatrizPublicada } from '@/../product/sections/avalia-es-de-risco/types'

interface Props {
  matriz: MatrizPublicada
  onSelecionarCelula?: (setor: string, fator: string) => void
}

const CLASSIFICACAO_STYLE = {
  baixo: {
    label: 'Baixo',
    bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    bgHover: 'hover:bg-emerald-200 dark:hover:bg-emerald-900/60',
    text: 'text-emerald-900 dark:text-emerald-200',
    dot: 'bg-emerald-500',
  },
  moderado: {
    label: 'Moderado',
    bg: 'bg-amber-100 dark:bg-amber-950/50',
    bgHover: 'hover:bg-amber-200 dark:hover:bg-amber-900/60',
    text: 'text-amber-900 dark:text-amber-200',
    dot: 'bg-amber-500',
  },
  critico: {
    label: 'Crítico',
    bg: 'bg-orange-200 dark:bg-orange-950/60',
    bgHover: 'hover:bg-orange-300 dark:hover:bg-orange-900/70',
    text: 'text-orange-950 dark:text-orange-100',
    dot: 'bg-orange-500',
  },
  prioritario: {
    label: 'Prioritário',
    bg: 'bg-rose-300 dark:bg-rose-950/70',
    bgHover: 'hover:bg-rose-400 dark:hover:bg-rose-900',
    text: 'text-rose-950 dark:text-rose-100',
    dot: 'bg-rose-600',
  },
} as const

export function MatrizHeatmap({ matriz, onSelecionarCelula }: Props) {
  const celulasMap = new Map<string, MatrizCelula>()
  for (const c of matriz.celulas) {
    celulasMap.set(`${c.setor}::${c.fator}`, c)
  }

  return (
    <section className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Matriz psicossocial
          </div>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">
            Setor × Fator avaliado
          </h3>
        </div>
        <Legend />
      </header>

      <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
        <table className="w-full border-separate border-spacing-1.5 text-xs">
          <thead>
            <tr>
              <th className="text-left font-mono uppercase tracking-[0.14em] text-[10px] text-slate-500 dark:text-slate-400 font-medium px-2 pb-1 sticky left-0 bg-white dark:bg-slate-900/60 z-10">
                Setor
              </th>
              {matriz.fatores.map((fator) => (
                <th
                  key={fator}
                  className="text-left font-mono uppercase tracking-[0.14em] text-[10px] text-slate-500 dark:text-slate-400 font-medium px-2 pb-1 align-bottom"
                >
                  <div className="-rotate-0 sm:-rotate-12 origin-bottom-left whitespace-nowrap">{fator}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matriz.setores.map((setor) => (
              <tr key={setor}>
                <th className="text-left font-medium text-xs text-slate-700 dark:text-slate-200 px-2 py-1.5 sticky left-0 bg-white dark:bg-slate-900/60 z-10 whitespace-nowrap">
                  {setor}
                </th>
                {matriz.fatores.map((fator) => {
                  const celula = celulasMap.get(`${setor}::${fator}`)
                  if (!celula) {
                    return <td key={fator} className="rounded-md bg-slate-50 dark:bg-slate-900/40" />
                  }
                  const style = CLASSIFICACAO_STYLE[celula.classificacao]
                  return (
                    <td key={fator} className="p-0">
                      <button
                        type="button"
                        onClick={() => onSelecionarCelula?.(setor, fator)}
                        className={`
                          w-full h-12 rounded-md flex items-center justify-center text-[13px] font-semibold tabular-nums
                          ${style.bg} ${style.bgHover} ${style.text}
                          transition-all hover:scale-[1.02] hover:shadow-[0_8px_18px_-8px_rgba(15,23,42,0.25)]
                          focus:outline-none focus:ring-2 focus:ring-teal-500
                        `}
                        title={`${setor} · ${fator} · score ${celula.score} · ${style.label}`}
                      >
                        {celula.score.toFixed(1)}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {(Object.keys(CLASSIFICACAO_STYLE) as Array<keyof typeof CLASSIFICACAO_STYLE>).map((k) => {
        const s = CLASSIFICACAO_STYLE[k]
        return (
          <div key={k} className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
            <span className={`inline-block w-3 h-3 rounded ${s.bg}`} />
            <span className="font-medium">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
