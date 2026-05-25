import type { RiskCollaboratorDetailProps } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  EyeOff,
  History as HistoryIcon,
  Lock,
  ShieldAlert,
} from 'lucide-react'
import { Timeline } from './Timeline'
import { TimelineComposer } from './TimelineComposer'

const RISK_STYLE = {
  critical: {
    label: 'Crítico',
    chip: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    dot: 'bg-rose-500',
    halo: 'from-rose-100 via-rose-50 to-transparent dark:from-rose-950/40 dark:via-rose-950/20',
  },
  high: {
    label: 'Alto',
    chip: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
    dot: 'bg-amber-500',
    halo: 'from-amber-100 via-amber-50 to-transparent dark:from-amber-950/40 dark:via-amber-950/20',
  },
  moderate: {
    label: 'Moderado',
    chip: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-900/60',
    dot: 'bg-violet-500',
    halo: 'from-violet-100 via-violet-50 to-transparent dark:from-violet-950/40 dark:via-violet-950/20',
  },
} as const

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime()
  const now = Date.now()
  const diff = now - t
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (hours < 1) return 'há poucos minutos'
  if (hours < 24) return `há ${hours}h`
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  return `há ${Math.floor(days / 7)} sem.`
}

export function RiskCollaboratorDetail({
  team,
  collaborator,
  timeline,
  onBack,
  onAddLeaderNote,
  onForwardToSst,
  onCloseObservation,
}: RiskCollaboratorDetailProps) {
  const style = RISK_STYLE[collaborator.riskLevel]
  const isCritical = collaborator.riskLevel === 'critical'

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />
      <BackgroundGlow halo={style.halo} />

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
            <span className="text-violet-700 dark:text-violet-400 inline-flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" strokeWidth={2.25} />
              NR-1 · Acompanhamento individual
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-500 dark:text-slate-500">{team.sectorName}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center
                bg-slate-100 dark:bg-slate-800
                text-slate-500 dark:text-slate-400
                ring-2 ${isCritical ? 'ring-rose-300 dark:ring-rose-900/60' : 'ring-slate-200 dark:ring-slate-800'}
              `}
            >
              <EyeOff className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h1 className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                {collaborator.anonId}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${style.chip}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  Risco {style.label}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="tabular-nums">
                  <Clock className="inline w-3 h-3 mr-0.5 -mt-0.5" strokeWidth={2.25} />
                  {collaborator.weeksUnderObservation} {collaborator.weeksUnderObservation === 1 ? 'semana' : 'semanas'} em observação
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>último sinal {relativeTime(collaborator.lastSignalAt)}</span>
              </div>
            </div>
          </div>
        </header>

        <section
          style={{ animationDelay: '200ms' }}
          className="nymos-reveal opacity-0 mt-5 rounded-2xl bg-violet-50/40 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/60 p-4 sm:p-5 flex items-start gap-3"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-violet-500 text-white flex items-center justify-center">
            <Lock className="w-4 h-4" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
              Anonimato preservado
            </div>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              Você acompanha por sinais agregados. A identidade do colaborador nunca é exposta — nem para você, nem para o empregador. Encaminhar ao SST mantém o anonimato no canal clínico.
            </p>
          </div>
        </section>

        <section
          style={{ animationDelay: '260ms' }}
          className="nymos-reveal opacity-0 mt-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-5"
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Fonte do sinal
          </div>
          <p className="mt-1 text-sm text-slate-800 dark:text-slate-100 font-medium leading-snug">
            {collaborator.signalSource}
          </p>
          {collaborator.leaderNotes && (
            <p className="mt-3 text-[13px] text-slate-600 dark:text-slate-300 italic leading-relaxed pl-3 border-l-2 border-slate-200 dark:border-slate-700">
              “{collaborator.leaderNotes}”
            </p>
          )}
        </section>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] gap-6">
          <div className="space-y-5 min-w-0">
            <section
              style={{ animationDelay: '320ms' }}
              className="nymos-reveal opacity-0"
            >
              <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  <HistoryIcon className="w-3 h-3" strokeWidth={2.25} />
                  Timeline · {timeline.length} {timeline.length === 1 ? 'evento' : 'eventos'}
                </div>
              </header>
              <Timeline events={timeline} emptyLabel="Nenhum sinal ou nota registrado ainda." />
            </section>
          </div>

          <aside className="space-y-4 min-w-0">
            <section
              style={{ animationDelay: '380ms' }}
              className="nymos-reveal opacity-0"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-2">
                Registrar acompanhamento
              </div>
              <TimelineComposer
                variant="violet"
                placeholder="Nota privada do líder — fica visível só para você."
                cta="Adicionar nota"
                onSubmit={(note) => onAddLeaderNote?.(collaborator.anonId, note)}
              />
            </section>

            <section
              style={{ animationDelay: '440ms' }}
              className="nymos-reveal opacity-0 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 space-y-2"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-1">
                Ações
              </div>

              <button
                type="button"
                onClick={() => onForwardToSst?.(collaborator.anonId)}
                className="
                  w-full inline-flex items-center justify-center gap-1.5
                  px-3.5 py-2.5 rounded-xl
                  bg-violet-500 hover:bg-violet-400 text-white
                  text-sm font-semibold
                  shadow-[0_10px_22px_-10px_rgba(124,58,237,0.55)]
                  active:scale-[0.98] transition
                "
              >
                Encaminhar ao SST
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.25} />
              </button>

              <button
                type="button"
                onClick={() => onCloseObservation?.(collaborator.anonId)}
                className="
                  w-full inline-flex items-center justify-center gap-1.5
                  px-3.5 py-2.5 rounded-xl
                  bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
                  text-slate-700 dark:text-slate-200
                  text-sm font-medium
                  transition
                "
              >
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.25} />
                Encerrar observação
              </button>

              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Encaminhamento gera evento na timeline e leva à seção Encaminhamento Clínico, sem revelar identidade.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function BackgroundGlow({ halo }: { halo: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[440px] overflow-hidden">
      <div className={`absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full blur-3xl bg-gradient-to-br ${halo}`} />
      <div className="absolute -top-16 left-[12%] w-[400px] h-[400px] rounded-full bg-violet-200/30 dark:bg-violet-950/30 blur-3xl" />
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
