import { Calendar, CameraOff } from 'lucide-react'
import type { SnapshotFotos } from '@/../product/sections/minha-sa-de-paciente/types'

interface FotosTimelineProps {
  /** Array em ordem cronológica ascendente (mais antigo → mais novo). */
  series: SnapshotFotos[]
  onOpen?: (date: string) => void
}

function formatDateBR(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function pickThumbnail(fotos: SnapshotFotos): string | undefined {
  return (
    fotos.frontal ?? fotos.perfilEsquerdo ?? fotos.perfilDireito ?? fotos.costas
  )
}

export function FotosTimeline({ series, onOpen }: FotosTimelineProps) {
  if (series.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <Calendar
          className="mx-auto h-6 w-6 text-slate-300 dark:text-slate-600"
          aria-hidden
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Sem fotos registradas ainda
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Linha do tempo
        </h3>
        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
          {series.length} {series.length === 1 ? 'registro' : 'registros'}
        </span>
      </header>

      <div
        role="list"
        aria-label="Fotos ao longo do tempo"
        className="flex gap-3 overflow-x-auto pb-2"
      >
        {series.map((fotos) => {
          const thumb = pickThumbnail(fotos)
          return (
            <button
              key={fotos.date}
              type="button"
              role="listitem"
              onClick={() => onOpen?.(fotos.date)}
              className="group flex w-24 shrink-0 flex-col items-center gap-1.5"
            >
              <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition-colors group-hover:border-teal-500 dark:border-slate-800 dark:bg-slate-800 dark:group-hover:border-teal-400">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={`Foto ${formatDateBR(fotos.date)}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <CameraOff
                      className="h-4 w-4 text-slate-300 dark:text-slate-600"
                      aria-hidden
                    />
                  </div>
                )}
              </div>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                {formatDateBR(fotos.date)}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
