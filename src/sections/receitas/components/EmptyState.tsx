import { ChefHat, FilterX } from 'lucide-react'

interface EmptyStateProps {
  variant: 'no-receitas' | 'no-results'
  titulo: string
  descricao: string
  ctaLabel?: string
  onCta?: () => void
  onClearFilters?: () => void
}

export function EmptyState({
  variant,
  titulo,
  descricao,
  ctaLabel,
  onCta,
  onClearFilters,
}: EmptyStateProps) {
  const isNoReceitas = variant === 'no-receitas'
  return (
    <div
      className={`
        flex flex-col items-center justify-center rounded-2xl border px-6 py-16 text-center
        ${isNoReceitas
          ? 'border-teal-200/50 bg-gradient-to-br from-teal-50/50 via-amber-50/30 to-white dark:border-teal-900/40 dark:from-teal-950/20 dark:via-amber-950/10 dark:to-slate-950/40'
          : 'border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900/40'}
      `}
    >
      <div
        className={`
          mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl
          ${isNoReceitas
            ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}
        `}
      >
        {isNoReceitas ? <ChefHat size={28} strokeWidth={1.5} /> : <FilterX size={24} strokeWidth={1.5} />}
      </div>
      <h3
        className={`text-base font-semibold ${
          isNoReceitas ? 'text-teal-900 dark:text-teal-100' : 'text-slate-800 dark:text-slate-200'
        }`}
      >
        {titulo}
      </h3>
      <p
        className={`mt-1.5 max-w-md text-sm ${
          isNoReceitas
            ? 'text-teal-800/80 dark:text-teal-200/70'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {descricao}
      </p>
      {isNoReceitas && ctaLabel && (
        <button
          type="button"
          onClick={onCta}
          className="
            mt-5 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white
            hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
          "
        >
          {ctaLabel}
        </button>
      )}
      {!isNoReceitas && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="
            mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white
            hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
          "
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
