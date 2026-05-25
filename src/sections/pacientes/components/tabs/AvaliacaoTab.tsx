import { Lock, Ruler, Sparkles } from 'lucide-react'
import type { AvaliacaoData, PlanTier } from '@/../product/sections/pacientes/types'

interface AvaliacaoTabProps {
  data: AvaliacaoData
  currentPlan: PlanTier
  onUpgradeClick?: (toPlan: PlanTier) => void
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function AvaliacaoTab({ data, currentPlan, onUpgradeClick }: AvaliacaoTabProps) {
  const locked = PLAN_RANK[currentPlan] < PLAN_RANK[data.lockedForPlan]

  if (!locked) {
    // Pro user — show normal antropometria view (placeholder; full design in V2)
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Avaliação Antropométrica
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
          Tela completa de antropometria com histórico, gráficos e formulário expandido — desenhada nos próximos batches.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[2fr_3fr]">
      {/* Preview blurred */}
      <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Ruler size={14} className="text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Última avaliação
            </h2>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
            {formatDate(data.preview.lastDate)}
          </span>
        </header>

        <div className="relative mt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.preview.values.map((v) => (
              <div
                key={v.label}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/40"
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {v.label}
                </p>
                <p className="mt-1 font-mono text-base font-semibold tabular-nums text-slate-900 blur-sm select-none dark:text-slate-50">
                  {v.value}
                </p>
              </div>
            ))}
          </div>

          {/* Lock overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/40 to-white/80 dark:via-slate-900/40 dark:to-slate-900/80">
            <div className="rounded-full bg-white/90 p-3 shadow-lg dark:bg-slate-800">
              <Lock size={20} className="text-orange-500" />
            </div>
          </div>
        </div>
      </article>

      {/* Paywall */}
      <article className="relative overflow-hidden rounded-2xl border border-orange-300 bg-gradient-to-br from-slate-900 via-orange-950 to-orange-900 p-6 text-white dark:border-orange-700">
        <div
          className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-orange-500 opacity-25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-amber-400 opacity-15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1">
            <Sparkles size={12} className="text-orange-300" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-200">
              Plano Pro
            </p>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight">
            Avaliação Antropométrica completa
          </h3>

          <p className="text-sm text-slate-300">{data.paywallMessage}</p>

          <ul className="space-y-2 pt-1">
            {[
              'Formulário expandido com peso, altura, IMC, perímetros e composição corporal',
              'Histórico evolutivo com gráficos por medida',
              'Configurável via Configurações → Preferências de Medições',
              'Exportação em PDF com identidade visual do nutri',
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-slate-200"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                {feature}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => onUpgradeClick?.('pro')}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-400"
          >
            Ver plano Pro · R$ 99,90/mês
          </button>
        </div>
      </article>
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}
