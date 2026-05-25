import { Inbox, Archive, Filter, Sparkles } from 'lucide-react'

type Variant = 'all-clear' | 'empty-archived' | 'no-matches'

interface EmptyStateProps {
  variant: Variant
  onClearFilters?: () => void
  onSeeArchived?: () => void
}

export function EmptyState({ variant, onClearFilters, onSeeArchived }: EmptyStateProps) {
  if (variant === 'all-clear') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-white px-6 py-12 text-center dark:border-emerald-900/30 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-slate-950/40">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
          <Sparkles size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
          Tudo em dia
        </h3>
        <p className="mt-1 max-w-sm text-sm text-emerald-700/80 dark:text-emerald-300/70">
          Você não tem notificações pendentes. Bom trabalho na triagem.
        </p>
        {onSeeArchived && (
          <button
            type="button"
            onClick={onSeeArchived}
            className="
              mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium
              text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50
              dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/60 dark:hover:bg-emerald-950/60
            "
          >
            <Archive size={11} />
            Ver arquivadas
          </button>
        )}
      </div>
    )
  }

  if (variant === 'empty-archived') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/40 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Archive size={22} strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
          Nenhuma notificação arquivada
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Você ainda não arquivou notificações nesta conta.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Filter size={22} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Nenhuma notificação corresponde aos filtros
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Tente abrir mais um tipo ou urgência, ou volte para todas as notificações.
      </p>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="
            mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white
            hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
          "
        >
          <Inbox size={11} />
          Limpar filtros
        </button>
      )}
    </div>
  )
}
