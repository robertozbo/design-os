import { Mail, ArrowRight } from 'lucide-react'
import type { InviteBannerContent } from '@/../product/sections/profissionais/types'

interface Props {
  content: InviteBannerContent
  onClick?: () => void
}

export function InviteBanner({ content, onClick }: Props) {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 50% 50%, rgba(20,184,166,0.08) 0px, transparent 60%)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-teal-500/12 via-emerald-500/8 to-cyan-500/5 ring-1 ring-teal-400/30 p-7 lg:p-9 shadow-xl shadow-teal-500/10">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-teal-400/20 via-transparent to-emerald-400/20 -z-10 blur-xl" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-2 md:col-start-1 hidden md:flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-300/30 to-emerald-400/20 ring-1 ring-teal-400/40 grid place-items-center">
                <Mail className="w-7 h-7 text-teal-200" strokeWidth={2.2} />
              </div>
            </div>
            <div className="md:col-span-6">
              <h3 className="text-xl lg:text-2xl font-bold text-slate-50 tracking-tight mb-2">{content.title}</h3>
              <p className="text-sm lg:text-[15px] text-slate-300 leading-relaxed">{content.description}</p>
            </div>
            <div className="md:col-span-4 md:flex md:justify-end">
              <button
                onClick={onClick}
                className="group w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-br from-teal-300 to-emerald-400 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/50 hover:scale-[1.02] transition-all"
              >
                {content.cta.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
