import type { ActiveAction } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { Calendar, Check, ChevronRight, MessageCircle } from 'lucide-react'

interface Props {
  action: ActiveAction
  onOpen?: () => void
  onComplete?: () => void
}

const STATUS_STYLE: Record<
  ActiveAction['status'],
  { label: string; chip: string; dot: string }
> = {
  in_progress: {
    label: 'Em andamento',
    chip: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900/60',
    dot: 'bg-teal-500',
  },
  overdue: {
    label: 'Atrasada',
    chip: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    dot: 'bg-rose-500',
  },
  completed: {
    label: 'Concluída',
    chip: 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
}

function deadlineHint(action: ActiveAction): { label: string; tone: string } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(action.deadline)
  deadline.setHours(0, 0, 0, 0)
  const diff = Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (action.status === 'completed') {
    return { label: 'Concluída', tone: 'text-slate-500 dark:text-slate-400' }
  }
  if (diff < 0) {
    return {
      label: `${Math.abs(diff)} ${Math.abs(diff) === 1 ? 'dia' : 'dias'} atrasada`,
      tone: 'text-rose-600 dark:text-rose-400',
    }
  }
  if (diff === 0) {
    return { label: 'Vence hoje', tone: 'text-amber-600 dark:text-amber-400' }
  }
  if (diff <= 3) {
    return { label: `Vence em ${diff} ${diff === 1 ? 'dia' : 'dias'}`, tone: 'text-amber-600 dark:text-amber-400' }
  }
  return { label: `Em ${diff} dias`, tone: 'text-slate-500 dark:text-slate-400' }
}

export function ActionRow({ action, onOpen, onComplete }: Props) {
  const status = STATUS_STYLE[action.status]
  const hint = deadlineHint(action)
  const isCompleted = action.status === 'completed'

  return (
    <li className="group relative px-5 sm:px-6 py-4 transition hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.chip}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className={`text-[11px] font-medium tabular-nums ${hint.tone}`}>
              {hint.label}
            </span>
            {action.updatesCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <MessageCircle className="w-3 h-3" strokeWidth={2.25} />
                {action.updatesCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="block text-left w-full"
          >
            <p
              className={`text-sm leading-snug ${
                isCompleted
                  ? 'text-slate-500 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-700'
                  : 'text-slate-800 dark:text-slate-100'
              } font-medium`}
            >
              {action.description}
            </p>
          </button>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" strokeWidth={2.25} />
              <span className="tabular-nums">
                {new Date(action.deadline).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>de {action.sourceDiagnosisLabel}</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-mono uppercase tracking-[0.12em] text-[10px]">{action.owner}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 self-center">
          {!isCompleted && (
            <button
              type="button"
              onClick={onComplete}
              title="Marcar como concluída"
              className="
                hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg
                text-slate-400 hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400
                hover:bg-emerald-50 dark:hover:bg-emerald-950/40
                transition opacity-0 group-hover:opacity-100
              "
            >
              <Check className="w-4 h-4" strokeWidth={2.25} />
            </button>
          )}
          <button
            type="button"
            onClick={onOpen}
            className="
              inline-flex items-center justify-center w-8 h-8 rounded-lg
              text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </li>
  )
}
