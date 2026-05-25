import { CalendarDays, AlertTriangle, ChevronRight } from 'lucide-react'
import type { Plano } from '@/../product-personal/sections/treinos/types'
import { OBJETIVO_STYLE, formatProximaSessao } from './objetivoStyle'

interface OverviewTabProps {
  plano: Plano
}

export function OverviewTab({ plano }: OverviewTabProps) {
  const objStyle = OBJETIVO_STYLE[plano.objetivo]
  const proxima = plano.proximaSessao
  const treino = proxima
    ? plano.treinos.find((t) => t.letra === proxima.treinoLetra)
    : null
  const historico = plano.historicoSemanas ?? []
  const alertas = plano.alertas ?? []

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      {/* Próxima sessão */}
      <div className="lg:col-span-3">
        <SectionLabel>Próxima sessão</SectionLabel>
        {proxima ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className={`h-1 ${objStyle.bar}`} />
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
                  <CalendarDays size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Treino {proxima.treinoLetra} ·{' '}
                    {formatProximaSessao(proxima.data)}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
                    {proxima.treinoNome}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(proxima.data).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                    })}
                  </p>
                </div>
              </div>

              {treino && treino.exercicios.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {treino.exercicios.map((ex) => (
                    <div
                      key={ex.exercicioId}
                      className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60 ring-1 ring-inset ring-slate-100 dark:ring-slate-800"
                    >
                      {ex.thumbUrl ? (
                        <img
                          src={ex.thumbUrl}
                          alt=""
                          className="h-9 w-9 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                          {ex.exercicioNome}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                          {ex.series.length}x · descanso {ex.descansoSegundos}s
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sem próxima sessão prevista
            </p>
          </div>
        )}

        {/* Alertas */}
        {alertas.length > 0 && (
          <>
            <SectionLabel className="mt-6">Alertas</SectionLabel>
            <div className="mt-3 space-y-2">
              {alertas.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/50 dark:bg-amber-900/10"
                >
                  <AlertTriangle
                    size={14}
                    className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                  />
                  <p className="text-[13px] leading-snug text-amber-900 dark:text-amber-200">
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Adesão semanal */}
      <div className="lg:col-span-2">
        <SectionLabel>Adesão · 8 semanas</SectionLabel>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <WeeklyBarChart historico={historico} />
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="font-mono uppercase tracking-wider">Meta 80%</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Ver histórico completo
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 ${className}`}
    >
      {children}
    </h2>
  )
}

function WeeklyBarChart({
  historico,
}: {
  historico: { semana: string; percentual: number; feitas: number; totais: number }[]
}) {
  if (historico.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
        Sem histórico ainda
      </p>
    )
  }

  const meta = 80

  return (
    <div className="relative h-36">
      {/* meta line */}
      <div
        className="absolute inset-x-0 border-t border-dashed border-emerald-300 dark:border-emerald-800"
        style={{ top: `${100 - meta}%` }}
      />
      <div
        className="absolute -translate-y-3 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
        style={{ top: `${100 - meta}%` }}
      >
        {meta}%
      </div>

      {/* bars */}
      <div className="flex h-full items-end gap-1.5">
        {historico.map((s) => {
          const aboveMeta = s.percentual >= meta
          return (
            <div key={s.semana} className="flex h-full flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full flex-1 items-end">
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    aboveMeta
                      ? 'bg-emerald-500 dark:bg-emerald-400'
                      : 'bg-amber-400 dark:bg-amber-500'
                  }`}
                  style={{ height: `${s.percentual}%` }}
                  title={`${s.semana}: ${s.feitas}/${s.totais} (${s.percentual}%)`}
                />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {s.semana}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
