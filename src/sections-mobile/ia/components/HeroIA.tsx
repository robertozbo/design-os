import type { HeroIAState } from '@/../product-mobile/sections/ia/types'
import { Bot, ArrowRight } from 'lucide-react'

interface HeroIAProps {
  hero: HeroIAState
  onChatClick?: () => void
}

export function HeroIA({ hero, onChatClick }: HeroIAProps) {
  return (
    <div
      className="mx-4 mb-4 rounded-2xl p-4 border border-slate-800 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgb(15 23 42) 0%, rgb(20 184 166 / 0.12) 100%)',
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-300 shrink-0">
          <Bot size={22} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <h2 className="text-slate-100 font-semibold text-[17px] leading-snug">{hero.fraseTitulo}</h2>
          <p className="text-slate-400 text-[12.5px] mt-1 leading-snug">{hero.fraseSubtitulo}</p>
        </div>
      </div>
      <button
        onClick={onChatClick}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-white font-medium text-[13px] shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 active:scale-[0.99] transition-transform"
        style={{
          background: 'linear-gradient(135deg, rgb(20 184 166) 0%, rgb(56 189 248) 100%)',
        }}
      >
        {hero.ctaLabel}
        <ArrowRight size={14} strokeWidth={2.4} />
      </button>
    </div>
  )
}
