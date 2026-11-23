import type { ReactNode } from 'react'
import { ChevronRight, Search, type LucideIcon } from 'lucide-react'

/**
 * Shared building blocks for the personal-trainer mobile screens.
 * Colors mirror the mobile dark theme (`mobile/src/theme/ThemeContext.tsx`):
 * background #0A0E0D, card = background + border #2A3130, secondary #1B2120,
 * muted #111615, primary emerald-500 with "Noite" #0E1A17 foreground.
 */

export function Screen({ children }: { children: ReactNode }) {
  return <div className="min-h-full bg-[#0A0E0D] pb-10">{children}</div>
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mx-4 mt-4 rounded-3xl bg-[#0A0E0D] border border-[#2A3130] p-4 ${className}`}>
      {children}
    </section>
  )
}

export function CardHeader({ titulo, acao, onAcao }: { titulo: string; acao?: string; onAcao?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] uppercase tracking-wider font-mono text-slate-400">{titulo}</h2>
      {acao && (
        <button onClick={onAcao} className="text-emerald-300 text-[12.5px] font-medium">
          {acao}
        </button>
      )}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="px-5 mt-5 mb-2 text-[11px] uppercase tracking-wider font-mono text-slate-500">{children}</h2>
}

export function Avatar({ inicial, size = 'md', tone = 'neutral' }: { inicial: string; size?: 'sm' | 'md' | 'lg' | 'xl'; tone?: 'neutral' | 'primary' }) {
  const dims = { sm: 'w-8 h-8 text-[12px] rounded-xl', md: 'w-10 h-10 text-[14px] rounded-xl', lg: 'w-12 h-12 text-[16px] rounded-2xl', xl: 'w-16 h-16 text-[22px] rounded-2xl' }[size]
  const cor = tone === 'primary' ? 'bg-emerald-500 text-[#0E1A17]' : 'bg-[#1B2120] text-slate-200'
  return <div className={`${dims} ${cor} flex items-center justify-center font-semibold shrink-0`}>{inicial}</div>
}

export type ChipTone = 'neutral' | 'primary' | 'warning' | 'danger' | 'info'

const CHIP: Record<ChipTone, string> = {
  neutral: 'text-slate-300 bg-[#1B2120]',
  primary: 'text-emerald-300 bg-emerald-500/10',
  warning: 'text-amber-400 bg-amber-500/10',
  danger: 'text-rose-400 bg-rose-500/10',
  info: 'text-teal-300 bg-teal-500/10',
}

export function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: ChipTone }) {
  return <span className={`inline-flex items-center gap-1 text-[11.5px] font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ${CHIP[tone]}`}>{children}</span>
}

export function ListGroup({ children }: { children: ReactNode }) {
  return (
    <ul className="mx-4 rounded-2xl bg-[#0A0E0D] border border-[#2A3130] divide-y divide-[#2A3130] overflow-hidden">
      {children}
    </ul>
  )
}

export function Row({
  leading,
  titulo,
  subtitulo,
  trailing,
  onClick,
  chevron = true,
}: {
  leading?: ReactNode
  titulo: ReactNode
  subtitulo?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  chevron?: boolean
}) {
  return (
    <li>
      <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-[#111615]">
        {leading}
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 text-[14px] truncate">{titulo}</div>
          {subtitulo && <div className="text-slate-400 text-[12px] truncate">{subtitulo}</div>}
        </div>
        {trailing}
        {chevron && <ChevronRight size={16} className="text-slate-600 shrink-0" />}
      </button>
    </li>
  )
}

export function IconTile({ Icon, tone = 'primary' }: { Icon: LucideIcon; tone?: ChipTone }) {
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${CHIP[tone]}`}>
      <Icon size={17} />
    </div>
  )
}

export function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="mx-4 mt-1 flex items-center gap-2 rounded-2xl bg-[#111615] border border-[#2A3130] px-3 py-2.5">
      <Search size={16} className="text-slate-500" />
      <span className="text-slate-500 text-[14px]">{placeholder}</span>
    </div>
  )
}

export function Segmented<T extends string>({ opcoes, ativo, onChange }: { opcoes: Array<{ id: T; label: string; count?: number }>; ativo: T; onChange: (id: T) => void }) {
  return (
    <div className="mx-4 mt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
      {opcoes.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium border ${
            ativo === o.id ? 'bg-emerald-500 text-[#0E1A17] border-emerald-500' : 'bg-[#0A0E0D] text-slate-300 border-[#2A3130]'
          }`}
        >
          {o.label}
          {o.count !== undefined && <span className="ml-1 opacity-70 font-mono">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Progress({ value, tone = 'primary' }: { value: number; tone?: 'primary' | 'warning' | 'danger' }) {
  const cor = { primary: 'bg-emerald-500', warning: 'bg-amber-500', danger: 'bg-rose-500' }[tone]
  return (
    <div className="h-1.5 rounded-full bg-[#1B2120] overflow-hidden">
      <div className={`h-full rounded-full ${cor}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function PrimaryButton({ children, onClick, full = true }: { children: ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${full ? 'w-full' : ''} rounded-2xl bg-emerald-500 text-[#0E1A17] font-semibold text-[15px] py-3 px-4 inline-flex items-center justify-center gap-2 active:scale-[0.99] transition`}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, onClick, full = true }: { children: ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${full ? 'w-full' : ''} rounded-2xl border border-[#2A3130] bg-[#1B2120] text-slate-100 font-semibold text-[14px] py-2.5 px-4 inline-flex items-center justify-center gap-2`}
    >
      {children}
    </button>
  )
}

export function Stat({ label, valor, delta, positivo }: { label: string; valor: string; delta?: string; positivo?: boolean }) {
  return (
    <div className="rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3">
      <div className="text-slate-400 text-[11px] leading-tight">{label}</div>
      <div className="mt-1 text-white text-[19px] font-mono tabular-nums font-semibold">{valor}</div>
      {delta && (
        <div className={`text-[11px] font-mono ${positivo === undefined ? 'text-slate-500' : positivo ? 'text-emerald-400' : 'text-rose-400'}`}>{delta}</div>
      )}
    </div>
  )
}

export function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`w-11 h-6 rounded-full relative inline-block shrink-0 ${on ? 'bg-emerald-500' : 'bg-[#2A3130]'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </span>
  )
}

export function Empty({ Icon, titulo, texto }: { Icon: LucideIcon; titulo: string; texto: string }) {
  return (
    <div className="mx-4 mt-6 rounded-3xl border border-dashed border-[#2A3130] p-6 text-center">
      <Icon size={22} className="mx-auto text-slate-500" />
      <div className="mt-2 text-slate-200 text-[14px] font-medium">{titulo}</div>
      <div className="text-slate-500 text-[12.5px]">{texto}</div>
    </div>
  )
}

/** Wraps a section preview with the mobile fonts (same block every mobile preview uses). */
export function PreviewFonts({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'Geist Mono', ui-monospace, monospace;
        }
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-mobile="true" className="min-h-full">
        {children}
      </div>
    </>
  )
}

/** Prototype navigation between personal sections. */
export function go(sectionId: string) {
  window.location.href = `/mobile/sections/${sectionId}`
}
