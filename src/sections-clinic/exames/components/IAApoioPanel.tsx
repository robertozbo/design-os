import { Activity, FileText, GitCompare, Pill, Sparkles } from 'lucide-react'
import type { IAAnalise, IABlocoTipo } from '@/../product-clinic/sections/exames/types'

const BLOCO_ICON: Record<IABlocoTipo, typeof FileText> = {
  'resumo-laudo': FileText,
  'comparacao-historica': GitCompare,
  'cruzamento-queixa': Activity,
  'cruzamento-medicacao': Pill,
}

export function IAApoioPanel({ analise }: { analise: IAAnalise }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              IA de apoio à interpretação
            </div>
            <div className="text-[10px] text-slate-400">
              {analise.modeloIA} · {analise.geradoEm}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {analise.blocos.map((b) => {
          const Icon = BLOCO_ICON[b.tipo]
          return (
            <div
              key={b.tipo}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/30"
            >
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Icon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <h4 className="text-[11px] font-semibold uppercase tracking-wide">{b.titulo}</h4>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {b.conteudo}
              </p>
              <div className="mt-1.5 text-[10px] italic text-slate-400">Fonte: {b.fonte}</div>
            </div>
          )
        })}

        <p className="flex items-start gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[10px] leading-snug text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
          Apoio à decisão gerado por IA. Não substitui o julgamento clínico do médico. Cada inferência
          é registrada no log de auditoria (LGPD).
        </p>
      </div>
    </div>
  )
}
