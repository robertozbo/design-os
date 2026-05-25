import { ToggleRight, Globe, Lock, Eye } from 'lucide-react'
import type { TrustContent } from '@/../product/sections/landing-page/types'

const ICONS: Record<string, typeof Lock> = { ToggleRight, Globe, Lock, Eye }

const ACCENT: Record<string, { bg: string; ring: string; text: string }> = {
  teal: { bg: 'from-teal-400/20 to-emerald-500/10', ring: 'ring-teal-400/30', text: 'text-teal-300' },
  emerald: { bg: 'from-emerald-400/20 to-green-500/10', ring: 'ring-emerald-400/30', text: 'text-emerald-300' },
  purple: { bg: 'from-violet-400/20 to-purple-500/10', ring: 'ring-violet-400/30', text: 'text-violet-300' },
  amber: { bg: 'from-amber-400/20 to-yellow-500/10', ring: 'ring-amber-400/30', text: 'text-amber-300' },
}

interface Props {
  content: TrustContent
}

export function LandingTrust({ content }: Props) {
  return (
    <section id="trust" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 50% 50%, rgba(20,184,166,0.06) 0px, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 lg:mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30 mb-6">
            {content.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-50">
            {content.titleLine1}{' '}
            <span className="bg-gradient-to-br from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              {content.titleLine2Gradient}
            </span>
          </h2>
          <p className="mt-6 text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-10">
          {content.pillars.map((pillar) => {
            const Icon = ICONS[pillar.icon] ?? Lock
            const a = ACCENT[pillar.iconAccent] ?? ACCENT.teal
            return (
              <div
                key={pillar.id}
                className="group relative rounded-2xl bg-white/[0.025] backdrop-blur-sm ring-1 ring-white/[0.08] p-5 lg:p-6 hover:bg-white/[0.05] hover:ring-white/15 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.bg} ring-1 ${a.ring} grid place-items-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 ${a.text}`} strokeWidth={2.2} />
                </div>
                <h3 className="text-sm lg:text-base font-bold text-slate-100 mb-2 tracking-tight">{pillar.title}</h3>
                <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">{pillar.description}</p>
              </div>
            )
          })}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {content.badges.map((badge) => (
            <div
              key={badge.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.02] ring-1 ring-white/[0.06]"
            >
              {badge.prefix && <span>{badge.prefix}</span>}
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
