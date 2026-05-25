import { useState } from 'react'
import {
  CalendarClock,
  MessageSquare,
  TrendingDown,
  RefreshCcw,
  UserPlus,
  Cake,
  NotebookPen,
  FlaskConical,
  Clock,
  Check,
  Archive,
  ChevronRight,
  MoreHorizontal,
  Mail,
} from 'lucide-react'
import type {
  NotificacaoNutri,
  PacienteFiltro,
  SnoozeDuracao,
  SnoozeOpcao,
  TipoNotificacao,
} from '@/../product/sections/notifica-es-nutri/types'
import { AVATAR_COLOR_CLASS, formatAbsolute, formatRelative, formatSnoozeUntil, URGENCY_TONE } from './utils'

const TIPO_ICON: Record<TipoNotificacao, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  'lembrete-consulta': CalendarClock,
  'mensagem-paciente': MessageSquare,
  'adesao-baixa': TrendingDown,
  'prazo-revisao-plano': RefreshCcw,
  'novo-paciente-vinculou': UserPlus,
  'aniversario-paciente': Cake,
  'diario-inativo': NotebookPen,
  'exame-chegou': FlaskConical,
}

interface NotificationCardProps {
  notif: NotificacaoNutri
  paciente: PacienteFiltro | undefined
  selected: boolean
  onSelectChange: (next: boolean) => void
  onOpen: () => void
  onToggleLida: () => void
  onArchive: () => void
  onUnarchive: () => void
  onSnooze: (duracao: SnoozeDuracao) => void
  onCancelSnooze: () => void
  snoozeOpcoes: SnoozeOpcao[]
}

export function NotificationCard({
  notif,
  paciente,
  selected,
  onSelectChange,
  onOpen,
  onToggleLida,
  onArchive,
  onUnarchive,
  onSnooze,
  onCancelSnooze,
  snoozeOpcoes,
}: NotificationCardProps) {
  const [snoozeMenuOpen, setSnoozeMenuOpen] = useState(false)
  const tone = URGENCY_TONE[notif.urgencia]
  const Icon = TIPO_ICON[notif.tipo]
  const isSnoozed = !!notif.snoozeAteIso
  const isArchived = notif.arquivada

  return (
    <li
      className={`
        group relative flex items-start gap-3 rounded-xl border px-3 py-3 transition
        ${selected
          ? 'border-teal-300 bg-teal-50/50 dark:border-teal-700 dark:bg-teal-950/30'
          : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900/60'}
      `}
    >
      {/* Urgency stripe */}
      <span
        className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r ${tone.stripeBg}`}
        aria-hidden
      />

      {/* Checkbox */}
      <label className="flex shrink-0 items-center pt-1">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectChange(e.target.checked)}
          aria-label="Selecionar notificação"
          className="
            h-4 w-4 cursor-pointer rounded border-slate-300 text-teal-600
            focus:ring-2 focus:ring-teal-400/30 focus:ring-offset-0
            dark:border-slate-600 dark:bg-slate-800
          "
        />
      </label>

      {/* Type icon */}
      <span
        className={`
          mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          ${tone.iconBg} ${tone.iconText}
        `}
      >
        <Icon size={16} strokeWidth={1.75} />
      </span>

      {/* Body */}
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 cursor-pointer text-left"
      >
        <div className="flex items-start gap-2">
          {!notif.lida && !isArchived && (
            <span
              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500"
              aria-label="Não lida"
            />
          )}
          <p
            className={`text-sm leading-snug ${
              notif.lida || isArchived
                ? 'font-medium text-slate-700 dark:text-slate-300'
                : 'font-semibold text-slate-900 dark:text-slate-50'
            }`}
          >
            {notif.titulo}
          </p>
          <span
            className={`
              ml-auto inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px]
              font-semibold uppercase tracking-[0.12em] ring-1 ${tone.badgeBg} ${tone.badgeText} ${tone.badgeRing}
            `}
          >
            {tone.label}
          </span>
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-slate-600 dark:text-slate-400">
          {notif.descricao}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {paciente && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`
                  inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold
                  ${AVATAR_COLOR_CLASS[paciente.corAvatar] ?? AVATAR_COLOR_CLASS.slate}
                `}
              >
                {paciente.iniciais}
              </span>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                {paciente.nome}
              </span>
            </span>
          )}
          <span
            className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500"
            title={formatAbsolute(notif.timestampIso)}
          >
            · {formatRelative(notif.timestampIso)}
          </span>
          {isSnoozed && (
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-violet-200/60 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60">
              <Clock size={10} />
              Lembrar {formatSnoozeUntil(notif.snoozeAteIso!)}
            </span>
          )}
        </div>
      </button>

      {/* Inline actions */}
      <div className="shrink-0 self-center">
        <div className="hidden items-center gap-0.5 group-hover:flex">
          {isArchived ? (
            <ActionButton
              label="Desarquivar"
              icon={<Archive size={13} />}
              onClick={onUnarchive}
            />
          ) : (
            <>
              <ActionButton
                label={notif.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                icon={notif.lida ? <Mail size={13} /> : <Check size={13} />}
                onClick={onToggleLida}
              />
              <ActionButton
                label="Arquivar"
                icon={<Archive size={13} />}
                onClick={onArchive}
              />
              <div className="relative">
                <ActionButton
                  label="Snooze"
                  icon={<Clock size={13} />}
                  onClick={() => setSnoozeMenuOpen((o) => !o)}
                  active={snoozeMenuOpen}
                />
                {snoozeMenuOpen && (
                  <SnoozeMenu
                    snoozeOpcoes={snoozeOpcoes}
                    isSnoozed={isSnoozed}
                    onPick={(d) => {
                      setSnoozeMenuOpen(false)
                      onSnooze(d)
                    }}
                    onCancel={() => {
                      setSnoozeMenuOpen(false)
                      onCancelSnooze()
                    }}
                    onClose={() => setSnoozeMenuOpen(false)}
                  />
                )}
              </div>
              <ActionButton
                label="Abrir origem"
                icon={<ChevronRight size={13} />}
                onClick={onOpen}
              />
            </>
          )}
        </div>

        <div className="flex group-hover:hidden">
          <ActionButton
            label="Ações"
            icon={<MoreHorizontal size={13} />}
            onClick={onOpen}
          />
        </div>
      </div>
    </li>
  )
}

function ActionButton({
  label,
  icon,
  onClick,
  active,
}: {
  label: string
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      className={`
        rounded-md p-1.5 text-slate-500 transition
        hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200
        ${active ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' : ''}
      `}
    >
      {icon}
    </button>
  )
}

function SnoozeMenu({
  snoozeOpcoes,
  isSnoozed,
  onPick,
  onCancel,
  onClose,
}: {
  snoozeOpcoes: SnoozeOpcao[]
  isSnoozed: boolean
  onPick: (d: SnoozeDuracao) => void
  onCancel: () => void
  onClose: () => void
}) {
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default"
        aria-hidden
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      />
      <div
        className="
          absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-xl
          border border-slate-200 bg-white shadow-lg
          dark:border-slate-800 dark:bg-slate-900
        "
      >
        <p className="border-b border-slate-200 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Lembrar daqui a
        </p>
        <ul className="py-1">
          {snoozeOpcoes.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPick(opt.value)
                }}
                className="
                  flex w-full items-center justify-between px-3 py-1.5 text-left text-xs
                  text-slate-700 hover:bg-teal-50 hover:text-teal-700
                  dark:text-slate-300 dark:hover:bg-teal-950/40 dark:hover:text-teal-200
                "
              >
                {opt.label}
              </button>
            </li>
          ))}
          {isSnoozed && (
            <>
              <li className="my-1 border-t border-slate-200 dark:border-slate-800" />
              <li>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCancel()
                  }}
                  className="
                    flex w-full items-center px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50
                    dark:text-rose-400 dark:hover:bg-rose-950/40
                  "
                >
                  Cancelar snooze
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  )
}
