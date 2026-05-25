import { Video, MapPin, ArrowLeft } from 'lucide-react'
import type {
  Consulta,
  Paciente,
  GravacaoStatus,
} from '@/../product-clinico/sections/consulta/types'
import { RecordingIndicator } from './RecordingIndicator'

interface Props {
  consulta: Consulta
  paciente: Paciente
  onIniciarGravacao?: () => void
  onPausarGravacao?: () => void
  onRetomarGravacao?: () => void
  onEncerrarGravacao?: () => void
  onEntrarSalaTele?: () => void
  onVoltar?: () => void
}

export function ConsultaHeader({
  consulta,
  paciente,
  onIniciarGravacao,
  onPausarGravacao,
  onRetomarGravacao,
  onEncerrarGravacao,
  onEntrarSalaTele,
  onVoltar,
}: Props) {
  const tele = consulta.modalidade === 'tele'

  return (
    <header
      className="
        sticky top-0 z-10
        border-b border-slate-200/80 bg-white/85 backdrop-blur-md
        dark:border-slate-800/80 dark:bg-slate-950/80
      "
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-10">
        {/* Back */}
        <button
          onClick={onVoltar}
          className="
            -ml-1 inline-flex items-center justify-center rounded-md p-1.5
            text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900
            focus:outline-none focus:ring-2 focus:ring-slate-300
            dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
            dark:focus:ring-slate-600
          "
          aria-label="Voltar pra agenda"
        >
          <ArrowLeft className="size-4" />
        </button>

        {/* Patient identity */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-medium text-white sm:flex">
            {paciente.nome
              .split(' ')
              .filter((_, i, arr) => i === 0 || i === arr.length - 1)
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {paciente.nome}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{paciente.idade} anos</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">
                {paciente.condicoesCronicas.slice(0, 2).join(' · ')}
                {paciente.condicoesCronicas.length > 2
                  ? ` +${paciente.condicoesCronicas.length - 2}`
                  : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Modalidade */}
        <div className="hidden md:block">
          {tele ? (
            <button
              onClick={onEntrarSalaTele}
              className="
                inline-flex items-center gap-1.5 rounded-md
                border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-800
                transition-colors hover:bg-teal-100
                dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950/60
              "
            >
              <Video className="size-3.5" />
              Teleconsulta
            </button>
          ) : (
            <span
              className="
                inline-flex items-center gap-1.5 rounded-md
                border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
              "
            >
              <MapPin className="size-3.5" />
              Presencial
            </span>
          )}
        </div>

        {/* Recording */}
        <RecordingIndicator
          status={consulta.gravacaoStatus as GravacaoStatus}
          tempoDecorridoSeg={consulta.tempoDecorridoSeg}
          onIniciar={onIniciarGravacao}
          onPausar={onPausarGravacao}
          onRetomar={onRetomarGravacao}
          onEncerrar={onEncerrarGravacao}
        />
      </div>
    </header>
  )
}
