import { Sparkles } from 'lucide-react'
import type { MinhaSaudeData, DimensionId } from '@/../product-mobile/sections/minha-saude/types'
import { ScoreGauge } from './ScoreGauge'
import { DimensionCard } from './DimensionCard'
import { IdadesCard } from './IdadesCard'
import { formatRelativeDate } from './_shared'

interface EstadoAtualTabProps {
  data: MinhaSaudeData
  onDimensaoClick?: (id: DimensionId) => void
  onColetarDado?: (tipo: string) => void
}

export function EstadoAtualTab({ data, onColetarDado }: EstadoAtualTabProps) {
  const { estadoAtual } = data
  const dimensoesComDados = estadoAtual.dimensoes.filter((d) => d.score !== null).length
  const totalDimensoes = estadoAtual.dimensoes.length

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <div className="flex flex-col items-center pt-2">
        <ScoreGauge score={estadoAtual.scoreGeral} />
        <div className="text-slate-500 text-[10.5px] mt-3 font-mono tabular-nums">
          atualizado {formatRelativeDate(estadoAtual.atualizadoEm)}
        </div>
      </div>

      {estadoAtual.idades && <IdadesCard idades={estadoAtual.idades} />}

      <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-300 shrink-0">
          <Sparkles size={16} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 text-[12.5px] font-semibold">
            {dimensoesComDados} de {totalDimensoes} dimensões avaliadas
          </div>
          <div className="text-slate-400 text-[11px] leading-snug">
            Quanto mais dados você coletar, mais preciso fica seu score.
          </div>
        </div>
      </div>

      <div>
        <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-2 px-1">
          Dimensões
        </div>
        <div className="space-y-2">
          {estadoAtual.dimensoes.map((d) => (
            <DimensionCard key={d.id} dimension={d} onColetarDado={onColetarDado} />
          ))}
        </div>
      </div>
    </div>
  )
}
