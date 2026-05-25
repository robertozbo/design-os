import { useMemo, useState } from 'react'
import type { DiagnosticoSemanalDoLiderProps } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { DiagnosticoHeader } from './DiagnosticoHeader'
import { WeeklyStatusBanner } from './WeeklyStatusBanner'
import { SignalKpiStrip } from './SignalKpiStrip'
import { SignalEvolutionChart } from './SignalEvolutionChart'
import { ActiveActionsList } from './ActiveActionsList'
import { RiskCollaboratorsPanel } from './RiskCollaboratorsPanel'

export function DiagnosticoSemanalDoLider({
  team,
  currentWeek,
  weeklySignals,
  signalHistory,
  activeActions,
  riskCollaborators,
  onStartDiagnosis,
  onOpenDiagnosisDetail,
  onOpenActionDetail,
  onUpdateActionStatus,
  onOpenRiskCollaborator,
  onForwardToSst,
}: DiagnosticoSemanalDoLiderProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  function toggleSeries(id: string) {
    setHiddenSeries((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const sortedActions = useMemo(() => {
    const order: Record<string, number> = { overdue: 0, in_progress: 1, completed: 2 }
    return [...activeActions].sort((a, b) => {
      const so = order[a.status] - order[b.status]
      if (so !== 0) return so
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    })
  }, [activeActions])

  const sortedRisk = useMemo(() => {
    const order: Record<string, number> = { critical: 0, high: 1, moderate: 2 }
    return [...riskCollaborators].sort((a, b) => order[a.riskLevel] - order[b.riskLevel])
  }, [riskCollaborators])

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

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <DiagnosticoHeader team={team} currentWeek={currentWeek} onStartDiagnosis={onStartDiagnosis} />

        <div className="mt-7">
          <WeeklyStatusBanner
            currentWeek={currentWeek}
            onStartDiagnosis={onStartDiagnosis}
            onOpenDiagnosisDetail={onOpenDiagnosisDetail}
          />
        </div>

        <div className="mt-7">
          <SignalKpiStrip signals={weeklySignals} />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-6">
          <div className="min-w-0 space-y-6">
            <SignalEvolutionChart
              signals={weeklySignals}
              history={signalHistory}
              hiddenSeries={hiddenSeries}
              onToggleSeries={toggleSeries}
            />
            <ActiveActionsList
              actions={sortedActions}
              onOpenActionDetail={onOpenActionDetail}
              onUpdateActionStatus={onUpdateActionStatus}
            />
          </div>

          <div className="min-w-0">
            <RiskCollaboratorsPanel
              riskCollaborators={sortedRisk}
              onOpenRiskCollaborator={onOpenRiskCollaborator}
              onForwardToSst={onForwardToSst}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
      <div className="absolute -top-40 -right-32 w-[640px] h-[640px] rounded-full bg-teal-200/40 dark:bg-teal-900/20 blur-3xl" />
      <div className="absolute -top-24 left-[28%] w-[480px] h-[480px] rounded-full bg-violet-200/30 dark:bg-violet-950/30 blur-3xl" />
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
      @keyframes nymos-pulse-ring {
        0%   { transform: scale(1);   opacity: 0.55; }
        80%  { transform: scale(2.6); opacity: 0; }
        100% { transform: scale(2.6); opacity: 0; }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .nymos-pulse-dot {
        position: relative;
      }
      .nymos-pulse-dot::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        background: currentColor;
        animation: nymos-pulse-ring 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        z-index: 0;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
        .nymos-pulse-dot::after { animation: none !important; }
      }
    `}</style>
  )
}
