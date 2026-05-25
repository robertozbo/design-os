import { useMemo, useState } from 'react'
import type {
  InboxTab,
  NotificacoesSSTProps,
  Notification,
  NotificationType,
  NotificationUrgency,
  SnoozeDuration,
} from '@/../product/sections/notifica-es-sst/types'
import { InboxHeader } from './InboxHeader'
import { FilterStrip } from './FilterStrip'
import { NotificationCard } from './NotificationCard'
import { BulkActionBar } from './BulkActionBar'
import { EmptyState } from './EmptyState'
import { UndoToast } from './UndoToast'

interface ToastState {
  message: string
  onUndo: () => void
}

export function NotificacoesSst({
  notifications,
  employers,
  summary,
  onMarkRead,
  onMarkUnread,
  onMarkAllRead,
  onArchive,
  onUnarchive,
  onSnooze,
  onUnsnooze,
  onBulkMarkRead,
  onBulkArchive,
  onOpenSource,
  onUndoLastAction,
}: NotificacoesSSTProps) {
  const [tab, setTab] = useState<InboxTab>('unread')
  const [typeFilters, setTypeFilters] = useState<NotificationType[]>([])
  const [urgencyFilters, setUrgencyFilters] = useState<NotificationUrgency[]>([])
  const [employerFilter, setEmployerFilter] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<ToastState | null>(null)

  const employersById = useMemo(
    () => Object.fromEntries(employers.map((e) => [e.id, e])),
    [employers],
  )

  const tabCounts: Record<InboxTab, number> = useMemo(() => ({
    unread: notifications.filter((n) => !n.read && !n.archived).length,
    all: notifications.filter((n) => !n.archived).length,
    archived: notifications.filter((n) => n.archived).length,
  }), [notifications])

  const visible = useMemo(() => {
    return notifications.filter((n) => {
      if (tab === 'unread' && (n.read || n.archived)) return false
      if (tab === 'all' && n.archived) return false
      if (tab === 'archived' && !n.archived) return false
      if (typeFilters.length > 0 && !typeFilters.includes(n.type)) return false
      if (urgencyFilters.length > 0 && !urgencyFilters.includes(n.urgency)) return false
      if (employerFilter && n.employerId !== employerFilter) return false
      return true
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [notifications, tab, typeFilters, urgencyFilters, employerFilter])

  const hasActiveFilters =
    typeFilters.length > 0 || urgencyFilters.length > 0 || employerFilter !== null

  const showToast = (message: string) => {
    setToast({
      message,
      onUndo: () => {
        onUndoLastAction?.()
        setToast(null)
      },
    })
    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current))
    }, 5000)
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleClearSelection() {
    setSelectedIds(new Set())
  }

  function handleBulkMarkRead() {
    const ids = Array.from(selectedIds)
    onBulkMarkRead?.(ids)
    showToast(`${ids.length} ${ids.length === 1 ? 'notificação marcada como lida' : 'notificações marcadas como lidas'}`)
    handleClearSelection()
  }

  function handleBulkArchive() {
    const ids = Array.from(selectedIds)
    onBulkArchive?.(ids)
    showToast(`${ids.length} ${ids.length === 1 ? 'notificação arquivada' : 'notificações arquivadas'}`)
    handleClearSelection()
  }

  function handleArchive(n: Notification) {
    onArchive?.(n.id)
    showToast('Notificação arquivada')
  }

  function handleSnooze(n: Notification, duration: SnoozeDuration) {
    onSnooze?.(n.id, duration)
    showToast('Notificação adiada')
  }

  function handleClearFilters() {
    setTypeFilters([])
    setUrgencyFilters([])
    setEmployerFilter(null)
  }

  const emptyVariant = (() => {
    if (visible.length > 0) return null
    if (hasActiveFilters) return 'filtered-empty' as const
    if (tab === 'archived') return 'archived-empty' as const
    return 'inbox-clear' as const
  })()

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white dark:from-slate-900 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
        <InboxHeader
          summary={summary}
          hasUnread={tabCounts.unread > 0}
          onMarkAllRead={() => {
            onMarkAllRead?.()
            showToast(`${tabCounts.unread} ${tabCounts.unread === 1 ? 'notificação marcada como lida' : 'notificações marcadas como lidas'}`)
          }}
        />

        <div className="mt-6">
          <FilterStrip
            tab={tab}
            tabCounts={tabCounts}
            typeFilters={typeFilters}
            urgencyFilters={urgencyFilters}
            employerFilter={employerFilter}
            employers={employers}
            hasActiveFilters={hasActiveFilters}
            onChangeTab={(t) => { setTab(t); handleClearSelection() }}
            onToggleType={(t) =>
              setTypeFilters((prev) =>
                prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
              )
            }
            onToggleUrgency={(u) =>
              setUrgencyFilters((prev) =>
                prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u],
              )
            }
            onChangeEmployer={setEmployerFilter}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="mt-6">
          {emptyVariant ? (
            <EmptyState
              variant={emptyVariant}
              onAction={
                emptyVariant === 'filtered-empty'
                  ? handleClearFilters
                  : emptyVariant === 'inbox-clear'
                    ? () => setTab('archived')
                    : undefined
              }
              actionLabel={
                emptyVariant === 'filtered-empty'
                  ? 'Limpar filtros'
                  : emptyVariant === 'inbox-clear'
                    ? 'Ver arquivadas'
                    : undefined
              }
            />
          ) : (
            <ol className="flex flex-col gap-2">
              {visible.map((n, i) => (
                <li
                  key={n.id}
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                  className="opacity-0 animate-[reveal_500ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
                >
                  <NotificationCard
                    notification={n}
                    employer={employersById[n.employerId]}
                    selected={selectedIds.has(n.id)}
                    onToggleSelect={() => handleToggleSelect(n.id)}
                    onMarkRead={() => onMarkRead?.(n.id)}
                    onMarkUnread={() => onMarkUnread?.(n.id)}
                    onArchive={() => handleArchive(n)}
                    onUnarchive={() => onUnarchive?.(n.id)}
                    onSnooze={(d) => handleSnooze(n, d)}
                    onUnsnooze={() => onUnsnooze?.(n.id)}
                    onOpenSource={() => onOpenSource?.(n)}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {selectedIds.size > 0 && (
        <BulkActionBar
          count={selectedIds.size}
          onMarkRead={handleBulkMarkRead}
          onArchive={handleBulkArchive}
          onClear={handleClearSelection}
        />
      )}

      {toast && <UndoToast message={toast.message} onUndo={toast.onUndo} />}

      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-["],
          .animate-in { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  )
}
