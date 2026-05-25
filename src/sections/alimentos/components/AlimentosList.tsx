import { Plus, Search, ServerCrash } from 'lucide-react'
import type {
  AlimentosProps,
  CategoryId,
} from '@/../product/sections/alimentos/types'
import { AlimentoCard } from './AlimentoCard'
import { AlimentosFiltersBar } from './AlimentosFiltersBar'
import { CategoryChips } from './CategoryChips'

export function AlimentosList({
  alimentos,
  categories,
  selectedCategory,
  sources,
  selectedSource,
  sortOptions,
  selectedSort,
  stats,
  emptyStates,
  searchQuery = '',
  onSearchChange,
  onSourceChange,
  onCategoryChange,
  onSortChange,
  onToggleFavorite,
  onOpenDetail,
  onOpenCreate,
  onClearFilters,
}: AlimentosProps) {
  const totalCount = stats.total
  const filteredCount = alimentos.length
  const isFiltered =
    selectedSource !== 'todos' || selectedCategory !== 'todas' || searchQuery !== ''
  const showEmpty = filteredCount === 0

  // Build category label map for cards
  const categoryLabels = Object.fromEntries(
    categories
      .filter((c) => c.id !== 'todas')
      .map((c) => [c.id, c.label]),
  ) as Record<CategoryId, string>

  return (
    <div
      data-nymos-alimentos
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header
          style={{ animationDelay: '0ms' }}
          className="nymos-reveal opacity-0 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Base nutricional
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Alimentos
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-mono tabular-nums">{stats.total}</span> alimento
              {stats.total === 1 ? '' : 's'} ·{' '}
              <span className="font-mono tabular-nums">{stats.tbca}</span> TBCA ·{' '}
              <span className="font-mono tabular-nums">{stats.custom}</span> customizado
              {stats.custom === 1 ? '' : 's'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreate}
            className="
              group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all
              hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md
              dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
            "
          >
            <Plus size={16} strokeWidth={2.5} />
            Novo customizado
          </button>
        </header>

        {/* Search */}
        <div
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Buscar alimento por nome…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
        </div>

        {/* Filters: source + sort */}
        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-4"
        >
          <AlimentosFiltersBar
            sources={sources}
            selectedSource={selectedSource}
            onSourceChange={onSourceChange}
            sortOptions={sortOptions}
            selectedSort={selectedSort}
            onSortChange={onSortChange}
          />
        </div>

        {/* Filters: category chips */}
        <div
          style={{ animationDelay: '320ms' }}
          className="nymos-reveal opacity-0 mt-3"
        >
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>

        {/* Counter */}
        <div
          style={{ animationDelay: '380ms' }}
          className="nymos-reveal opacity-0 mt-5 flex items-center justify-between px-1"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isFiltered ? (
              <>
                Mostrando{' '}
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
                  {filteredCount}
                </span>{' '}
                de <span className="font-mono tabular-nums">{totalCount}</span>
              </>
            ) : (
              <>
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
                  {filteredCount}
                </span>{' '}
                alimento{filteredCount === 1 ? '' : 's'}
              </>
            )}
          </p>
        </div>

        {/* Grid / empty */}
        {showEmpty ? (
          <div
            style={{ animationDelay: '460ms' }}
            className="nymos-reveal opacity-0 mt-6"
          >
            <EmptyState
              empty={emptyStates.noResults}
              onPrimary={onOpenCreate}
              onSecondary={onClearFilters}
            />
          </div>
        ) : (
          <div
            style={{ animationDelay: '460ms' }}
            className="nymos-reveal opacity-0 mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {alimentos.map((alimento) => (
              <AlimentoCard
                key={alimento.id}
                alimento={alimento}
                categoryLabel={categoryLabels[alimento.category] ?? alimento.category}
                onClick={() => onOpenDetail?.(alimento.id)}
                onToggleFavorite={() => onToggleFavorite?.(alimento.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  empty,
  onPrimary,
  onSecondary,
}: {
  empty: { title: string; description: string; primaryCta: string; secondaryCta: string }
  onPrimary?: () => void
  onSecondary?: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
        <ServerCrash size={20} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
        {empty.title}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {empty.description}
      </p>
      <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onPrimary}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus size={14} strokeWidth={2.5} />
          {empty.primaryCta}
        </button>
        <button
          type="button"
          onClick={onSecondary}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {empty.secondaryCta}
        </button>
      </div>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      [data-nymos-alimentos] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-alimentos] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
