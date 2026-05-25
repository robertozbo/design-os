import type { AnelCalorias as AnelCaloriasType } from '@/../product-mobile/sections/inicio/types'

interface AnelCaloriasProps {
  data: AnelCaloriasType
  onClick?: () => void
}

const SIZE = 240
const OUTER_STROKE = 14
const INNER_STROKE = 14
const GAP = 6 // gap between rings
const OUTER_RADIUS = (SIZE - OUTER_STROKE) / 2
const INNER_RADIUS = OUTER_RADIUS - OUTER_STROKE / 2 - GAP - INNER_STROKE / 2

const OUTER_CIRC = 2 * Math.PI * OUTER_RADIUS
const INNER_CIRC = 2 * Math.PI * INNER_RADIUS

export function AnelCalorias({ data, onClick }: AnelCaloriasProps) {
  const consumidoPct = data.semMeta || data.meta === 0
    ? 0
    : Math.min(1, data.consumidas / data.meta)
  const gastoPct = data.metaGasto === 0
    ? 0
    : Math.min(1, data.gastas / data.metaGasto)

  const outerOffset = OUTER_CIRC * (1 - consumidoPct)
  const innerOffset = INNER_CIRC * (1 - gastoPct)

  // Saldo líquido = meta - consumidas + gastas
  const restantes = data.meta - data.consumidas + data.gastas
  const acima = restantes < 0
  const absRestantes = Math.abs(restantes)

  return (
    <button onClick={onClick} className="block mx-auto my-2 active:scale-[0.99] transition-transform">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <defs>
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={data.acima ? '#fbbf24' : '#14b8a6'} />
              <stop offset="100%" stopColor={data.acima ? '#f43f5e' : '#38bdf8'} />
            </linearGradient>
            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Outer track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={OUTER_RADIUS}
            fill="none"
            stroke="#1e293b"
            strokeWidth={OUTER_STROKE}
          />
          {/* Outer progress (consumido) */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={OUTER_RADIUS}
            fill="none"
            stroke="url(#outerGradient)"
            strokeWidth={OUTER_STROKE}
            strokeLinecap="round"
            strokeDasharray={OUTER_CIRC}
            strokeDashoffset={outerOffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />

          {/* Inner track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={INNER_RADIUS}
            fill="none"
            stroke="#1e293b"
            strokeWidth={INNER_STROKE}
          />
          {/* Inner progress (gasto) */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={INNER_RADIUS}
            fill="none"
            stroke="url(#innerGradient)"
            strokeWidth={INNER_STROKE}
            strokeLinecap="round"
            strokeDasharray={INNER_CIRC}
            strokeDashoffset={innerOffset}
            style={{ transition: 'stroke-dashoffset 1.1s ease-out' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {data.semMeta ? (
            <>
              <div className="text-slate-100 font-semibold text-[15px]">Definir meta</div>
              <div className="text-slate-500 text-[11px] mt-1">para começar</div>
            </>
          ) : (
            <>
              <div className={`font-mono text-[36px] leading-none font-bold tabular-nums ${acima ? 'text-rose-400' : 'text-slate-50'}`}>
                {acima ? '+' : ''}
                {absRestantes.toLocaleString('pt-BR')}
              </div>
              <div className="text-slate-300 text-[11.5px] mt-1.5">
                kcal {acima ? 'acima' : 'restantes'}
              </div>
              <div className="text-slate-500 text-[10px] font-mono tabular-nums mt-0.5">
                meta {data.meta.toLocaleString('pt-BR')}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      {!data.semMeta && (
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg,#14b8a6,#38bdf8)' }} />
            <span className="text-slate-400 text-[11.5px] font-mono tabular-nums">
              Consumido {data.consumidas.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg,#fb923c,#f43f5e)' }} />
            <span className="text-slate-400 text-[11.5px] font-mono tabular-nums">
              Gasto {data.gastas.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </button>
  )
}
