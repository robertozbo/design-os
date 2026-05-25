import { ArrowRight, ChevronDown, Watch, Utensils, Link2, User, Users, FileText, Sparkles } from 'lucide-react'
import type { HeroContent } from '@/../product/sections/landing-page/types'

interface LandingHeroProps {
  content: HeroContent
  onPrimary?: () => void
  onSecondary?: () => void
  onAnchorClick?: (href: string) => void
}

const ICON_MAP: Record<string, typeof Watch> = {
  Watch, Utensils, Link2, User, Users, FileText,
}

const ACCENT_BG: Record<string, string> = {
  teal: 'bg-teal-400/15 text-teal-300 ring-1 ring-teal-400/30',
  emerald: 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30',
  purple: 'bg-violet-400/15 text-violet-300 ring-1 ring-violet-400/30',
  sky: 'bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30',
  orange: 'bg-orange-400/15 text-orange-300 ring-1 ring-orange-400/30',
  amber: 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30',
  rose: 'bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/30',
  indigo: 'bg-indigo-400/15 text-indigo-300 ring-1 ring-indigo-400/30',
  green: 'bg-green-400/15 text-green-300 ring-1 ring-green-400/30',
}

function BentoCard({
  icon, iconAccent, title, caption, metric, side,
}: {
  icon: string; iconAccent: string; title: string; caption: string
  metric?: { value: string; label?: string; percent?: number }
  side: 'patient' | 'professional'
}) {
  const Icon = ICON_MAP[icon] ?? User
  const sideRing = side === 'patient' ? 'ring-teal-400/10' : 'ring-emerald-400/10'

  return (
    <div className={`relative rounded-2xl bg-white/[0.04] backdrop-blur-sm ring-1 ${sideRing} p-4 hover:bg-white/[0.06] hover:scale-[1.02] transition-all duration-300`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-9 h-9 rounded-lg grid place-items-center ${ACCENT_BG[iconAccent] ?? ACCENT_BG.teal}`}>
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-100 truncate">{title}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{caption}</p>
        </div>
      </div>
      {metric && (
        <div className="mt-3 flex items-end justify-between">
          <div className="font-mono text-lg font-bold text-slate-50 tracking-tight">{metric.value}</div>
          {metric.label && <div className="text-[10px] uppercase tracking-wider text-slate-500">{metric.label}</div>}
          {typeof metric.percent === 'number' && (
            <div className="ml-2 flex-1 max-w-[60px] h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400"
                style={{ width: `${Math.min(100, metric.percent)}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function LandingHero({ content, onPrimary, onSecondary, onAnchorClick }: LandingHeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden"
    >
      {/* Mesh background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 20% 10%, rgba(20,184,166,0.18) 0px, transparent 50%),' +
            'radial-gradient(at 80% 30%, rgba(16,185,129,0.15) 0px, transparent 50%),' +
            'radial-gradient(at 50% 100%, rgba(251,113,133,0.08) 0px, transparent 50%)',
        }}
      />
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(148,163,184,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left — Text */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30 mb-7">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.eyebrow}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-slate-50 mb-6">
              {content.titleLine1}
              <br />
              <span className="bg-gradient-to-br from-teal-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                {content.titleLine2Gradient}
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-9">
              {content.subtitle}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 mb-5">
              <button
                onClick={onPrimary}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-br from-teal-300 via-teal-400 to-emerald-500 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {content.ctaPrimary.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onSecondary}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 hover:ring-white/20 transition-all"
              >
                {content.ctaSecondary.label}
                <ChevronDown className="w-4 h-4 lg:hidden" />
                <ArrowRight className="w-4 h-4 hidden lg:inline-block" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-7">{content.microcopy}</p>

            {/* Trust pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2.5">
              {content.trustPills.map((pill) => (
                <div key={pill.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-teal-300 to-emerald-400" />
                  <span className="text-xs sm:text-sm font-medium text-slate-400">{pill.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dual Bento */}
          <div className="lg:col-span-6 relative">
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-8 rounded-3xl blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)' }}
            />

            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              {/* Patient column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="text-[10px] uppercase tracking-widest font-bold text-teal-400/80 px-1">
                  Paciente
                </div>
                {content.bentoPatient.map((c) => (
                  <BentoCard key={c.id} {...c} side="patient" />
                ))}
              </div>

              {/* Professional column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400/80 px-1">
                  Profissional
                </div>
                {content.bentoProfessional.map((c) => (
                  <BentoCard key={c.id} {...c} side="professional" />
                ))}
              </div>

              {/* Connecting line with pulse */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-teal-300/40 to-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-200 to-transparent opacity-60 animate-pulse" />
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-sm ring-1 ring-teal-400/40 text-[10px] font-mono text-teal-200 whitespace-nowrap shadow-lg shadow-teal-500/20">
                ⟷ dados em tempo real
              </div>
            </div>
          </div>
        </div>

        {/* Integrations bar */}
        <div className="mt-20 lg:mt-24">
          <p className="text-center text-xs sm:text-sm font-medium text-slate-500 mb-5">
            {content.integrationsTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {content.integrations.map(({ name, color }) => (
              <div
                key={name}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.03] transition-all"
                style={{ background: `${color}10`, borderColor: `${color}30` }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap" style={{ color }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
