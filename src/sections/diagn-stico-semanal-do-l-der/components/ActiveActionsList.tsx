import type { ActionStatus, ActiveAction } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { ListChecks } from 'lucide-react'
import { ActionRow } from './ActionRow'

interface Props {
  actions: ActiveAction[]
  onOpenActionDetail?: (id: string) => void
  onUpdateActionStatus?: (id: string, status: ActionStatus) => void
}

export function ActiveActionsList({ actions, onOpenActionDetail, onUpdateActionStatus }: Props) {
  const overdueCount = actions.filter((a) => a.status === 'overdue').length
  const inProgressCount = actions.filter((a) => a.status === 'in_progress').length

  return (
    <section
      style={{ animationDelay: '600ms' }}
      className="
        nymos-reveal opacity-0
        rounded-2xl bg-white dark:bg-slate-900/60
        border border-slate-200 dark:border-slate-800
        overflow-hidden
      "
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <ListChecks className="w-3 h-3" strokeWidth={2.25} />
            Ações ativas
          </div>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">
            Ações em acompanhamento
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {overdueCount} {overdueCount === 1 ? 'atrasada' : 'atrasadas'}
            </span>
          )}
          {inProgressCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              {inProgressCount} em andamento
            </span>
          )}
        </div>
      </header>

      {actions.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Nenhuma ação ativa. Registre o diagnóstico semanal para criar ações.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {actions.map((action) => (
            <ActionRow
              key={action.id}
              action={action}
              onOpen={() => onOpenActionDetail?.(action.id)}
              onComplete={() => onUpdateActionStatus?.(action.id, 'completed')}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
