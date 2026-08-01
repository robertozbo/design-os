import { useState } from 'react'
import { Lock } from 'lucide-react'
import { ShellInvocationIcon } from '@/sections/assistente-nymos/components/ShellInvocationIcon'
import { NymosPerformancePopover } from './NymosPerformancePopover'
import type {
  AdherenceSnapshot,
  AnalysisInsight,
  PerformanceMetric,
  PlanGate,
  StudentSnapshot,
  SuggestedAction,
  WidgetStatus,
} from '@/../product/sections/aluno-ficha-nymos-pro/types'

interface NymosPerformanceCornerProps {
  student: StudentSnapshot
  metrics: PerformanceMetric[]
  adherence: AdherenceSnapshot
  analysisInsights: AnalysisInsight[]
  suggestedAction: SuggestedAction | null
  widgetStatus: WidgetStatus
  pendingSignalsCount: number
  planGate: PlanGate
  /** Force the popover open (prototype convenience) */
  defaultOpen?: boolean
  onExpand?: () => void
  onCollapse?: () => void
  onGenerateReport?: () => void
  onShareWithStudent?: () => void
  onAskNymos?: (question: string) => void
  onDrillDownInsight?: (path: string) => void
  onDrillDownMetric?: (metricId: string) => void
  onAcceptSuggestion?: (path: string) => void
  onOpenPaywall?: () => void
}

const STATUS_COPY: Record<WidgetStatus, { label: string; sublabel: string }> = {
  waiting: {
    label: 'Aguardando',
    sublabel: 'precisa de 2+ avaliações',
  },
  monitoring: {
    label: 'Monitorando',
    sublabel: 'sem sinais detectados',
  },
  'signals-detected': {
    label: 'Sinais detectados',
    sublabel: 'toque pra ver diagnóstico',
  },
  locked: {
    label: 'Pro · bloqueado',
    sublabel: 'toque pra liberar',
  },
}

export function NymosPerformanceCorner({
  student,
  metrics,
  adherence,
  analysisInsights,
  suggestedAction,
  widgetStatus,
  pendingSignalsCount,
  planGate,
  defaultOpen = false,
  onExpand,
  onCollapse,
  onGenerateReport,
  onShareWithStudent,
  onAskNymos,
  onDrillDownInsight,
  onDrillDownMetric,
  onAcceptSuggestion,
  onOpenPaywall,
}: NymosPerformanceCornerProps) {
  const [open, setOpen] = useState(defaultOpen)
  const isLocked = planGate.isLocked
  const status = isLocked ? 'locked' : widgetStatus
  const copy = STATUS_COPY[status]
  const showBadge = pendingSignalsCount > 0 && !isLocked

  const accent = isLocked
    ? 'slate'
    : status === 'signals-detected'
      ? 'orange'
      : status === 'monitoring'
        ? 'teal'
        : 'slate'

  const accentText = {
    teal: 'text-teal-300',
    orange: 'text-orange-300',
    slate: 'text-slate-500',
  }[accent]

  const borderColor = {
    teal: 'border-teal-500/40',
    orange: 'border-orange-400/50',
    slate: 'border-slate-700',
  }[accent]

  const glow = {
    teal: 'shadow-[0_0_28px_-8px_rgba(45,212,191,0.5)]',
    orange: 'shadow-[0_0_28px_-8px_rgba(251,146,60,0.5)]',
    slate: '',
  }[accent]

  const handleClick = () => {
    if (isLocked) {
      onOpenPaywall?.()
      setOpen(true)
      return
    }
    if (!open) {
      onExpand?.()
      setOpen(true)
    } else {
      onCollapse?.()
      setOpen(false)
    }
  }

  const handleClose = () => {
    onCollapse?.()
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={open}
        aria-label={`Análise Nymos · ${student.displayName}`}
        className={`
          relative w-full
          border ${borderColor} ${glow}
          bg-slate-950/70 backdrop-blur-sm
          px-4 py-4
          flex flex-col items-center gap-2.5
          transition-all duration-200
          ${isLocked ? 'cursor-pointer opacity-90' : 'hover:bg-slate-950 hover:border-opacity-100'}
        `}
        style={{
          clipPath:
            'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
        }}
      >
        {/* Title strip */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isLocked ? (
              <Lock size={10} className="text-slate-500" />
            ) : (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  accent === 'orange' ? 'bg-orange-400 animate-pulse' : 'bg-teal-300 animate-pulse'
                }`}
              />
            )}
            <span className="text-[9px] font-mono tracking-[0.22em] uppercase text-slate-400">
              Análise Nymos
            </span>
          </div>
          {showBadge && (
            <span className="text-[9px] font-mono tabular-nums text-orange-300 bg-orange-500/15 border border-orange-400/40 px-1.5 py-0.5">
              {pendingSignalsCount} sinais
            </span>
          )}
        </div>

        {/* Mini face */}
        <div className="my-1">
          <ShellInvocationIcon
            hasProactiveSuggestion={status === 'signals-detected'}
            size={64}
          />
        </div>

        {/* Status text */}
        <div className="text-center">
          <div className={`text-[11px] font-mono tracking-[0.18em] uppercase ${accentText}`}>
            {copy.label}
          </div>
          <div className="text-[9.5px] text-slate-500 mt-0.5">{copy.sublabel}</div>
        </div>

        {/* CTA hint */}
        {!isLocked && (
          <div className="text-[9px] font-mono tracking-widest uppercase text-teal-400/60 mt-0.5">
            {open ? 'Fechar' : 'Ver diagnóstico →'}
          </div>
        )}
        {isLocked && (
          <div className="text-[9px] font-mono tracking-widest uppercase text-teal-400/70 mt-0.5">
            {planGate.upgradeCtaLabel}
          </div>
        )}
      </button>

      {open && (
        <NymosPerformancePopover
          student={student}
          metrics={metrics}
          adherence={adherence}
          analysisInsights={analysisInsights}
          suggestedAction={suggestedAction}
          planGate={planGate}
          onClose={handleClose}
          onGenerateReport={onGenerateReport}
          onShareWithStudent={onShareWithStudent}
          onAskNymos={onAskNymos}
          onDrillDownInsight={onDrillDownInsight}
          onDrillDownMetric={onDrillDownMetric}
          onAcceptSuggestion={onAcceptSuggestion}
        />
      )}
    </div>
  )
}
