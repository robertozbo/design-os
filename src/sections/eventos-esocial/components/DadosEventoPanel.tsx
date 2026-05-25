import { useState } from 'react'
import type {
  DadoEspecifico,
  EventoEsocial,
} from '@/../product/sections/eventos-esocial/types'
import { FileEdit, Pencil, X, Save, Lock } from 'lucide-react'

interface Props {
  evento: EventoEsocial
  onEditar?: () => void
}

const HIGHLIGHT_CLASSES: Record<NonNullable<DadoEspecifico['highlight']>, string> = {
  info: 'text-sky-700 dark:text-sky-300',
  warning: 'text-amber-800 dark:text-amber-300 font-medium',
  danger: 'text-rose-700 dark:text-rose-300 font-medium',
  success: 'text-emerald-700 dark:text-emerald-300 font-medium',
}

export function DadosEventoPanel({ evento, onEditar }: Props) {
  const [editing, setEditing] = useState(false)
  const podeEditar = evento.status === 'rascunho' || evento.status === 'rejeitado'

  const grupos = evento.dadosEspecificos ?? []

  const handleEditClick = () => {
    if (!podeEditar) return
    setEditing((v) => !v)
    if (!editing) onEditar?.()
  }

  return (
    <section
      style={{ animationDelay: '240ms' }}
      className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <FileEdit className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Dados do evento
          </h2>
          {!podeEditar && (
            <span
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400"
              title={`Edição bloqueada — status ${evento.statusLabel}`}
            >
              <Lock className="w-2.5 h-2.5" strokeWidth={2} />
              somente leitura
            </span>
          )}
        </div>
        {podeEditar && (
          <button
            type="button"
            onClick={handleEditClick}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition ${
              editing
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                : 'text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30'
            }`}
          >
            {editing ? (
              <>
                <X className="w-3 h-3" strokeWidth={2.25} />
                Cancelar
              </>
            ) : (
              <>
                <Pencil className="w-3 h-3" strokeWidth={2.25} />
                Editar
              </>
            )}
          </button>
        )}
      </header>

      <div className="px-5 py-4 space-y-5">
        {grupos.length === 0 ? (
          <p className="text-[12px] text-slate-500 dark:text-slate-400 py-6 text-center">
            Sem dados específicos cadastrados ainda. Use "Editar" para preencher o formulário do{' '}
            {evento.tipo}.
          </p>
        ) : (
          grupos.map((grupo, gIdx) => (
            <div key={gIdx}>
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                {grupo.titulo}
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {grupo.campos.map((campo, cIdx) => (
                  <div
                    key={cIdx}
                    className={`flex flex-col gap-0.5 ${
                      editing
                        ? 'p-2.5 rounded-lg ring-1 ring-slate-200/70 dark:ring-slate-800 bg-white dark:bg-slate-900/60 hover:ring-teal-300 dark:hover:ring-teal-800 transition'
                        : ''
                    }`}
                  >
                    <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                      {campo.label}
                    </dt>
                    {editing ? (
                      <input
                        type="text"
                        defaultValue={campo.valor}
                        className={`bg-transparent border-0 border-b border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:outline-none px-0 py-1 text-sm text-slate-900 dark:text-slate-100 ${
                          campo.mono ? 'font-mono tabular-nums' : ''
                        }`}
                      />
                    ) : (
                      <dd
                        className={`text-sm ${
                          campo.highlight
                            ? HIGHLIGHT_CLASSES[campo.highlight]
                            : 'text-slate-800 dark:text-slate-100'
                        } ${campo.mono ? 'font-mono tabular-nums' : ''}`}
                      >
                        {campo.valor}
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </div>
          ))
        )}

        {editing && (
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/70 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white transition"
            >
              <Save className="w-3 h-3" strokeWidth={2.25} />
              Salvar e revalidar XSD
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
