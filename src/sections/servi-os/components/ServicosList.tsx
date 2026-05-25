import { Plus, Search, ServerCrash } from 'lucide-react'
import type { ServicosProps } from '@/../product/sections/servi-os/types'
import { ServicoCard } from './ServicoCard'
import { ServicoFiltersBar } from './ServicoFiltersBar'

export function ServicosList({
  servicos,
  filterTypes,
  selectedFilterType,
  selectedSort,
  sortOptions,
  stats,
  emptyStates,
  searchQuery = '',
  onSearchChange,
  onFilterTypeChange,
  onSortChange,
  onOpenCreate,
  onOpenEdit,
  onDuplicate,
  onRequestDelete,
  onClearFilters,
}: ServicosProps) {
  const totalCount = filterTypes.find((f) => f.id === 'todos')?.count ?? servicos.length
  const filteredCount = servicos.length
  const isFiltered = selectedFilterType !== 'todos' || searchQuery !== ''
  const hasAnyServicos = stats.total > 0
  const showEmpty = filteredCount === 0

  return (
    <div
      data-nymos-servicos
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
              Catálogo
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Serviços
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-mono tabular-nums">{stats.total}</span> serviço
              {stats.total === 1 ? '' : 's'} cadastrado{stats.total === 1 ? '' : 's'} ·{' '}
              <span className="font-mono tabular-nums">R$ {stats.averagePrice}</span> ticket médio
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
            Novo serviço
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
              placeholder="Buscar por nome ou descrição…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
        </div>

        {/* Filters + sort */}
        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-4"
        >
          <ServicoFiltersBar
            filterTypes={filterTypes}
            selectedFilterType={selectedFilterType}
            onFilterTypeChange={onFilterTypeChange}
            sortOptions={sortOptions}
            selectedSort={selectedSort}
            onSortChange={onSortChange}
          />
        </div>

        {/* Result count */}
        <div
          style={{ animationDelay: '320ms' }}
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
                serviço{filteredCount === 1 ? '' : 's'}
              </>
            )}
          </p>
        </div>

        {/* Grid / empty */}
        {hasAnyServicos ? (
          showEmpty ? (
            <div
              style={{ animationDelay: '420ms' }}
              className="nymos-reveal opacity-0 mt-6"
            >
              <EmptyState
                kind="noResults"
                empty={emptyStates.noResults}
                onCta={onClearFilters}
              />
            </div>
          ) : (
            <div
              style={{ animationDelay: '420ms' }}
              className="nymos-reveal opacity-0 mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {servicos.map((servico) => (
                <ServicoCard
                  key={servico.id}
                  servico={servico}
                  onEdit={() => onOpenEdit?.(servico.id)}
                  onDuplicate={() => onDuplicate?.(servico.id)}
                  onRequestDelete={() => onRequestDelete?.(servico.id)}
                />
              ))}
            </div>
          )
        ) : (
          <div
            style={{ animationDelay: '420ms' }}
            className="nymos-reveal opacity-0 mt-6"
          >
            <EmptyState
              kind="noServices"
              empty={emptyStates.noServices}
              onCta={onOpenCreate}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  kind,
  empty,
  onCta,
}: {
  kind: 'noServices' | 'noResults'
  empty: { title: string; description: string; ctaLabel: string }
  onCta?: () => void
}) {
  const Icon = kind === 'noServices' ? Plus : ServerCrash
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
        {empty.title}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {empty.description}
      </p>
      <button
        type="button"
        onClick={onCta}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
      >
        {kind === 'noServices' && <Plus size={14} strokeWidth={2.5} />}
        {empty.ctaLabel}
      </button>
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
      [data-nymos-servicos] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-servicos] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
