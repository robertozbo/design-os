import {
  ChevronDown,
  Plus,
  Search,
  Sparkles,
  UserPlus,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
} from 'lucide-react'
import type {
  IndicacoesProps,
  SortId,
  TabId,
} from '@/../product-personal/sections/indicacoes/types'
import { KpisStripIndicacoes } from './KpisStripIndicacoes'
import { ConviteCard } from './ConviteCard'
import { CANAL_STYLE } from './helpers'

const TAB_ICONS: Record<TabId, React.ElementType> = {
  pendentes: Send,
  aceitos: CheckCircle2,
  expirados: Clock,
  cancelados: XCircle,
}

export function IndicacoesList({
  convites,
  kpis,
  tabs,
  selectedTab,
  canais,
  selectedCanal,
  sortOptions,
  selectedSort,
  emptyStates,
  planoPersonal,
  searchQuery = '',
  onTabChange,
  onSearchChange,
  onCanalChange,
  onSortChange,
  onCreate,
  onReenviar,
  onCopiarLink,
  onMostrarQR,
  onCancelar,
  onExcluir,
  onRestaurar,
  onOpenFichaAluno,
  onUpgrade,
  onClearFilters,
}: IndicacoesProps) {
  const filtered = convites.filter((c) => {
    // Tab filter
    if (selectedTab === 'pendentes' && c.status !== 'pendente') return false
    if (selectedTab === 'aceitos' && c.status !== 'aceito') return false
    if (selectedTab === 'expirados' && c.status !== 'expirado') return false
    if (selectedTab === 'cancelados' && c.status !== 'cancelado') return false

    if (selectedCanal !== 'todos' && c.canal !== selectedCanal) return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!c.nome.toLowerCase().includes(q)) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (selectedSort === 'antigos') return a.enviadoEm.localeCompare(b.enviadoEm)
    if (selectedSort === 'expira-em-breve') {
      if (a.status !== 'pendente' || b.status !== 'pendente') return 0
      return a.expiraEm.localeCompare(b.expiraEm)
    }
    return b.enviadoEm.localeCompare(a.enviadoEm)
  })

  const isFiltered = selectedCanal !== 'todos' || searchQuery !== ''
  const isEmpty = sorted.length === 0
  const showFreeBanner = planoPersonal === 'free'

  return (
    <div
      data-nymos-indicacoes
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Free banner */}
        {showFreeBanner && (
          <div
            style={{ animationDelay: '0ms' }}
            className="nymos-reveal opacity-0 mb-6 flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-900/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-amber-900 dark:text-amber-200">
                  Indicações é uma feature Plus
                </p>
                <p className="mt-0.5 text-[11px] text-amber-800 dark:text-amber-300">
                  Convide alunos pra baixar o app e acompanhar o treino —
                  R$49,90/mês.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onUpgrade}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
            >
              Upgrade Plus
            </button>
          </div>
        )}

        {/* Header */}
        <header
          style={{ animationDelay: '60ms' }}
          className="nymos-reveal opacity-0 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Convites · App
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Indicações
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Convide alunos pra baixar o app Nymos e vincular ao seu
              acompanhamento. Eles registram treinos, recebem mensagens e veem a
              evolução pelo celular.
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
            Novo convite
          </button>
        </header>

        {/* KPIs */}
        <div
          style={{ animationDelay: '140ms' }}
          className="nymos-reveal opacity-0 mt-6"
        >
          <KpisStripIndicacoes kpis={kpis} />
        </div>

        {/* Tabs */}
        <div
          style={{ animationDelay: '220ms' }}
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
          style={{ animationDelay: '280ms' }}
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
              placeholder="Buscar por nome…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {canais.map((c) => {
              const active = selectedCanal === c.id
              const ChipIcon = c.id !== 'todos' ? CANAL_STYLE[c.id].icon : null
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onCanalChange?.(c.id)}
                  className={`
                    inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all
                    ${
                      active
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {ChipIcon && <ChipIcon size={11} />}
                  {c.label}
                  <span
                    className={`font-mono tabular-nums text-[10px] ${
                      active
                        ? 'text-white/70 dark:text-slate-900/70'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {c.count}
                  </span>
                </button>
              )
            })}
          </div>
          <Select
            value={selectedSort}
            onChange={(v) => onSortChange?.(v as SortId)}
            options={sortOptions.map((s) => ({ id: s.id, label: s.label }))}
          />
        </div>

        {/* Counter */}
        <div
          style={{ animationDelay: '340ms' }}
          className="nymos-reveal opacity-0 mt-5 flex items-center justify-between px-1"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
              {sorted.length}
            </span>{' '}
            convite{sorted.length === 1 ? '' : 's'}
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

        {/* Cards */}
        {isEmpty ? (
          <div
            style={{ animationDelay: '400ms' }}
            className="nymos-reveal opacity-0 mt-6"
          >
            <EmptyState
              tab={selectedTab}
              empty={emptyForTab(selectedTab, emptyStates, isFiltered)}
              onPrimary={onCreate}
            />
          </div>
        ) : (
          <div
            style={{ animationDelay: '400ms' }}
            className="nymos-reveal opacity-0 mt-4 grid gap-3 lg:grid-cols-2"
          >
            {sorted.map((convite) => (
              <ConviteCard
                key={convite.id}
                convite={convite}
                onReenviar={() => onReenviar?.(convite.id)}
                onCopiarLink={() => onCopiarLink?.(convite.id)}
                onMostrarQR={() => onMostrarQR?.(convite.id)}
                onCancelar={() => onCancelar?.(convite.id)}
                onExcluir={() => onExcluir?.(convite.id)}
                onRestaurar={() => onRestaurar?.(convite.id)}
                onOpenFichaAluno={() =>
                  convite.alunoId && onOpenFichaAluno?.(convite.alunoId)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function emptyForTab(
  tab: TabId,
  emptyStates: IndicacoesProps['emptyStates'],
  isFiltered: boolean,
) {
  if (isFiltered) return emptyStates.noResults
  if (tab === 'pendentes') return emptyStates.pendentes
  if (tab === 'aceitos') return emptyStates.aceitos
  if (tab === 'expirados') return emptyStates.expirados
  return emptyStates.cancelados
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
  const Icon = TAB_ICONS[tab] ?? UserPlus
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
      [data-nymos-indicacoes] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-indicacoes] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
