import { Watch, Utensils, Activity, FileText, Bell, ArrowRight, Sparkles } from 'lucide-react'
import type { PatientSectionContent } from '@/../product/sections/landing-page/types'

const ICONS: Record<string, typeof Watch> = {
  Watch, Utensils, Activity, FileText, Bell,
}

const ACCENT: Record<string, { bg: string; ring: string; text: string; chip: string }> = {
  sky: { bg: 'from-sky-400/20 to-cyan-500/10', ring: 'ring-sky-400/30', text: 'text-sky-300', chip: 'bg-sky-400/15 text-sky-300 ring-sky-400/30' },
  emerald: { bg: 'from-emerald-400/20 to-green-500/10', ring: 'ring-emerald-400/30', text: 'text-emerald-300', chip: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30' },
  teal: { bg: 'from-teal-400/20 to-emerald-500/10', ring: 'ring-teal-400/30', text: 'text-teal-300', chip: 'bg-teal-400/15 text-teal-300 ring-teal-400/30' },
  purple: { bg: 'from-violet-400/20 to-purple-500/10', ring: 'ring-violet-400/30', text: 'text-violet-300', chip: 'bg-violet-400/15 text-violet-300 ring-violet-400/30' },
  amber: { bg: 'from-amber-400/20 to-yellow-500/10', ring: 'ring-amber-400/30', text: 'text-amber-300', chip: 'bg-amber-400/15 text-amber-300 ring-amber-400/30' },
}

interface Props {
  content: PatientSectionContent
  onCta?: () => void
}

export function LandingPatient({ content, onCta }: Props) {
  return (
    <section id="patient" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 10% 30%, rgba(56,189,248,0.10) 0px, transparent 50%),' +
            'radial-gradient(at 90% 70%, rgba(20,184,166,0.08) 0px, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left — Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/30 mb-6">
              {content.eyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-slate-50 mb-5">
              {content.titleLine1}{' '}
              <span className="bg-gradient-to-br from-sky-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
                {content.titleLine2Gradient}
              </span>
            </h2>
            <p className="text-base lg:text-lg text-slate-400 leading-relaxed mb-7">
              {content.subtitle}
            </p>
            <button
              onClick={onCta}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-100 bg-white/[0.05] ring-1 ring-white/10 hover:bg-white/[0.1] hover:ring-sky-400/30 transition-all"
            >
              Começar como paciente
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right — Capabilities grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {content.capabilities.map((cap) => {
              const Icon = ICONS[cap.icon] ?? Watch
              const a = ACCENT[cap.iconAccent] ?? ACCENT.sky
              return (
                <div
                  key={cap.id}
                  className="group relative rounded-2xl bg-white/[0.025] backdrop-blur-sm ring-1 ring-white/[0.08] p-5 lg:p-6 hover:bg-white/[0.05] hover:ring-white/15 transition-all duration-300"
                >
                  {cap.exclusive && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-br from-rose-400/20 to-orange-400/10 text-rose-300 ring-1 ring-rose-400/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      Exclusivo
                    </div>
                  )}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.bg} ring-1 ${a.ring} grid place-items-center mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 ${a.text}`} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-2 tracking-tight">{cap.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{cap.description}</p>
                  {cap.chip && (
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ring-1 ${a.chip}`}>
                      {cap.chip}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
