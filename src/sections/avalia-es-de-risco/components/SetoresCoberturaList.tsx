import type { CoberturaSetor } from '@/../product/sections/avalia-es-de-risco/types'
import { Bell, ChevronRight, Mail } from 'lucide-react'

interface Props {
  setores: CoberturaSetor[]
  onAbrirSetor?: (setorId: string) => void
  onReenviarLembrete?: (setorIds: string[]) => void
}

export function SetoresCoberturaList({ setores, onAbrirSetor, onReenviarLembrete }: Props) {
  const alertSetorIds = setores.filter((s) => s.status === 'alerta').map((s) => s.setorId)

  const grouped = setores.reduce<Record<string, CoberturaSetor[]>>((acc, s) => {
    if (!acc[s.estabelecimento]) acc[s.estabelecimento] = []
    acc[s.estabelecimento].push(s)
    return acc
  }, {})

  return (
    <section className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Cobertura por setor</div>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">{setores.length} setores no escopo</h3>
        </div>
        {alertSetorIds.length > 0 && (
          <button
            type="button"
            onClick={() => onReenviarLembrete?.(alertSetorIds)}
            className="
              inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
              bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold
              shadow-[0_8px_18px_-8px_rgba(217,119,6,0.55)]
              active:scale-[0.98] transition
            "
          >
            <Mail className="w-3.5 h-3.5" strokeWidth={2.25} />
            Reenviar a {alertSetorIds.length} setores em alerta
          </button>
        )}
      </header>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {Object.entries(grouped).map(([est, items]) => (
          <div key={est}>
            <div className="px-5 py-2 bg-slate-50/60 dark:bg-slate-900/40 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {est}
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {items.map((s) => {
                const isAlert = s.status === 'alerta'
                const barColor = isAlert
                  ? s.cobertura >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                  : 'bg-emerald-500'
                return (
                  <li key={s.setorId}>
                    <button
                      type="button"
                      onClick={() => onAbrirSetor?.(s.setorId)}
                      className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{s.setor}</span>
                            {isAlert && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[10px] font-medium text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                                <Bell className="w-2.5 h-2.5" strokeWidth={2.25} />
                                alerta
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">{s.cobertura.toFixed(1)}%</span>
                        </div>
                        <div className="relative h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <span
                            className={`absolute inset-y-0 left-0 ${barColor} rounded-full transition-all`}
                            style={{ width: `${Math.max(2, s.cobertura)}%` }}
                          />
                        </div>
                        <div className="mt-1.5 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-500">
                          {s.respondentes} / {s.elegiveis} respondentes
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" strokeWidth={2.25} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
