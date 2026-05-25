import { ArrowDownUp, LayoutTemplate, Plus, Search, ServerCrash } from 'lucide-react'
import type {
  TemplatesListProps,
} from '@/../product/sections/planos-alimentares/types'
import type { SectionTab } from './SectionTabs'
import { SectionTabs } from './SectionTabs'
import { TemplateCard } from './TemplateCard'

interface Props extends TemplatesListProps {
  /** Tab toggle data — passes through. */
  planosCount: number
  templatesCountForTabs: number
  activeTab: SectionTab
  onTabChange: (tab: SectionTab) => void
  /** Empty states. */
  emptyTitle?: string
  emptyDescription?: string
  emptyCtaLabel?: string
  noResultsTitle?: string
  noResultsDescription?: string
  noResultsCtaLabel?: string
}

export function TemplatesList({
  templates,
  objetivoFilters,
  selectedObjetivoFilter,
  selectedSort,
  sortOptions,
  stats,
  objetivoOptions,
  searchQuery = '',
  onSearchChange,
  onObjetivoFilterChange,
  onSortChange,
  onToggleFavorite,
  onOpenCreate,
  onOpenTemplate,
  onApplyTemplate,
  planosCount,
  templatesCountForTabs,
  activeTab,
  onTabChange,
  emptyTitle = 'Nenhum template ainda',
  emptyDescription = 'Crie templates dos planos que você usa muito — depois aplica em qualquer paciente em 2 cliques.',
  emptyCtaLabel = 'Criar primeiro template',
  noResultsTitle = 'Nenhum template encontrado',
  noResultsDescription = 'Ajuste o filtro ou crie um novo template.',
  noResultsCtaLabel = 'Limpar filtros',
}: Props) {
  const totalCount = stats.total
  const filteredCount = templates.length
  const isFiltered = selectedObjetivoFilter !== 'todos' || searchQuery !== ''
  const showEmpty = filteredCount === 0
  const hasAny = totalCount > 0
  const currentSortLabel = sortOptions.find((s) => s.id === selectedSort)?.label ?? 'Ordenar'

  return (
    <div
      data-nymos-templates
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
              <span className="font-mono tabular-nums">{stats.total}</span> template{stats.total === 1 ? '' : 's'}
              {' · '}
              <span className="font-mono tabular-nums">{stats.favoritos}</span> favorito{stats.favoritos === 1 ? '' : 's'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreate}
            className="
              inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all
              hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md
              dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
            "
          >
            <Plus size={16} strokeWidth={2.5} />
            Novo template
          </button>
        </header>

        {/* Tabs */}
        <div
          style={{ animationDelay: '60ms' }}
          className="nymos-reveal opacity-0 mt-5"
        >
          <SectionTabs
            active={activeTab}
            planosCount={planosCount}
            templatesCount={templatesCountForTabs}
            onChange={onTabChange}
          />
        </div>

        {/* Search */}
        <div
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-5"
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
              placeholder="Buscar template por nome ou descrição…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
        </div>

        {/* Filters: objetivo pills + sort */}
        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1.5 sm:flex-wrap sm:overflow-visible sm:py-0">
            {objetivoFilters.map((f) => {
              const active = f.id === selectedObjetivoFilter
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onObjetivoFilterChange?.(f.id)}
                  className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  {f.label}
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      active
                        ? 'text-slate-300 dark:text-slate-500'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative inline-flex shrink-0">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange?.(e.target.value as typeof selectedSort)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-8 text-sm font-medium text-slate-700 ring-0 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-teal-600"
              aria-label="Ordenar lista"
            >
              {sortOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ArrowDownUp
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              ▾
            </span>
            <span className="sr-only">{currentSortLabel}</span>
          </div>
        </div>

        {/* Counter */}
        <div
          style={{ animationDelay: '320ms' }}
          className="nymos-reveal opacity-0 mt-5 px-1"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isFiltered ? (
              <>
                Mostrando{' '}
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">{filteredCount}</span>
                {' '}de <span className="font-mono tabular-nums">{totalCount}</span>
              </>
            ) : (
              <>
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">{filteredCount}</span>
                {' '}template{filteredCount === 1 ? '' : 's'}
              </>
            )}
          </p>
        </div>

        {/* Grid / empty */}
        {hasAny ? (
          showEmpty ? (
            <div
              style={{ animationDelay: '420ms' }}
              className="nymos-reveal opacity-0 mt-6"
            >
              <EmptyState
                icon={<ServerCrash size={20} />}
                title={noResultsTitle}
                description={noResultsDescription}
                ctaLabel={noResultsCtaLabel}
                onCta={() => onObjetivoFilterChange?.('todos')}
              />
            </div>
          ) : (
            <div
              style={{ animationDelay: '420ms' }}
              className="nymos-reveal opacity-0 mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  objetivoOptions={objetivoOptions}
                  onClick={() => onOpenTemplate?.(template.id)}
                  onApply={() => onApplyTemplate?.(template.id)}
                  onToggleFavorite={() => onToggleFavorite?.(template.id)}
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
              icon={<LayoutTemplate size={20} />}
              title={emptyTitle}
              description={emptyDescription}
              ctaLabel={emptyCtaLabel}
              onCta={onOpenCreate}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCta,
}: {
  icon: React.ReactNode
  title: string
  description: string
  ctaLabel: string
  onCta?: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      <button
        type="button"
        onClick={onCta}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
      >
        <Plus size={14} strokeWidth={2.5} />
        {ctaLabel}
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
      [data-nymos-templates] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-templates] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
