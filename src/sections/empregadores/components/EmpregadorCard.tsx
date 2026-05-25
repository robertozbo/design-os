import type {
  Empregador,
  AvaliacaoStatusSnapshot,
  PlanoAcaoStatus,
  AlertaSeveridade,
} from '@/../product/sections/empregadores/types'
import {
  Building2,
  Layers,
  Users2,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  CalendarClock,
  ClipboardList,
  Pencil,
  Archive,
  ArchiveRestore,
} from 'lucide-react'

interface EmpregadorCardProps {
  empregador: Empregador
  revealIndex?: number
  onSelect?: () => void
  onEdit?: () => void
  onArchive?: () => void
  onUnarchive?: () => void
  onSelectAlerta?: (alertaId: string) => void
}

const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR')

const AVALIACAO_TONE: Record<
  AvaliacaoStatusSnapshot,
  { label: string; pill: string; dot: string }
> = {
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
  nao_iniciado: { label: 'Não iniciado', tone: 'text-slate-500 dark:text-slate-400' },
  rascunho: { label: 'Em rascunho', tone: 'text-slate-600 dark:text-slate-300' },
  em_execucao: { label: 'Em execução', tone: 'text-teal-700 dark:text-teal-400' },
  concluido: { label: 'Concluído', tone: 'text-violet-700 dark:text-violet-400' },
  encerrado: { label: 'Encerrado', tone: 'text-slate-500 dark:text-slate-500' },
}

const SEV_TONE: Record<
  AlertaSeveridade,
  { wrapper: string; chip: string; ring: string }
> = {
  alta: {
    wrapper: 'ring-amber-200/70 dark:ring-amber-900/50',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    ring: 'ring-1 ring-amber-200/70 dark:ring-amber-900/50',
  },
  critica: {
    wrapper: 'ring-rose-200/70 dark:ring-rose-900/50',
    chip: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    ring: 'ring-1 ring-rose-200/70 dark:ring-rose-900/50',
  },
}

function pickHighestSeverity(alertasCount: { critica: number; alta: number }): AlertaSeveridade | null {
  if (alertasCount.critica > 0) return 'critica'
  if (alertasCount.alta > 0) return 'alta'
  return null
}

export function EmpregadorCard({
  empregador,
  revealIndex = 0,
  onSelect,
  onEdit,
  onArchive,
  onUnarchive,
  onSelectAlerta,
}: EmpregadorCardProps) {
  const { saudeNr1, planoAcao, estrutura, alertas, status } = empregador
  const isArquivado = status === 'arquivado'
  const showCoverage = saudeNr1.ultimaAvaliacaoStatus !== 'rascunho'
  const planoTone = PLANO_TONE[planoAcao.status]
  const tone = AVALIACAO_TONE[saudeNr1.ultimaAvaliacaoStatus]

  const counts = alertas.reduce(
    (acc, a) => {
      acc[a.severidade] += 1
      return acc
    },
    { critica: 0, alta: 0 } as { critica: number; alta: number },
  )
  const highestSev = pickHighestSeverity(counts)
  const hoursOff = highestSev ? SEV_TONE[highestSev].ring : ''

  const coverageMinima = 0.65
  const coverage = saudeNr1.coberturaMedia
  const cleared = coverage >= coverageMinima
  const coverageFill = cleared
    ? 'from-teal-500 to-emerald-400'
    : coverage > 0
      ? 'from-amber-500 to-amber-300'
      : 'from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700'

  const diasAteVigencia = saudeNr1.diasAteVigencia
  const vigenciaUrgente = diasAteVigencia !== null && diasAteVigencia <= 30

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.()
        }
      }}
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className={`
        nymos-reveal opacity-0
        group relative cursor-pointer
        rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        ${hoursOff}
        ${isArquivado ? 'opacity-80' : ''}
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
            {isArquivado && (
              <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-slate-200/70 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 ring-1 ring-slate-300/60 dark:ring-slate-700">
                Arquivado
              </span>
            )}
            {!isArquivado && (
              <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-teal-50 dark:bg-teal-950/40 text-[10px] font-medium text-teal-700 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-900/60">
                <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                Ativo
              </span>
            )}
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 line-clamp-1">
            {empregador.razaoSocial}
          </h3>
          <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400 line-clamp-1">
            {empregador.nomeFantasia}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ActionButton
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.()
            }}
            label="Editar"
            icon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />}
          />
          {isArquivado ? (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation()
                onUnarchive?.()
              }}
              label="Desarquivar"
              icon={<ArchiveRestore className="w-3.5 h-3.5" strokeWidth={1.75} />}
            />
          ) : (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation()
                onArchive?.()
              }}
              label="Arquivar"
              icon={<Archive className="w-3.5 h-3.5" strokeWidth={1.75} />}
            />
          )}
          <ChevronRight
            className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-200 ml-0.5"
            strokeWidth={1.75}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{estrutura.estabelecimentos}</span> estab.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{estrutura.setores}</span> setores
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{NUMBER_FORMATTER.format(estrutura.trabalhadores)}</span>{' '}
          trab.
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500">
          <CalendarClock
            className={`w-3 h-3 ${vigenciaUrgente ? 'text-rose-500' : 'text-slate-400'}`}
            strokeWidth={1.75}
          />
          <span
            className={`tabular-nums font-mono ${
              vigenciaUrgente ? 'text-rose-700 dark:text-rose-300 font-semibold' : ''
            }`}
          >
            {diasAteVigencia === null
              ? 'Sem vigência'
              : `${diasAteVigencia}d até vigência`}
          </span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Saúde NR-1
            </span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-px rounded-md ring-1 text-[10px] font-medium ${tone.pill}`}
            >
              <span className={`w-1 h-1 rounded-full ${tone.dot}`} />
              {tone.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 shrink-0">
              {saudeNr1.instrumento}
            </span>
            {showCoverage ? (
              <div className="flex items-center gap-2 min-w-[120px] flex-1">
                <span
                  className={`text-[11px] font-semibold tabular-nums ${
                    cleared
                      ? 'text-teal-700 dark:text-teal-300'
                      : coverage > 0
                        ? 'text-amber-700 dark:text-amber-300'
                        : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {(coverage * 100).toFixed(0)}%
                </span>
                <div className="relative flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${coverageFill}`}
                    style={{ width: `${Math.min(coverage * 100, 100)}%` }}
                  />
                  <div
                    className="absolute top-[-1px] bottom-[-1px] w-px bg-slate-300 dark:bg-slate-600"
                    style={{ left: `${coverageMinima * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">Sem coleta</span>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Plano de ação
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${planoTone.tone}`}>
              <ClipboardList className="w-3 h-3" strokeWidth={1.75} />
              {planoTone.label}
            </span>
          </div>
          {planoAcao.totalItens > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-[100px] flex-1">
                <span className="text-[11px] tabular-nums font-mono text-slate-600 dark:text-slate-400">
                  {planoAcao.concluidos}/{planoAcao.totalItens}
                </span>
                <div className="flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500/80 dark:bg-violet-400/80"
                    style={{ width: `${(planoAcao.concluidos / planoAcao.totalItens) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-[11px] tabular-nums">
                {planoAcao.emAtraso > 0 && (
                  <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300 font-medium">
                    <span className="w-1 h-1 rounded-full bg-rose-500" />
                    {planoAcao.emAtraso}
                  </span>
                )}
                {planoAcao.emExecucao > 0 && (
                  <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-300">
                    <span className="w-1 h-1 rounded-full bg-teal-500" />
                    {planoAcao.emExecucao}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">Sem itens cadastrados</span>
          )}
        </div>
      </div>

      {alertas.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {alertas.map((alerta) => {
            const t = SEV_TONE[alerta.severidade]
            return (
              <button
                key={alerta.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectAlerta?.(alerta.id)
                }}
                className={`
                  inline-flex items-center gap-1.5 px-2 py-1 rounded-lg
                  ring-1 text-[11px] font-medium
                  ${t.chip}
                  hover:brightness-105 active:translate-y-px
                  transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                `}
              >
                <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                {alerta.mensagem}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ActionButton({
  onClick,
  label,
  icon,
}: {
  onClick: (e: React.MouseEvent) => void
  label: string
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="
        opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
        inline-flex items-center justify-center
        w-7 h-7 rounded-lg
        text-slate-500 dark:text-slate-400
        hover:bg-slate-100 dark:hover:bg-slate-800
        hover:text-slate-900 dark:hover:text-slate-100
        transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
      "
    >
      {icon}
    </button>
  )
}
