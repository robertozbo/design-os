import { Plus, Search, ChevronDown, Activity, Users } from 'lucide-react'
import type {
  AvaliacoesProps,
  PeriodoId,
  SortId,
} from '@/../product-personal/sections/avaliacoes/types'
import { AvaliacaoCard } from './AvaliacaoCard'

export function AvaliacoesList({
  avaliacoes,
  tipos,
  selectedTipo,
  periodos,
  selectedPeriodo,
  sortOptions,
  selectedSort,
  stats,
  emptyStates,
  searchQuery = '',
  onSearchChange,
  onTipoChange,
  onPeriodoChange,
  onSortChange,
  onCreate,
  onOpenDetail,
  onClearFilters,
}: AvaliacoesProps) {
  // Local-side filtering
  const filtered = avaliacoes.filter((a) => {
    if (selectedTipo === 'antropometria' && !a.antropometria) return false
    if (selectedTipo === 'funcional' && !a.funcional) return false
    if (selectedTipo === 'completas' && (!a.antropometria || !a.funcional)) return false
    if (searchQuery && !a.aluno.nome.toLowerCase().includes(searchQuery.toLowerCase()))
      return false
    if (selectedPeriodo !== 'todas') {
      const days = selectedPeriodo === '30d' ? 30 : selectedPeriodo === '90d' ? 90 : 365
      const diff = (Date.now() - new Date(a.data).getTime()) / (1000 * 60 * 60 * 24)
      if (diff > days) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (selectedSort === 'antigas') return a.data.localeCompare(b.data)
    if (selectedSort === 'por-aluno') return a.aluno.nome.localeCompare(b.aluno.nome)
    return b.data.localeCompare(a.data)
  })

  const isFiltered =
    selectedTipo !== 'todas' || selectedPeriodo !== 'todas' || searchQuery !== ''
  const isEmpty = sorted.length === 0

  return (
    <div
      data-nymos-avaliacoes
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
              Histórico · Triagem
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Histórico de avaliações
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Visão geral de todas as avaliações da carteira ·{' '}
              <span className="font-mono tabular-nums">{stats.total}</span> avaliaç
              {stats.total === 1 ? 'ão' : 'ões'} ·{' '}
              <span className="font-mono tabular-nums">{stats.alunosAvaliados}</span>{' '}
              aluno{stats.alunosAvaliados === 1 ? '' : 's'} avaliados.{' '}
              <span className="text-slate-500 dark:text-slate-500">
                Click num card pra abrir na ficha do aluno.
              </span>
            </p>
          </div>

          {/* Banner de criação fica na ficha do aluno — não tem botão aqui */}
          {onCreate && (
            <button
              type="button"
              onClick={onCreate}
              className="hidden"
              aria-hidden
            />
          )}
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
              placeholder="Buscar por aluno…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-teal-600"
            />
          </div>
        </div>

        {/* Filters: tipo pills + periodo + sort */}
        <div
          style={{ animationDelay: '220ms' }}
          className="nymos-reveal opacity-0 mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Tipo pills */}
          <div className="flex flex-wrap gap-1.5">
            {tipos.map((t) => {
              const active = selectedTipo === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTipoChange?.(t.id)}
                  className={`
                    inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all
                    ${
                      active
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <span>{t.label}</span>
                  <span
                    className={`font-mono tabular-nums text-[10px] ${
                      active
                        ? 'text-white/70 dark:text-slate-900/70'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Period + sort */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedPeriodo}
              onChange={(v) => onPeriodoChange?.(v as PeriodoId)}
              options={periodos.map((p) => ({ id: p.id, label: p.label }))}
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
          style={{ animationDelay: '280ms' }}
          className="nymos-reveal opacity-0 mt-5 flex items-center justify-between px-1"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isFiltered ? (
              <>
                Mostrando{' '}
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
                  {sorted.length}
                </span>{' '}
                de <span className="font-mono tabular-nums">{stats.total}</span>
              </>
            ) : (
              <>
                <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
                  {sorted.length}
                </span>{' '}
                avaliaç{sorted.length === 1 ? 'ão' : 'ões'}
              </>
            )}
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

        {/* Grid / empty */}
        {isEmpty ? (
          <div
            style={{ animationDelay: '380ms' }}
            className="nymos-reveal opacity-0 mt-6"
          >
            <EmptyState
              empty={isFiltered ? emptyStates.noResults : emptyStates.noAvaliacoes}
              onPrimary={onCreate}
              onSecondary={isFiltered ? onClearFilters : undefined}
            />
          </div>
        ) : (
          <div
            style={{ animationDelay: '380ms' }}
            className="nymos-reveal opacity-0 mt-4 grid gap-3 sm:grid-cols-2"
          >
            {sorted.map((avaliacao) => (
              <AvaliacaoCard
                key={avaliacao.id}
                avaliacao={avaliacao}
                onOpenDetail={() => onOpenDetail?.(avaliacao.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
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
  empty,
  onPrimary,
  onSecondary,
}: {
  empty: { title: string; description: string; primaryCta: string }
  onPrimary?: () => void
  onSecondary?: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
        {onSecondary ? <Users size={20} /> : <Activity size={20} />}
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
        {onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Limpar filtros
          </button>
        )}
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
      [data-nymos-avaliacoes] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-avaliacoes] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
