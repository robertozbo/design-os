import type { MetricaDetalheProps } from '@/../product-mobile/sections/metricas/types'
import { ChevronLeft, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getIcon, hexFromCor } from './_shared'
import { BigChart } from './BigChart'
import { StatsRow } from './StatsRow'
import { HistoricoList } from './HistoricoList'

const DELTA_COLOR: Record<string, string> = {
  positive: 'text-emerald-400',
  negative: 'text-rose-400',
  neutral: 'text-slate-400',
}

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus }

export function MetricaDetalhe({
  metrica,
  periodos,
  periodoSelecionado,
  serie,
  stats,
  faixaNormal,
  safeTop = false,
  onPeriodoChange,
  onVoltar,
  onAdicionarClick,
}: MetricaDetalheProps) {
  const Icon = getIcon(metrica.iconeNome)
  const color = hexFromCor(metrica.iconeCor)
  const unidade = metrica.tipo.unit ?? ''
  const Trend = TREND_ICON[metrica.tendencia] ?? Minus
  const podeAdicionar = metrica.tipo.dataType !== 'composite'

  return (
    <div className="min-h-full bg-slate-950 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-sm">
        {safeTop && <div className="h-11" />}
        <div className="flex items-center gap-2 px-3 py-3">
          <button
            onClick={onVoltar}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-800 active:scale-95 transition"
            aria-label="Voltar"
          >
            <ChevronLeft size={22} />
          </button>
          <div className={`w-8 h-8 rounded-xl ${metrica.iconeBg} flex items-center justify-center shrink-0`}>
            <Icon size={15} strokeWidth={2.2} style={{ color }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-slate-100 font-semibold text-[14.5px] truncate">{metrica.tipo.label}</div>
            <div className="text-slate-500 font-mono text-[10px] truncate">{metrica.fonte}</div>
          </div>
        </div>
      </div>

      {/* Valor atual */}
      <div className="px-4 pt-1 pb-4">
        <div className="flex items-end gap-2">
          <span className="font-mono font-bold text-slate-50 text-[40px] leading-none tabular-nums">
            {metrica.valorFormatado ?? '—'}
          </span>
          {unidade && metrica.valorFormatado && (
            <span className="text-slate-400 text-[15px] font-medium mb-1.5">{unidade}</span>
          )}
        </div>
        {metrica.delta && (
          <div className={`flex items-center gap-1 mt-1.5 text-[12.5px] font-mono ${DELTA_COLOR[metrica.deltaTone]}`}>
            <Trend size={13} />
            <span>{metrica.delta}</span>
            <span className="text-slate-500">· vs período anterior</span>
          </div>
        )}
      </div>

      {/* Filtro de período */}
      <div className="px-4 mb-1 flex gap-2 overflow-x-auto no-scrollbar">
        {periodos.map((p) => {
          const active = p.id === periodoSelecionado
          return (
            <button
              key={p.id}
              onClick={() => onPeriodoChange?.(p.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
                active
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Gráfico */}
      <div className="px-2 py-2">
        <BigChart serie={serie} color={color} unidade={unidade} faixaNormal={faixaNormal} />
      </div>

      {faixaNormal && (
        <div className="px-4 -mt-1 mb-3 flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
          <span className="text-slate-500 text-[10.5px] font-mono">
            Faixa normal
            {faixaNormal.min != null && faixaNormal.max != null
              ? ` ${faixaNormal.min}–${faixaNormal.max}${unidade}`
              : faixaNormal.min != null
                ? ` ≥ ${faixaNormal.min}${unidade}`
                : ` ≤ ${faixaNormal.max}${unidade}`}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="mb-5">
        <StatsRow stats={stats} />
      </div>

      {/* Histórico */}
      <HistoricoList serie={serie} unidade={unidade} />

      {/* Adicionar registro */}
      {podeAdicionar && (
        <div className="px-4 mt-5">
          <button
            onClick={onAdicionarClick}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-[14px] py-3 active:scale-[0.99] transition"
          >
            <Plus size={17} />
            Adicionar registro
          </button>
        </div>
      )}
    </div>
  )
}
