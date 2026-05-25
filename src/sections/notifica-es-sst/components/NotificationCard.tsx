import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Archive,
  ArchiveRestore,
  BellOff,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react'
import type {
  Employer,
  Notification,
  SnoozeDuration,
} from '@/../product/sections/notifica-es-sst/types'
import {
  TYPE_META,
  URGENCY_TONE,
  SNOOZE_OPTIONS,
  formatRelativo,
  formatAbsoluto,
  snoozeUntilLabel,
} from './utils'

interface NotificationCardProps {
  notification: Notification
  employer?: Employer
  selected: boolean
  onToggleSelect?: () => void
  onMarkRead?: () => void
  onMarkUnread?: () => void
  onArchive?: () => void
  onUnarchive?: () => void
  onSnooze?: (duration: SnoozeDuration) => void
  onUnsnooze?: () => void
  onOpenSource?: () => void
}

export function NotificationCard({
  notification,
  employer,
  selected,
  onToggleSelect,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onUnarchive,
  onSnooze,
  onUnsnooze,
  onOpenSource,
}: NotificationCardProps) {
  const tone = URGENCY_TONE[notification.urgency]
  const meta = TYPE_META[notification.type]
  const Icon = meta.icon
  const [snoozeOpen, setSnoozeOpen] = useState(false)
  const snoozeRef = useRef<HTMLDivElement>(null)
  const isUnread = !notification.read
  const isSnoozed = !!notification.snoozedUntil

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (snoozeRef.current && !snoozeRef.current.contains(e.target as Node)) {
        setSnoozeOpen(false)
      }
    }
    if (snoozeOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [snoozeOpen])

  return (
    <article
      className={`
        group relative
        rounded-xl
        bg-white dark:bg-slate-900
        ring-1 ring-slate-200 dark:ring-slate-800
        ${selected ? 'ring-teal-400 dark:ring-teal-500 ring-2' : ''}
        ${isSnoozed ? 'opacity-70' : ''}
        transition-all duration-200
        hover:ring-slate-300 dark:hover:ring-slate-700
        hover:shadow-sm hover:shadow-slate-900/5 dark:hover:shadow-black/30
        focus-within:ring-teal-400 dark:focus-within:ring-teal-500
      `}
    >
      <span
        className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${tone.rail} transition-opacity ${isUnread ? 'opacity-100' : 'opacity-40'}`}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3 sm:gap-4 pl-4 pr-3 py-3.5">
        <label className="shrink-0 mt-0.5 inline-flex cursor-pointer">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="
              h-4 w-4 rounded
              border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-800
              text-teal-600 dark:text-teal-500
              focus:ring-2 focus:ring-teal-500 focus:ring-offset-0
              cursor-pointer
            "
            aria-label={`Selecionar notificação: ${notification.title}`}
          />
        </label>

        <div
          className={`
            shrink-0 w-9 h-9 rounded-lg
            flex items-center justify-center
            ring-1 ${tone.iconBg} ${tone.ring}
          `}
          aria-hidden="true"
        >
          <Icon className={`w-4 h-4 ${tone.iconText}`} strokeWidth={1.75} />
        </div>

        <button
          type="button"
          onClick={onOpenSource}
          className="min-w-0 flex-1 text-left focus:outline-none"
          aria-label={`Abrir origem: ${notification.source.label}`}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            {isUnread && (
              <span className="inline-flex w-1.5 h-1.5 rounded-full bg-sky-500" aria-label="Não lida" />
            )}
            <span className={`
              inline-flex items-center gap-1
              px-1.5 py-0.5 rounded-md
              text-[10px] uppercase tracking-[0.14em] font-semibold
              ${tone.badgeBg} ${tone.badgeText}
            `}>
              {tone.label}
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-400 dark:text-slate-500">
              {meta.label}
            </span>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
            <time
              className="text-[11px] text-slate-500 dark:text-slate-500 tabular-nums"
              title={formatAbsoluto(notification.timestamp)}
              dateTime={notification.timestamp}
            >
              {formatRelativo(notification.timestamp)}
            </time>
            {isSnoozed && notification.snoozedUntil && (
              <span className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200 dark:ring-violet-900/60">
                <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
                {snoozeUntilLabel(notification.snoozedUntil)}
              </span>
            )}
          </div>

          <h3
            className={`
              text-sm leading-snug
              ${isUnread
                ? 'font-semibold text-slate-900 dark:text-slate-50'
                : 'font-medium text-slate-700 dark:text-slate-300'}
            `}
          >
            {notification.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {employer?.razaoSocial ?? 'Empregador desconhecido'}
            </span>
            {employer && (
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                {employer.cnpj}
              </span>
            )}
          </div>

          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-1 group-hover:line-clamp-none transition-all">
            {notification.description}
          </p>

          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {notification.source.label}
            <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
          </div>
        </button>

        <div
          className="
            shrink-0 flex items-center gap-1
            opacity-0 translate-x-1
            group-hover:opacity-100 group-hover:translate-x-0
            focus-within:opacity-100 focus-within:translate-x-0
            transition-all duration-200
          "
        >
          <IconAction
            icon={isUnread ? Eye : EyeOff}
            label={isUnread ? 'Marcar como lida' : 'Marcar como não-lida'}
            onClick={isUnread ? onMarkRead : onMarkUnread}
          />

          {!notification.archived && (
            <div ref={snoozeRef} className="relative">
              <IconAction
                icon={isSnoozed ? BellOff : Clock}
                label={isSnoozed ? 'Cancelar snooze' : 'Adiar'}
                onClick={() => isSnoozed ? onUnsnooze?.() : setSnoozeOpen((s) => !s)}
              />
              {snoozeOpen && !isSnoozed && (
                <div
                  role="menu"
                  className="
                    absolute right-0 top-full mt-1.5 z-20
                    min-w-[160px] py-1
                    bg-white dark:bg-slate-900
                    rounded-lg ring-1 ring-slate-200 dark:ring-slate-700
                    shadow-lg shadow-slate-900/5 dark:shadow-black/40
                    animate-in fade-in slide-in-from-top-1 duration-150
                  "
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-500">
                    Lembrar em
                  </div>
                  {SNOOZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      role="menuitem"
                      type="button"
                      onClick={() => { onSnooze?.(opt.value); setSnoozeOpen(false) }}
                      className="
                        w-full px-3 py-1.5 text-left text-xs
                        text-slate-700 dark:text-slate-300
                        hover:bg-violet-50 dark:hover:bg-violet-950/40
                        hover:text-violet-700 dark:hover:text-violet-300
                        transition-colors duration-100
                      "
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <IconAction
            icon={notification.archived ? ArchiveRestore : Archive}
            label={notification.archived ? 'Restaurar' : 'Arquivar'}
            onClick={notification.archived ? onUnarchive : onArchive}
          />
        </div>
      </div>
    </article>
  )
}

interface IconActionProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  onClick?: () => void
}

function IconAction({ icon: Icon, label, onClick }: IconActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="
        inline-flex items-center justify-center
        w-8 h-8 rounded-md
        text-slate-500 dark:text-slate-400
        hover:bg-slate-100 dark:hover:bg-slate-800
        hover:text-slate-900 dark:hover:text-slate-100
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
        transition-colors duration-100
      "
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
    </button>
  )
}
