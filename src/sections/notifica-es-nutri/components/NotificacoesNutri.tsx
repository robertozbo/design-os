import { useMemo } from 'react'
import type {
  EstadoTabId,
  NotificacaoNutri,
  NotificacoesNutriProps,
  PacienteFiltro,
} from '@/../product/sections/notifica-es-nutri/types'
import { InboxHeader } from './InboxHeader'
import { FilterStrip } from './FilterStrip'
import { NotificationCard } from './NotificationCard'
import { EmptyState } from './EmptyState'
import { BulkActionBar } from './BulkActionBar'

export function NotificacoesNutri({
  perfilContexto,
  notificacoes,
  pacientesFiltro,
  tabs,
  tiposOpcoes,
  urgenciasOpcoes,
  snoozeOpcoes,

  activeTab = 'nao-lidas',
  onTabChange,

  selectedTipos = [],
  onTiposChange,
  selectedUrgencias = [],
  onUrgenciasChange,
  selectedPacienteId = null,
  onPacienteChange,
  onClearFilters,

  onOpenOrigem,
  onToggleLida,
  onArquivar,
  onDesarquivar,
  onSnooze,
  onCancelSnooze,

  selectedIds = [],
  onSelectionChange,
  onMarcarTodasComoLidas,
  onMarcarSelecionadasComoLidas,
  onArquivarSelecionadas,
}: NotificacoesNutriProps) {
  const pacienteById = useMemo(
    () => Object.fromEntries(pacientesFiltro.map((p) => [p.id, p])),
    [pacientesFiltro],
  ) as Record<string, PacienteFiltro>

  // Counts per tab (independent of filters)
  const tabCounts = useMemo<Record<EstadoTabId, number>>(() => {
    return {
      'nao-lidas': notificacoes.filter((n) => !n.lida && !n.arquivada).length,
      todas: notificacoes.filter((n) => !n.arquivada).length,
      arquivadas: notificacoes.filter((n) => n.arquivada).length,
    }
  }, [notificacoes])

  const countCriticas = useMemo(
    () => notificacoes.filter((n) => !n.arquivada && n.urgencia === 'critica').length,
    [notificacoes],
  )
  const countAltas = useMemo(
    () => notificacoes.filter((n) => !n.arquivada && n.urgencia === 'alta').length,
    [notificacoes],
  )
  const countNaoLidas = tabCounts['nao-lidas']

  // Visible list = tab + filters
  const visible = useMemo(() => {
    return notificacoes
      .filter((n) => {
        if (activeTab === 'nao-lidas') return !n.lida && !n.arquivada
        if (activeTab === 'todas') return !n.arquivada
        return n.arquivada
      })
      .filter((n) => selectedTipos.length === 0 || selectedTipos.includes(n.tipo))
      .filter((n) => selectedUrgencias.length === 0 || selectedUrgencias.includes(n.urgencia))
      .filter((n) => !selectedPacienteId || n.pacienteId === selectedPacienteId)
      .sort((a, b) => b.timestampIso.localeCompare(a.timestampIso))
  }, [notificacoes, activeTab, selectedTipos, selectedUrgencias, selectedPacienteId])

  const hasActiveFilters =
    selectedTipos.length > 0 || selectedUrgencias.length > 0 || selectedPacienteId !== null

  const isFiltering = hasActiveFilters

  function setSelected(id: string, next: boolean) {
    const cur = new Set(selectedIds)
    if (next) cur.add(id)
    else cur.delete(id)
    onSelectionChange?.(Array.from(cur))
  }

  // Decide which empty-state variant
  function renderEmpty() {
    if (visible.length > 0) return null
    if (isFiltering) {
      return <EmptyState variant="no-matches" onClearFilters={onClearFilters} />
    }
    if (activeTab === 'arquivadas') {
      return <EmptyState variant="empty-archived" />
    }
    return (
      <EmptyState
        variant="all-clear"
        onSeeArchived={() => onTabChange?.('arquivadas')}
      />
    )
  }

  return (
    <div
      data-nymos-notif-nutri="true"
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <div className="nymos-reveal opacity-0">
          <InboxHeader
            perfilNome={perfilContexto.nome}
            countCriticas={countCriticas}
            countAltas={countAltas}
            countNaoLidas={countNaoLidas}
            showMarkAllAsRead={
              activeTab !== 'arquivadas' &&
              visible.some((n) => !n.lida)
            }
            onMarkAllAsRead={onMarcarTodasComoLidas}
          />
        </div>

        <div
          className="nymos-reveal mt-6 opacity-0"
          style={{ animationDelay: '120ms' }}
        >
          <FilterStrip
            tabs={tabs}
            tabCounts={tabCounts}
            activeTab={activeTab}
            onTabChange={(id) => onTabChange?.(id)}
            tiposOpcoes={tiposOpcoes}
            selectedTipos={selectedTipos}
            onTiposChange={(t) => onTiposChange?.(t)}
            urgenciasOpcoes={urgenciasOpcoes}
            selectedUrgencias={selectedUrgencias}
            onUrgenciasChange={(u) => onUrgenciasChange?.(u)}
            pacientes={pacientesFiltro}
            selectedPacienteId={selectedPacienteId}
            onPacienteChange={(id) => onPacienteChange?.(id)}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={() => onClearFilters?.()}
          />
        </div>

        <div
          className="nymos-reveal mt-5 opacity-0"
          style={{ animationDelay: '180ms' }}
        >
          {visible.length === 0 ? (
            renderEmpty()
          ) : (
            <ul className="space-y-2">
              {visible.map((n) => (
                <NotificationCard
                  key={n.id}
                  notif={n}
                  paciente={pacienteById[n.pacienteId]}
                  selected={selectedIds.includes(n.id)}
                  onSelectChange={(next) => setSelected(n.id, next)}
                  onOpen={() => onOpenOrigem?.(n)}
                  onToggleLida={() => onToggleLida?.(n.id, !n.lida)}
                  onArchive={() => onArquivar?.(n.id)}
                  onUnarchive={() => onDesarquivar?.(n.id)}
                  onSnooze={(d) => onSnooze?.(n.id, d)}
                  onCancelSnooze={() => onCancelSnooze?.(n.id)}
                  snoozeOpcoes={snoozeOpcoes}
                />
              ))}
            </ul>
          )}
        </div>

        <BulkActionBar
          selectedCount={selectedIds.length}
          hideMarkAsRead={activeTab === 'arquivadas'}
          onMarkAsRead={onMarcarSelecionadasComoLidas}
          onArchive={onArquivarSelecionadas}
          onClear={() => onSelectionChange?.([])}
        />
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

// Note: NotificacaoNutri import preserved for IDE hints in subcomponents.
export type { NotificacaoNutri }
