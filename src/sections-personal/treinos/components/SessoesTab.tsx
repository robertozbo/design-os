import { useState } from 'react'
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  XCircle,
  Clock,
  ChevronDown,
} from 'lucide-react'
import type {
  SessaoExecutada,
  SessaoStatus,
  Plano,
  ExercicioPrescrito,
} from '@/../product-personal/sections/treinos/types'

interface SessoesTabProps {
  plano: Plano
}

const STATUS_LABEL: Record<SessaoStatus, string> = {
  completa: 'Completa',
  parcial: 'Parcial',
  pulada: 'Pulada',
  agendada: 'Agendada',
}

const STATUS_TONE: Record<SessaoStatus, { icon: React.ElementType; color: string; bg: string }> = {
  completa: {
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  parcial: {
    icon: Circle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  pulada: {
    icon: XCircle,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-900/40',
  },
  agendada: {
    icon: CircleDashed,
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
  },
}

export function SessoesTab({ plano }: SessoesTabProps) {
  const sessoes = plano.sessoesExecutadas ?? []

  if (sessoes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Nenhuma sessão executada ainda
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* timeline line */}
      <div className="absolute left-[18px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-3">
        {sessoes.map((sessao) => (
          <SessaoRow key={sessao.id} sessao={sessao} plano={plano} />
        ))}
      </div>
    </div>
  )
}

function SessaoRow({ sessao, plano }: { sessao: SessaoExecutada; plano: Plano }) {
  const [open, setOpen] = useState(false)
  const tone = STATUS_TONE[sessao.status]
  const Icon = tone.icon
  const treino = plano.treinos.find((t) => t.letra === sessao.treinoLetra)

  return (
    <div className="relative flex items-start gap-4">
      <span
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone.bg} ${tone.color} ring-4 ring-white dark:ring-slate-950`}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-4 p-4 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Treino {sessao.treinoLetra} · {sessao.treinoNome}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone.bg} ${tone.color}`}
              >
                {STATUS_LABEL[sessao.status]}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {new Date(sessao.data).toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
              })}
              {sessao.duracaoMinutos != null && (
                <>
                  {' · '}
                  <Clock size={11} className="mb-0.5 inline-block" />{' '}
                  {sessao.duracaoMinutos}min
                </>
              )}
              {sessao.rpeMedio != null && <> · RPE {sessao.rpeMedio.toFixed(1)}</>}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition-transform ${
              open ? 'rotate-180' : ''
            } dark:text-slate-500`}
          />
        </button>

        {open && (
          <div className="space-y-4 border-t border-slate-100 p-4 dark:border-slate-800">
            {sessao.comentarioAluno && (
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60 ring-1 ring-inset ring-slate-100 dark:ring-slate-800">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Comentário do aluno
                </p>
                <p className="mt-1 text-[13px] italic text-slate-700 dark:text-slate-300">
                  “{sessao.comentarioAluno}”
                </p>
              </div>
            )}

            {sessao.exercicios.length > 0 && treino && (
              <div className="space-y-3">
                {sessao.exercicios.map((exExec) => {
                  const exPrescrito = treino.exercicios.find(
                    (e) => e.exercicioId === exExec.exercicioId,
                  )
                  return (
                    <div
                      key={exExec.exercicioId}
                      className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40"
                    >
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                        {exExec.exercicioNome}
                      </p>
                      <table className="mt-2 w-full text-[12px]">
                        <thead>
                          <tr className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            <th className="pb-1 pr-2 text-left">Série</th>
                            <th className="pb-1 px-2 text-left">Prescrito</th>
                            <th className="pb-1 px-2 text-left">Real</th>
                            <th className="pb-1 pl-2 text-left">RPE</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono tabular-nums">
                          {exExec.series.map((sExec) => {
                            const sPresc = exPrescrito?.series.find(
                              (sp) => sp.numero === sExec.numero,
                            )
                            const cargaDelta =
                              sExec.cargaRealKg != null && sPresc?.cargaKg != null
                                ? sExec.cargaRealKg - sPresc.cargaKg
                                : null
                            return (
                              <tr
                                key={sExec.numero}
                                className="border-t border-slate-100 dark:border-slate-800"
                              >
                                <td className="py-1.5 pr-2 text-slate-500 dark:text-slate-400">
                                  {sExec.numero}
                                </td>
                                <td className="py-1.5 px-2 text-slate-500 dark:text-slate-400">
                                  {formatPrescrito(sPresc)}
                                </td>
                                <td className="py-1.5 px-2 text-slate-900 dark:text-slate-100">
                                  {formatReal(sExec)}
                                  {cargaDelta != null && cargaDelta !== 0 && (
                                    <span
                                      className={`ml-1.5 text-[10px] font-semibold ${
                                        cargaDelta > 0
                                          ? 'text-emerald-600 dark:text-emerald-400'
                                          : 'text-rose-600 dark:text-rose-400'
                                      }`}
                                    >
                                      {cargaDelta > 0 ? '+' : ''}
                                      {cargaDelta}kg
                                    </span>
                                  )}
                                </td>
                                <td className="py-1.5 pl-2 text-slate-700 dark:text-slate-300">
                                  {sExec.rpePercebido ?? '—'}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </div>
            )}

            {sessao.status === 'pulada' && (
              <p className="text-center text-[12px] text-slate-500 dark:text-slate-400">
                Sessão não executada
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function formatPrescrito(s?: ExercicioPrescrito['series'][number]): string {
  if (!s) return '—'
  if (s.modo === 'tempo') return `${s.tempoSegundos}s`
  return `${s.reps} reps × ${s.cargaKg}kg`
}

function formatReal(s: { repsReal?: number; tempoRealSegundos?: number; cargaRealKg: number | null }): string {
  if (s.tempoRealSegundos != null) return `${s.tempoRealSegundos}s`
  if (s.repsReal != null) return `${s.repsReal} × ${s.cargaRealKg ?? 0}kg`
  return '—'
}
