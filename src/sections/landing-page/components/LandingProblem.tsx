import { CalendarX, Unplug, RotateCcw } from 'lucide-react'
import type { ProblemContent } from '@/../product/sections/landing-page/types'

const ICONS: Record<string, typeof CalendarX> = {
  CalendarX, Unplug, RotateCcw,
}

interface Props {
  content: ProblemContent
}

export function LandingProblem({ content }: Props) {
  return (
    <section id="problem" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 50% 0%, rgba(20,184,166,0.06) 0px, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/30 mb-6">
            {content.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-50 max-w-3xl mx-auto">
            {content.titleLine1}{' '}
            <span className="bg-gradient-to-br from-rose-300 via-orange-300 to-amber-300 bg-clip-text text-transparent">
              {content.titleLine2}
            </span>
          </h2>
          <p className="mt-6 text-base lg:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {content.cards.map((card, idx) => {
            const Icon = ICONS[card.icon] ?? CalendarX
            return (
              <div
                key={card.id}
                className="group relative rounded-2xl bg-white/[0.025] backdrop-blur-sm ring-1 ring-white/[0.08] p-7 hover:bg-white/[0.04] hover:ring-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-400/15 to-orange-400/10 ring-1 ring-rose-400/20 grid place-items-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-rose-300" strokeWidth={2.2} />
                  </div>
                  <div className="font-mono text-xs text-slate-600">0{idx + 1}</div>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2.5 tracking-tight">{card.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
