import { Pencil, Timer, Repeat } from 'lucide-react'
import type { Plano, Treino, ExercicioPrescrito } from '@/../product-personal/sections/treinos/types'

interface TreinosTabProps {
  plano: Plano
  onEdit?: () => void
}

export function TreinosTab({ plano, onEdit }: TreinosTabProps) {
  if (plano.treinos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sem treinos definidos
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Prescrição · {plano.treinos.length} treino
          {plano.treinos.length === 1 ? '' : 's'}
        </h2>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Pencil size={12} />
          Editar prescrição
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {plano.treinos.map((treino) => (
          <TreinoCard key={treino.id} treino={treino} />
        ))}
      </div>
    </div>
  )
}

function TreinoCard({ treino }: { treino: Treino }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/60">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Treino {treino.letra}
          </p>
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-50">
            {treino.nome}
          </h3>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
          {treino.exercicios.length} ex
        </span>
      </header>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {treino.exercicios.length === 0 ? (
          <p className="px-5 py-4 text-sm text-slate-400 dark:text-slate-500">
            Sem exercícios
          </p>
        ) : (
          treino.exercicios.map((ex) => (
            <ExercicioRow key={ex.exercicioId} ex={ex} />
          ))
        )}
      </div>
    </article>
  )
}

function ExercicioRow({ ex }: { ex: ExercicioPrescrito }) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-start gap-3">
        {ex.thumbUrl ? (
          <img
            src={ex.thumbUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
            {ex.exercicioNome}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {ex.grupoMuscular} · descanso {ex.descansoSegundos}s
          </p>
        </div>
      </div>

      {/* Series mini-table */}
      <div className="mt-3 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-900/50 ring-1 ring-inset ring-slate-100 dark:ring-slate-800">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="px-2.5 py-1.5 text-left">#</th>
              <th className="px-2.5 py-1.5 text-left">Reps/Tempo</th>
              <th className="px-2.5 py-1.5 text-left">Carga</th>
              <th className="px-2.5 py-1.5 text-left">RPE</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {ex.series.map((s) => (
              <tr
                key={s.numero}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-2.5 py-1.5 text-slate-500 dark:text-slate-400">
                  {s.numero}
                </td>
                <td className="px-2.5 py-1.5 text-slate-900 dark:text-slate-100">
                  {s.modo === 'tempo' ? (
                    <span className="inline-flex items-center gap-1">
                      <Timer size={10} />
                      {s.tempoSegundos}s
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Repeat size={10} />
                      {s.reps}
                    </span>
                  )}
                </td>
                <td className="px-2.5 py-1.5 text-slate-900 dark:text-slate-100">
                  {s.cargaKg != null ? `${s.cargaKg}kg` : '—'}
                </td>
                <td className="px-2.5 py-1.5 text-slate-700 dark:text-slate-300">
                  {s.rpeAlvo ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ex.observacoes && (
        <p className="mt-2 text-[11px] italic leading-snug text-slate-500 dark:text-slate-400">
          {ex.observacoes}
        </p>
      )}
    </div>
  )
}
