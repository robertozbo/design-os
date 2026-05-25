import { Star, Quote } from 'lucide-react'
import type { TestimonialsContent } from '@/../product/sections/landing-page/types'

const AVATAR_ACCENT: Record<string, string> = {
  emerald: 'from-emerald-300 to-green-400',
  sky: 'from-sky-300 to-blue-400',
  orange: 'from-orange-300 to-amber-400',
  purple: 'from-violet-300 to-purple-400',
  rose: 'from-rose-300 to-pink-400',
  teal: 'from-teal-300 to-cyan-400',
}

interface Props {
  content: TestimonialsContent
}

export function LandingTestimonials({ content }: Props) {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 50% 50%, rgba(20,184,166,0.08) 0px, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        </div>

        {/* Marquee */}
        <div className="mb-12 overflow-hidden border-y border-white/[0.05] py-3">
          <div className="flex gap-12 whitespace-nowrap animate-marquee" style={{ animation: 'scroll 40s linear infinite' }}>
            {Array.from({ length: 2 }).flatMap((_, dup) =>
              content.marquee.split('·').map((piece, i) => (
                <span key={`${dup}-${i}`} className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  {piece.trim()}
                  <span className="ml-12 text-teal-400/40">·</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {content.items.map((item) => {
            const avatarGradient = AVATAR_ACCENT[item.avatarAccent] ?? AVATAR_ACCENT.teal
            const isProfessional = item.type === 'professional'
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-white/[0.025] backdrop-blur-sm ring-1 ring-white/[0.08] p-6 lg:p-7 hover:bg-white/[0.04] hover:ring-white/15 transition-all duration-300 flex flex-col"
              >
                {/* Type badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ring-1 ${
                    isProfessional
                      ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30'
                      : 'bg-sky-400/10 text-sky-300 ring-sky-400/30'
                  }`}>
                    {isProfessional ? 'Profissional' : 'Paciente'}
                  </div>
                  <Quote className="w-5 h-5 text-slate-700 group-hover:text-teal-400/40 transition-colors" />
                </div>

                {/* Stars */}
                {item.rating && (
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                )}

                {/* Quote */}
                <p className="text-sm lg:text-[15px] text-slate-200 leading-relaxed flex-1 mb-5">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} grid place-items-center text-slate-950 font-bold text-xs shadow-lg shadow-black/20`}>
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate">{item.role}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
