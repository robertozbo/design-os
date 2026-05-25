import { Salad, Dumbbell, Brain, HardHat, Stethoscope } from 'lucide-react'
import type { VerticaisContent } from '@/../product/sections/landing-page/types'

const ICONS: Record<string, typeof Salad> = {
  Salad, Dumbbell, Brain, HardHat, Stethoscope,
}

const ACCENT: Record<string, { bg: string; ring: string; text: string }> = {
  green: { bg: 'from-green-400/20 to-emerald-500/10', ring: 'ring-green-400/30', text: 'text-green-300' },
  orange: { bg: 'from-orange-400/20 to-amber-500/10', ring: 'ring-orange-400/30', text: 'text-orange-300' },
  purple: { bg: 'from-violet-400/20 to-purple-500/10', ring: 'ring-violet-400/30', text: 'text-violet-300' },
  amber: { bg: 'from-amber-400/20 to-yellow-500/10', ring: 'ring-amber-400/30', text: 'text-amber-300' },
  rose: { bg: 'from-rose-400/20 to-pink-500/10', ring: 'ring-rose-400/30', text: 'text-rose-300' },
}

interface Props {
  content: VerticaisContent
}

export function LandingVerticais({ content }: Props) {
  return (
    <section id="verticais" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 50% 100%, rgba(20,184,166,0.10) 0px, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 lg:mb-20">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30 mb-6">
            {content.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-50 max-w-3xl mx-auto">
            {content.titleLine1}{' '}
            <span className="bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              {content.titleLine2Gradient}
            </span>
          </h2>
          <p className="mt-6 text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {content.cards.map((card) => {
            const Icon = ICONS[card.icon] ?? Salad
            const a = ACCENT[card.iconAccent] ?? ACCENT.green
            return (
              <div
                key={card.slug}
                className="group relative rounded-2xl bg-white/[0.025] backdrop-blur-sm ring-1 ring-white/[0.08] p-6 hover:bg-white/[0.05] hover:ring-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Badge */}
                {card.badge === 'em-breve' && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30">
                    Em breve
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.bg} ring-1 ${a.ring} grid place-items-center mb-5 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 ${a.text}`} strokeWidth={2.2} />
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">{card.title}</h3>
                </div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
                  {card.audience}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
