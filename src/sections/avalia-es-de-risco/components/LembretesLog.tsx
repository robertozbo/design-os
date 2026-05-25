import type { Lembrete } from '@/../product/sections/avalia-es-de-risco/types'
import { Mail, Megaphone, RefreshCw } from 'lucide-react'

interface Props {
  lembretes: Lembrete[]
}

const TYPE_META = {
  abertura: { label: 'Abertura', Icon: Megaphone, tone: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-100 dark:bg-teal-950/60' },
  lembrete: { label: 'Lembrete', Icon: Mail, tone: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-100 dark:bg-violet-950/60' },
  extensao: { label: 'Extensão', Icon: RefreshCw, tone: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-950/60' },
} as const

export function LembretesLog({ lembretes }: Props) {
  const sorted = [...lembretes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  return (
    <section className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Lembretes enviados</div>
        <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">
          {lembretes.length} comunicações
        </h3>
      </header>

      {sorted.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Nenhum lembrete enviado ainda.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {sorted.map((l) => {
            const meta = TYPE_META[l.tipo]
            const Icon = meta.Icon
            const taxa = l.destinatarios > 0 ? (l.entregues / l.destinatarios) * 100 : 0
            return (
              <li key={l.id} className="flex items-start gap-3 px-5 py-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.tone}`}>
                  <Icon className="w-4 h-4" strokeWidth={2.25} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.18em] ${meta.tone}`}>{meta.label}</span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
                      {new Date(l.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm text-slate-700 dark:text-slate-200 tabular-nums">
                    {l.entregues} / {l.destinatarios} entregues
                    <span className="text-slate-500 dark:text-slate-400 font-normal"> · {taxa.toFixed(0)}%</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
