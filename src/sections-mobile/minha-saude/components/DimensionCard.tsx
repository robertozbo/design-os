import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import type {
  DimensionScore,
  DimensionMetric,
  DataSufficiency,
  MetricHistorico,
} from '@/../product-mobile/sections/minha-saude/types'
import { DIMENSION_ICON, STATUS_VISUAL, formatDateBR } from './_shared'

interface DimensionCardProps {
  dimension: DimensionScore
  onColetarDado?: (tipo: string) => void
}

export function DimensionCard({ dimension, onColetarDado }: DimensionCardProps) {
  const [open, setOpen] = useState(false)
  const Icon = DIMENSION_ICON[dimension.id]
  const visual = STATUS_VISUAL[dimension.status]
  const noData = dimension.status === 'sem_dados'

  return (
    <div
      className={`rounded-2xl bg-slate-900 border ${visual.border} overflow-hidden`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3.5 py-3 flex items-center gap-3 text-left"
      >
        <div className={`w-10 h-10 rounded-xl ${visual.bg} flex items-center justify-center ${visual.text} shrink-0`}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-semibold text-[13.5px] truncate">{dimension.label}</span>
            {dimension.sufficiency !== 'suficiente' && (
              <SufficiencyBadge sufficiency={dimension.sufficiency} />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {dimension.score === null ? (
              <span className="text-slate-500 text-[11px]">Sem dados suficientes</span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                {dimension.metrics.length} métrica{dimension.metrics.length === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {dimension.score !== null ? (
            <div
              className={`px-2.5 py-1 rounded-full ${visual.bg} ${visual.text} text-[12px] font-bold font-mono tabular-nums`}
            >
              {dimension.score}
            </div>
          ) : (
            <span className={`px-2.5 py-1 rounded-full ${visual.bg} ${visual.text} text-[10px] font-semibold uppercase`}>
              {visual.label}
            </span>
          )}
          {open ? (
            <ChevronUp size={15} className="text-slate-500" />
          ) : (
            <ChevronDown size={15} className="text-slate-500" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/60">
          {dimension.metrics.length > 0 && (
            <div className="space-y-2 pt-3">
              {dimension.metrics.map((m) => (
                <MetricRow key={m.label} metric={m} />
              ))}
            </div>
          )}

          {dimension.faltam && dimension.faltam.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle size={11} className="text-amber-300" strokeWidth={2.4} />
                <span className="text-amber-300 text-[10.5px] font-semibold uppercase tracking-wider">
                  Faltam dados
                </span>
              </div>
              <ul className="space-y-1">
                {dimension.faltam.map((f) => (
                  <li key={f} className="text-slate-400 text-[11.5px] leading-snug flex items-start gap-1.5">
                    <span className="text-slate-600 mt-1">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {noData && onColetarDado && (
            <button
              onClick={() => onColetarDado(dimension.id)}
              className="mt-3 w-full h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[12px] font-medium flex items-center justify-center gap-1.5"
            >
              <Plus size={13} strokeWidth={2.4} />
              Coletar dados
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function MetricRow({ metric }: { metric: DimensionMetric }) {
  const [open, setOpen] = useState(false)
  const visual = STATUS_VISUAL[metric.status]
  const hasHistorico = !!metric.historico && metric.historico.length > 1
  const canExpand = hasHistorico

  return (
    <div className="rounded-lg overflow-hidden">
      <button
        onClick={() => canExpand && setOpen((v) => !v)}
        disabled={!canExpand}
        className="w-full flex items-center gap-3 py-1.5 -mx-1 px-1 rounded-lg hover:bg-slate-800/40 disabled:cursor-default disabled:hover:bg-transparent text-left"
      >
        <div className={`w-1 h-10 rounded-full ${visual.ring.replace('stroke-', 'bg-')}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-100 text-[12.5px] font-medium">{metric.label}</span>
            <span className="text-slate-500 text-[10px]">· {metric.fonteReferencia}</span>
          </div>
          <div className="text-slate-500 text-[10.5px] mt-0.5">{metric.faixaReferencia}</div>
        </div>
        <div className="shrink-0 text-right flex flex-col items-end gap-0.5">
          <div className="text-slate-100 text-[14px] font-mono tabular-nums font-semibold">
            {metric.valor}
            {metric.unidade && <span className="text-slate-500 text-[10px] ml-0.5">{metric.unidade}</span>}
          </div>
          {metric.delta && metric.direcao && (
            <TrendChip direcao={metric.direcao} delta={metric.delta} subirEhBom={metric.subirEhBom} />
          )}
        </div>
        {canExpand && (
          <div className="shrink-0 text-slate-600">
            {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        )}
      </button>

      {open && hasHistorico && <HistoricoBlock historico={metric.historico!} unidade={metric.unidade} />}
    </div>
  )
}

interface TrendChipProps {
  direcao: NonNullable<DimensionMetric['direcao']>
  delta: string
  subirEhBom?: boolean
}

function TrendChip({ direcao, delta, subirEhBom = true }: TrendChipProps) {
  if (direcao === 'sem_anterior') return null
  if (direcao === 'manteve') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9.5px] font-mono tabular-nums font-semibold">
        <Minus size={9} />
        manteve
      </span>
    )
  }
  const subiu = direcao === 'subiu'
  const ehPositivo = subiu === subirEhBom
  const cls = ehPositivo
    ? 'bg-emerald-500/15 text-emerald-300'
    : 'bg-rose-500/15 text-rose-300'
  const Icon = subiu ? TrendingUp : TrendingDown
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${cls} text-[9.5px] font-mono tabular-nums font-semibold`}>
      <Icon size={9} strokeWidth={2.6} />
      {delta}
    </span>
  )
}

function HistoricoBlock({
  historico,
  unidade,
}: {
  historico: MetricHistorico[]
  unidade?: string
}) {
  // Sparkline simples
  const valores = historico.map((h) => h.valorNumerico)
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const range = max - min || 1
  const w = 280
  const h = 36
  const padX = 4
  const padY = 4
  const innerW = w - padX * 2
  const innerH = h - padY * 2
  const xStep = historico.length > 1 ? innerW / (historico.length - 1) : 0
  const yScale = (v: number) => padY + innerH - ((v - min) / range) * innerH

  const linha = historico
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${padX + i * xStep} ${yScale(p.valorNumerico)}`)
    .join(' ')

  return (
    <div className="ml-4 mt-2 mb-1 rounded-xl bg-slate-950/60 border border-slate-800/60 px-3 py-2.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider">
          Histórico · {historico.length} medições
        </span>
        <span className="text-slate-600 text-[9px] font-mono tabular-nums">
          {historico[0].valor}
          {unidade && unidade}
          {' → '}
          {historico[historico.length - 1].valor}
          {unidade && unidade}
        </span>
      </div>

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-9 block">
        <path
          d={linha}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6}
        />
        {historico.map((p, i) => {
          const cx = padX + i * xStep
          const cy = yScale(p.valorNumerico)
          const isLast = i === historico.length - 1
          return (
            <circle
              key={p.data}
              cx={cx}
              cy={cy}
              r={isLast ? 2.5 : 1.6}
              fill={isLast ? '#2dd4bf' : '#94a3b8'}
            />
          )
        })}
      </svg>

      <div className="mt-2 space-y-0.5">
        {historico
          .slice()
          .reverse()
          .map((h, i) => (
            <div key={h.data} className="flex items-center justify-between text-[10.5px]">
              <span className={`font-mono tabular-nums ${i === 0 ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>
                {formatDateBR(h.data)}
              </span>
              <span className={`font-mono tabular-nums ${i === 0 ? 'text-slate-100 font-semibold' : 'text-slate-400'}`}>
                {h.valor}
                {unidade && <span className="text-slate-600 ml-0.5">{unidade}</span>}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

function SufficiencyBadge({ sufficiency }: { sufficiency: DataSufficiency }) {
  const map: Record<DataSufficiency, { label: string; cls: string }> = {
    suficiente: { label: 'OK', cls: '' },
    parcial: { label: 'parcial', cls: 'bg-amber-500/15 text-amber-300' },
    insuficiente: { label: 'sem dados', cls: 'bg-slate-800 text-slate-400' },
  }
  const m = map[sufficiency]
  if (!m.cls) return null
  return (
    <span className={`px-1.5 py-0.5 rounded ${m.cls} text-[9px] font-semibold uppercase tracking-wider`}>
      {m.label}
    </span>
  )
}
