import type {
  EmpregadorResumo,
  AvaliacaoStatus,
  PlanoAcaoStatus,
} from '@/../product/sections/dashboard-sst/types'
import {
  Building2,
  Layers,
  Users2,
  ChevronRight,
  AlertTriangle,
  Calendar,
  ListChecks,
} from 'lucide-react'

interface EmpregadorCardProps {
  empregador: EmpregadorResumo
  revealIndex?: number
  onAbrir?: () => void
}

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

const AVALIACAO_TONE: Record<AvaliacaoStatus, { label: string; pill: string; dot: string }> = {
  rascunho: {
    label: 'Rascunho',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200 dark:ring-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
  em_aplicacao: {
    label: 'Em aplicação',
    pill: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200 dark:ring-teal-900/60',
    dot: 'bg-teal-500',
  },
  encerrada: {
    label: 'Encerrada',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200 dark:ring-amber-900/60',
    dot: 'bg-amber-500',
  },
  publicada: {
    label: 'Publicada',
    pill: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200 dark:ring-violet-900/60',
    dot: 'bg-violet-500',
  },
}

const PLANO_TONE: Record<PlanoAcaoStatus, { label: string; tone: string }> = {
  nao_iniciado: {
    label: 'Plano não iniciado',
    tone: 'text-slate-500 dark:text-slate-400',
  },
  rascunho: {
    label: 'Plano em rascunho',
    tone: 'text-slate-600 dark:text-slate-300',
  },
  em_execucao: {
    label: 'Plano em execução',
    tone: 'text-teal-700 dark:text-teal-400',
  },
  concluido: {
    label: 'Plano concluído',
    tone: 'text-violet-700 dark:text-violet-400',
  },
}

function CoverageMini({
  cobertura,
  coberturaMinima,
}: {
  cobertura: number
  coberturaMinima: number
}) {
  const cleared = cobertura >= coberturaMinima
  const fillTone = cleared
    ? 'from-teal-500 to-emerald-400'
    : 'from-amber-500 to-amber-300'

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <span className={`text-[11px] font-semibold tabular-nums ${cleared ? 'text-teal-700 dark:text-teal-300' : 'text-amber-700 dark:text-amber-300'}`}>
        {cobertura.toFixed(1)}%
      </span>
      <div className="relative flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fillTone}`}
          style={{ width: `${Math.min(cobertura, 100)}%` }}
        />
        <div
          className="absolute top-[-1px] bottom-[-1px] w-px bg-slate-300 dark:bg-slate-600"
          style={{ left: `${coberturaMinima}%` }}
        />
      </div>
    </div>
  )
}

function PlanoProgress({
  total,
  concluidos,
}: {
  total: number
  concluidos: number
}) {
  if (total === 0) return null
  const pct = (concluidos / total) * 100
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <span className="text-[11px] tabular-nums font-mono text-slate-600 dark:text-slate-400">
        {concluidos}/{total}
      </span>
      <div className="flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500/80 dark:bg-violet-400/80"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function EmpregadorCard({ empregador, revealIndex = 0, onAbrir }: EmpregadorCardProps) {
  const tem = empregador.ultimaAvaliacao
  const showCoverage = tem && tem.status !== 'rascunho'
  const planoTone = PLANO_TONE[empregador.planoAcao.status]
  const hasAlertas = empregador.alertasCriticos > 0

  return (
    <button
      type="button"
      onClick={onAbrir}
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className={`
        nymos-reveal opacity-0
        group relative w-full text-left
        rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        ${hasAlertas ? 'ring-1 ring-rose-200/60 dark:ring-rose-900/40' : ''}
        hover:border-teal-300 dark:hover:border-teal-700
        hover:shadow-[0_4px_20px_-8px_rgba(15,118,110,0.25)]
        dark:hover:shadow-[0_4px_20px_-8px_rgba(20,184,166,0.35)]
        transition-all duration-200
        p-5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {empregador.cnpj}
            </span>
            {hasAlertas && (
              <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-200 dark:ring-rose-900/60 text-[10px] font-medium text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-3 h-3" strokeWidth={1.75} />
                {empregador.alertasCriticos} {empregador.alertasCriticos === 1 ? 'alerta' : 'alertas'}
              </span>
            )}
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 line-clamp-1">
            {empregador.razaoSocial}
          </h3>
        </div>
        <ChevronRight
          className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-200 mt-1 shrink-0"
          strokeWidth={1.75}
        />
      </div>

      <div className="mt-3 flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{empregador.totalEstabelecimentos}</span> estab.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{empregador.totalSetores}</span> setores
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{empregador.totalTrabalhadores.toLocaleString('pt-BR')}</span> trab.
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Última avaliação
            </span>
            {tem && (
              <span className={`inline-flex items-center gap-1 px-1.5 py-px rounded-md ring-1 text-[10px] font-medium ${AVALIACAO_TONE[tem.status].pill}`}>
                <span className={`w-1 h-1 rounded-full ${AVALIACAO_TONE[tem.status].dot}`} />
                {AVALIACAO_TONE[tem.status].label}
              </span>
            )}
          </div>
          {tem ? (
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 shrink-0">
                {tem.instrumento}
              </span>
              {showCoverage && (
                <CoverageMini
                  cobertura={tem.coberturaPercent}
                  coberturaMinima={tem.coberturaMinima}
                />
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">Sem avaliação iniciada</span>
          )}
        </div>

        <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Plano de ação
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${planoTone.tone}`}>
              <ListChecks className="w-3 h-3" strokeWidth={1.75} />
              {planoTone.label}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <PlanoProgress
              total={empregador.planoAcao.itensTotal}
              concluidos={empregador.planoAcao.itensConcluidos}
            />
            {empregador.planoAcao.proximoVencimento && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                <Calendar className="w-3 h-3" strokeWidth={1.75} />
                {formatDate(empregador.planoAcao.proximoVencimento)}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
