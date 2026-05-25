import { Heart } from 'lucide-react'
import type { FooterContent } from '@/../product/sections/landing-page/types'

interface Props {
  content: FooterContent
  onNavClick?: (href: string) => void
}

export function LandingFooter({ content, onNavClick }: Props) {
  return (
    <footer className="relative border-t border-white/[0.05] bg-slate-950/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 grid place-items-center shadow-lg shadow-teal-500/30">
                <span className="font-bold text-slate-950 text-sm">N</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-slate-50 text-sm tracking-tight">{content.brand.name}</span>
                <span className="text-[10px] text-teal-300/80 tracking-wider uppercase">{content.brand.tagline}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{content.brand.description}</p>
          </div>

          {/* Columns */}
          {content.columns.map((col) => (
            <div key={col.id}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => onNavClick?.(item.href)}
                      className="text-xs text-slate-500 hover:text-teal-300 transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-8 pb-8 border-b border-white/[0.05]">
          {content.trustBadges.map((badge) => (
            <div
              key={badge.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-slate-500 bg-white/[0.02] ring-1 ring-white/[0.06]"
            >
              {badge.prefix && <span>{badge.prefix}</span>}
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <p>{content.copyright}</p>
          <p className="inline-flex items-center gap-1.5">
            {content.madeWith.split('❤️').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <Heart className="inline w-3 h-3 fill-rose-400 text-rose-400 mx-0.5 -translate-y-px" />
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}
