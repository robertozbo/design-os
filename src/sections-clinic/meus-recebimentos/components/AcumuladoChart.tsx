import { TrendingUp } from 'lucide-react'
import type {
  LinhaExtrato,
  ResumoCompetencia,
} from '@/../product-clinic/sections/meus-recebimentos/types'
import { brl, brlCurto } from './helpers'

interface Props {
  extrato: LinhaExtrato[]
  resumo: ResumoCompetencia
}

interface Ponto {
  dataLabel: string
  acumulado: number
  doDia: number
}

/**
 * Acumulado da comissão dia a dia — conta o atendimento feito, pago ou não. É a leitura de
 * produção; o que já virou dinheiro está no card de próximo repasse.
 */
function serie(extrato: LinhaExtrato[]): Ponto[] {
  const porDia = new Map<string, { label: string; total: number }>()
  for (const l of extrato) {
    const atual = porDia.get(l.data) ?? { label: l.dataLabel, total: 0 }
    atual.total += l.valorRepasse
    porDia.set(l.data, atual)
  }

  let acumulado = 0
  return [...porDia.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, { label, total }]) => {
      acumulado += total
      return { dataLabel: label, acumulado, doDia: total }
    })
}

export function AcumuladoChart({ extrato, resumo }: Props) {
  const pontos = serie(extrato)
  if (pontos.length === 0) return null

  const total = pontos[pontos.length - 1].acumulado
  const mediaDia = Math.round(total / resumo.diasUteisDecorridos)
  const projecao = Math.round(mediaDia * resumo.diasUteisNoMes)
  const teto = Math.max(projecao, total)

  const W = 100 // viewBox em % — o SVG estica com o card
  const H = 44
  const x = (i: number) => (i / (pontos.length - 1 || 1)) * W
  const y = (v: number) => H - (v / teto) * H

  const linha = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.acumulado)}`).join(' ')
  const area = `${linha} L ${W} ${H} L 0 ${H} Z`
  const ultimo = pontos[pontos.length - 1]

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Acumulado da competência
        </h2>
        <span className="text-[11px] text-slate-400">
          {resumo.diasUteisDecorridos} de {resumo.diasUteisNoMes} dias úteis
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {brl(total)}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <TrendingUp className="h-3 w-3 text-teal-500" />
          média de {brl(mediaDia)} por dia útil
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="mt-3 h-28 w-full"
        role="img"
        aria-label={`Comissão acumulada até ${ultimo.dataLabel}: ${brl(total)}`}
      >
        <defs>
          <linearGradient id="acumulado-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(20 184 166)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#acumulado-fill)" />
        <path
          d={linha}
          fill="none"
          stroke="rgb(20 184 166)"
          strokeWidth="0.9"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        {/* Projeção: mesmo ritmo até o fim do mês */}
        <path
          d={`M ${x(pontos.length - 1)} ${y(total)} L ${W} ${y(projecao)}`}
          fill="none"
          stroke="rgb(20 184 166)"
          strokeWidth="0.9"
          strokeDasharray="2 2"
          strokeOpacity="0.55"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
        <span>{pontos[0].dataLabel}</span>
        <span>{ultimo.dataLabel}</span>
        <span className="text-teal-600 dark:text-teal-400">
          fecha ~{brlCurto(projecao)} em 31 ago
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
        Mantido o ritmo, a competência fecha em torno de{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">{brl(projecao)}</span> de
        comissão. O que entra na conta depende do que a clínica receber até o fechamento.
      </p>
    </div>
  )
}
