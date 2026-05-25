import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Search, X } from 'lucide-react'
import type { PacienteSelector } from '@/../product-clinico/sections/prescricao/types'
import { formatDataBR } from './helpers'

interface NovaPrescricaoModalProps {
  open: boolean
  pacientes: PacienteSelector[]
  onClose?: () => void
  onSelecionar?: (pacienteId: string) => void
}

export function NovaPrescricaoModal({
  open,
  pacientes,
  onClose,
  onSelecionar,
}: NovaPrescricaoModalProps) {
  const [busca, setBusca] = useState('')

  useEffect(() => {
    if (open) setBusca('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return pacientes
    return pacientes.filter((p) => p.nome.toLowerCase().includes(q))
  }, [pacientes, busca])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-950/70"
      />

      <div className="relative mt-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:mt-0">
        <header className="flex items-center justify-between border-b border-slate-200/80 px-5 py-3.5 dark:border-slate-800/80">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Nova prescrição
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Selecione o paciente — Memed abrirá em seguida
            </p>
          </div>
          <button
            onClick={onClose}
            className="-mr-1 inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="px-5 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Buscar por nome…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="
                w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm
                placeholder:text-slate-400
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500
              "
            />
          </div>

          <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto pr-1">
            {filtrados.length === 0 ? (
              <li className="rounded-lg bg-slate-50/60 py-8 text-center text-xs italic text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                Nenhum paciente encontrado
              </li>
            ) : (
              filtrados.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => onSelecionar?.(p.id)}
                    className="
                      group/pck flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition-colors
                      hover:border-teal-200 hover:bg-teal-50/40
                      focus:border-teal-300 focus:bg-teal-50/40 focus:outline-none
                      dark:hover:border-teal-800 dark:hover:bg-teal-950/20
                      dark:focus:border-teal-700 dark:focus:bg-teal-950/20
                    "
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-[10px] font-medium text-white shadow-sm">
                      {p.iniciais}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {p.nome}
                      </p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {p.condicoesCronicas.slice(0, 2).join(' · ')}
                        {p.ultimaConsulta && (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span>última {formatDataBR(p.ultimaConsulta)}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-slate-300 transition-colors group-hover/pck:text-teal-500 dark:text-slate-600" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
