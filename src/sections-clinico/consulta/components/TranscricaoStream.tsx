import { Stethoscope, User } from 'lucide-react'
import type { TranscricaoTrecho } from '@/../product-clinico/sections/consulta/types'

interface Props {
  trechos: TranscricaoTrecho[]
}

export function TranscricaoStream({ trechos }: Props) {
  if (trechos.length === 0) {
    return (
      <p className="text-sm italic text-slate-400 dark:text-slate-500">
        A transcrição aparecerá aqui em tempo real assim que a gravação iniciar.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {trechos.map((t, i) => (
        <div key={i} className="flex items-start gap-3 text-sm">
          <span
            className={`
              mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full
              text-[10px] font-medium
              ${
                t.fala === 'medico'
                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }
            `}
          >
            {t.fala === 'medico' ? (
              <Stethoscope className="size-3" />
            ) : (
              <User className="size-3" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {t.fala === 'medico' ? 'Você' : 'Paciente'}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                {t.ts}
              </span>
            </div>
            <p className="mt-0.5 leading-relaxed text-slate-700 dark:text-slate-300">
              {t.texto}
            </p>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1 text-xs text-slate-400 dark:text-slate-500">
        <span className="size-1.5 animate-pulse rounded-full bg-rose-500" />
        Capturando…
      </div>
    </div>
  )
}
