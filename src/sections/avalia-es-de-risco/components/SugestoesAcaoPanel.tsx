import type { SugestaoAcao } from '@/../product/sections/avalia-es-de-risco/types'
import { Lightbulb, Tag } from 'lucide-react'

interface Props {
  sugestoes: SugestaoAcao[]
}

const PRIORITY_TONE = {
  baixo: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
  moderado: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
  critico: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-900/60',
  prioritario: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
} as const

const PRIORITY_LABEL = { baixo: 'Baixa', moderado: 'Moderada', critico: 'Crítica', prioritario: 'Prioritária' } as const
const PRIORITY_RANK = { prioritario: 0, critico: 1, moderado: 2, baixo: 3 } as const

export function SugestoesAcaoPanel({ sugestoes }: Props) {
  const sorted = [...sugestoes].sort((a, b) => PRIORITY_RANK[a.prioridade] - PRIORITY_RANK[b.prioridade])

  return (
    <section className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
          <Lightbulb className="w-3 h-3" strokeWidth={2.25} />
          Sugestões de ação
        </div>
        <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">
          {sorted.length} {sorted.length === 1 ? 'recomendação' : 'recomendações'}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Geradas pela classificação dos fatores. Use como ponto de partida para o Plano de Ação NR-1.
        </p>
      </header>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {sorted.map((s) => (
          <li key={s.id} className="px-5 py-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${PRIORITY_TONE[s.prioridade]}`}>
                Prioridade {PRIORITY_LABEL[s.prioridade]}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                {s.setor} · {s.fator}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-snug">{s.titulo}</h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.descricao}</p>
            {s.evidenciasSugeridas.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" strokeWidth={2.25} />
                {s.evidenciasSugeridas.map((e) => (
                  <span
                    key={e}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300"
                  >
                    {e}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
