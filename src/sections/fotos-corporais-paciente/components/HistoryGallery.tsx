import { ChevronRight, Camera } from 'lucide-react'
import type {
  BodyType,
  PhotoAngle,
  PhotoPeriod,
  PhotoPeriodOption,
  PhotoSession,
} from '@/../product/sections/fotos-corporais-paciente/types'

interface HistoryGalleryProps {
  sessions: PhotoSession[]
  periodOptions: PhotoPeriodOption[]
  activePeriod: PhotoPeriod
  onPeriodChange?: (period: PhotoPeriod) => void
  onOpen?: (id: string) => void
}

const BODY_TYPE_SHORT: Record<BodyType, string> = {
  ectomorph: 'Ecto',
  mesomorph: 'Meso',
  endomorph: 'Endo',
  mixed: 'Misto',
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function presentAngles(s: PhotoSession): PhotoAngle[] {
  return (['front', 'side', 'back'] as PhotoAngle[]).filter(
    (a) => !!s.photos[a],
  )
}

export function HistoryGallery({
  sessions,
  periodOptions,
  activePeriod,
  onPeriodChange,
  onOpen,
}: HistoryGalleryProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Histórico
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {sessions.length} sessão{sessions.length !== 1 ? 'ões' : ''}
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          {periodOptions.map((opt) => {
            const isActive = opt.value === activePeriod
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPeriodChange?.(opt.value)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </header>

      <div className="p-5">
        {sessions.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Camera className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Nenhuma sessão ainda
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => {
              const angles = presentAngles(s)
              const bodyType = s.analysis?.bodyType
              const bodyFat = s.analysis?.estimatedBodyFat
              const gridCols =
                angles.length === 1
                  ? 'grid-cols-1'
                  : angles.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onOpen?.(s.id)}
                    className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40"
                  >
                    <div className={`grid gap-0.5 p-1 ${gridCols}`}>
                      {angles.map((angle) => (
                        <div
                          key={angle}
                          className="aspect-[3/4] overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800"
                        >
                          <img
                            src={s.photos[angle]!}
                            alt={angle}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          {formatDate(s.date)}
                          {s.isBaseline && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                              Base
                            </span>
                          )}
                          {s.isLatest && (
                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                              Última
                            </span>
                          )}
                        </p>
                        {(bodyType || bodyFat != null) && (
                          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            {bodyType && BODY_TYPE_SHORT[bodyType]}
                            {bodyType && bodyFat != null && ' · '}
                            {bodyFat != null && `${bodyFat}% gord.`}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
