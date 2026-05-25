import { Sparkles, Video, MapPin, ChevronRight } from 'lucide-react'
import type { Atendimento } from '@/../product-clinico/sections/pacientes/types'
import { formatDataBR } from './helpers'

interface Props {
  atendimentos: Atendimento[]
  onAbrirAtendimento?: (id: string) => void
}

export function AtendimentosTab({ atendimentos, onAbrirAtendimento }: Props) {
  if (atendimentos.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-sm italic text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Nenhum atendimento registrado ainda.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Histórico de atendimentos
      </h2>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        {atendimentos.length} consultas registradas
      </p>

      <ol className="mt-6 space-y-0">
        {atendimentos.map((a, i) => (
          <li key={a.id} className="relative">
            {/* Connector line */}
            {i < atendimentos.length - 1 && (
              <span
                className="absolute left-3 top-6 -ml-px h-full w-px bg-slate-200 dark:bg-slate-800"
                aria-hidden="true"
              />
            )}
            <div className="relative flex gap-4 pb-6">
              {/* Dot */}
              <span
                className={`
                  relative z-[1] mt-1.5 flex size-6 shrink-0 items-center justify-center rounded-full
                  ${
                    i === 0
                      ? 'bg-teal-100 ring-2 ring-teal-500 ring-offset-2 ring-offset-white dark:bg-teal-950 dark:ring-offset-slate-900'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }
                `}
              >
                <span
                  className={`size-2 rounded-full ${
                    i === 0 ? 'bg-teal-600' : 'bg-slate-400 dark:bg-slate-500'
                  }`}
                />
              </span>

              {/* Card */}
              <button
                onClick={() => onAbrirAtendimento?.(a.id)}
                className="
                  group/atd flex-1 rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 text-left
                  transition-all hover:border-teal-300 hover:bg-white hover:shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-teal-500/40
                  dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-teal-700 dark:hover:bg-slate-900
                "
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatDataBR(a.data)}
                    </span>
                    <span
                      className={`
                        inline-flex items-center gap-1 rounded-md border px-1.5 py-0 text-[10px] font-medium
                        ${
                          a.modalidade === 'tele'
                            ? 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300'
                            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                        }
                      `}
                    >
                      {a.modalidade === 'tele' ? (
                        <>
                          <Video className="size-2.5" />
                          Teleconsulta
                        </>
                      ) : (
                        <>
                          <MapPin className="size-2.5" />
                          Presencial
                        </>
                      )}
                    </span>
                    {a.geradoPorIA && (
                      <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-1.5 py-0 text-[10px] font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <Sparkles className="size-2.5" />
                        IA
                      </span>
                    )}
                  </div>
                  <ChevronRight className="size-4 text-slate-300 transition-colors group-hover/atd:text-teal-500 dark:text-slate-600" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {a.planoResumo}
                </p>
                <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                  Atendido por {a.medico}
                </p>
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
