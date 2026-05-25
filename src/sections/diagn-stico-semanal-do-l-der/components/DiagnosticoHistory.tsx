import { useEffect, useMemo, useState } from 'react'
import { ClipboardList, FileX2, History as HistoryIcon, Plus } from 'lucide-react'
import type {
  DiagnosisHistoryEntry,
  DiagnosticoHistoryProps,
  HistoryPeriod,
} from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { DiagnosticoHistoryFilters } from './DiagnosticoHistoryFilters'
import { DiagnosticoHistoryCard } from './DiagnosticoHistoryCard'

function periodToRange(period: HistoryPeriod): { from: Date | null; to: Date | null } {
  const now = new Date()
  if (period === 'all') return { from: null, to: null }
  if (period === 'this-month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1)
    return { from, to: now }
  }
  if (period === 'last-quarter') {
    const from = new Date(now)
    from.setMonth(from.getMonth() - 3)
    return { from, to: now }
  }
  if (period === 'last-year') {
    const from = new Date(now)
    from.setFullYear(from.getFullYear() - 1)
    return { from, to: now }
  }
  return { from: null, to: null }
}

function isWithin(entry: DiagnosisHistoryEntry, range: { from: Date | null; to: Date | null }): boolean {
  if (!range.from && !range.to) return true
  const t = new Date(entry.registeredAt).getTime()
  if (range.from && t < range.from.getTime()) return false
  if (range.to && t > range.to.getTime()) return false
  return true
}

function matchesSearch(entry: DiagnosisHistoryEntry, query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    entry.observation.toLowerCase().includes(q) ||
    entry.action.toLowerCase().includes(q) ||
    entry.weekLabel.toLowerCase().includes(q)
  )
}

function groupByMonth(entries: DiagnosisHistoryEntry[]): Array<{ key: string; label: string; items: DiagnosisHistoryEntry[] }> {
  const map = new Map<string, { label: string; items: DiagnosisHistoryEntry[] }>()
  for (const entry of entries) {
    const date = new Date(entry.registeredAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    if (!map.has(key)) {
      map.set(key, { label, items: [] })
    }
    map.get(key)!.items.push(entry)
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, { label, items }]) => ({ key, label, items }))
}

export function DiagnosticoHistory({
  team,
  diagnosisHistory,
  archivedDiagnoses,
  onOpenDiagnosisDetail,
  onFilterHistory,
  onSearchHistory,
  onStartDiagnosis,
}: DiagnosticoHistoryProps) {
  const [activePeriod, setActivePeriod] = useState<HistoryPeriod>('all')
  const [search, setSearch] = useState('')

  const allEntries = useMemo(() => {
    const combined = [...diagnosisHistory, ...archivedDiagnoses]
    return combined.sort(
      (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    )
  }, [diagnosisHistory, archivedDiagnoses])

  const range = useMemo(() => periodToRange(activePeriod), [activePeriod])

  const filtered = useMemo(() => {
    return allEntries.filter((e) => isWithin(e, range) && matchesSearch(e, search))
  }, [allEntries, range, search])

  const grouped = useMemo(() => groupByMonth(filtered), [filtered])

  useEffect(() => {
    if (range.from || range.to) {
      onFilterHistory?.({
        from: range.from ? range.from.toISOString().slice(0, 10) : '',
        to: range.to ? range.to.toISOString().slice(0, 10) : '',
      })
    }
  }, [range, onFilterHistory])

  useEffect(() => {
    if (search) onSearchHistory?.(search)
  }, [search, onSearchHistory])

  const totalCount = allEntries.length
  const filteredCount = filtered.length

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />
      <BackgroundGlow />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header
          style={{ animationDelay: '60ms' }}
          className="nymos-reveal opacity-0 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8"
        >
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200/70 dark:border-violet-900/60 text-[10px] font-mono uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
              <HistoryIcon className="w-3 h-3" strokeWidth={2.25} />
              NR-1 · Histórico do diagnóstico
            </div>
            <h1 className="mt-3 text-3xl sm:text-[34px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.05]">
              Histórico de diagnósticos
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Linha do tempo dos diagnósticos semanais registrados em{' '}
              <span className="text-slate-700 dark:text-slate-300 font-medium">{team.sectorName}</span>.
              Cada registro vira evidência da NR-1 e fundamenta o plano de ação.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur">
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-slate-500 dark:text-slate-400">
                Total registrado
              </div>
              <div className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {totalCount} {totalCount === 1 ? 'diagnóstico' : 'diagnósticos'}
              </div>
            </div>

            <button
              type="button"
              onClick={onStartDiagnosis}
              className="
                group inline-flex items-center justify-center gap-2
                px-4 py-2.5 rounded-xl
                bg-slate-900 text-white dark:bg-teal-500 dark:text-slate-950
                font-semibold text-sm tracking-tight
                shadow-[0_12px_28px_-12px_rgba(15,23,42,0.45)] dark:shadow-[0_12px_28px_-12px_rgba(20,184,166,0.55)]
                hover:bg-slate-800 dark:hover:bg-teal-400
                active:scale-[0.98] transition
              "
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Novo diagnóstico
            </button>
          </div>
        </header>

        <DiagnosticoHistoryFilters
          activePeriod={activePeriod}
          onChangePeriod={setActivePeriod}
          search={search}
          onChangeSearch={setSearch}
          totalCount={totalCount}
          filteredCount={filteredCount}
        />

        <div className="mt-7">
          {filtered.length === 0 ? (
            <EmptyState
              isFiltered={search.trim() !== '' || activePeriod !== 'all'}
              onClear={() => {
                setActivePeriod('all')
                setSearch('')
              }}
              onStartDiagnosis={onStartDiagnosis}
            />
          ) : (
            <div className="space-y-9">
              {grouped.map((group) => (
                <section key={group.key}>
                  <header className="flex items-center gap-3 mb-4">
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {group.label}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent" />
                    <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-600">
                      {group.items.length} {group.items.length === 1 ? 'reg.' : 'regs.'}
                    </span>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((entry, i) => (
                      <DiagnosticoHistoryCard
                        key={entry.id}
                        diagnosis={entry}
                        index={i}
                        isFirst={entry.id === allEntries[0]?.id}
                        onOpen={() => onOpenDiagnosisDetail?.(entry.id)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  isFiltered,
  onClear,
  onStartDiagnosis,
}: {
  isFiltered: boolean
  onClear: () => void
  onStartDiagnosis?: () => void
}) {
  if (isFiltered) {
    return (
      <div
        style={{ animationDelay: '260ms' }}
        className="
          nymos-reveal opacity-0
          flex flex-col items-center text-center px-6 py-16
          rounded-2xl border border-dashed border-slate-200 dark:border-slate-800
          bg-white/60 dark:bg-slate-900/30
        "
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <FileX2 className="w-5 h-5" strokeWidth={2} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Nenhum diagnóstico encontrado
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Tente outro período ou termo de busca para encontrar o registro que você procura.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition"
        >
          Limpar filtros
        </button>
      </div>
    )
  }

  return (
    <div
      style={{ animationDelay: '260ms' }}
      className="
        nymos-reveal opacity-0
        flex flex-col items-center text-center px-6 py-20
        rounded-2xl border border-dashed border-teal-200 dark:border-teal-900/60
        bg-teal-50/40 dark:bg-teal-950/20
      "
    >
      <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-[0_14px_28px_-12px_rgba(20,184,166,0.55)]">
        <ClipboardList className="w-6 h-6" strokeWidth={2.25} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-50">
        Você ainda não registrou nenhum diagnóstico
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
        O diagnóstico semanal é exigido pela NR-1. Cada registro vira evidência do acompanhamento contínuo do líder.
      </p>
      <button
        type="button"
        onClick={onStartDiagnosis}
        className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-semibold transition"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Registrar primeiro diagnóstico
      </button>
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-violet-200/40 dark:bg-violet-950/30 blur-3xl" />
      <div className="absolute -top-16 left-[20%] w-[420px] h-[420px] rounded-full bg-teal-200/30 dark:bg-teal-900/20 blur-3xl" />
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
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
