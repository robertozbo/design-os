import type { NotificacaoSst, NotificacaoTipo, Urgencia } from '@/../product/sections/dashboard-sst/types'
import {
  ShieldAlert,
  TrendingDown,
  Hourglass,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'

interface NotificacaoItemProps {
  notificacao: NotificacaoSst
  onAbrir?: () => void
}

const TIPO_ICON: Record<NotificacaoTipo, LucideIcon> = {
  vigencia_aproximando: ShieldAlert,
  baixa_cobertura: TrendingDown,
  prazo_plano_vencendo: Hourglass,
  novo_perigo_detectado: AlertTriangle,
}

const URGENCIA_TONE: Record<Urgencia, { dot: string; label: string; labelTone: string; iconBg: string; iconTone: string }> = {
  alta: {
    dot: 'bg-rose-500',
    label: 'Alta',
    labelTone: 'text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40 ring-rose-200 dark:ring-rose-900/60',
    iconTone: 'text-rose-600 dark:text-rose-400',
  },
  media: {
    dot: 'bg-amber-500',
    label: 'Média',
    labelTone: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 ring-amber-200 dark:ring-amber-900/60',
    iconTone: 'text-amber-600 dark:text-amber-400',
  },
  baixa: {
    dot: 'bg-slate-400',
    label: 'Baixa',
    labelTone: 'text-slate-600 dark:text-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800 ring-slate-200 dark:ring-slate-700',
    iconTone: 'text-slate-500 dark:text-slate-400',
  },
}

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

function formatRelativo(iso: string): string {
  const target = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = target - now
  const diffMin = Math.round(diffMs / 60000)
  const diffH = Math.round(diffMs / 3600000)
  const diffD = Math.round(diffMs / 86400000)
  if (Math.abs(diffMin) < 60) return RELATIVE_FORMATTER.format(diffMin, 'minute')
  if (Math.abs(diffH) < 24) return RELATIVE_FORMATTER.format(diffH, 'hour')
  return RELATIVE_FORMATTER.format(diffD, 'day')
}

export function NotificacaoItem({ notificacao, onAbrir }: NotificacaoItemProps) {
  const Icon = TIPO_ICON[notificacao.tipo]
  const tone = URGENCIA_TONE[notificacao.urgencia]

  return (
    <button
      type="button"
      onClick={onAbrir}
      className="
        group w-full text-left
        rounded-xl px-3 py-3
        hover:bg-slate-50 dark:hover:bg-slate-800/50
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
      "
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ring-1 ${tone.iconBg}`}>
          <Icon className={`w-4 h-4 ${tone.iconTone}`} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`w-1 h-1 rounded-full ${tone.dot}`} aria-hidden="true" />
            <span className={`text-[10px] uppercase tracking-[0.14em] font-semibold ${tone.labelTone}`}>
              {tone.label}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-500 tabular-nums">
              {formatRelativo(notificacao.criadaEm)}
            </span>
          </div>
          <div className="text-[13px] font-medium text-slate-900 dark:text-slate-100 leading-snug">
            {notificacao.titulo}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {notificacao.descricao}
          </div>
        </div>
      </div>
    </button>
  )
}
