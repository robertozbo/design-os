import type { TimelineEvent } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  CircleDot,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

interface Props {
  event: TimelineEvent
  isFirst?: boolean
  isLast?: boolean
}

const KIND_STYLE = {
  created: {
    Icon: Plus,
    label: 'Criação',
    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    ring: 'ring-slate-200 dark:ring-slate-800',
  },
  status_change: {
    Icon: TrendingUp,
    label: 'Mudança de status',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-900/60',
  },
  note_added: {
    Icon: CircleDot,
    label: 'Nota',
    iconBg: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-900/60',
  },
  progress: {
    Icon: TrendingUp,
    label: 'Progresso',
    iconBg: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
    ring: 'ring-teal-200 dark:ring-teal-900/60',
  },
  completed: {
    Icon: CheckCircle2,
    label: 'Concluída',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-200 dark:ring-emerald-900/60',
  },
  reopened: {
    Icon: RotateCcw,
    label: 'Reaberta',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-900/60',
  },
  forwarded: {
    Icon: ArrowUpRight,
    label: 'Encaminhamento',
    iconBg: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-900/60',
  },
  signal_detected: {
    Icon: Bell,
    label: 'Sinal detectado',
    iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-900/60',
  },
  consent_given: {
    Icon: Sparkles,
    label: 'Consentimento',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-200 dark:ring-emerald-900/60',
  },
} as const

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TimelineEventCard({ event, isFirst, isLast }: Props) {
  const style = KIND_STYLE[event.kind] ?? KIND_STYLE.note_added
  const isCritical = event.meta?.severity === 'critical'
  const Icon = isCritical ? AlertTriangle : style.Icon
  const iconClasses = isCritical
    ? 'bg-rose-500 text-white'
    : style.iconBg

  return (
    <li className="relative pl-12 pb-7 last:pb-0">
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[19px] top-9 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
        />
      )}

      <span
        className={`
          absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center
          ring-4 ${style.ring}
          ${iconClasses}
          ${isFirst ? 'shadow-[0_8px_18px_-6px_rgba(15,23,42,0.25)]' : ''}
        `}
      >
        <Icon className="w-4 h-4" strokeWidth={2.25} />
      </span>

      <div
        className={`
          rounded-2xl border bg-white dark:bg-slate-900/60
          ${isCritical
            ? 'border-rose-200 dark:border-rose-900/60 ring-1 ring-rose-200/60 dark:ring-rose-900/40'
            : 'border-slate-200 dark:border-slate-800'}
          p-4
        `}
      >
        <header className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {style.label}
            </div>
            <h4 className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-50 leading-snug">
              {event.title}
            </h4>
          </div>
          <div className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 whitespace-nowrap">
            {formatTimestamp(event.at)}
          </div>
        </header>

        {event.body && (
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {event.body}
          </p>
        )}

        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          {event.author}
        </div>
      </div>
    </li>
  )
}
