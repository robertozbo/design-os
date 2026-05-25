import {
  ChevronDown,
  Plus,
  Search,
  Users,
  CheckSquare,
  PauseCircle,
  AlertTriangle,
  Archive,
} from 'lucide-react'
import type {
  AlunosProps,
  ObjetivoFiltroId,
  SortId,
  TabId,
} from '@/../product-personal/sections/alunos/types'
import { KpisStripAlunos } from './KpisStripAlunos'
import { AlunoTableRow } from './AlunoTableRow'

const TAB_ICONS: Record<TabId, React.ElementType> = {
  'em-plano': CheckSquare,
  pausados: PauseCircle,
  'sem-plano': Users,
  'em-risco': AlertTriangle,
  arquivados: Archive,
}

export function AlunosList({
  alunos,
  tabs,
  selectedTab,
  objetivos,
  selectedObjetivo,
  sortOptions,
  selectedSort,
  kpis,
  emptyStates,
  searchQuery = '',
  onTabChange,
  onSearchChange,
  onObjetivoChange,
  onSortChange,
  onCreate,
  onOpenFicha,
  onMessage,
  onApplyTemplate,
  onNovaAvaliacao,
  onPausar,
  onDespausar,
  onArquivar,
  onRestaurar,
  onClearFilters,
}: AlunosProps) {
  const filtered = alunos.filter((a) => {
    // Tab filter
    if (selectedTab === 'em-plano' && a.status !== 'em-plano') return false
    if (selectedTab === 'pausados' && a.status !== 'pausado') return false
    if (selectedTab === 'sem-plano' && a.status !== 'sem-plano') return false
    if (selectedTab === 'em-risco' && a.riscos.length === 0) return false
    if (selectedTab === 'arquivados' && a.status !== 'arquivado') return false

    // Objetivo filter
    if (selectedObjetivo !== 'todos' && a.objetivo !== selectedObjetivo) return false

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !a.nome.toLowerCase().includes(q) &&
        !a.email.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (selectedSort === 'nome-asc') return a.nome.localeCompare(b.nome)
    if (selectedSort === 'recentes')
      return b.inicioVinculoData.localeCompare(a.inicioVinculoData)
    if (selectedSort === 'adesao-desc')
      return (b.adesao?.percentual ?? -1) - (a.adesao?.percentual ?? -1)
    if (selectedSort === 'adesao-asc')
      return (a.adesao?.percentual ?? 999) - (b.adesao?.percentual ?? 999)
    if (selectedSort === 'ultima-sessao')
      return (b.ultimaSessaoData ?? '').localeCompare(a.ultimaSessaoData ?? '')
    return 0
  })

  const isFiltered =
    selectedObjetivo !== 'todos' || searchQuery !== ''
  const isEmpty = sorted.length === 0
  const totalAlunos = alunos.length

  return (
    <div
      data-nymos-alunos
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
              Carteira · Personal
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Alunos
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-mono tabular-nums">{totalAlunos}</span> aluno
              {totalAlunos === 1 ? '' : 's'} cadastrad
              {totalAlunos === 1 ? 'o' : 'os'}
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
            Novo aluno
          </button>
        </header>

        {/* KPIs */}
        <div
          style={{ animationDelay: '100ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <KpisStripAlunos kpis={kpis} />
        </div>

        {/* Tabs */}
        <div
          style={{ animationDelay: '180ms' }}
          className="nymos-reveal opacity-0 mt-6 border-b border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-0 overflow-x-auto">
            {tabs.map((t) => {
              const Icon = TAB_ICONS[t.id]
              const active = selectedTab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange?.(t.id)}
                  className={`
                    relative inline-flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors
                    ${
                      active
                        ? 'text-slate-900 dark:text-slate-50'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }
                  `}
                >
                  <Icon size={13} />
                  {t.label}
                  <span
                    className={`font-mono tabular-nums text-[10px] ${
                      active
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {t.count}
                  </span>
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 bg-teal-500 dark:bg-teal-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Search + filters */}
        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Buscar por nome ou email…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedObjetivo}
              onChange={(v) => onObjetivoChange?.(v as ObjetivoFiltroId)}
              options={objetivos.map((o) => ({ id: o.id, label: o.label }))}
            />
            <Select
              value={selectedSort}
              onChange={(v) => onSortChange?.(v as SortId)}
              options={sortOptions.map((s) => ({ id: s.id, label: s.label }))}
            />
          </div>
        </div>

        {/* Counter */}
        <div
          style={{ animationDelay: '300ms' }}
          className="nymos-reveal opacity-0 mt-5 flex items-center justify-between px-1"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
              {sorted.length}
            </span>{' '}
            aluno{sorted.length === 1 ? '' : 's'}
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

        {/* Table */}
        {isEmpty ? (
          <div
            style={{ animationDelay: '380ms' }}
            className="nymos-reveal opacity-0 mt-6"
          >
            <EmptyState
              tab={selectedTab}
              empty={emptyForTab(selectedTab, emptyStates, isFiltered)}
              onPrimary={onCreate}
            />
          </div>
        ) : (
          <article
            style={{ animationDelay: '380ms' }}
            className="nymos-reveal opacity-0 mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Header row */}
            <div
              style={{
                gridTemplateColumns:
                  'minmax(0, 2.4fr) minmax(0, 2fr) minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
              }}
              className="grid gap-4 border-b border-slate-100 bg-slate-50/60 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400"
            >
              <div className="pl-[3px]">Aluno</div>
              <div>Plano</div>
              <div>Adesão</div>
              <div>Última</div>
              <div>Próxima</div>
              <div>Status</div>
              <div className="text-right">Ações</div>
            </div>
            {/* Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sorted.map((aluno) => (
                <AlunoTableRow
                  key={aluno.id}
                  aluno={aluno}
                  onOpenFicha={() => onOpenFicha?.(aluno.id)}
                  onMessage={() => onMessage?.(aluno.id)}
                  onApplyTemplate={() => onApplyTemplate?.(aluno.id)}
                  onNovaAvaliacao={() => onNovaAvaliacao?.(aluno.id)}
                  onPausar={() => onPausar?.(aluno.id)}
                  onDespausar={() => onDespausar?.(aluno.id)}
                  onArquivar={() => onArquivar?.(aluno.id)}
                  onRestaurar={() => onRestaurar?.(aluno.id)}
                />
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

function emptyForTab(
  tab: TabId,
  emptyStates: AlunosProps['emptyStates'],
  isFiltered: boolean,
): { title: string; description: string; primaryCta?: string } {
  if (isFiltered) return emptyStates.noResults
  if (tab === 'em-plano') return emptyStates.emPlano
  if (tab === 'pausados') return emptyStates.pausados
  if (tab === 'sem-plano') return emptyStates.semPlano
  if (tab === 'em-risco') return emptyStates.emRisco
  return emptyStates.arquivados
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string
  options: { id: string; label: string }[]
  onChange?: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs font-medium text-slate-700 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-teal-600"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />
    </div>
  )
}

function EmptyState({
  tab,
  empty,
  onPrimary,
}: {
  tab: TabId
  empty: { title: string; description: string; primaryCta?: string }
  onPrimary?: () => void
}) {
  const Icon = TAB_ICONS[tab]
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-14 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
        {empty.title}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {empty.description}
      </p>
      {empty.primaryCta && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onPrimary}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Plus size={14} strokeWidth={2.5} />
            {empty.primaryCta}
          </button>
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
      [data-nymos-alunos] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-alunos] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
