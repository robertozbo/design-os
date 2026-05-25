import { Plus, Search, ServerCrash } from 'lucide-react'
import type { PlanosListProps } from '@/../product/sections/planos-alimentares/types'
import { PlanoCard } from './PlanoCard'
import { PlanosFiltersBar } from './PlanosFiltersBar'
import type { SectionTab } from './SectionTabs'
import { SectionTabs } from './SectionTabs'

interface Props extends PlanosListProps {
  planosCountForTabs: number
  templatesCountForTabs: number
  activeTab: SectionTab
  onTabChange: (tab: SectionTab) => void
}

export function PlanosList({
  planos,
  patients,
  filters,
  selectedFilter,
  selectedSort,
  sortOptions,
  stats,
  emptyStates,
  objetivoOptions,
  searchQuery = '',
  onSearchChange,
  onFilterChange,
  onSortChange,
  onOpenCreate,
  onOpenPlano,
  onToggleFavorite,
  onClearFilters,
  planosCountForTabs,
  templatesCountForTabs,
  activeTab,
  onTabChange,
}: Props) {
  const totalCount = stats.total
  const filteredCount = planos.length
  const isFiltered = selectedFilter !== 'todos' || searchQuery !== ''
  const hasAnyPlans = stats.total > 0
  const showEmpty = filteredCount === 0

  const patientsById = Object.fromEntries(patients.map((p) => [p.id, p]))

  return (
    <div
      data-nymos-planos
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
              Acompanhamento
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Planos alimentares
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-mono tabular-nums">{stats.total}</span> plano{stats.total === 1 ? '' : 's'} ·{' '}
              <span className="font-mono tabular-nums">{stats.vigente}</span> vigente{stats.vigente === 1 ? '' : 's'} ·{' '}
              <span className="font-mono tabular-nums">{stats.rascunho}</span> rascunho{stats.rascunho === 1 ? '' : 's'}
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
            Novo plano
          </button>
        </header>

        {/* Tabs */}
        <div
          style={{ animationDelay: '60ms' }}
          className="nymos-reveal opacity-0 mt-5"
        >
          <SectionTabs
            active={activeTab}
            planosCount={planosCountForTabs}
            templatesCount={templatesCountForTabs}
            onChange={onTabChange}
          />
        </div>

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
              placeholder="Buscar por plano ou paciente…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
        </div>

        {/* Filters */}
        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-4"
        >
          <PlanosFiltersBar
            filters={filters}
            selectedFilter={selectedFilter}
            onFilterChange={onFilterChange}
            sortOptions={sortOptions}
            selectedSort={selectedSort}
            onSortChange={onSortChange}
          />
        </div>

        {/* Counter */}
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
                plano{filteredCount === 1 ? '' : 's'}
              </>
            )}
          </p>
        </div>

        {/* Grid / empty */}
        {hasAnyPlans ? (
          showEmpty ? (
            <div
              style={{ animationDelay: '420ms' }}
              className="nymos-reveal opacity-0 mt-6"
            >
              <EmptyState
                empty={emptyStates.noResults}
                onCta={onClearFilters}
                kind="noResults"
              />
            </div>
          ) : (
            <div
              style={{ animationDelay: '420ms' }}
              className="nymos-reveal opacity-0 mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {planos.map((plano) => (
                <PlanoCard
                  key={plano.id}
                  plano={plano}
                  patient={patientsById[plano.patientId]}
                  objetivoOptions={objetivoOptions}
                  onClick={() => onOpenPlano?.(plano.id)}
                  onToggleFavorite={() => onToggleFavorite?.(plano.id)}
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
              empty={emptyStates.noPlans}
              onCta={onOpenCreate}
              kind="noPlans"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  empty,
  onCta,
  kind,
}: {
  empty: { title: string; description: string; ctaLabel: string }
  onCta?: () => void
  kind: 'noPlans' | 'noResults'
}) {
  const Icon = kind === 'noPlans' ? Plus : ServerCrash
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
        {kind === 'noPlans' && <Plus size={14} strokeWidth={2.5} />}
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
      [data-nymos-planos] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-planos] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
