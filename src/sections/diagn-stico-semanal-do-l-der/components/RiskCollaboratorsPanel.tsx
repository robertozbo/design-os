import type { RiskCollaborator } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { ShieldAlert } from 'lucide-react'
import { RiskCollaboratorItem } from './RiskCollaboratorItem'

interface Props {
  riskCollaborators: RiskCollaborator[]
  onOpenRiskCollaborator?: (anonId: string) => void
  onForwardToSst?: (anonId: string) => void
}

export function RiskCollaboratorsPanel({
  riskCollaborators,
  onOpenRiskCollaborator,
  onForwardToSst,
}: Props) {
  const criticalCount = riskCollaborators.filter((r) => r.riskLevel === 'critical').length

  return (
    <aside
      style={{ animationDelay: '680ms' }}
      className="
        nymos-reveal opacity-0
        rounded-2xl bg-white dark:bg-slate-900/60
        border border-slate-200 dark:border-slate-800
        overflow-hidden
      "
    >
      <header className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <ShieldAlert className="w-3 h-3" strokeWidth={2.25} />
          Acompanhamento individual
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Em risco
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {riskCollaborators.length} {riskCollaborators.length === 1 ? 'caso' : 'casos'}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Identidade preservada. Sinais agregados anônimos exigem acompanhamento próximo do líder.
        </p>
        {criticalCount > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-[11px] font-medium">
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-rose-500 nymos-pulse-dot text-rose-500" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-rose-500" />
            </span>
            {criticalCount} {criticalCount === 1 ? 'caso crítico' : 'casos críticos'}
          </div>
        )}
      </header>

      {riskCollaborators.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Nenhum colaborador sinalizado nesta semana.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {riskCollaborators.map((collab) => (
            <RiskCollaboratorItem
              key={collab.anonId}
              collaborator={collab}
              onOpen={() => onOpenRiskCollaborator?.(collab.anonId)}
              onForward={() => onForwardToSst?.(collab.anonId)}
            />
          ))}
        </ul>
      )}
    </aside>
  )
}
