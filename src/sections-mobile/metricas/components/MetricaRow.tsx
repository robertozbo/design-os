import type { MetricaViewModel } from '@/../product-mobile/sections/metricas/types'
import { getIcon, hexFromCor } from './_shared'
import { Sparkline } from './Sparkline'

interface MetricaRowProps {
  metrica: MetricaViewModel
  onClick?: (m: MetricaViewModel) => void
}

const DELTA_COLOR: Record<string, string> = {
  positive: 'text-emerald-400',
  negative: 'text-rose-400',
  neutral: 'text-slate-400',
}

export function MetricaRow({ metrica, onClick }: MetricaRowProps) {
  const Icon = getIcon(metrica.iconeNome)
  const sparkColor = hexFromCor(metrica.iconeCor)
  const semDados = metrica.semDados
  const unidade = metrica.tipo.unit ?? ''

  return (
    <button
      onClick={() => onClick?.(metrica)}
      className="w-[calc(100%-32px)] mx-4 mb-2 flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-left active:scale-[0.99] transition-transform hover:bg-slate-800/40"
    >
      {/* Ícone */}
      <div className={`w-9 h-9 rounded-xl ${metrica.iconeBg} flex items-center justify-center shrink-0`}>
        <Icon size={16} strokeWidth={2.2} style={{ color: sparkColor }} />
      </div>

      {/* Nome + fonte */}
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-semibold text-[13.5px] truncate">{metrica.tipo.label}</div>
        <div className="text-slate-500 font-mono text-[10.5px] truncate tabular-nums">
          {metrica.fonte}
        </div>
      </div>

      {/* Valor + unidade */}
      <div className="text-right shrink-0">
        <div className="font-mono font-bold text-slate-50 tabular-nums leading-none">
          <span className={semDados ? 'text-slate-600 text-[18px]' : 'text-[18px]'}>
            {metrica.valorFormatado ?? '—'}
          </span>
          {unidade && !semDados && (
            <span className="text-slate-400 text-[10px] font-medium ml-0.5">{unidade}</span>
          )}
        </div>
        {metrica.delta && (
          <div className={`text-[10px] font-mono mt-0.5 tabular-nums ${DELTA_COLOR[metrica.deltaTone]}`}>
            {metrica.delta}
          </div>
        )}
      </div>

      {/* Sparkline */}
      {!semDados && metrica.sparkline.length >= 2 && (
        <div className="shrink-0 ml-1">
          <Sparkline data={metrica.sparkline} color={sparkColor} width={56} height={28} />
        </div>
      )}
    </button>
  )
}
