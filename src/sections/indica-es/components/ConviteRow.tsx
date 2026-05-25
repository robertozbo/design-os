import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Copy,
  QrCode,
  X,
  ChevronRight,
} from 'lucide-react'
import type { Convite, EstadoConvite } from '@/../product/sections/indica-es/types'
import { AVATAR_COLOR, ESTADO_TONE, formatRelative } from './utils'

const STATE_ICON: Record<EstadoConvite, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  pendente: Clock,
  vinculado: CheckCircle2,
  expirado: AlertCircle,
  cancelado: XCircle,
}

interface ConviteRowProps {
  convite: Convite
  onResend: () => void
  onCopyLink: () => void
  onShowQr: () => void
  onCancel: () => void
  onOpenPaciente: () => void
}

export function ConviteRow({
  convite,
  onResend,
  onCopyLink,
  onShowQr,
  onCancel,
  onOpenPaciente,
}: ConviteRowProps) {
  const tone = ESTADO_TONE[convite.estado]
  const Icon = STATE_ICON[convite.estado]

  // Pick the most relevant timestamp for the row
  const timeRefIso =
    convite.estado === 'vinculado' && convite.vinculadoIso
      ? convite.vinculadoIso
      : convite.estado === 'cancelado' && convite.canceladoIso
      ? convite.canceladoIso
      : convite.estado === 'expirado'
      ? convite.expiraIso
      : convite.enviadoIso

  const timeLabel = (() => {
    switch (convite.estado) {
      case 'vinculado':
        return `vinculou ${formatRelative(timeRefIso)}`
      case 'cancelado':
        return `cancelado ${formatRelative(timeRefIso)}`
      case 'expirado':
        return `expirou ${formatRelative(timeRefIso)}`
      default:
        return `enviado ${formatRelative(timeRefIso)}`
    }
  })()

  const isVinculado = convite.estado === 'vinculado'
  const isPendente = convite.estado === 'pendente'
  const isCancelado = convite.estado === 'cancelado'

  return (
    <li
      className={`
        group relative flex items-start gap-3 rounded-xl border bg-white px-3 py-3
        transition hover:border-slate-300 hover:bg-slate-50/60
        dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/80
        border-slate-200/80
      `}
    >
      {/* Stripe */}
      <span
        className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r ${tone.stripeBg}`}
        aria-hidden
      />

      {/* Avatar */}
      <span
        className={`
          mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold
          ${AVATAR_COLOR[convite.paciente.corAvatar] ?? AVATAR_COLOR.slate}
        `}
      >
        {convite.paciente.iniciais}
      </span>

      {/* Body */}
      <button
        type="button"
        onClick={isVinculado ? onOpenPaciente : undefined}
        disabled={!isVinculado}
        className={`
          min-w-0 flex-1 text-left
          ${isVinculado ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {convite.paciente.nome}
          </p>
          <span
            className={`
              inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ring-1
              ${tone.badgeBg} ${tone.badgeText} ${tone.badgeRing}
            `}
          >
            <Icon size={9} strokeWidth={2.5} />
            {tone.label}
          </span>
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {convite.paciente.email}
          </span>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-500">
            {convite.paciente.telefone}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400">
            {convite.codigo}
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
            {timeLabel}
          </span>
          {convite.canaisUsados.length > 0 && (
            <>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                via {convite.canaisUsados.join(' · ')}
              </span>
            </>
          )}
        </div>
      </button>

      {/* Inline actions */}
      <div className="shrink-0 self-center">
        {isCancelado ? (
          <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-600">
            —
          </span>
        ) : isVinculado ? (
          <button
            type="button"
            onClick={onOpenPaciente}
            className="
              inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition
              hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40
            "
          >
            Abrir paciente
            <ChevronRight size={12} />
          </button>
        ) : (
          <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100 sm:opacity-60">
            <ActionButton label="Reenviar" icon={<RefreshCw size={12} />} onClick={onResend} />
            <ActionButton label="Copiar link" icon={<Copy size={12} />} onClick={onCopyLink} />
            <ActionButton label="Mostrar QR" icon={<QrCode size={12} />} onClick={onShowQr} />
            {isPendente && (
              <ActionButton
                label="Cancelar"
                icon={<X size={12} />}
                onClick={onCancel}
                tone="rose"
              />
            )}
          </div>
        )}
      </div>
    </li>
  )
}

function ActionButton({
  label,
  icon,
  onClick,
  tone = 'slate',
}: {
  label: string
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  tone?: 'slate' | 'rose'
}) {
  const colorClass =
    tone === 'rose'
      ? 'text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300'
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      className={`rounded-md p-1.5 transition ${colorClass}`}
    >
      {icon}
    </button>
  )
}
