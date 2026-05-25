import type { MacroResumo, NutricaoData } from '@/../product-mobile/sections/nutricao/types'

interface CalorieAndMacrosProps {
  anel: NutricaoData['anel']
  macros: MacroResumo[]
}

const RING_SIZE = 130
const STROKE = 11
const RADIUS = (RING_SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * RADIUS

export function CalorieAndMacros({ anel, macros }: CalorieAndMacrosProps) {
  const pct = anel.semMeta || anel.meta === 0
    ? 0
    : Math.min(1, anel.consumidas / anel.meta)
  const offset = CIRC * (1 - pct)
  const restantes = Math.max(0, anel.meta - anel.consumidas)
  const acima = anel.consumidas > anel.meta
  const excedente = acima ? anel.consumidas - anel.meta : 0

  return (
    <div className="mx-4 mb-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
      {/* Anel */}
      <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
          <defs>
            <linearGradient id="cal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={acima ? '#fbbf24' : '#14b8a6'} />
              <stop offset="100%" stopColor={acima ? '#f43f5e' : '#38bdf8'} />
            </linearGradient>
          </defs>
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#1e293b"
            strokeWidth={STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="url(#cal-grad)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {anel.semMeta ? (
            <span className="text-slate-300 text-[12px] text-center px-2">Defina meta</span>
          ) : (
            <>
              <span className={`font-mono text-[22px] leading-none font-bold tabular-nums ${acima ? 'text-rose-400' : 'text-slate-50'}`}>
                {acima ? '+' : ''}{(acima ? excedente : restantes).toLocaleString('pt-BR')}
              </span>
              <span className="text-slate-300 text-[10px] mt-0.5">
                kcal {acima ? 'acima' : 'restantes'}
              </span>
              <span className="text-slate-500 text-[9px] mt-0.5 font-mono tabular-nums">
                {anel.consumidas}/{anel.meta}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Macro bars */}
      <div className="flex-1 flex flex-col gap-2.5">
        {macros.map((m) => (
          <MacroBar key={m.id} macro={m} />
        ))}
      </div>
    </div>
  )
}

function MacroBar({ macro }: { macro: MacroResumo }) {
  const pct = Math.min(100, macro.pct)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-300 text-[11px] font-medium">{macro.label}</span>
        <span className="text-slate-400 font-mono text-[10px] tabular-nums">
          {macro.consumido}
          <span className="text-slate-500"> / {macro.meta}{macro.unidade}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${macro.hex}66 0%, ${macro.hex} 100%)`,
          }}
        />
      </div>
    </div>
  )
}
