import { Stethoscope, Video, MapPin, ChevronRight, Clock } from 'lucide-react'
import type { ProximaConsulta } from '@/../product-clinico/sections/inicio/types'
import { formatRelativoMin } from './helpers'

interface Props {
  consulta: ProximaConsulta | null
  onIniciar?: () => void
  onVerPaciente?: () => void
}

export function ProximaConsultaCard({ consulta, onIniciar, onVerPaciente }: Props) {
  if (!consulta) {
    return (
      <article className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <Stethoscope className="size-5" />
        </div>
        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Sem consultas restantes hoje
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Aproveite pra revisar pendências e exames novos.
        </p>
      </article>
    )
  }

  const ehTele = consulta.modalidade === 'tele'
  return (
    <article
      className="
        relative overflow-hidden rounded-2xl border border-teal-200/80
        bg-gradient-to-br from-teal-50 via-emerald-50/40 to-white p-5 shadow-sm
        dark:border-teal-900/40 dark:from-teal-950/40 dark:via-emerald-950/20 dark:to-slate-900
      "
    >
      <div
        className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-teal-300/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-base font-medium text-white shadow-md">
            {consulta.iniciais}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              Próxima consulta
            </p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {consulta.pacienteNome}
            </h2>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                <Clock className="size-3" />
                {consulta.horaLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 capitalize">
                {ehTele ? <Video className="size-3" /> : <MapPin className="size-3" />}
                {ehTele ? 'Teleconsulta' : 'Presencial'}
              </span>
              {consulta.condicoesCronicas.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{consulta.condicoesCronicas.join(' · ')}</span>
                </>
              )}
            </p>
            {consulta.observacao && (
              <p className="mt-1 text-xs italic text-slate-600 dark:text-slate-400">
                {consulta.observacao}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tabular-nums text-teal-700 dark:text-teal-300">
            {formatRelativoMin(consulta.minutosAteInicio)}
          </span>
          {consulta.podeIniciar ? (
            <button
              onClick={onIniciar}
              className="
                inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm
                ring-2 ring-teal-500/40 transition-all hover:bg-teal-500
                focus:outline-none focus:ring-teal-500
                dark:focus:ring-offset-slate-950
              "
            >
              <Stethoscope className="size-4" />
              Iniciar consulta
            </button>
          ) : (
            <button
              onClick={onVerPaciente}
              className="
                inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-teal-800 backdrop-blur-sm
                transition-colors hover:bg-white
                dark:border-teal-900/60 dark:bg-slate-900/60 dark:text-teal-300 dark:hover:bg-slate-900
              "
            >
              Ver paciente
              <ChevronRight className="size-3" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
