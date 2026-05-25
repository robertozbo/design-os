import { useEffect, useState } from 'react'
import type {
  JobFila,
  PrioridadeJob,
  StatusJobFila,
} from '@/../product/sections/eventos-esocial/types'
import {
  Send,
  X,
  ArrowUp,
  FileSearch,
  Flame,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { TipoEventoBadge } from './TipoEventoBadge'
import { AmbienteBadge } from './AmbienteBadge'

interface Props {
  job: JobFila
  revealIndex: number
  onAbrirEvento?: () => void
  onReenviarAgora?: () => void
  onCancelar?: () => void
  onPriorizar?: () => void
  onVerLog?: () => void
}

const STATUS_TONE: Record<StatusJobFila, { dot: string; text: string; bg: string; ring: string; pulse?: boolean }> = {
  aguardando: {
    dot: 'bg-slate-400',
    text: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    ring: 'ring-slate-200 dark:ring-slate-700',
  },
  enviando: {
    dot: 'bg-amber-500',
    text: 'text-amber-800 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    ring: 'ring-amber-200 dark:ring-amber-900',
    pulse: true,
  },
  aguardando_retorno: {
    dot: 'bg-sky-500',
    text: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    ring: 'ring-sky-200 dark:ring-sky-900',
    pulse: true,
  },
  falhou_retry: {
    dot: 'bg-orange-500',
    text: 'text-orange-800 dark:text-orange-300',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    ring: 'ring-orange-200 dark:ring-orange-900',
  },
  exausto: {
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    ring: 'ring-rose-200 dark:ring-rose-900',
  },
  cancelado: {
    dot: 'bg-stone-400',
    text: 'text-stone-600 dark:text-stone-400',
    bg: 'bg-stone-100 dark:bg-stone-800/60',
    ring: 'ring-stone-200 dark:ring-stone-700',
  },
  concluido: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    ring: 'ring-emerald-200 dark:ring-emerald-900',
  },
}

const PRIORIDADE_TONE: Record<PrioridadeJob, { bg: string; text: string; label: string; icon: boolean }> = {
  normal: { bg: '', text: '', label: '', icon: false },
  alta: {
    bg: 'bg-amber-100 dark:bg-amber-950/50',
    text: 'text-amber-800 dark:text-amber-300',
    label: 'Alta',
    icon: false,
  },
  urgente: {
    bg: 'bg-rose-100 dark:bg-rose-950/50',
    text: 'text-rose-800 dark:text-rose-300',
    label: 'Urgente',
    icon: true,
  },
}

export function FilaJobRow({
  job,
  revealIndex,
  onAbrirEvento,
  onReenviarAgora,
  onCancelar,
  onPriorizar,
  onVerLog,
}: Props) {
  const statusTone = STATUS_TONE[job.statusFila]
  const prioridadeTone = PRIORIDADE_TONE[job.prioridade]
  const tentativasRatio = job.tentativaAtual / job.maxTentativas

  return (
    <article
      style={{ animationDelay: `${revealIndex * 40}ms` }}
      className={`
        nymos-reveal opacity-0 relative
        rounded-2xl border bg-white/80 dark:bg-slate-900/40
        transition-all duration-200
        ${
          job.prioridade === 'urgente'
            ? 'border-rose-300/60 dark:border-rose-900/60 shadow-[0_0_0_1px_rgba(225,29,72,0.08)]'
            : 'border-slate-200 dark:border-slate-800'
        }
        hover:border-slate-300 dark:hover:border-slate-700
        hover:shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)]
        dark:hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.55)]
      `}
    >
      {job.prioridade === 'urgente' && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r bg-gradient-to-b from-rose-500 to-rose-600"
        />
      )}

      <div className="grid grid-cols-12 gap-3 items-center px-4 py-3 pl-5">
        {/* Status pill */}
        <div className="col-span-12 sm:col-span-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${statusTone.bg} ${statusTone.text} ring-1 ${statusTone.ring}`}
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              {statusTone.pulse && (
                <span
                  className={`absolute inset-0 rounded-full ${statusTone.dot} opacity-70 animate-ping`}
                  aria-hidden="true"
                />
              )}
              <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${statusTone.dot}`} />
            </span>
            {job.statusFilaLabel}
          </span>
          {job.prioridade !== 'normal' && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${prioridadeTone.bg} ${prioridadeTone.text}`}
            >
              {prioridadeTone.icon && <Flame className="w-2.5 h-2.5" strokeWidth={2.25} />}
              {prioridadeTone.label}
            </span>
          )}
        </div>

        {/* Evento + trabalhador */}
        <button
          type="button"
          onClick={onAbrirEvento}
          className="col-span-12 sm:col-span-4 min-w-0 text-left group/evento"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <TipoEventoBadge tipo={job.tipo} compact />
            <span
              className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate group-hover/evento:text-teal-700 dark:group-hover/evento:text-teal-300 transition"
              title={job.eventoId}
            >
              {job.eventoId}
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400 dark:text-slate-600 group-hover/evento:text-teal-700 dark:group-hover/evento:text-teal-300 opacity-0 group-hover/evento:opacity-100 transition" strokeWidth={2} />
          </div>
          <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">
            {job.trabalhador.nome}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {job.trabalhador.setor} · {job.trabalhador.estabelecimento}
          </p>
        </button>

        {/* Tentativas + countdown */}
        <div className="col-span-6 sm:col-span-3 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Tentativas
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[12px] tabular-nums font-medium text-slate-700 dark:text-slate-300">
              {job.tentativaAtual}/{job.maxTentativas}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${
                  job.statusFila === 'exausto'
                    ? 'bg-rose-500 dark:bg-rose-400'
                    : tentativasRatio >= 0.6
                      ? 'bg-amber-500 dark:bg-amber-400'
                      : 'bg-teal-500 dark:bg-teal-400'
                } transition-all`}
                style={{ width: `${Math.max(8, tentativasRatio * 100)}%` }}
              />
            </div>
          </div>
          {job.proximoRetryEm && (
            <p className="mt-1 text-[10px] text-orange-700 dark:text-orange-300 font-mono inline-flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" strokeWidth={2} />
              Retry em <Countdown isoTimestamp={job.proximoRetryEm} />
            </p>
          )}
          {!job.proximoRetryEm && job.statusFila !== 'exausto' && (
            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
              na fila há <RelativeAge iso={job.entrouNaFilaEm} />
            </p>
          )}
        </div>

        {/* Ambiente + ações */}
        <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-1.5">
          <AmbienteBadge ambiente={job.ambiente} />
          <div className="flex items-center gap-0.5">
            {job.podePriorizar && (
              <IconBtn
                icon={<ArrowUp className="w-3.5 h-3.5" strokeWidth={2} />}
                label="Priorizar"
                onClick={onPriorizar}
                tone="amber"
              />
            )}
            {job.podeReenviar && (
              <IconBtn
                icon={<Send className="w-3.5 h-3.5" strokeWidth={2} />}
                label="Reenviar agora"
                onClick={onReenviarAgora}
                tone="teal"
              />
            )}
            <IconBtn
              icon={<FileSearch className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Ver log"
              onClick={onVerLog}
            />
            {job.podeCancelar && (
              <IconBtn
                icon={<X className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="Cancelar"
                onClick={onCancelar}
                tone="rose"
              />
            )}
          </div>
        </div>
      </div>

      {/* Erro detail strip */}
      {job.ultimoErroDescricao && (
        <div
          className={`px-5 pb-3 ${
            job.statusFila === 'exausto'
              ? 'text-rose-800 dark:text-rose-200'
              : 'text-orange-800 dark:text-orange-200'
          }`}
        >
          <div
            className={`rounded-lg border px-3 py-2 inline-flex items-start gap-2 ${
              job.statusFila === 'exausto'
                ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200/70 dark:border-rose-900/50'
                : 'bg-orange-50/60 dark:bg-orange-950/30 border-orange-200/70 dark:border-orange-900/50'
            }`}
          >
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={2.25} />
            <p className="text-[11px] leading-snug">
              {job.ultimoErroCodigo && (
                <span className="font-mono font-semibold mr-1">[{job.ultimoErroCodigo}]</span>
              )}
              {job.ultimoErroDescricao}
            </p>
          </div>
        </div>
      )}

      {/* Prazo legal indicator */}
      {job.prazoFatoGerador && job.prioridade === 'urgente' && (
        <div className="px-5 pb-3">
          <p className="text-[10px] text-rose-700 dark:text-rose-300 font-medium inline-flex items-center gap-1">
            <Flame className="w-2.5 h-2.5" strokeWidth={2.25} />
            CAT 24h · fato gerador <RelativeAge iso={job.prazoFatoGerador} /> atrás
          </p>
        </div>
      )}
    </article>
  )
}

function IconBtn({
  icon,
  label,
  onClick,
  tone = 'default',
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  tone?: 'default' | 'teal' | 'amber' | 'rose'
}) {
  const toneClasses =
    tone === 'teal'
      ? 'text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40'
      : tone === 'amber'
        ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
        : tone === 'rose'
          ? 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition ${toneClasses}`}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  )
}

function Countdown({ isoTimestamp }: { isoTimestamp: string }) {
  const [remaining, setRemaining] = useState(() => secondsUntil(isoTimestamp))
  useEffect(() => {
    const t = window.setInterval(() => setRemaining(secondsUntil(isoTimestamp)), 1000)
    return () => window.clearInterval(t)
  }, [isoTimestamp])
  if (remaining <= 0) return <span>agora</span>
  if (remaining < 60) return <span>{remaining}s</span>
  return <span>{Math.floor(remaining / 60)}min {remaining % 60}s</span>
}

function RelativeAge({ iso }: { iso: string }) {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (diffSec < 60) return <span>{diffSec}s</span>
  if (diffSec < 3600) return <span>{Math.floor(diffSec / 60)}min</span>
  return <span>+1h</span>
}

function secondsUntil(iso: string): number {
  try {
    return Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 1000))
  } catch {
    return 0
  }
}
