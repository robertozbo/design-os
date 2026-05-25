import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type {
  Avaliacao,
  Classificacoes,
  MedidaId,
  PacienteContexto,
} from '@/../product/sections/avalia-o-antropom-trica/types'
import {
  TONE_BADGE,
  TONE_TEXT,
  calcImc,
  calcRcq,
  classifyImc,
  classifyPercentualGordura,
  classifyRcq,
  computeDelta,
  deltaTone,
  formatNumber,
  formatRelativeDate,
  formatSigned,
} from './utils'

interface StatsRowProps {
  pacienteContexto: PacienteContexto
  current: Avaliacao
  previous: Avaliacao | undefined
  classificacoes: Classificacoes
}

export function StatsRow({
  pacienteContexto,
  current,
  previous,
  classificacoes,
}: StatsRowProps) {
  const imc = calcImc(current.basicas.pesoKg, current.basicas.alturaCm)
  const prevImc = previous
    ? calcImc(previous.basicas.pesoKg, previous.basicas.alturaCm)
    : null
  const rcq = calcRcq(current.circunferencias.cinturaCm, current.circunferencias.quadrilCm)
  const prevRcq = previous
    ? calcRcq(previous.circunferencias.cinturaCm, previous.circunferencias.quadrilCm)
    : null
  const pctG = current.composicao.percentualGordura
  const prevPctG = previous?.composicao.percentualGordura

  const imcClass = classifyImc(imc, classificacoes)
  const rcqClass = rcq ? classifyRcq(rcq, pacienteContexto.sexo, classificacoes) : null
  const pctGClass = pctG ? classifyPercentualGordura(pctG, pacienteContexto.sexo, classificacoes) : null

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Peso"
        value={formatNumber(current.basicas.pesoKg)}
        unit="kg"
        delta={previous ? computeDelta(current.basicas.pesoKg, previous.basicas.pesoKg) : null}
        deltaMedida="peso"
        timestamp={formatRelativeDate(current.dataIso)}
      />
      <StatCard
        label="IMC"
        value={formatNumber(imc)}
        unit="kg/m²"
        delta={prevImc !== null ? computeDelta(imc, prevImc) : null}
        deltaMedida="imc"
        timestamp={formatRelativeDate(current.dataIso)}
        classification={imcClass}
      />
      <StatCard
        label="RCQ"
        value={rcq !== null ? formatNumber(rcq, 2) : '—'}
        unit="cint/quad"
        delta={rcq !== null && prevRcq !== null ? computeDelta(rcq, prevRcq) : null}
        deltaMedida="rcq"
        timestamp={formatRelativeDate(current.dataIso)}
        classification={rcqClass}
      />
      <StatCard
        label="% Gordura"
        value={pctG !== undefined ? formatNumber(pctG) : '—'}
        unit="%"
        delta={pctG !== undefined && prevPctG !== undefined ? computeDelta(pctG, prevPctG) : null}
        deltaMedida="percentualGordura"
        timestamp={formatRelativeDate(current.dataIso)}
        classification={pctGClass}
      />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  unit: string
  delta: ReturnType<typeof computeDelta> | null
  deltaMedida: MedidaId
  timestamp: string
  classification?: { label: string; tone: 'rose' | 'amber' | 'emerald' } | null
}

function StatCard({
  label,
  value,
  unit,
  delta,
  deltaMedida,
  timestamp,
  classification,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {classification && (
          <span
            className={`
              inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ring-1
              ${TONE_BADGE[classification.tone]}
            `}
          >
            {classification.label}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {value}
        </span>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{unit}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        {delta ? (
          <DeltaChip delta={delta} medida={deltaMedida} unit={unit} />
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-600">
            Sem comparação
          </span>
        )}
        <span
          className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-600"
          title={timestamp}
        >
          {timestamp}
        </span>
      </div>
    </div>
  )
}

function DeltaChip({
  delta,
  medida,
  unit,
}: {
  delta: NonNullable<ReturnType<typeof computeDelta>>
  medida: MedidaId
  unit: string
}) {
  const tone = deltaTone(medida, delta.direction)
  const Icon =
    delta.direction === 'down' ? ArrowDownRight : delta.direction === 'up' ? ArrowUpRight : Minus

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums
        ${TONE_TEXT[tone]}
      `}
    >
      <Icon size={10} strokeWidth={2.5} />
      {formatSigned(delta.abs, 1)}
      {unit && unit !== 'cint/quad' && (
        <span className="font-mono opacity-70">{unit}</span>
      )}
      <span className="opacity-70">({formatSigned(delta.pct, 1)}%)</span>
    </span>
  )
}
