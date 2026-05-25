import { ArrowRight, Users } from 'lucide-react'
import type { FinalCTAContent } from '@/../product/sections/landing-page/types'

interface Props {
  content: FinalCTAContent
  onPatient?: () => void
  onProfessional?: () => void
}

export function LandingFinalCTA({ content, onPatient, onProfessional }: Props) {
  return (
    <section id="final-cta" className="relative py-28 lg:py-40 overflow-hidden">
      {/* Intense mesh — closing moment */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 50% 50%, rgba(20,184,166,0.25) 0px, transparent 60%),' +
            'radial-gradient(at 20% 80%, rgba(16,185,129,0.18) 0px, transparent 50%),' +
            'radial-gradient(at 80% 20%, rgba(167,139,250,0.10) 0px, transparent 50%)',
        }}
      />

      {/* Grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-slate-50 mb-6">
          {content.titleLine1}
          <br />
          <span className="bg-gradient-to-br from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            {content.titleLine2Gradient}
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed mb-10">
          {content.subtitle}
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-8">
          <button
            onClick={onPatient}
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm lg:text-base font-bold text-slate-950 bg-gradient-to-br from-teal-300 via-teal-400 to-emerald-500 shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-[1.02] transition-all"
          >
            {content.ctaPatient.label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={onProfessional}
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm lg:text-base font-bold text-slate-50 bg-white/[0.06] ring-1 ring-white/15 hover:bg-white/[0.1] hover:ring-emerald-400/40 hover:scale-[1.02] transition-all backdrop-blur-md"
          >
            {content.ctaProfessional.label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Microcopy chips */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-10">
          {content.microcopyChips.map((chip, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-teal-300/70" />
              <span className="text-xs text-slate-400">{chip}</span>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.03] ring-1 ring-white/[0.08] backdrop-blur-sm">
          <Users className="w-3.5 h-3.5 text-teal-300" />
          <span className="text-xs lg:text-sm text-slate-300 font-medium">{content.socialProof}</span>
        </div>
      </div>
    </section>
  )
}
