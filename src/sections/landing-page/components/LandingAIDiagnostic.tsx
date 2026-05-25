import { Brain, Salad, Dumbbell, Stethoscope, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import type { AIDiagnosticContent } from '@/../product/sections/landing-page/types'

const ICONS: Record<string, typeof Brain> = { Brain, Salad, Dumbbell, Stethoscope }

const ACCENT: Record<string, { bg: string; ring: string; text: string; glow: string }> = {
  purple: { bg: 'from-violet-400/25 to-purple-500/10', ring: 'ring-violet-400/40', text: 'text-violet-300', glow: 'shadow-violet-500/20' },
  green: { bg: 'from-green-400/25 to-emerald-500/10', ring: 'ring-green-400/40', text: 'text-green-300', glow: 'shadow-green-500/20' },
  orange: { bg: 'from-orange-400/25 to-amber-500/10', ring: 'ring-orange-400/40', text: 'text-orange-300', glow: 'shadow-orange-500/20' },
  rose: { bg: 'from-rose-400/25 to-pink-500/10', ring: 'ring-rose-400/40', text: 'text-rose-300', glow: 'shadow-rose-500/20' },
}

interface Props {
  content: AIDiagnosticContent
  onCtaClick?: () => void
}

export function LandingAIDiagnostic({ content, onCtaClick }: Props) {
  return (
    <section id="ai-diagnostic" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Stronger mesh — this is the killer feature */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 30% 0%, rgba(167,139,250,0.18) 0px, transparent 50%),' +
            'radial-gradient(at 70% 100%, rgba(20,184,166,0.15) 0px, transparent 50%),' +
            'radial-gradient(at 50% 50%, rgba(251,113,133,0.05) 0px, transparent 60%)',
        }}
      />

      {/* Animated grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase bg-gradient-to-br from-violet-400/15 via-teal-400/15 to-emerald-400/15 text-teal-300 ring-1 ring-teal-400/30 mb-6 shadow-lg shadow-teal-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            {content.eyebrow}
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-slate-50 max-w-4xl mx-auto">
            <span className="bg-gradient-to-br from-violet-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
              {content.titleLine1Gradient}
            </span>{' '}
            {content.titleLine2}{' '}
            <span className="bg-gradient-to-br from-teal-300 via-emerald-300 to-violet-300 bg-clip-text text-transparent">
              {content.titleLine3Gradient}
            </span>
          </h2>

          <p className="mt-7 text-base lg:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* 4 vertical cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-12">
          {content.cards.map((card) => {
            const Icon = ICONS[card.icon] ?? Brain
            const a = ACCENT[card.iconAccent] ?? ACCENT.purple
            return (
              <div
                key={card.vertical}
                className={`group relative rounded-3xl bg-white/[0.03] backdrop-blur-md ring-1 ${a.ring} p-7 lg:p-8 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${a.glow}`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.bg} ring-1 ${a.ring} grid place-items-center group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 ${a.text}`} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="text-base lg:text-lg font-bold text-slate-100 tracking-tight">{card.professionLabel}</h3>
                      <div className={`text-[10px] font-mono uppercase tracking-widest ${a.text} mt-0.5`}>{card.registry}</div>
                    </div>
                  </div>
                  {card.badge && (
                    <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30 whitespace-nowrap">
                      {card.badge}
                    </div>
                  )}
                </div>

                {/* AI suggestion */}
                <div className="mb-5 pl-4 border-l-2 border-white/10">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5">IA sugere</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{card.aiSuggestion}</p>
                </div>

                {/* Decision footer */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/[0.05]">
                  <CheckCircle2 className={`w-4 h-4 ${a.text} shrink-0`} strokeWidth={2.4} />
                  <p className="text-xs font-semibold text-slate-200">{card.decisionMaker}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust strip */}
        <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-md ring-1 ring-white/10 p-5 lg:p-6 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {content.trustChips.map((chip) => (
              <div key={chip.id} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-300 mt-0.5 shrink-0" strokeWidth={2.4} />
                <span className="text-xs lg:text-sm text-slate-300 leading-snug">{chip.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onCtaClick}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-teal-200 bg-white/[0.04] ring-1 ring-teal-400/30 hover:ring-teal-400/60 hover:bg-teal-400/10 transition-all"
          >
            {content.cta.label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
