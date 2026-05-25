import { useMemo, useState } from 'react'
import type {
  FilaTransmissaoProps,
  PrioridadeJob,
  StatusJobFila,
} from '@/../product/sections/eventos-esocial/types'
import {
  ChevronRight,
  ChevronLeft,
  Inbox,
  Trash2,
  Filter as FilterIcon,
  Hourglass,
  Send,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { AmbienteToggle } from './AmbienteToggle'
import { WorkerHealthCard } from './WorkerHealthCard'
import { FilaJobRow } from './FilaJobRow'

const STATUS_FILTROS: { v: StatusJobFila | 'todos'; label: string }[] = [
  { v: 'todos', label: 'Todos' },
  { v: 'enviando', label: 'Enviando' },
  { v: 'aguardando_retorno', label: 'Aguardando retorno' },
  { v: 'aguardando', label: 'Aguardando' },
  { v: 'falhou_retry', label: 'Retry pendente' },
  { v: 'exausto', label: 'Esgotados' },
  { v: 'cancelado', label: 'Cancelados' },
]

const PRIORIDADE_RANK: Record<PrioridadeJob, number> = {
  urgente: 0,
  alta: 1,
  normal: 2,
}

const STATUS_RANK: Record<StatusJobFila, number> = {
  enviando: 0,
  aguardando_retorno: 1,
  falhou_retry: 2,
  aguardando: 3,
  exausto: 4,
  cancelado: 5,
  concluido: 6,
}

export function FilaTransmissao({
  empregadorContexto,
  fila,
  ambiente,
  onVoltar,
  onAmbienteChange,
  onAbrirEvento,
  onReenviarAgora,
  onCancelar,
  onPriorizar,
  onVerLog,
  onPausarWorker,
  onRetomarWorker,
  onLimparExaustos,
}: FilaTransmissaoProps) {
  const [filtroStatus, setFiltroStatus] = useState<StatusJobFila | 'todos'>('todos')

  const jobsDoAmbiente = useMemo(
    () => fila.jobs.filter((j) => j.ambiente === ambiente),
    [fila.jobs, ambiente],
  )

  const contagemPorStatus = useMemo(() => {
    const map: Record<StatusJobFila | 'todos', number> = {
      todos: jobsDoAmbiente.length,
      enviando: 0,
      aguardando_retorno: 0,
      aguardando: 0,
      falhou_retry: 0,
      exausto: 0,
      cancelado: 0,
      concluido: 0,
    }
    for (const j of jobsDoAmbiente) map[j.statusFila]++
    return map
  }, [jobsDoAmbiente])

  const jobsOrdenados = useMemo(() => {
    const out = jobsDoAmbiente.filter(
      (j) => filtroStatus === 'todos' || j.statusFila === filtroStatus,
    )
    return out.sort((a, b) => {
      const pDiff = PRIORIDADE_RANK[a.prioridade] - PRIORIDADE_RANK[b.prioridade]
      if (pDiff !== 0) return pDiff
      const sDiff = STATUS_RANK[a.statusFila] - STATUS_RANK[b.statusFila]
      if (sDiff !== 0) return sDiff
      return a.entrouNaFilaEm.localeCompare(b.entrouNaFilaEm)
    })
  }, [jobsDoAmbiente, filtroStatus])

  const exaustosCount = contagemPorStatus.exausto

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap" aria-label="Trilha">
          <button type="button" onClick={onVoltar} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            Empregadores
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <button type="button" onClick={onVoltar} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            Eventos eSocial
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400">Fila de transmissão</span>
        </div>

        <button
          type="button"
          onClick={onVoltar}
          className="nymos-reveal opacity-0 inline-flex items-center gap-1 mb-3 text-[12px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition lg:hidden"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Voltar
        </button>

        {/* Header */}
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Transmissão eSocial
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Fila de transmissão
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Pipeline assíncrono entre validação e retorno do governo · {empregadorContexto.nomeFantasia}
              </p>
            </div>
            <AmbienteToggle ambiente={ambiente} onChange={(a) => onAmbienteChange?.(a)} />
          </div>
        </header>

        {/* Worker health */}
        <div className="mt-5">
          <WorkerHealthCard
            worker={fila.worker}
            onPausar={onPausarWorker}
            onRetomar={onRetomarWorker}
          />
        </div>

        {/* KPI strip */}
        <div
          style={{ animationDelay: '180ms' }}
          className="nymos-reveal opacity-0 mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <StatTile
            icon={<Hourglass className="w-4 h-4" strokeWidth={1.75} />}
            label="Aguardando"
            value={fila.totalAguardando}
            tone="slate"
          />
          <StatTile
            icon={<Send className="w-4 h-4" strokeWidth={1.75} />}
            label="Enviando"
            value={fila.totalEnviando}
            tone="amber"
            pulse
          />
          <StatTile
            icon={<AlertTriangle className="w-4 h-4" strokeWidth={1.75} />}
            label="Com falha"
            value={fila.totalFalha}
            tone="rose"
          />
          <StatTile
            icon={<CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />}
            label="Concluídos · 24h"
            value={fila.totalConcluidos24h}
            tone="emerald"
          />
        </div>

        {/* Filtros + ações */}
        <div
          style={{ animationDelay: '260ms' }}
          className="nymos-reveal opacity-0 mt-6 flex flex-col lg:flex-row lg:items-center gap-3"
        >
          <div className="flex items-center gap-1.5 flex-wrap">
            <FilterIcon className="w-3.5 h-3.5 text-slate-400 mr-0.5" strokeWidth={1.75} />
            {STATUS_FILTROS.map((opt) => {
              const active = filtroStatus === opt.v
              const count = contagemPorStatus[opt.v]
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setFiltroStatus(opt.v)}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition
                    ${
                      active
                        ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-[0_2px_8px_-2px_rgba(13,148,136,0.45)]'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {opt.label}
                  <span
                    className={`text-[10px] tabular-nums ${
                      active
                        ? 'text-white/80'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {exaustosCount > 0 && (
            <button
              type="button"
              onClick={onLimparExaustos}
              className="lg:ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <Trash2 className="w-3 h-3" strokeWidth={2} />
              Limpar esgotados ({exaustosCount})
            </button>
          )}
        </div>

        {/* Lista */}
        <div className="mt-4">
          {jobsOrdenados.length === 0 ? (
            <EmptyFila
              isFiltered={filtroStatus !== 'todos'}
              onClear={() => setFiltroStatus('todos')}
            />
          ) : (
            <div className="space-y-2">
              {jobsOrdenados.map((job, idx) => (
                <FilaJobRow
                  key={job.id}
                  job={job}
                  revealIndex={idx + 4}
                  onAbrirEvento={() => onAbrirEvento?.(job.eventoId)}
                  onReenviarAgora={() => onReenviarAgora?.(job.id)}
                  onCancelar={() => onCancelar?.(job.id)}
                  onPriorizar={() => onPriorizar?.(job.id)}
                  onVerLog={() => onVerLog?.(job.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatTile({
  icon,
  label,
  value,
  tone,
  pulse = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: 'slate' | 'amber' | 'rose' | 'emerald'
  pulse?: boolean
}) {
  const tones: Record<typeof tone, { bg: string; ring: string; icon: string; text: string; pulse: string }> = {
    slate: {
      bg: 'from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950',
      ring: 'border-slate-200/70 dark:border-slate-800',
      icon: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
      text: 'text-slate-900 dark:text-slate-50',
      pulse: 'bg-slate-400',
    },
    amber: {
      bg: 'from-amber-50/70 to-white dark:from-amber-950/30 dark:to-slate-950',
      ring: 'border-amber-200/70 dark:border-amber-900/60',
      icon: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
      text: 'text-amber-900 dark:text-amber-100',
      pulse: 'bg-amber-400',
    },
    rose: {
      bg: 'from-rose-50/70 to-white dark:from-rose-950/30 dark:to-slate-950',
      ring: 'border-rose-200/70 dark:border-rose-900/60',
      icon: 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
      text: 'text-rose-900 dark:text-rose-100',
      pulse: 'bg-rose-400',
    },
    emerald: {
      bg: 'from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-slate-950',
      ring: 'border-emerald-200/70 dark:border-emerald-900/60',
      icon: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
      text: 'text-emerald-900 dark:text-emerald-100',
      pulse: 'bg-emerald-400',
    },
  }
  const t = tones[tone]
  return (
    <article className={`rounded-2xl bg-gradient-to-br ${t.bg} border ${t.ring} px-4 py-3.5`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className={`mt-1.5 text-2xl font-semibold tabular-nums ${t.text}`}>{value}</p>
        </div>
        <span className={`relative shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl ${t.icon}`}>
          {pulse && value > 0 && (
            <span className={`absolute inset-0 rounded-xl ${t.pulse} opacity-30 animate-ping`} />
          )}
          <span className="relative">{icon}</span>
        </span>
      </div>
    </article>
  )
}

function EmptyFila({ isFiltered, onClear }: { isFiltered: boolean; onClear?: () => void }) {
  return (
    <div className="nymos-reveal opacity-0 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 px-8 py-14 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Inbox className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {isFiltered ? 'Nenhum job no filtro atual' : 'Fila vazia'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {isFiltered
          ? 'Ajuste o filtro acima para ver outros jobs.'
          : 'Quando você enviar eventos para transmissão, eles aparecem aqui em tempo real.'}
      </p>
      {isFiltered && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Limpar filtro
        </button>
      )}
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
