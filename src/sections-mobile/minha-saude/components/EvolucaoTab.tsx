import { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type {
  EvolucaoPeriodo,
  EvolucaoSerie,
  MinhaSaudeData,
} from '@/../product-mobile/sections/minha-saude/types'
import { DIMENSION_ICON, STATUS_VISUAL } from './_shared'
import { SerieChart } from './SerieChart'
import { FotosTimeline } from './FotosTimeline'

interface EvolucaoTabProps {
  data: MinhaSaudeData
  onSnapshotClick?: (id: string) => void
}

const PERIODOS: { id: EvolucaoPeriodo; label: string; dias: number | null }[] = [
  { id: '3m', label: '3 meses', dias: 90 },
  { id: '6m', label: '6 meses', dias: 180 },
  { id: '1a', label: '1 ano', dias: 365 },
  { id: 'tudo', label: 'Tudo', dias: null },
]

export function EvolucaoTab({ data, onSnapshotClick }: EvolucaoTabProps) {
  const [periodo, setPeriodo] = useState<EvolucaoPeriodo>('tudo')

  const seriesFiltradas = useMemo(() => {
    const cfg = PERIODOS.find((p) => p.id === periodo)!
    if (cfg.dias === null) return data.evolucao
    const limite = Date.now() - cfg.dias * 24 * 60 * 60 * 1000
    return data.evolucao.map((s) => ({
      ...s,
      pontos: s.pontos.filter((p) => new Date(p.data).getTime() >= limite),
    }))
  }, [data.evolucao, periodo])

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <FotosTimeline snapshots={data.snapshots} onSnapshotClick={onSnapshotClick} />

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {PERIODOS.map((p) => {
          const active = p.id === periodo
          return (
            <button
              key={p.id}
              onClick={() => setPeriodo(p.id)}
              className={`px-3.5 h-8 rounded-full text-[12px] font-semibold whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-slate-100 text-slate-900'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-2.5">
        {seriesFiltradas.map((s) => (
          <SerieCard key={s.dimensaoId} serie={s} />
        ))}
      </div>
    </div>
  )
}

function SerieCard({ serie }: { serie: EvolucaoSerie }) {
  const Icon = DIMENSION_ICON[serie.dimensaoId]
  const visual = STATUS_VISUAL[serie.statusAtual]
  const semDados = serie.scoreAtual === null

  return (
    <div className={`rounded-2xl bg-slate-900 border ${visual.border} p-3.5`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${visual.bg} flex items-center justify-center ${visual.text} shrink-0`}
        >
          <Icon size={17} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[13px]">{serie.label}</div>
          <div className="text-slate-500 text-[10.5px] mt-0.5">
            {serie.pontos.filter((p) => p.score !== null).length} pontos no período
          </div>
        </div>
        <div className="shrink-0 text-right">
          {semDados ? (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[10px] font-semibold uppercase">
              Sem dados
            </span>
          ) : (
            <>
              <div className={`text-[18px] font-bold font-mono tabular-nums ${visual.text}`}>
                {serie.scoreAtual}
              </div>
              {serie.deltaTotal !== null && <DeltaTotalChip delta={serie.deltaTotal} />}
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-slate-950/50 border border-slate-800/50 p-1.5">
        <SerieChart pontos={serie.pontos} width={310} height={88} />
      </div>
    </div>
  )
}

function DeltaTotalChip({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <div className="text-slate-500 text-[10px] font-mono tabular-nums flex items-center gap-0.5 justify-end mt-0.5">
        <Minus size={9} />
        manteve
      </div>
    )
  }
  const Icon = delta > 0 ? TrendingUp : TrendingDown
  const cls = delta > 0 ? 'text-emerald-400' : 'text-rose-400'
  return (
    <div
      className={`${cls} text-[10px] font-mono tabular-nums font-semibold flex items-center gap-0.5 justify-end mt-0.5`}
    >
      <Icon size={9} strokeWidth={2.6} />
      {delta > 0 ? '+' : ''}
      {delta} pts
    </div>
  )
}
