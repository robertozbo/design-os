import { ArrowRight, Sparkles } from 'lucide-react'
import type { UpsellCard as UpsellCardData } from '@/../product/sections/dashboard-nutri/types'

interface UpsellCardProps {
  card: UpsellCardData
  onClick?: () => void
}

export function UpsellCard({ card, onClick }: UpsellCardProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 p-6 text-slate-50 dark:border-slate-700">
      <div
        className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-orange-500 opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-teal-400 opacity-15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-orange-300">
            <Sparkles size={12} />
            Plano {card.fromPlan} → {card.toPlan}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight">{card.title}</h3>
          <p className="text-sm text-slate-300">{card.subtitle}</p>

          {!card.compact && (
            <ul className="mt-2 space-y-1.5">
              {card.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-200">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={onClick}
          className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-500/40"
        >
          {card.ctaLabel}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  )
}
