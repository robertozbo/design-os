import { useMemo, useState } from 'react'
import { Target, TrendingDown } from 'lucide-react'
import type {
  Glp1Meta,
  PeriodoGrafico,
  PontoPeso,
} from '@/../product-mobile/sections/glp1/types'

interface Props {
  pontos: PontoPeso[]
  meta: Glp1Meta
  projecao: 'adiantado' | 'no_prazo' | 'atrasado'
  /** Pulsa a borda por alguns segundos após salvar uma aplicação. */
  destaque?: boolean
}

const PERIODOS: PeriodoGrafico[] = ['30D', '90D', 'TUDO']

const W = 320
const H = 168
const PAD = { top: 16, right: 34, bottom: 26, left: 10 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom

const PROJECAO_LABEL: Record<Props['projecao'], string> = {
  adiantado: 'Adiantado',
  no_prazo: 'No prazo',
  atrasado: 'Atrasado',
}

const PROJECAO_COLOR: Record<Props['projecao'], string> = {
  adiantado: 'text-emerald-300',
  no_prazo: 'text-teal-300',
  atrasado: 'text-amber-300',
}

const SEMANA_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Paciente recém-configurado tem uma pesagem só e nenhuma projeção vinda do
 * backend. Traça a reta do último peso real até a meta, em passos semanais,
 * pra curva já nascer na primeira aplicação em vez de esperar a segunda.
 */
function projetarAteMeta(ultimo: PontoPeso | undefined, meta: Glp1Meta): PontoPeso[] {
  if (!ultimo) return []
  const inicio = new Date(`${ultimo.data}T00:00:00`).getTime()
  const totalMs = new Date(`${meta.dataAlvo}T00:00:00`).getTime() - inicio
  if (!Number.isFinite(totalMs) || totalMs <= 0) return []
  const passos = Math.max(2, Math.min(26, Math.round(totalMs / SEMANA_MS)))
  const delta = meta.pesoAlvoKg - ultimo.pesoKg
  return Array.from({ length: passos }, (_, k) => {
    const f = (k + 1) / passos
    return {
      data: new Date(inicio + totalMs * f).toISOString().slice(0, 10),
      pesoKg: Math.round((ultimo.pesoKg + delta * f) * 10) / 10,
      projetado: true,
      aplicacao: false,
    }
  })
}

function tick(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${Number(m)}`
}

export function EvolucaoPesoChart({ pontos, meta, projecao, destaque = false }: Props) {
  const [periodo, setPeriodo] = useState<PeriodoGrafico>('90D')

  const visiveis = useMemo(() => {
    const reais = pontos.filter((p) => !p.projetado)
    const doBackend = pontos.filter((p) => p.projetado)
    const proj = doBackend.length > 0 ? doBackend : projetarAteMeta(reais.at(-1), meta)
    if (periodo === 'TUDO') return [...reais, ...proj]
    const semanas = periodo === '30D' ? 5 : 13
    return [...reais.slice(-semanas), ...proj]
  }, [pontos, periodo, meta])

  // Paciente recém-configurado: existe um peso só, não existe curva. Em vez de
  // sumir com o bloco, mostra o ponto de partida e o que falta pra meta.
  if (visiveis.length < 2) {
    const partida = visiveis[0]?.pesoKg ?? null
    return (
      <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-4">
        <div className="flex items-center gap-2">
          <TrendingDown size={14} className="text-teal-300" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
            Evolução do peso
          </span>
        </div>
        <div className="mt-3 flex items-end gap-6">
          <div>
            <div className="font-mono tabular-nums text-slate-50 text-[24px] font-bold leading-none">
              {partida !== null ? partida.toFixed(1).replace('.', ',') : '--'}
              <span className="text-slate-500 text-[12px] font-normal"> kg</span>
            </div>
            <div className="mt-1 text-slate-500 text-[11px]">hoje</div>
          </div>
          <div>
            <div className="font-mono tabular-nums text-amber-300 text-[17px] font-semibold leading-none">
              {meta.pesoAlvoKg.toFixed(1).replace('.', ',')}
              <span className="text-amber-300/60 text-[11px] font-normal"> kg</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-slate-500 text-[11px]">
              <Target size={10} className="text-amber-300/70" />
              meta
            </div>
          </div>
        </div>
        <p className="mt-3 text-slate-400 text-[11.5px] leading-snug">
          Registre o peso a cada aplicação. Na segunda pesagem a curva com projeção
          até a meta aparece aqui.
        </p>
      </div>
    )
  }

  const valores = visiveis.map((p) => p.pesoKg)
  const min = Math.min(...valores, meta.pesoAlvoKg) - 1
  const max = Math.max(...valores, meta.pesoAlvoKg) + 1
  const span = Math.max(1, max - min)

  const n = visiveis.length
  const x = (i: number) => PAD.left + (i * PLOT_W) / (n - 1)
  const y = (v: number) => PAD.top + PLOT_H * (1 - (v - min) / span)

  let solido = ''
  let tracejado = ''
  let ultimoRealIdx = -1
  visiveis.forEach((p, i) => {
    if (!p.projetado) {
      solido += i === 0 ? `M${x(i)},${y(p.pesoKg)}` : ` L${x(i)},${y(p.pesoKg)}`
      ultimoRealIdx = i
    } else {
      if (tracejado === '') {
        const j = Math.max(0, i - 1)
        tracejado = `M${x(j)},${y(visiveis[j].pesoKg)} L${x(i)},${y(p.pesoKg)}`
      } else {
        tracejado += ` L${x(i)},${y(p.pesoKg)}`
      }
    }
  })

  const area =
    ultimoRealIdx >= 0
      ? `${solido} L${x(ultimoRealIdx)},${PAD.top + PLOT_H} L${x(0)},${PAD.top + PLOT_H} Z`
      : ''

  const atual = visiveis[ultimoRealIdx]
  const primeiro = visiveis[0]
  const yAlvo = y(meta.pesoAlvoKg)
  /** Uma pesagem só: existe projeção, mas ainda não existe ritmo real. */
  const semRitmoReal = ultimoRealIdx < 1

  // Um ponto não fecha polígono, então a área sob o trecho real não existe
  // enquanto houver uma pesagem só. Preenche sob a projeção pra curva ter o
  // mesmo corpo do gráfico com histórico — é o gradiente que mostra a queda.
  const areaFinal = semRitmoReal
    ? `M${x(0)},${y(visiveis[0].pesoKg)} ${visiveis
        .slice(1)
        .map((p, k) => `L${x(k + 1)},${y(p.pesoKg)}`)
        .join(' ')} L${x(n - 1)},${PAD.top + PLOT_H} L${x(0)},${PAD.top + PLOT_H} Z`
    : area

  const tickIdx = [0, Math.round(ultimoRealIdx / 2), ultimoRealIdx, n - 1].filter(
    (v, i, arr) => v >= 0 && arr.indexOf(v) === i,
  )

  return (
    <div
      className={`mx-4 mb-4 rounded-2xl bg-slate-900 border p-4 transition-colors duration-700 ${
        destaque ? 'border-teal-400 shadow-[0_0_0_3px_rgba(45,212,191,0.12)]' : 'border-slate-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
            Evolução de peso
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-mono tabular-nums text-slate-50 text-[26px] font-bold leading-none">
              {atual.pesoKg.toFixed(1).replace('.', ',')}
            </span>
            <span className="font-mono text-slate-400 text-[13px]">kg</span>
            {semRitmoReal ? (
              <span className="ml-1 shrink-0 whitespace-nowrap text-slate-500 text-[12px]">
                ponto de partida
              </span>
            ) : (
              <span className="ml-1 flex items-center gap-0.5 text-emerald-300 text-[12px] font-medium">
                <TrendingDown size={12} strokeWidth={2.4} />
                {(primeiro.pesoKg - atual.pesoKg).toFixed(1).replace('.', ',')} kg
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {PERIODOS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`rounded-md px-2 py-1 font-mono text-[10.5px] transition-colors ${
                periodo === p
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gráfico de evolução de peso">
        <defs>
          <linearGradient id="glp1-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Linha da meta */}
        <line
          x1={PAD.left}
          x2={PAD.left + PLOT_W}
          y1={yAlvo}
          y2={yAlvo}
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.7"
        />
        <text
          x={PAD.left + PLOT_W + 4}
          y={yAlvo + 3.5}
          fill="#fbbf24"
          fontSize="9"
          fontFamily="IBM Plex Mono, monospace"
        >
          {meta.pesoAlvoKg.toFixed(0)}
        </text>

        {areaFinal && (
          <path d={areaFinal} fill="url(#glp1-area)" opacity={semRitmoReal ? 0.6 : 1} />
        )}
        {solido && (
          <path d={solido} fill="none" stroke="#2dd4bf" strokeWidth="2.2" strokeLinejoin="round" />
        )}
        {tracejado && (
          <path
            d={tracejado}
            fill="none"
            stroke="#5eead4"
            strokeWidth="1.6"
            strokeDasharray="4 4"
            opacity="0.65"
          />
        )}

        {/* Marcadores de aplicação */}
        {visiveis.map((p, i) =>
          p.aplicacao ? (
            <circle key={`ap-${p.data}`} cx={x(i)} cy={PAD.top + PLOT_H + 7} r="1.8" fill="#38bdf8" />
          ) : null,
        )}

        {/* Ponto atual */}
        <circle cx={x(ultimoRealIdx)} cy={y(atual.pesoKg)} r="5.5" fill="#2dd4bf" opacity="0.2" />
        <circle
          cx={x(ultimoRealIdx)}
          cy={y(atual.pesoKg)}
          r="3"
          fill="#0f172a"
          stroke="#2dd4bf"
          strokeWidth="2"
        />

        {/* Ticks de data */}
        {tickIdx.map((i) => (
          <text
            key={`t-${i}`}
            x={x(i)}
            y={H - 6}
            fill="#64748b"
            fontSize="8.5"
            fontFamily="IBM Plex Mono, monospace"
            textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
          >
            {tick(visiveis[i].data)}
          </text>
        ))}
      </svg>

      {/* Legenda */}
      <div className="mt-2 flex items-center justify-between text-[10.5px]">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-[2px] bg-teal-400 rounded" />
            real
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-[2px] rounded bg-teal-300/60" style={{ borderTop: '1px dashed' }} />
            projeção
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            dose
          </span>
        </div>
        {!semRitmoReal && (
          <span className={`flex items-center gap-1 font-medium ${PROJECAO_COLOR[projecao]}`}>
            <Target size={11} strokeWidth={2.4} />
            {PROJECAO_LABEL[projecao]}
          </span>
        )}
      </div>

      {semRitmoReal && (
        <p className="mt-2 text-slate-400 text-[11px] leading-snug">
          A tracejada é o ritmo necessário pra bater a meta. Registre o peso a cada
          aplicação — na segunda pesagem a curva passa a seguir o seu ritmo real.
        </p>
      )}
    </div>
  )
}
