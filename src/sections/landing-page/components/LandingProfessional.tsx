import { Users, FileText, UserPlus, Calendar, BarChart3, Sparkles, ArrowRight } from 'lucide-react'
import type { ProfessionalSectionContent } from '@/../product/sections/landing-page/types'

const ICONS: Record<string, typeof Users> = {
  Users, FileText, UserPlus, Calendar, BarChart3, Sparkles,
}

const ACCENT: Record<string, { bg: string; ring: string; text: string; chip: string }> = {
  teal: { bg: 'from-teal-400/20 to-emerald-500/10', ring: 'ring-teal-400/30', text: 'text-teal-300', chip: 'bg-teal-400/15 text-teal-300 ring-teal-400/30' },
  emerald: { bg: 'from-emerald-400/20 to-green-500/10', ring: 'ring-emerald-400/30', text: 'text-emerald-300', chip: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30' },
  purple: { bg: 'from-violet-400/20 to-purple-500/10', ring: 'ring-violet-400/30', text: 'text-violet-300', chip: 'bg-violet-400/15 text-violet-300 ring-violet-400/30' },
  sky: { bg: 'from-sky-400/20 to-blue-500/10', ring: 'ring-sky-400/30', text: 'text-sky-300', chip: 'bg-sky-400/15 text-sky-300 ring-sky-400/30' },
  orange: { bg: 'from-orange-400/20 to-amber-500/10', ring: 'ring-orange-400/30', text: 'text-orange-300', chip: 'bg-orange-400/15 text-orange-300 ring-orange-400/30' },
  indigo: { bg: 'from-indigo-400/20 to-violet-500/10', ring: 'ring-indigo-400/30', text: 'text-indigo-300', chip: 'bg-indigo-400/15 text-indigo-300 ring-indigo-400/30' },
}

interface Props {
  content: ProfessionalSectionContent
  onCta?: () => void
}

export function LandingProfessional({ content, onCta }: Props) {
  return (
    <section id="professional" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 90% 30%, rgba(16,185,129,0.10) 0px, transparent 50%),' +
            'radial-gradient(at 10% 70%, rgba(139,92,246,0.08) 0px, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left — Features grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 lg:order-1 order-2">
            {content.features.map((feat) => {
              const Icon = ICONS[feat.icon] ?? Users
              const a = ACCENT[feat.iconAccent] ?? ACCENT.emerald
              return (
                <div
                  key={feat.id}
                  className="group relative rounded-2xl bg-white/[0.025] backdrop-blur-sm ring-1 ring-white/[0.08] p-5 lg:p-6 hover:bg-white/[0.05] hover:ring-white/15 transition-all duration-300"
                >
                  {feat.tierGate && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-br from-amber-400/20 to-orange-400/10 text-amber-300 ring-1 ring-amber-400/30">
                      {feat.tierGate === 'pro' ? 'Pro+' : 'Plus+'}
                    </div>
                  )}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.bg} ring-1 ${a.ring} grid place-items-center mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 ${a.text}`} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-2 tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{feat.description}</p>
                  {feat.chip && (
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ring-1 ${a.chip}`}>
                      {feat.chip}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right — Header (sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:order-2 order-1">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30 mb-6">
              {content.eyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-50 mb-5">
              {content.titleLine1}{' '}
              <span className="bg-gradient-to-br from-emerald-300 via-teal-300 to-violet-300 bg-clip-text text-transparent">
                {content.titleLine2Gradient}
              </span>
            </h2>
            <p className="text-base lg:text-lg text-slate-400 leading-relaxed mb-7">
              {content.subtitle}
            </p>
            <button
              onClick={onCta}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
            >
              Cadastrar como profissional
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
