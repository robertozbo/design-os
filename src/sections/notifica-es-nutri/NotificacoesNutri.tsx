import { useState } from 'react'
import data from '@/../product/sections/notifica-es-nutri/data.json'
import type {
  EstadoTabId,
  NotificacaoNutri,
  PacienteFiltro,
  PerfilContexto,
  EstadoTab,
  TipoNotificacao,
  TipoOpcao,
  UrgenciaNotificacao,
  UrgenciaOpcao,
  SnoozeDuracao,
  SnoozeOpcao,
} from '@/../product/sections/notifica-es-nutri/types'
import { NotificacoesNutri } from './components/NotificacoesNutri'
import { UndoToast } from './components/UndoToast'

type DataShape = {
  perfilContexto: PerfilContexto
  notificacoes: NotificacaoNutri[]
  pacientesFiltro: PacienteFiltro[]
  tabs: EstadoTab[]
  tiposOpcoes: TipoOpcao[]
  urgenciasOpcoes: UrgenciaOpcao[]
  snoozeOpcoes: SnoozeOpcao[]
}

interface UndoEntry {
  id: number
  message: string
  rollback: () => void
}

export default function NotificacoesNutriPreview() {
  const baseProps = data as unknown as DataShape

  // Live state
  const [notificacoes, setNotificacoes] = useState<NotificacaoNutri[]>(baseProps.notificacoes)
  const [activeTab, setActiveTab] = useState<EstadoTabId>('nao-lidas')
  const [selectedTipos, setSelectedTipos] = useState<TipoNotificacao[]>([])
  const [selectedUrgencias, setSelectedUrgencias] = useState<UrgenciaNotificacao[]>([])
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [undoQueue, setUndoQueue] = useState<UndoEntry[]>([])

  function pushUndo(message: string, rollback: () => void) {
    const id = Date.now() + Math.random()
    setUndoQueue((q) => [...q, { id, message, rollback }])
  }
  function popUndo(id: number) {
    setUndoQueue((q) => q.filter((u) => u.id !== id))
  }

  function clearFilters() {
    setSelectedTipos([])
    setSelectedUrgencias([])
    setSelectedPacienteId(null)
  }

  function patchNotif(id: string, patch: Partial<NotificacaoNutri>) {
    setNotificacoes((list) => list.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }

  function toggleLida(id: string, next: boolean) {
    patchNotif(id, { lida: next })
  }

  function archive(id: string) {
    const before = notificacoes.find((n) => n.id === id)
    if (!before) return
    patchNotif(id, { arquivada: true })
    pushUndo('Notificação arquivada', () => patchNotif(id, { arquivada: before.arquivada }))
  }
  function unarchive(id: string) {
    patchNotif(id, { arquivada: false })
  }

  function snooze(id: string, duracao: SnoozeDuracao) {
    const before = notificacoes.find((n) => n.id === id)
    if (!before) return
    const now = new Date()
    let until = new Date(now)
    if (duracao === '1h') until.setHours(until.getHours() + 1)
    else if (duracao === '3h') until.setHours(until.getHours() + 3)
    else if (duracao === 'amanha') {
      until.setDate(until.getDate() + 1)
      until.setHours(9, 0, 0, 0)
    } else if (duracao === 'proxima-semana') {
      until.setDate(until.getDate() + 7)
      until.setHours(9, 0, 0, 0)
    }
    patchNotif(id, { snoozeAteIso: until.toISOString() })
    pushUndo('Snooze aplicado', () =>
      patchNotif(id, { snoozeAteIso: before.snoozeAteIso }),
    )
  }
  function cancelSnooze(id: string) {
    patchNotif(id, { snoozeAteIso: null })
  }

  function bulkMarkSelectedAsRead() {
    setNotificacoes((list) =>
      list.map((n) => (selectedIds.includes(n.id) ? { ...n, lida: true } : n)),
    )
    setSelectedIds([])
  }

  function bulkArchiveSelected() {
    const before = notificacoes.filter((n) => selectedIds.includes(n.id))
    setNotificacoes((list) =>
      list.map((n) => (selectedIds.includes(n.id) ? { ...n, arquivada: true } : n)),
    )
    const ids = [...selectedIds]
    setSelectedIds([])
    pushUndo(
      `${ids.length} ${ids.length === 1 ? 'notificação arquivada' : 'notificações arquivadas'}`,
      () =>
        setNotificacoes((list) =>
          list.map((n) => {
            const orig = before.find((b) => b.id === n.id)
            return orig ? { ...n, arquivada: orig.arquivada } : n
          }),
        ),
    )
  }

  function markAllAsRead() {
    const visibleIds = notificacoes
      .filter((n) => {
        if (activeTab === 'nao-lidas') return !n.lida && !n.arquivada
        if (activeTab === 'todas') return !n.arquivada
        return n.arquivada
      })
      .filter((n) => !n.lida)
      .map((n) => n.id)
    setNotificacoes((list) =>
      list.map((n) => (visibleIds.includes(n.id) ? { ...n, lida: true } : n)),
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-notif-nutri],
        [data-nymos-notif-nutri] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-notif-nutri] .font-mono,
        [data-nymos-notif-nutri] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      <NotificacoesNutri
        perfilContexto={baseProps.perfilContexto}
        notificacoes={notificacoes}
        pacientesFiltro={baseProps.pacientesFiltro}
        tabs={baseProps.tabs}
        tiposOpcoes={baseProps.tiposOpcoes}
        urgenciasOpcoes={baseProps.urgenciasOpcoes}
        snoozeOpcoes={baseProps.snoozeOpcoes}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedTipos={selectedTipos}
        onTiposChange={setSelectedTipos}
        selectedUrgencias={selectedUrgencias}
        onUrgenciasChange={setSelectedUrgencias}
        selectedPacienteId={selectedPacienteId}
        onPacienteChange={setSelectedPacienteId}
        onClearFilters={clearFilters}
        onOpenOrigem={(n) => console.log('Open origin', n.origemHref)}
        onToggleLida={toggleLida}
        onArquivar={archive}
        onDesarquivar={unarchive}
        onSnooze={snooze}
        onCancelSnooze={cancelSnooze}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onMarcarTodasComoLidas={markAllAsRead}
        onMarcarSelecionadasComoLidas={bulkMarkSelectedAsRead}
        onArquivarSelecionadas={bulkArchiveSelected}
      />

      {undoQueue.length > 0 && (
        <UndoToast
          message={undoQueue[undoQueue.length - 1].message}
          onUndo={() => {
            const last = undoQueue[undoQueue.length - 1]
            last.rollback()
            popUndo(last.id)
          }}
          onClose={() => popUndo(undoQueue[undoQueue.length - 1].id)}
        />
      )}
    </>
  )
}
