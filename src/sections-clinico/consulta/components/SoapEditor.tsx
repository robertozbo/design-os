import { useState } from 'react'
import { Sparkles, Pencil, Check } from 'lucide-react'
import type { SoapBloco, SoapTipo } from '@/../product-clinico/sections/consulta/types'
import { SOAP_DESCRICAO } from './helpers'

interface Props {
  blocos: SoapBloco[]
  modeloIA: string
  onEditarBloco?: (tipo: SoapTipo, novoTexto: string) => void
}

export function SoapEditor({ blocos, modeloIA, onEditarBloco }: Props) {
  return (
    <div className="space-y-3">
      {blocos.map((bloco) => (
        <SoapBlock
          key={bloco.tipo}
          bloco={bloco}
          modeloIA={modeloIA}
          onEditar={(novoTexto) => onEditarBloco?.(bloco.tipo, novoTexto)}
        />
      ))}
    </div>
  )
}

function SoapBlock({
  bloco,
  modeloIA,
  onEditar,
}: {
  bloco: SoapBloco
  modeloIA: string
  onEditar?: (novoTexto: string) => void
}) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(bloco.texto)

  const tipoColors = {
    S: 'border-teal-200 bg-teal-50/40 dark:border-teal-900/40 dark:bg-teal-950/20',
    O: 'border-sky-200 bg-sky-50/40 dark:border-sky-900/40 dark:bg-sky-950/20',
    A: 'border-violet-200 bg-violet-50/40 dark:border-violet-900/40 dark:bg-violet-950/20',
    P: 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20',
  }
  const letterColors = {
    S: 'bg-teal-600 text-white',
    O: 'bg-sky-600 text-white',
    A: 'bg-violet-600 text-white',
    P: 'bg-emerald-600 text-white',
  }

  return (
    <article
      className={`
        group relative rounded-xl border ${tipoColors[bloco.tipo]}
        transition-shadow
      `}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={`
            flex size-8 shrink-0 items-center justify-center rounded-lg
            font-semibold tracking-tight ${letterColors[bloco.tipo]}
          `}
          aria-hidden="true"
        >
          {bloco.tipo}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {bloco.rotulo}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {SOAP_DESCRICAO[bloco.tipo]}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {bloco.geradoPorIA && !bloco.editadoPeloMedico && (
                <span
                  title={`Gerado por ${modeloIA}`}
                  className="
                    inline-flex items-center gap-1 rounded-full border border-emerald-200/70 bg-emerald-50
                    px-2 py-0.5 text-[10px] font-medium text-emerald-800
                    dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300
                  "
                >
                  <Sparkles className="size-3" />
                  IA
                </span>
              )}
              {bloco.editadoPeloMedico && (
                <span
                  className="
                    inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-amber-50
                    px-2 py-0.5 text-[10px] font-medium text-amber-800
                    dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300
                  "
                >
                  <Pencil className="size-3" />
                  Editado
                </span>
              )}
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="
                    rounded-md p-1.5 text-slate-400 opacity-0 transition-opacity
                    hover:bg-slate-200/60 hover:text-slate-700 group-hover:opacity-100
                    focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-300
                    dark:hover:bg-slate-800 dark:hover:text-slate-200
                  "
                  aria-label={`Editar ${bloco.rotulo}`}
                >
                  <Pencil className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {editando ? (
            <div className="mt-3 space-y-2">
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={4}
                className="
                  w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2
                  text-sm leading-relaxed text-slate-800
                  focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
                  dark:focus:border-teal-400
                "
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setTexto(bloco.texto)
                    setEditando(false)
                  }}
                  className="
                    rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600
                    transition-colors hover:bg-slate-50
                    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
                  "
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onEditar?.(texto)
                    setEditando(false)
                  }}
                  className="
                    inline-flex items-center gap-1.5 rounded-md
                    bg-teal-600 px-3 py-1.5 text-xs font-medium text-white
                    transition-colors hover:bg-teal-500
                  "
                >
                  <Check className="size-3.5" />
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {texto}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
