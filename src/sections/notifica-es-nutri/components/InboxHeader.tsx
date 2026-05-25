import { CheckCheck } from 'lucide-react'

interface InboxHeaderProps {
  perfilNome: string
  countCriticas: number
  countAltas: number
  countNaoLidas: number
  showMarkAllAsRead: boolean
  onMarkAllAsRead?: () => void
}

export function InboxHeader({
  perfilNome,
  countCriticas,
  countAltas,
  countNaoLidas,
  showMarkAllAsRead,
  onMarkAllAsRead,
}: InboxHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
            Conta · Inbox
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Notificações
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Triagem rápida da sua carteira · {perfilNome}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-wider tabular-nums">
          <Counter
            label="Críticas"
            count={countCriticas}
            tone="rose"
            urgent={countCriticas > 0}
          />
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <Counter
            label="Altas"
            count={countAltas}
            tone="amber"
            urgent={countAltas > 0}
          />
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <Counter
            label="Não lidas"
            count={countNaoLidas}
            tone="sky"
            urgent={countNaoLidas > 0}
          />
        </div>
      </div>

      {showMarkAllAsRead && (
        <div>
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="
              inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs
              font-medium text-slate-700 hover:bg-slate-50
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
            "
          >
            <CheckCheck size={13} />
            Marcar todas como lidas
          </button>
        </div>
      )}
    </header>
  )
}

const TONE_CLASSES: Record<'rose' | 'amber' | 'sky', { active: string; inactive: string }> = {
  rose: {
    active: 'text-rose-700 dark:text-rose-300',
    inactive: 'text-slate-400 dark:text-slate-600',
  },
  amber: {
    active: 'text-amber-700 dark:text-amber-300',
    inactive: 'text-slate-400 dark:text-slate-600',
  },
  sky: {
    active: 'text-sky-700 dark:text-sky-300',
    inactive: 'text-slate-400 dark:text-slate-600',
  },
}

function Counter({
  label,
  count,
  tone,
  urgent,
}: {
  label: string
  count: number
  tone: 'rose' | 'amber' | 'sky'
  urgent: boolean
}) {
  const cls = urgent ? TONE_CLASSES[tone].active : TONE_CLASSES[tone].inactive
  return (
    <span className={cls}>
      <span className="text-sm font-semibold tabular-nums">{count}</span>{' '}
      <span className="font-mono text-[10px]">{label}</span>
    </span>
  )
}
