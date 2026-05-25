import type { RegistroReceita, TipoReceita } from '@/../product/sections/medication/types'

interface Props {
  registros: RegistroReceita[]
  onAbrirDetalhe?: (id: string) => void
  onVerTodas?: () => void
}

const TIPO_DOT: Record<TipoReceita, string> = {
  inicio: 'bg-emerald-500',
  ajuste: 'bg-amber-500',
  renovacao: 'bg-teal-500',
  descontinuacao: 'bg-rose-500',
}

const TIPO_LABEL: Record<TipoReceita, string> = {
  inicio: 'Início',
  ajuste: 'Ajuste',
  renovacao: 'Renovação',
  descontinuacao: 'Descontinuada',
}

export function PrescriptionHistory({
  registros,
  onAbrirDetalhe,
  onVerTodas,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      {onVerTodas && (
        <div className="mb-2 flex items-baseline justify-end">
          <button
            onClick={onVerTodas}
            className="text-[11.5px] text-teal-700 hover:underline dark:text-teal-300"
          >
            Ver todas →
          </button>
        </div>
      )}

      <ul className="-mx-1.5">
        {registros.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onAbrirDetalhe?.(r.id)}
              className="group flex w-full items-start gap-3 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-stone-50 dark:hover:bg-slate-800/40"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TIPO_DOT[r.tipo]}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-stone-500 dark:text-slate-500">
                    {r.data}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-slate-500">
                    {TIPO_LABEL[r.tipo]}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[13px] text-stone-800 dark:text-slate-200">
                  {r.titulo}
                </p>
                <p className="mt-0.5 text-[11.5px] text-stone-500 dark:text-slate-500">
                  {r.medicoNome}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
