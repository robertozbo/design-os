import { Mail, ShieldCheck, Repeat } from 'lucide-react'
import type { LoopContent } from '@/../product/sections/landing-page/types'

const ICONS: Record<string, typeof Mail> = { Mail, ShieldCheck, Repeat }

const ACCENT: Record<string, { bg: string; text: string; ring: string; glow: string }> = {
  teal: { bg: 'from-teal-400/20 to-teal-500/10', text: 'text-teal-300', ring: 'ring-teal-400/30', glow: 'shadow-teal-500/25' },
  purple: { bg: 'from-violet-400/20 to-violet-500/10', text: 'text-violet-300', ring: 'ring-violet-400/30', glow: 'shadow-violet-500/25' },
  emerald: { bg: 'from-emerald-400/20 to-emerald-500/10', text: 'text-emerald-300', ring: 'ring-emerald-400/30', glow: 'shadow-emerald-500/25' },
}

interface Props {
  content: LoopContent
}

export function LandingLoop({ content }: Props) {
  return (
    <section id="loop" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 20% 50%, rgba(167,139,250,0.10) 0px, transparent 50%),' +
            'radial-gradient(at 80% 50%, rgba(16,185,129,0.08) 0px, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30 mb-6">
            {content.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-50">
            {content.titleLine1}{' '}
            <span className="bg-gradient-to-br from-teal-300 via-emerald-300 to-violet-300 bg-clip-text text-transparent">
              {content.titleLine2Gradient}
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 relative">
          {/* Connecting line */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-teal-400/30 via-violet-400/30 to-emerald-400/30"
          />

          {content.steps.map((step) => {
            const Icon = ICONS[step.icon] ?? Mail
            const a = ACCENT[step.iconAccent] ?? ACCENT.teal
            return (
              <div key={step.id} className="relative">
                <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-sm ring-1 ring-white/[0.08] p-7 hover:bg-white/[0.05] hover:ring-white/15 transition-all duration-300">
                  {/* Step number */}
                  <div className={`absolute -top-4 left-7 w-9 h-9 rounded-full bg-gradient-to-br ${a.bg} ring-2 ring-slate-950 grid place-items-center font-mono font-bold text-sm ${a.text} shadow-lg ${a.glow}`}>
                    {step.number}
                  </div>

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.bg} ring-1 ${a.ring} grid place-items-center mb-4 mt-2`}>
                    <Icon className={`w-5 h-5 ${a.text}`} strokeWidth={2.2} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 mb-2.5 tracking-tight">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mockup stack */}
        <div className="mt-16 lg:mt-20 flex justify-center items-end gap-2 sm:gap-3">
          {content.mockupStack.map((card, idx) => {
            const accent = card.accent ?? 'teal'
            const a = ACCENT[accent] ?? ACCENT.teal
            const rotate = idx === 0 ? '-rotate-3' : idx === 2 ? 'rotate-3' : ''
            const offset = idx === 1 ? '-translate-y-6 z-10' : ''
            return (
              <div
                key={card.id}
                className={`relative w-28 sm:w-36 lg:w-44 aspect-[3/4] rounded-2xl bg-white/[0.04] backdrop-blur-md ring-1 ${a.ring} p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all duration-500 ${rotate} ${offset} hover:scale-105 hover:z-20`}
                style={{ boxShadow: `0 10px 40px -10px rgba(20,184,166,0.15)` }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${a.bg} ring-1 ${a.ring} grid place-items-center mb-3`}>
                  <div className={`w-4 h-4 rounded-sm bg-gradient-to-br ${a.bg} ${a.text}`} />
                </div>
                <p className={`text-xs sm:text-sm font-semibold ${a.text}`}>{card.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
