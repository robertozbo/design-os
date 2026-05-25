import type { ActionDetailProps } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import {
  ArrowLeft,
  Calendar,
  Check,
  ClipboardCheck,
  Edit3,
  History as HistoryIcon,
  RotateCcw,
  User,
} from 'lucide-react'
import { Timeline } from './Timeline'
import { TimelineComposer } from './TimelineComposer'

const STATUS_STYLE = {
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
    chip: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
    dot: 'bg-emerald-500',
  },
} as const

function deadlineHint(deadline: string, status: keyof typeof STATUS_STYLE): { label: string; tone: string } {
  if (status === 'completed') return { label: 'Concluída', tone: 'text-emerald-600 dark:text-emerald-400' }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(deadline)
  d.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: `${Math.abs(diff)} ${Math.abs(diff) === 1 ? 'dia' : 'dias'} atrasada`, tone: 'text-rose-600 dark:text-rose-400' }
  if (diff === 0) return { label: 'Vence hoje', tone: 'text-amber-600 dark:text-amber-400' }
  if (diff <= 3) return { label: `Vence em ${diff} ${diff === 1 ? 'dia' : 'dias'}`, tone: 'text-amber-600 dark:text-amber-400' }
  return { label: `Em ${diff} dias`, tone: 'text-slate-500 dark:text-slate-400' }
}

export function ActionDetail({
  team,
  action,
  timeline,
  onBack,
  onOpenSourceDiagnosis,
  onComplete,
  onReopen,
  onAddProgressNote,
  onEditAction,
}: ActionDetailProps) {
  const status = STATUS_STYLE[action.status]
  const hint = deadlineHint(action.deadline, action.status)
  const isCompleted = action.status === 'completed'

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />
      <BackgroundGlow />

      <div className="relative mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-10 pt-6 pb-16">
        <button
          type="button"
          onClick={onBack}
          style={{ animationDelay: '40ms' }}
          className="
            nymos-reveal opacity-0
            inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            text-xs font-mono uppercase tracking-[0.16em]
            text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition
          "
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.25} />
          Voltar
        </button>

        <header
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-5"
        >
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em]">
            <span className="text-teal-700 dark:text-teal-400">NR-1 · Ação</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-500 dark:text-slate-500">{team.sectorName}</span>
          </div>

          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            {action.description}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.chip}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className={`text-xs font-medium ${hint.tone}`}>{hint.label}</span>
          </div>
        </header>

        <section
          style={{ animationDelay: '200ms' }}
          className="nymos-reveal opacity-0 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <MetaCard label="Prazo" icon={Calendar}>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
              {new Date(action.deadline).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </MetaCard>

          <MetaCard label="Responsável" icon={User}>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{action.owner}</div>
          </MetaCard>

          <MetaCard label="Origem" icon={HistoryIcon}>
            <button
              type="button"
              onClick={() => onOpenSourceDiagnosis?.(action.sourceDiagnosisId)}
              className="text-sm font-semibold text-teal-700 dark:text-teal-300 hover:underline truncate text-left"
            >
              {action.sourceDiagnosisLabel}
            </button>
          </MetaCard>
        </section>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] gap-6">
          <div className="space-y-5 min-w-0">
            <section
              style={{ animationDelay: '280ms' }}
              className="nymos-reveal opacity-0"
            >
              <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  <HistoryIcon className="w-3 h-3" strokeWidth={2.25} />
                  Timeline · {timeline.length} {timeline.length === 1 ? 'evento' : 'eventos'}
                </div>
              </header>
              <Timeline events={timeline} emptyLabel="Sem atualizações registradas ainda." />
            </section>
          </div>

          <aside className="space-y-4 min-w-0">
            <section
              style={{ animationDelay: '340ms' }}
              className="nymos-reveal opacity-0"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-2">
                Registrar progresso
              </div>
              <TimelineComposer
                placeholder="O que avançou desde a última atualização?"
                cta="Adicionar progresso"
                onSubmit={(note) => onAddProgressNote?.(action.id, note)}
              />
            </section>

            <section
              style={{ animationDelay: '400ms' }}
              className="nymos-reveal opacity-0 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 space-y-2"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-1">
                Ações
              </div>

              {!isCompleted ? (
                <button
                  type="button"
                  onClick={() => onComplete?.(action.id)}
                  className="
                    w-full inline-flex items-center justify-center gap-1.5
                    px-3.5 py-2.5 rounded-xl
                    bg-emerald-500 hover:bg-emerald-400 text-white
                    text-sm font-semibold
                    shadow-[0_10px_22px_-10px_rgba(16,185,129,0.55)]
                    active:scale-[0.98] transition
                  "
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  Marcar como concluída
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onReopen?.(action.id)}
                  className="
                    w-full inline-flex items-center justify-center gap-1.5
                    px-3.5 py-2.5 rounded-xl
                    bg-amber-500 hover:bg-amber-400 text-white
                    text-sm font-semibold
                    active:scale-[0.98] transition
                  "
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={2.25} />
                  Reabrir ação
                </button>
              )}

              <button
                type="button"
                onClick={() => onEditAction?.(action.id)}
                className="
                  w-full inline-flex items-center justify-center gap-1.5
                  px-3.5 py-2.5 rounded-xl
                  bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                  text-slate-700 dark:text-slate-200
                  text-sm font-medium
                  transition
                "
              >
                <Edit3 className="w-3.5 h-3.5" strokeWidth={2.25} />
                Editar ação
              </button>
            </section>

            <section
              style={{ animationDelay: '460ms' }}
              className="nymos-reveal opacity-0 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/60 p-4"
            >
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                <ClipboardCheck className="w-3 h-3" strokeWidth={2.25} />
                Origem
              </div>
              <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Esta ação foi registrada no diagnóstico semanal de{' '}
                <button
                  type="button"
                  onClick={() => onOpenSourceDiagnosis?.(action.sourceDiagnosisId)}
                  className="font-semibold text-teal-800 dark:text-teal-200 hover:underline"
                >
                  {action.sourceDiagnosisLabel}
                </button>
                . Atualizações daqui ficam vinculadas ao histórico do líder.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function MetaCard({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: typeof Calendar
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3.5">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-1.5">
        <Icon className="w-3 h-3" strokeWidth={2.25} />
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
      <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-teal-200/40 dark:bg-teal-900/20 blur-3xl" />
      <div className="absolute -top-16 left-[18%] w-[400px] h-[400px] rounded-full bg-violet-200/30 dark:bg-violet-950/30 blur-3xl" />
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
        animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
