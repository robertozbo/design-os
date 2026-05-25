import { HeartPulse, Plus, Smartphone } from 'lucide-react'

interface EmptyStateProps {
  onAddFirstMeasurement?: () => void
  onViewDevices?: () => void
}

export function EmptyState({
  onAddFirstMeasurement,
  onViewDevices,
}: EmptyStateProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50/30 via-white to-emerald-50/20 shadow-sm dark:border-slate-800 dark:from-teal-500/5 dark:via-slate-900 dark:to-emerald-500/5">
      <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-teal-400/20 via-emerald-300/10 to-transparent blur-2xl dark:from-teal-500/20"
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-500 text-white shadow-lg shadow-teal-500/30">
            <HeartPulse className="h-10 w-10" />
          </div>
        </div>
        <div className="max-w-md">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Comece a acompanhar sua saúde
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Conecte um dispositivo ou registre sua primeira medição pra
            desbloquear sua evolução nas 7 dimensões de saúde.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onAddFirstMeasurement}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/30 transition hover:bg-teal-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar primeira medição
          </button>
          <button
            type="button"
            onClick={onViewDevices}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
          >
            <Smartphone className="h-3.5 w-3.5" />
            Ver dispositivos
          </button>
        </div>
      </div>
    </section>
  )
}
