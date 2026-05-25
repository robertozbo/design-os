import { useEffect, useState } from 'react'
import { CheckCircle2, ShieldCheck, X } from 'lucide-react'

export type MemedContexto =
  | { tipo: 'renovacao'; pacienteNome: string; medicamentos: string[] }
  | { tipo: 'nova'; pacienteNome: string }
  | null

interface MemedEmbedModalProps {
  contexto: MemedContexto
  onClose?: () => void
  onEmitir?: () => void
}

export function MemedEmbedModal({ contexto, onClose, onEmitir }: MemedEmbedModalProps) {
  const [emitindo, setEmitindo] = useState(false)
  const [emitido, setEmitido] = useState(false)

  useEffect(() => {
    if (contexto) {
      setEmitindo(false)
      setEmitido(false)
    }
  }, [contexto])

  useEffect(() => {
    if (!contexto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !emitindo) onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [contexto, emitindo, onClose])

  if (!contexto) return null

  const titulo =
    contexto.tipo === 'renovacao'
      ? `Renovando receita de ${contexto.pacienteNome}`
      : `Nova prescrição pra ${contexto.pacienteNome}`

  const submit = () => {
    if (emitindo) return
    setEmitindo(true)
    setTimeout(() => {
      setEmitido(true)
      setTimeout(() => onEmitir?.(), 700)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => !emitindo && onClose?.()}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[3px] dark:bg-slate-950/80"
      />

      <div className="relative flex h-full max-h-[720px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/60 px-5 py-3.5 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{titulo}</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Memed · validade ICP-Brasil
              </p>
            </div>
          </div>
          <button
            onClick={() => !emitindo && onClose?.()}
            disabled={emitindo}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="size-3.5" /> Cancelar
          </button>
        </header>

        {/* Memed embed (mock) */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-emerald-50/40 to-teal-50/40 p-6 dark:from-emerald-950/20 dark:to-teal-950/20">
          {emitido ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="size-7" />
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Receita emitida
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paciente notificado no app — assinatura ICP-Brasil registrada
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              <div className="rounded-xl border border-emerald-200/70 bg-white/80 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900/80">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Memed · simulação do iframe
                </p>
                {contexto.tipo === 'renovacao' ? (
                  <>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      Itens pré-preenchidos da última prescrição:
                    </p>
                    <ul className="mt-3 space-y-2">
                      {contexto.medicamentos.map((m, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800/40"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded bg-emerald-600 text-[9px] font-bold text-white">
                            {i + 1}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{m}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[11px] italic text-slate-500 dark:text-slate-400">
                      Ajuste dose ou posologia se necessário antes de emitir.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      Receita em branco. Adicione os medicamentos no painel do Memed.
                    </p>
                    <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-4 py-8 text-center text-xs italic text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
                      [campo de busca de medicamento]
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-200/80 bg-slate-50/40 px-5 py-3 dark:border-slate-800/80 dark:bg-slate-950/60">
          {!emitido && (
            <>
              <button
                type="button"
                onClick={() => !emitindo && onClose?.()}
                disabled={emitindo}
                className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={emitindo}
                className="
                  inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
                  hover:bg-emerald-500
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                <ShieldCheck className="size-3.5" />
                {emitindo ? 'Emitindo no Memed…' : 'Emitir receita'}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}
