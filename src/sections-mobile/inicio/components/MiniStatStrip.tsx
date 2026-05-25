import type { MiniStat } from '@/../product-mobile/sections/inicio/types'
import { getIcon } from './_shared'

interface MiniStatStripProps {
  stats: MiniStat[]
  onStatClick?: (stat: MiniStat) => void
}

const ICONE_BG: Record<string, string> = {
  'teal-400': 'bg-teal-400/15 text-teal-300',
  'violet-400': 'bg-violet-400/15 text-violet-300',
  'sky-400': 'bg-sky-400/15 text-sky-300',
  'cyan-400': 'bg-cyan-400/15 text-cyan-300',
  'rose-400': 'bg-rose-400/15 text-rose-300',
  'amber-400': 'bg-amber-400/15 text-amber-300',
}

const DELTA_COLOR: Record<string, string> = {
  up: 'text-emerald-400',
  down: 'text-emerald-400', // for weight & fat % "down" is positive — assume context-specific later
  stable: 'text-slate-400',
}

export function MiniStatStrip({ stats, onStatClick }: MiniStatStripProps) {
  return (
    <div className="px-4 mt-1 mb-3">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {stats.map((s) => {
          const Icon = getIcon(s.iconeNome)
          const iconBg = ICONE_BG[s.iconeCor] ?? 'bg-slate-700/40 text-slate-300'
          // Heuristic: peso/gordura ↓ é positivo (verde); passos ↑ é positivo (verde); resto neutro
          let deltaTone = 'text-slate-400'
          if (s.tendencia === 'down' && (s.id === 'peso' || s.id === 'gordura')) {
            deltaTone = 'text-emerald-400'
          } else if (s.tendencia === 'up' && (s.id === 'passos' || s.id === 'agua')) {
            deltaTone = 'text-emerald-400'
          } else if (s.delta && /(ótimo|estável|em dia)/i.test(s.delta)) {
            deltaTone = 'text-slate-400'
          }
          return (
            <button
              key={s.id}
              onClick={() => onStatClick?.(s)}
              className="shrink-0 w-[112px] h-[104px] rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-left active:scale-[0.97] transition-transform"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center ${iconBg}`}>
                  <Icon size={11} strokeWidth={2.4} />
                </span>
                <span className="text-slate-400 text-[10.5px] font-medium truncate">{s.label}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-mono text-[22px] leading-none font-bold text-slate-50 tabular-nums">
                  {s.valor}
                </span>
                {s.unidade && (
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">{s.unidade}</span>
                )}
              </div>
              {s.delta && (
                <div className={`font-mono text-[10.5px] tabular-nums ${deltaTone} truncate`}>
                  {s.delta}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
