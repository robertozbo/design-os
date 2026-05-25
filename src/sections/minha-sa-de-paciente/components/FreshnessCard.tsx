import { AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import type {
  FreshnessGate,
  FreshnessRequirement,
  FreshnessRequirementKind,
} from '@/../product/sections/minha-sa-de-paciente/types'

interface FreshnessCardProps {
  gate: FreshnessGate
  onAddRequirement?: (
    kind: FreshnessRequirementKind,
    addHref: string,
  ) => void
  onRequestNewAnalysis?: () => void
  isRequesting?: boolean
}

const REQUIREMENT_LABEL: Record<FreshnessRequirementKind, string> = {
  bioimpedance: 'Bioimpedância',
  lab_exam: 'Exame laboratorial',
  body_photos: 'Fotos corporais',
}

export function FreshnessCard({
  gate,
  onAddRequirement,
  onRequestNewAnalysis,
  isRequesting,
}: FreshnessCardProps) {
  const { eligible, reason, requirements, cooldownDaysRemaining } = gate

  return (
    <section
      className={`overflow-hidden rounded-3xl border p-5 ${
        eligible
          ? 'border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-400/30 dark:bg-emerald-400/5'
          : 'border-amber-500/30 bg-amber-500/5 dark:border-amber-400/30 dark:bg-amber-400/5'
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              eligible
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
            }`}
          >
            {eligible ? (
              <CheckCircle2 className="h-5 w-5" aria-hidden />
            ) : (
              <AlertCircle className="h-5 w-5" aria-hidden />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {eligible
                ? 'Elegível para nova análise'
                : 'Aguardando novos dados'}
            </h3>
            <p className="mt-0.5 max-w-xl text-xs text-slate-600 dark:text-slate-400">
              {reason}
            </p>
          </div>
        </div>

        {eligible && (
          <button
            type="button"
            onClick={onRequestNewAnalysis}
            disabled={isRequesting}
            className="shrink-0 rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRequesting ? 'Gerando…' : 'Nova análise'}
          </button>
        )}
      </header>

      {/* Requirements checklist */}
      {requirements.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {requirements.map((req: FreshnessRequirement) => (
            <li
              key={req.kind}
              className="flex items-center justify-between gap-3 rounded-xl bg-white/60 px-3 py-2 dark:bg-slate-900/60"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    req.available
                      ? 'bg-emerald-500'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  aria-hidden
                />
                <span
                  className={`text-xs ${
                    req.available
                      ? 'text-slate-700 dark:text-slate-200'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {REQUIREMENT_LABEL[req.kind]} — {req.label}
                </span>
              </div>
              {!req.available && (
                <button
                  type="button"
                  onClick={() => onAddRequirement?.(req.kind, req.addHref)}
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-teal-600 transition-colors hover:bg-teal-500/10 dark:text-teal-400"
                >
                  <Plus className="h-3 w-3" aria-hidden />
                  Adicionar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Cooldown */}
      {!eligible && cooldownDaysRemaining > 0 && (
        <p className="mt-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          Cooldown: {cooldownDaysRemaining} dia
          {cooldownDaysRemaining === 1 ? '' : 's'} restante
          {cooldownDaysRemaining === 1 ? '' : 's'}
        </p>
      )}
    </section>
  )
}
