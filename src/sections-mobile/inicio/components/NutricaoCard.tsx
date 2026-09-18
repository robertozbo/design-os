import { useState } from 'react'
import { ChevronRight, Plus, Utensils } from 'lucide-react'
import type {
  MacroPreview,
  NutricaoResumo,
  RegistroRefeicaoModo,
} from '@/../product-mobile/sections/inicio/types'
import { RegistrarRefeicaoSheet } from './RegistrarRefeicaoSheet'

interface Props {
  nutricao: NutricaoResumo
  /** Há cardápio ativo — habilita "do meu cardápio" no sheet do "+". */
  temCardapio?: boolean
  onClick?: () => void
  onRegistrar?: (modo: RegistroRefeicaoModo) => void
  onVerCardapio?: () => void
}

// Arco aberto embaixo: 270° começando às 7h30 e fechando às 4h30.
const SIZE = 168
const STROKE = 13
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R
const ARCO = 0.75 // fração do círculo desenhada

const fmt = (n: number) => n.toLocaleString('pt-BR')

export function NutricaoCard({
  nutricao,
  temCardapio = false,
  onClick,
  onRegistrar,
  onVerCardapio,
}: Props) {
  const [sheetAberto, setSheetAberto] = useState(false)
  const { anel, macros, ultimaRefeicao } = nutricao

  // Saldo líquido do dia = meta - consumidas + gastas (mesma conta da Nutrição).
  const restantes = anel.meta - anel.consumidas + anel.gastas
  const acima = restantes < 0
  const pct = anel.semMeta || anel.meta === 0 ? 0 : Math.min(1, anel.consumidas / anel.meta)

  const registrar = (modo: RegistroRefeicaoModo) => {
    setSheetAberto(false)
    onRegistrar?.(modo)
  }

  return (
    <>
      <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 pt-4">
          <Utensils size={16} strokeWidth={2.2} className="text-teal-300" />
          <span className="flex-1 text-slate-100 text-[15px] font-semibold">Nutrição</span>
          <button
            onClick={() => setSheetAberto(true)}
            aria-label="Registrar refeição"
            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center active:scale-[0.94] transition-transform"
          >
            <Plus size={18} strokeWidth={2.4} className="text-teal-300" />
          </button>
        </div>

        {/* Anel */}
        <button
          onClick={onClick}
          className="w-full flex justify-center pt-2 pb-1 active:scale-[0.99] transition-transform"
        >
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(135deg)' }}>
              <defs>
                <linearGradient id="nutriArc" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={acima ? '#fbbf24' : '#14b8a6'} />
                  <stop offset="100%" stopColor={acima ? '#f43f5e' : '#38bdf8'} />
                </linearGradient>
              </defs>
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke="#1e293b"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${CIRC * ARCO} ${CIRC}`}
              />
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke="url(#nutriArc)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${CIRC * ARCO * pct} ${CIRC}`}
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {anel.semMeta ? (
                <>
                  <span className="text-slate-100 text-[14px] font-semibold">Definir meta</span>
                  <span className="text-slate-500 text-[11px] mt-1">para começar</span>
                </>
              ) : (
                <>
                  <span
                    className={`font-mono tabular-nums text-[32px] leading-none font-bold ${
                      acima ? 'text-rose-400' : 'text-slate-50'
                    }`}
                  >
                    {acima ? '+' : ''}
                    {fmt(Math.abs(restantes))}
                  </span>
                  <span className="text-slate-400 text-[11.5px] mt-1.5">
                    kcal {acima ? 'acima' : 'restantes'}
                  </span>
                  <span className="font-mono tabular-nums text-slate-600 text-[10px] mt-0.5">
                    {fmt(anel.consumidas)} de {fmt(anel.meta)}
                  </span>
                </>
              )}
            </div>
          </div>
        </button>

        {/* Macros */}
        {macros.length > 0 && (
          <div className="grid grid-cols-3 gap-3 px-4 pt-1 pb-4">
            {macros.map((m) => (
              <MacroBar key={m.id} macro={m} />
            ))}
          </div>
        )}

        {/* Último registro do dia — espelho do "+" */}
        <div className="border-t border-slate-800">
          {ultimaRefeicao ? (
            <button
              onClick={onClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-slate-800/40"
            >
              <span className="text-[22px] leading-none shrink-0">{ultimaRefeicao.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-slate-100 text-[13.5px] font-semibold truncate">
                  {ultimaRefeicao.refeicaoLabel}
                  <span className="text-slate-500 font-normal"> · {ultimaRefeicao.origem}</span>
                </div>
                <div className="text-slate-400 text-[11.5px] mt-0.5 font-mono tabular-nums">
                  {ultimaRefeicao.horario} · {fmt(ultimaRefeicao.kcal)} kcal
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-600 shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => setSheetAberto(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-slate-800/40"
            >
              <span className="text-[22px] leading-none shrink-0">🍽️</span>
              <div className="flex-1 min-w-0">
                <div className="text-slate-100 text-[13.5px] font-semibold">
                  Nada registrado hoje
                </div>
                <div className="text-slate-400 text-[11.5px] mt-0.5">
                  Comece pela foto do prato — leva 5 segundos
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-600 shrink-0" />
            </button>
          )}

          <button
            onClick={onVerCardapio}
            className="w-full flex items-center justify-center gap-1 border-t border-slate-800 py-2.5 text-[12.5px] font-medium text-teal-300 active:bg-slate-800/40"
          >
            Ver cardápio completo
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <RegistrarRefeicaoSheet
        open={sheetAberto}
        temCardapio={temCardapio}
        onClose={() => setSheetAberto(false)}
        onEscolher={registrar}
      />
    </>
  )
}

function MacroBar({ macro }: { macro: MacroPreview }) {
  const pct = macro.meta === 0 ? 0 : Math.min(1, macro.consumido / macro.meta)
  const n = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', ','))

  return (
    <div>
      <div className="text-slate-400 text-[11px] text-center">{macro.label}</div>
      <div className="mt-1.5 h-[5px] rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct * 100}%`,
            background: macro.hex,
            transition: 'width 1s ease-out',
          }}
        />
      </div>
      <div className="mt-1.5 text-center font-mono tabular-nums text-[11px]">
        <span style={{ color: macro.hex }}>
          {n(macro.consumido)}
          {macro.unidade}
        </span>
        <span className="text-slate-600">
          {' '}
          /{n(macro.meta)}
          {macro.unidade}
        </span>
      </div>
    </div>
  )
}
