import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import type {
  IndicacoesProps,
  Convite,
} from '@/../product/sections/indica-es/types'
import { StatsRow } from './StatsRow'
import { FilterStrip } from './FilterStrip'
import { ConviteRow } from './ConviteRow'
import { StuckBanner } from './StuckBanner'
import { EmptyState } from './EmptyState'
import { diffDays } from './utils'

export function Indicacoes({
  perfilContexto,
  estatistica,
  filtrosEstado,
  canaisEnvio: _canaisEnvio,
  convites,
  emptyStates,

  selectedEstado = 'todos',
  onEstadoChange,
  searchQuery = '',
  onSearchChange,
  selectedSort = 'recent',
  sortOptions = [
    { id: 'recent', label: 'Mais recentes' },
    { id: 'name-asc', label: 'Nome A-Z' },
    { id: 'wait-desc', label: 'Tempo aguardando' },
  ],
  onSortChange,

  onOpenNewInvite,
  onResend,
  onCopyLink,
  onShowQr,
  onCancel,
  onOpenPaciente,
  onResendAllStuck,
}: IndicacoesProps) {
  // Live counts per state, factoring in search but ignoring active state filter
  const liveCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    function matchesSearch(c: Convite): boolean {
      if (!q) return true
      return (
        c.paciente.nome.toLowerCase().includes(q) ||
        c.paciente.email.toLowerCase().includes(q) ||
        c.paciente.telefone.toLowerCase().includes(q) ||
        c.codigo.toLowerCase().includes(q)
      )
    }
    const filtered = convites.filter(matchesSearch)
    return {
      todos: filtered.length,
      pendente: filtered.filter((c) => c.estado === 'pendente').length,
      vinculado: filtered.filter((c) => c.estado === 'vinculado').length,
      expirado: filtered.filter((c) => c.estado === 'expirado').length,
      cancelado: filtered.filter((c) => c.estado === 'cancelado').length,
    } as Record<string, number>
  }, [convites, searchQuery])

  const liveFiltros = filtrosEstado.map((f) => ({
    ...f,
    count: liveCounts[f.id] ?? 0,
  }))

  // Visible list (state + search + sort)
  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let out = convites.filter((c) => {
      if (selectedEstado !== 'todos' && c.estado !== selectedEstado) return false
      if (!q) return true
      return (
        c.paciente.nome.toLowerCase().includes(q) ||
        c.paciente.email.toLowerCase().includes(q) ||
        c.paciente.telefone.toLowerCase().includes(q) ||
        c.codigo.toLowerCase().includes(q)
      )
    })

    switch (selectedSort) {
      case 'name-asc':
        out = [...out].sort((a, b) => a.paciente.nome.localeCompare(b.paciente.nome, 'pt-BR'))
        break
      case 'wait-desc':
        out = [...out].sort((a, b) => a.enviadoIso.localeCompare(b.enviadoIso))
        break
      case 'recent':
      default:
        out = [...out].sort((a, b) => b.ultimaInteracaoIso.localeCompare(a.ultimaInteracaoIso))
    }
    return out
  }, [convites, selectedEstado, selectedSort, searchQuery])

  const pendentesParados = useMemo(
    () =>
      convites.filter(
        (c) => c.estado === 'pendente' && diffDays(c.enviadoIso) >= 7,
      ).length,
    [convites],
  )

  const isFiltering = selectedEstado !== 'todos' || !!searchQuery.trim()

  function showStuckList() {
    onEstadoChange?.('pendente')
    onSortChange?.('wait-desc')
  }

  // Empty states
  function renderEmpty() {
    if (visible.length > 0) return null
    if (convites.length === 0) {
      return (
        <EmptyState
          variant="no-invites"
          titulo={emptyStates.noInvites.titulo}
          descricao={emptyStates.noInvites.descricao}
          ctaLabel={emptyStates.noInvites.ctaLabel}
          onCta={onOpenNewInvite}
        />
      )
    }
    return (
      <EmptyState
        variant="no-results"
        titulo={emptyStates.noResults.titulo}
        descricao={emptyStates.noResults.descricao}
        onClearFilters={() => {
          onEstadoChange?.('todos')
          onSearchChange?.('')
        }}
      />
    )
  }

  return (
    <div
      data-nymos-indicacoes="true"
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="nymos-reveal flex flex-col gap-3 opacity-0 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                Conta · Indicações
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Convites de pacientes
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Convide seus pacientes para vincular o app · {perfilContexto.nome}
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={onOpenNewInvite}
              className="
                inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white
                hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
              "
            >
              <Plus size={14} /> Novo convite
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="nymos-reveal mt-6 opacity-0" style={{ animationDelay: '120ms' }}>
          <StatsRow stats={estatistica} onShowStuck={showStuckList} />
        </div>

        {/* Stuck banner */}
        {pendentesParados >= 3 && (
          <div className="nymos-reveal mt-4 opacity-0" style={{ animationDelay: '160ms' }}>
            <StuckBanner
              count={pendentesParados}
              onResendAll={onResendAllStuck}
              onShowList={showStuckList}
            />
          </div>
        )}

        {/* Filter strip */}
        <div className="nymos-reveal mt-5 opacity-0" style={{ animationDelay: '200ms' }}>
          <FilterStrip
            filtros={liveFiltros}
            selectedEstado={selectedEstado}
            onEstadoChange={(id) => onEstadoChange?.(id)}
            searchQuery={searchQuery}
            onSearchChange={(q) => onSearchChange?.(q)}
            selectedSort={selectedSort}
            sortOptions={sortOptions}
            onSortChange={(s) => onSortChange?.(s)}
          />
        </div>

        {/* List */}
        <div className="nymos-reveal mt-5 opacity-0" style={{ animationDelay: '240ms' }}>
          {visible.length === 0 ? (
            renderEmpty()
          ) : (
            <>
              <header className="mb-2 flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider tabular-nums text-slate-500 dark:text-slate-500">
                  {visible.length} {visible.length === 1 ? 'convite' : 'convites'}
                  {isFiltering && ' (filtrados)'}
                </span>
              </header>
              <ul className="space-y-2">
                {visible.map((c) => (
                  <ConviteRow
                    key={c.id}
                    convite={c}
                    onResend={() => onResend?.(c.id)}
                    onCopyLink={() => onCopyLink?.(c.id)}
                    onShowQr={() => onShowQr?.(c.id)}
                    onCancel={() => onCancel?.(c.id)}
                    onOpenPaciente={() => onOpenPaciente?.(c.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
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
