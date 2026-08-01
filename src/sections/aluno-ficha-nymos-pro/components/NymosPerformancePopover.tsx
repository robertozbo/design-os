import { useState } from 'react'
import { ArrowRight, FileText, Lock, MessageSquareShare, Send, Sparkles, TrendingDown, TrendingUp, X } from 'lucide-react'
import { Avatar3D } from '@/sections/assistente-nymos/components/Avatar3D'
import type {
  AdherenceSnapshot,
  AnalysisInsight,
  InsightCategory,
  PerformanceMetric,
  PlanGate,
  StudentSnapshot,
  SuggestedAction,
  TrendDirection,
} from '@/../product/sections/aluno-ficha-nymos-pro/types'

interface NymosPerformancePopoverProps {
  student: StudentSnapshot
  metrics: PerformanceMetric[]
  adherence: AdherenceSnapshot
  analysisInsights: AnalysisInsight[]
  suggestedAction: SuggestedAction | null
  planGate: PlanGate
  onClose: () => void
  onGenerateReport?: () => void
  onShareWithStudent?: () => void
  onAskNymos?: (question: string) => void
  onDrillDownInsight?: (path: string) => void
  onDrillDownMetric?: (metricId: string) => void
  onAcceptSuggestion?: (path: string) => void
}

const CATEGORY_STYLES: Record<
  InsightCategory,
  { label: string; color: string; chip: string; dot: string }
> = {
  strength: {
    label: 'Forte',
    color: 'text-teal-300',
    chip: 'border-teal-400/50 bg-teal-500/[0.06] text-teal-300',
    dot: 'bg-teal-300',
  },
  attention: {
    label: 'Atenção',
    color: 'text-orange-300',
    chip: 'border-orange-400/50 bg-orange-500/[0.07] text-orange-300',
    dot: 'bg-orange-300',
  },
  projection: {
    label: 'Projeção',
    color: 'text-sky-300',
    chip: 'border-sky-400/50 bg-sky-500/[0.06] text-sky-300',
    dot: 'bg-sky-300',
  },
  'next-step': {
    label: 'Próximo passo',
    color: 'text-lime-300',
    chip: 'border-lime-400/50 bg-lime-500/[0.06] text-lime-300',
    dot: 'bg-lime-300',
  },
}

function formatDays(iso: string | null): string {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'hoje'
  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return `há ${diffDays}d`
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)}sem`
  return `há ${Math.floor(diffDays / 30)}mês`
}

function TrendIcon({ trend }: { trend: TrendDirection | null }) {
  if (trend === 'up') return <TrendingUp size={10} className="text-teal-300" />
  if (trend === 'down') return <TrendingDown size={10} className="text-orange-300" />
  return null
}

function MetricChip({
  metric,
  onClick,
}: {
  metric: PerformanceMetric
  onClick?: () => void
}) {
  const colorByStatus = {
    good: 'text-teal-200',
    neutral: 'text-slate-200',
    warning: 'text-orange-300',
    alert: 'text-rose-300',
  }[metric.status]

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex flex-col items-start gap-0.5
        border border-slate-700/60 bg-slate-900/40
        px-2.5 py-2
        hover:border-teal-500/40 hover:bg-slate-900/70
        transition-colors
        text-left
      "
      style={{
        clipPath:
          'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
      }}
    >
      <span className="text-[9px] font-mono tracking-[0.18em] uppercase text-slate-500">
        {metric.label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={`text-[15px] font-semibold tabular-nums ${colorByStatus}`}>
          {metric.value !== null ? metric.value : '—'}
        </span>
        {metric.unit && (
          <span className="text-[9px] text-slate-500">{metric.unit}</span>
        )}
      </div>
      {metric.trendDeltaPct !== null && (
        <div className="flex items-center gap-1">
          <TrendIcon trend={metric.trend} />
          <span
            className={`text-[9px] font-mono tabular-nums ${
              metric.trend === 'up'
                ? 'text-teal-300/80'
                : metric.trend === 'down'
                  ? 'text-orange-300/80'
                  : 'text-slate-500'
            }`}
          >
            {metric.trendDeltaPct > 0 ? '+' : ''}
            {metric.trendDeltaPct.toFixed(1)}%
          </span>
        </div>
      )}
    </button>
  )
}

function InsightItem({
  insight,
  onDrillDown,
}: {
  insight: AnalysisInsight
  onDrillDown?: (path: string) => void
}) {
  const style = CATEGORY_STYLES[insight.category]
  return (
    <li className="border-l-2 pl-3 py-1.5 border-l-slate-800 hover:border-l-teal-500/60 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-1 h-1 rounded-full ${style.dot}`} />
        <span
          className={`text-[8.5px] font-mono tracking-[0.2em] uppercase ${style.color}`}
        >
          {style.label}
        </span>
      </div>
      <h4 className="text-[13px] font-medium text-slate-100 leading-snug mb-1">
        {insight.title}
      </h4>
      <p className="text-[11.5px] text-slate-400 leading-snug mb-1.5">
        {insight.description}
      </p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-mono text-teal-500/50 tracking-wider">
          {insight.evidenceLabel}
        </span>
        {insight.drillTo && (
          <button
            type="button"
            onClick={() => insight.drillTo && onDrillDown?.(insight.drillTo)}
            className="
              inline-flex items-center gap-0.5
              text-[9px] font-mono tracking-widest uppercase
              text-teal-300 hover:text-teal-200
            "
          >
            Detalhes <ArrowRight size={9} />
          </button>
        )}
      </div>
    </li>
  )
}

export function NymosPerformancePopover({
  student,
  metrics,
  adherence,
  analysisInsights,
  suggestedAction,
  planGate,
  onClose,
  onGenerateReport,
  onShareWithStudent,
  onAskNymos,
  onDrillDownInsight,
  onDrillDownMetric,
  onAcceptSuggestion,
}: NymosPerformancePopoverProps) {
  const [askMode, setAskMode] = useState(false)
  const [question, setQuestion] = useState('')

  if (planGate.isLocked) {
    return (
      <div
        role="dialog"
        aria-label="Nymos · Pro"
        className="
          absolute bottom-full right-0 mb-3
          w-[380px]
          bg-slate-950/95 backdrop-blur-xl
          border border-slate-700/70
          shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]
          z-40
        "
        style={{
          clipPath:
            'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-slate-500">
            Análise Nymos
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300"
            aria-label="Fechar"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-4 py-6 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center">
            <Lock size={20} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-100">
            Disponível no plano Pro
          </h3>
          <p className="text-xs text-slate-400 leading-snug max-w-[280px]">
            Nymos cruza avaliações, treino, adesão e mensagens pra montar análise
            estruturada por aluno. Ative no plano Pro.
          </p>
          <button
            type="button"
            className="
              mt-2 inline-flex items-center gap-1
              text-[10px] font-mono tracking-widest uppercase
              bg-teal-400 text-slate-950 hover:bg-teal-300
              px-3 py-1.5
            "
          >
            {planGate.upgradeCtaLabel}
          </button>
        </div>
      </div>
    )
  }

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      onAskNymos?.(question.trim())
      setQuestion('')
      setAskMode(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-label={`Diagnóstico Nymos · ${student.displayName}`}
      className="
        absolute bottom-full right-0 mb-3
        w-[380px] max-h-[620px]
        bg-slate-950/95 backdrop-blur-xl
        border border-teal-500/30
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]
        flex flex-col
        z-40
      "
      style={{
        clipPath:
          'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-teal-300">
            Diagnóstico Nymos
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-200"
          aria-label="Fechar"
        >
          <X size={14} />
        </button>
      </div>

      {/* Avatar mesh */}
      <div className="relative h-[120px] mx-auto w-[140px] shrink-0">
        <Avatar3D state="thinking" />
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 w-3 h-3 border-t border-l border-teal-500/40"
        />
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 w-3 h-3 border-t border-r border-teal-500/40"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-teal-500/40"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-teal-500/40"
        />
      </div>

      {/* Identity strip */}
      <div className="px-4 pb-2 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-teal-600/80 flex items-center justify-center text-white font-semibold text-sm shrink-0">
          {student.avatarInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-slate-100 truncate">
            {student.displayName}
          </div>
          <div className="flex items-center gap-2 text-[9.5px] font-mono uppercase tracking-wider text-slate-500">
            <span className="text-teal-300/80">{student.planLabel}</span>
            <span>·</span>
            <span>{student.weeksActive}sem ativo</span>
            <span>·</span>
            <span>últ. {formatDays(adherence.lastSessionAt)}</span>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="px-4 pb-3 overflow-y-auto flex-1 flex flex-col gap-3">
        {/* Snapshot bio + adherence */}
        <section>
          <h3 className="text-[9px] font-mono tracking-[0.22em] uppercase text-slate-500 mb-1.5">
            Snapshot
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {metrics.slice(0, 4).map((m) => (
              <MetricChip
                key={m.id}
                metric={m}
                onClick={() => onDrillDownMetric?.(m.id)}
              />
            ))}
          </div>
          {/* Adherence bar */}
          <div className="mt-2 border border-slate-800 bg-slate-900/40 px-2.5 py-2"
            style={{
              clipPath:
                'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono tracking-[0.18em] uppercase text-slate-500">
                Adesão · semana
              </span>
              <span className={`text-[10px] font-mono tabular-nums ${
                adherence.trend === 'up' ? 'text-teal-300' : adherence.trend === 'down' ? 'text-orange-300' : 'text-slate-400'
              }`}>
                {adherence.trendDeltaPct > 0 ? '+' : ''}{adherence.trendDeltaPct}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${adherence.scorePct >= 80 ? 'bg-teal-400' : adherence.scorePct >= 60 ? 'bg-orange-400' : 'bg-rose-400'}`}
                  style={{ width: `${adherence.scorePct}%` }}
                />
              </div>
              <span className="text-[10.5px] tabular-nums text-slate-300 font-medium">
                {adherence.scorePct}%
              </span>
            </div>
            <div className="text-[9.5px] text-slate-500 mt-1 font-mono">
              {adherence.sessionsThisWeek}/{adherence.sessionsTargetWeek} sessões · streak {adherence.currentStreakSessions}
            </div>
          </div>
        </section>

        {/* Insights */}
        <section>
          <h3 className="text-[9px] font-mono tracking-[0.22em] uppercase text-slate-500 mb-1.5 flex items-center gap-2">
            <Sparkles size={9} className="text-teal-400" />
            Diagnóstico
          </h3>
          <ul className="space-y-2.5">
            {analysisInsights.map((insight) => (
              <InsightItem
                key={insight.id}
                insight={insight}
                onDrillDown={onDrillDownInsight}
              />
            ))}
          </ul>
        </section>

        {/* Suggested action */}
        {suggestedAction && (
          <section>
            <h3 className="text-[9px] font-mono tracking-[0.22em] uppercase text-slate-500 mb-1.5">
              Próxima ação
            </h3>
            <button
              type="button"
              onClick={() => onAcceptSuggestion?.(suggestedAction.targetPath)}
              className="
                w-full text-left
                border border-lime-400/50 bg-lime-500/[0.06]
                hover:bg-lime-500/[0.1]
                px-3 py-2.5
                transition-colors
              "
              style={{
                clipPath:
                  'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[12.5px] font-medium text-lime-100">
                  {suggestedAction.ctaLabel}
                </span>
                <ArrowRight size={12} className="text-lime-300 shrink-0" />
              </div>
              <p className="text-[10.5px] text-lime-200/80 leading-snug">
                {suggestedAction.context}
              </p>
            </button>
          </section>
        )}
      </div>

      {/* Footer actions */}
      {askMode ? (
        <form
          onSubmit={handleAskSubmit}
          className="px-3 py-2.5 border-t border-slate-800 flex items-center gap-2 shrink-0 bg-slate-950"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Pergunte ao Nymos…"
            autoFocus
            className="
              flex-1 bg-slate-900 border border-slate-700
              text-xs text-slate-100
              px-2.5 py-1.5
              focus:outline-none focus:border-teal-500/60
            "
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className="
              bg-teal-400 text-slate-950 hover:bg-teal-300
              disabled:opacity-40 disabled:cursor-not-allowed
              px-2 py-1.5
            "
            aria-label="Enviar"
          >
            <Send size={12} />
          </button>
          <button
            type="button"
            onClick={() => {
              setAskMode(false)
              setQuestion('')
            }}
            className="text-slate-500 hover:text-slate-300"
          >
            <X size={14} />
          </button>
        </form>
      ) : (
        <div className="px-3 py-2.5 border-t border-slate-800 flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onGenerateReport}
            className="
              flex-1 inline-flex items-center justify-center gap-1.5
              border border-teal-400/60 bg-teal-500/[0.08]
              hover:bg-teal-500/[0.15]
              text-[10px] font-mono tracking-widest uppercase
              text-teal-200
              px-2 py-1.5
            "
          >
            <FileText size={11} />
            Relatório
          </button>
          <button
            type="button"
            onClick={onShareWithStudent}
            className="
              inline-flex items-center justify-center gap-1.5
              border border-slate-700 bg-slate-900/50
              hover:bg-slate-800
              text-[10px] font-mono tracking-widest uppercase
              text-slate-300
              px-2 py-1.5
            "
            title="Mandar pro aluno"
            aria-label="Mandar pro aluno"
          >
            <MessageSquareShare size={11} />
          </button>
          <button
            type="button"
            onClick={() => setAskMode(true)}
            className="
              inline-flex items-center justify-center gap-1.5
              border border-slate-700 bg-slate-900/50
              hover:bg-slate-800
              text-[10px] font-mono tracking-widest uppercase
              text-slate-300
              px-2 py-1.5
            "
            title="Perguntar ao Nymos"
            aria-label="Perguntar ao Nymos"
          >
            <Sparkles size={11} />
          </button>
        </div>
      )}
    </div>
  )
}
