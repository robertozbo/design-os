import { useState } from 'react'
import { ArrowRight, ShieldCheck, Key } from 'lucide-react'
import type { DetailActionCardContent, AcceptanceStatus } from '@/../product/sections/profissionais/types'

interface Props {
  content: DetailActionCardContent
  acceptance: AcceptanceStatus
  professionalName: string
  onRequestLink?: () => void
  onValidateCode?: (code: string) => void
}

export function DetailActionCard({
  content,
  acceptance,
  professionalName,
  onRequestLink,
  onValidateCode,
}: Props) {
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState('')
  const isOpen = acceptance === 'accepting'

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-teal-500/15 via-emerald-500/8 to-slate-900/0 ring-1 ring-teal-400/30 p-6 shadow-xl shadow-teal-500/15">
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-teal-400/20 via-transparent to-emerald-400/20 -z-10 blur-xl" />

      <div className="space-y-4">
        {/* Status pill */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${
          isOpen
            ? 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30'
            : 'bg-amber-400/15 text-amber-300 ring-amber-400/30'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {isOpen ? 'Aceita novos pacientes' : 'Lista de espera'}
        </div>

        {/* Subject */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Solicitar vínculo com</p>
          <p className="text-base font-bold text-slate-100">{professionalName}</p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onRequestLink}
          disabled={!isOpen}
          className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-br from-teal-300 to-emerald-400 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isOpen ? content.ctaLabel : 'Entrar na lista de espera'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Microcopy */}
        <p className="text-xs text-slate-400 leading-relaxed text-center">{content.microcopy}</p>

        {/* Trust chips */}
        <div className="grid grid-cols-1 gap-1.5 pt-3 border-t border-white/[0.06]">
          {content.trustChips.map((chip, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <ShieldCheck className="w-3 h-3 text-teal-300 shrink-0" strokeWidth={2.4} />
              <span>{chip}</span>
            </div>
          ))}
        </div>

        {/* Code fallback toggle */}
        <div className="pt-3 border-t border-white/[0.06]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">{content.divider}</p>
          {!showCode ? (
            <button
              onClick={() => setShowCode(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.03] ring-1 ring-white/[0.08] hover:bg-white/[0.06] hover:ring-white/15 transition-all"
            >
              <Key className="w-3.5 h-3.5" strokeWidth={2.4} />
              {content.altLabel}
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={content.altCodePlaceholder}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] focus:ring-teal-400/40 focus:outline-none text-xs font-mono text-slate-100 placeholder:text-slate-600 transition-all"
              />
              <button
                onClick={() => onValidateCode?.(code)}
                disabled={!code.trim()}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-teal-200 bg-teal-400/10 ring-1 ring-teal-400/30 hover:ring-teal-400/60 hover:bg-teal-400/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {content.altCodeCta}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
