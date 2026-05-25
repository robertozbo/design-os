import type {
  ClassificacaoRisco,
  Estabelecimento,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import { Activity, AlertTriangle, Layers3, Users2 } from 'lucide-react'

interface EstabelecimentoDetailKpiProps {
  estabelecimento: Estabelecimento
}

const NUM = new Intl.NumberFormat('pt-BR')

const RISCO_TONE: Record<
  ClassificacaoRisco,
  { label: string; pill: string; dot: string }
> = {
  baixo: {
    label: 'Risco baixo',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    dot: 'bg-emerald-500',
  },
  moderado: {
    label: 'Risco moderado',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    dot: 'bg-amber-500',
  },
  critico: {
    label: 'Risco crítico',
    pill: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    dot: 'bg-rose-500',
  },
  prioritario: {
    label: 'Risco prioritário',
    pill: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 ring-rose-300/70 dark:ring-rose-900/70',
    dot: 'bg-rose-600',
  },
}

export function EstabelecimentoDetailKpi({ estabelecimento }: EstabelecimentoDetailKpiProps) {
  const { saudeNr1, estrutura } = estabelecimento
  const cobertura = saudeNr1.coberturaMedia
  const cleared = cobertura >= 0.65
  const fillTone = cleared
    ? 'from-teal-500 to-emerald-400'
    : cobertura > 0
      ? 'from-amber-500 to-amber-300'
      : 'from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        style={{ animationDelay: '50ms' }}
        className="
          nymos-reveal opacity-0
          rounded-2xl bg-white/95 dark:bg-slate-900/70
          border border-slate-200/80 dark:border-slate-800
          px-4 py-3.5 flex flex-col justify-between gap-3 min-h-[112px]
        "
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
            Cobertura NR-1
          </span>
          <span
            className={`inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 ${
              cleared
                ? 'text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 ring-teal-200/60 dark:ring-teal-900/50'
                : 'text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 ring-amber-200/60 dark:ring-amber-900/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
              {(cobertura * 100).toFixed(0)}%
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {saudeNr1.ultimoInstrumento ?? 'Sem coleta'}
            </span>
          </div>
          <div className="relative h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${fillTone}`}
              style={{ width: `${Math.min(cobertura * 100, 100)}%` }}
            />
            <div
              className="absolute top-[-1px] bottom-[-1px] w-px bg-slate-300 dark:bg-slate-600"
              style={{ left: '65%' }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
            mín NR-1: 65%
          </p>
        </div>
      </div>

      <div
        style={{ animationDelay: '100ms' }}
        className="
          nymos-reveal opacity-0
          rounded-2xl bg-white/95 dark:bg-slate-900/70
          border border-slate-200/80 dark:border-slate-800
          px-4 py-3.5 flex flex-col justify-between gap-3 min-h-[112px]
        "
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
            Risco predominante
          </span>
          <span
            className={`inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 ${
              saudeNr1.alertasCriticos > 0
                ? 'text-rose-700 dark:text-rose-300 bg-rose-50/70 dark:bg-rose-950/30 ring-rose-200/60 dark:ring-rose-900/50'
                : 'text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50 ring-slate-200/60 dark:ring-slate-700/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
        </div>
        <div>
          {saudeNr1.riscoPredominante ? (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 text-[12px] font-medium ${
                RISCO_TONE[saudeNr1.riscoPredominante].pill
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${RISCO_TONE[saudeNr1.riscoPredominante].dot}`}
              />
              {RISCO_TONE[saudeNr1.riscoPredominante].label}
            </span>
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">Aguardando coleta</span>
          )}
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {saudeNr1.alertasCriticos > 0
              ? `${saudeNr1.alertasCriticos} ${
                  saudeNr1.alertasCriticos === 1 ? 'alerta crítico' : 'alertas críticos'
                } em aberto`
              : 'Sem alertas críticos'}
          </p>
        </div>
      </div>

      <div
        style={{ animationDelay: '150ms' }}
        className="
          nymos-reveal opacity-0
          rounded-2xl bg-white/95 dark:bg-slate-900/70
          border border-slate-200/80 dark:border-slate-800
          px-4 py-3.5 flex flex-col justify-between gap-3 min-h-[112px]
        "
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
            Setores
          </span>
          <span className="inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50 ring-slate-200/60 dark:ring-slate-700/60">
            <Layers3 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
            {NUM.format(estrutura.totalSetores)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            cobertos pelo PGR
          </span>
        </div>
      </div>

      <div
        style={{ animationDelay: '200ms' }}
        className="
          nymos-reveal opacity-0
          rounded-2xl bg-white/95 dark:bg-slate-900/70
          border border-slate-200/80 dark:border-slate-800
          px-4 py-3.5 flex flex-col justify-between gap-3 min-h-[112px]
        "
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
            Trabalhadores
          </span>
          <span className="inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 text-violet-700 dark:text-violet-300 bg-violet-50/70 dark:bg-violet-950/30 ring-violet-200/60 dark:ring-violet-900/50">
            <Users2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
            {NUM.format(estrutura.totalTrabalhadores)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            elegíveis
          </span>
        </div>
      </div>
    </div>
  )
}
