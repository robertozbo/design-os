import { Ruler, Plus } from 'lucide-react'

interface EmptyStateProps {
  pacienteNome: string
  onCreate: () => void
}

export function EmptyState({ pacienteNome, onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-teal-50/40 via-white to-white px-6 py-16 text-center dark:border-slate-700 dark:from-teal-950/20 dark:via-slate-950 dark:to-slate-900/40">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
        <Ruler size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        Nenhuma avaliação registrada ainda
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-400">
        Comece registrando peso, altura e composição corporal de {pacienteNome} para acompanhar a
        evolução ao longo do tempo.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
      >
        <Plus size={14} />
        Registrar primeira avaliação
      </button>
    </div>
  )
}
