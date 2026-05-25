import { Plus, Search, Dumbbell, ListChecks, Archive } from 'lucide-react'
import type {
  TreinosProps,
  Plano,
} from '@/../product-personal/sections/treinos/types'
import { TabsBar } from './TabsBar'
import { PlanoTemplateCard } from './PlanoTemplateCard'
import { PlanoAtribuidoCard } from './PlanoAtribuidoCard'
import { PlanoArquivadoCard } from './PlanoArquivadoCard'

export function TreinosList({
  planos,
  tabs,
  selectedTab,
  objetivos,
  selectedObjetivo,
  emptyStates,
  searchQuery = '',
  onTabChange,
  onSearchChange,
  onObjetivoChange,
  onCreate,
  onOpenDetail,
  onApplyToAluno,
  onEdit,
  onDuplicate,
  onArchive,
  onUnarchive,
  onMessageAluno,
  onClearFilters,
}: TreinosProps) {
  const filtered: Plano[] = planos.filter((p) => {
    if (selectedTab === 'templates' && p.status !== 'template') return false
    if (selectedTab === 'atribuidos' && p.status !== 'atribuido') return false
    if (selectedTab === 'arquivados' && p.status !== 'arquivado') return false
    if (selectedObjetivo !== 'todos' && p.objetivo !== selectedObjetivo) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !p.nome.toLowerCase().includes(q) &&
        !(p.aluno?.nome.toLowerCase().includes(q) ?? false)
      )
        return false
    }
    return true
  })

  const isFiltered = selectedObjetivo !== 'todos' || searchQuery !== ''
  const isEmpty = filtered.length === 0
  const placeholder =
    selectedTab === 'atribuidos'
      ? 'Buscar por nome ou aluno…'
      : 'Buscar plano por nome…'

  const totalCount = tabs.reduce((sum, t) => sum + t.count, 0)

  return (
    <div
      data-nymos-treinos
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
              Prescrição · Personal
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Treinos
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-mono tabular-nums">{totalCount}</span> plano
              {totalCount === 1 ? '' : 's'} ·{' '}
              {tabs.map((t, i) => (
                <span key={t.id}>
                  <span className="font-mono tabular-nums">{t.count}</span>{' '}
                  {t.label.toLowerCase()}
                  {i < tabs.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          </div>

          <button
            type="button"
            onClick={onCreate}
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
          style={{ animationDelay: '100ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <TabsBar tabs={tabs} selected={selectedTab} onChange={onTabChange} />
        </div>

        {/* Search */}
        <div
          style={{ animationDelay: '180ms' }}
          className="nymos-reveal opacity-0 mt-4"
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
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
        </div>

        {/* Objetivo chips */}
        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-3"
        >
          <div className="flex items-center gap-3">
            <span className="hidden shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 sm:inline">
              Objetivo
            </span>
            <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {objetivos.map((opt) => {
                const active = selectedObjetivo === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onObjetivoChange?.(opt.id)}
                    className={`
                      shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all
                      ${
                        active
                          ? 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:ring-teal-800'
                          : 'text-slate-600 ring-1 ring-inset ring-transparent hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                      }
                    `}
                  >
                    {opt.label}
                    {opt.id !== 'todos' && (
                      <span
                        className={`ml-1 font-mono tabular-nums text-[10px] ${
                          active
                            ? 'text-teal-500 dark:text-teal-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {opt.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Counter */}
        <div
          style={{ animationDelay: '300ms' }}
          className="nymos-reveal opacity-0 mt-5 flex items-center justify-between px-1"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
              {filtered.length}
            </span>{' '}
            {selectedTab === 'templates'
              ? 'template'
              : selectedTab === 'atribuidos'
                ? 'atribuído'
                : 'arquivado'}
            {filtered.length === 1 ? '' : 's'}
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Content */}
        {isEmpty ? (
          <div
            style={{ animationDelay: '380ms' }}
            className="nymos-reveal opacity-0 mt-6"
          >
            <EmptyState
              tab={selectedTab}
              isFiltered={isFiltered}
              emptyStates={
                isFiltered
                  ? {
                      title: emptyStates.noResults.title,
                      description: emptyStates.noResults.description,
                      primaryCta: emptyStates.noResults.primaryCta,
                    }
                  : selectedTab === 'arquivados'
                    ? {
                        title: emptyStates.arquivados.title,
                        description: emptyStates.arquivados.description,
                      }
                    : selectedTab === 'atribuidos'
                      ? emptyStates.atribuidos
                      : emptyStates.templates
              }
              onPrimary={selectedTab === 'atribuidos' ? () => onTabChange?.('templates') : onCreate}
              onSecondary={onClearFilters}
            />
          </div>
        ) : selectedTab === 'arquivados' ? (
          <div
            style={{ animationDelay: '380ms' }}
            className="nymos-reveal opacity-0 mt-4 space-y-2"
          >
            {filtered.map((plano) => (
              <PlanoArquivadoCard
                key={plano.id}
                plano={plano}
                onUnarchive={() => onUnarchive?.(plano.id)}
                onDuplicate={() => onDuplicate?.(plano.id)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{ animationDelay: '380ms' }}
            className="nymos-reveal opacity-0 mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((plano) =>
              plano.status === 'template' ? (
                <PlanoTemplateCard
                  key={plano.id}
                  plano={plano}
                  onApplyToAluno={() => onApplyToAluno?.(plano.id)}
                  onOpenDetail={() => onOpenDetail?.(plano.id)}
                  onEdit={() => onEdit?.(plano.id)}
                  onDuplicate={() => onDuplicate?.(plano.id)}
                  onArchive={() => onArchive?.(plano.id)}
                />
              ) : (
                <PlanoAtribuidoCard
                  key={plano.id}
                  plano={plano}
                  onOpenDetail={() => onOpenDetail?.(plano.id)}
                  onMessageAluno={() => plano.aluno && onMessageAluno?.(plano.aluno.id)}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  tab,
  isFiltered,
  emptyStates,
  onPrimary,
  onSecondary,
}: {
  tab: string
  isFiltered: boolean
  emptyStates: { title: string; description: string; primaryCta?: string }
  onPrimary?: () => void
  onSecondary?: () => void
}) {
  const icon =
    tab === 'arquivados' ? (
      <Archive size={20} />
    ) : tab === 'atribuidos' ? (
      <ListChecks size={20} />
    ) : (
      <Dumbbell size={20} />
    )

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
        {emptyStates.title}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {emptyStates.description}
      </p>
      {emptyStates.primaryCta && (
        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onPrimary}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Plus size={14} strokeWidth={2.5} />
            {emptyStates.primaryCta}
          </button>
          {isFiltered && (
            <button
              type="button"
              onClick={onSecondary}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}
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
      [data-nymos-treinos] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-treinos] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
