import { useState } from 'react'
import { X, Sparkles, ShieldCheck } from 'lucide-react'
import type { AcaoPosConsulta } from '@/../product-clinico/sections/consulta/types'

interface Props {
  acoes: AcaoPosConsulta[]
  modeloIA: string
  onConfirmar?: (acoesIds: AcaoPosConsulta['id'][]) => void
  onCancelar?: () => void
}

export function PostConsultaModal({ acoes, modeloIA, onConfirmar, onCancelar }: Props) {
  const [selecionadas, setSelecionadas] = useState<Set<AcaoPosConsulta['id']>>(
    new Set(acoes.filter((a) => a.habilitada).map((a) => a.id)),
  )

  const toggle = (id: AcaoPosConsulta['id']) => {
    setSelecionadas((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-consulta-title"
    >
      <button
        onClick={onCancelar}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-label="Fechar modal"
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200/80 p-6 dark:border-slate-800">
          <div>
            <h2
              id="post-consulta-title"
              className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              Assinar e fechar consulta
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              Esta evolução foi assistida por IA ({modeloIA}) e revisada por você.
            </p>
          </div>
          <button
            onClick={onCancelar}
            className="
              -mt-1 -mr-1 rounded-md p-1.5 text-slate-400 transition-colors
              hover:bg-slate-100 hover:text-slate-700
              focus:outline-none focus:ring-2 focus:ring-slate-300
              dark:hover:bg-slate-800 dark:hover:text-slate-200
            "
            aria-label="Cancelar"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="px-6 py-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ações ao fechar
          </h3>
          <ul className="mt-3 space-y-2">
            {acoes.map((acao) => {
              const ativo = selecionadas.has(acao.id)
              return (
                <li key={acao.id}>
                  <label
                    className={`
                      flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors
                      ${
                        !acao.habilitada
                          ? 'cursor-not-allowed border-slate-200 bg-slate-50/60 opacity-60 dark:border-slate-800 dark:bg-slate-900/40'
                          : ativo
                          ? 'border-teal-300 bg-teal-50/60 dark:border-teal-700 dark:bg-teal-950/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={ativo && acao.habilitada}
                      disabled={!acao.habilitada}
                      onChange={() => acao.habilitada && toggle(acao.id)}
                      className="mt-0.5 size-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {acao.rotulo}
                      </p>
                      {acao.sugestao && (
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                          Sugestão: <span className="font-medium">{acao.sugestao}</span>
                        </p>
                      )}
                      {acao.preview && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                          “{acao.preview}”
                        </p>
                      )}
                      {acao.motivo && (
                        <p className="mt-0.5 text-xs italic text-slate-500 dark:text-slate-500">
                          {acao.motivo}
                        </p>
                      )}
                    </div>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200/80 px-6 py-4 dark:border-slate-800">
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="size-3.5" />
            Click-to-attest registra timestamp + audit log
          </p>
          <div className="flex gap-2">
            <button
              onClick={onCancelar}
              className="
                rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700
                transition-colors hover:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-slate-300
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
                dark:focus:ring-slate-600
              "
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirmar?.(Array.from(selecionadas))}
              className="
                rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                transition-colors hover:bg-teal-500
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                dark:focus:ring-offset-slate-950
              "
            >
              Assinar e fechar
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
