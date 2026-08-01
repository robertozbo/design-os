import { useState } from 'react'
import { Clock, MapPin, Plus, Users, X } from 'lucide-react'
import type { Sala } from '@/../product-clinic/sections/salas/types'
import { TIPO_BADGE, TIPO_LABEL } from './helpers'

interface Props {
  sala: Sala | null
  onClose: () => void
  onSalvar: (id: string, patch: { ativa: boolean; recursos: string[] }) => void
}

export function SalaDrawer({ sala, onClose, onSalvar }: Props) {
  const [ativa, setAtiva] = useState(sala?.ativa ?? true)
  const [recursos, setRecursos] = useState<string[]>(sala?.recursos ?? [])
  const [novo, setNovo] = useState('')

  if (!sala) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {sala.nome}
            </h2>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TIPO_BADGE[sala.tipo]}`}>
              {TIPO_LABEL[sala.tipo]}
            </span>
          </div>
          <button
            aria-label="Fechar"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Infos */}
          <div className="space-y-2.5 rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">
            <Info icon={MapPin} texto={sala.local} />
            <Info icon={Clock} texto={`Funcionamento ${sala.funcionamento}`} />
            <Info icon={Users} texto={`Capacidade ${sala.capacidade}`} />
          </div>

          {/* Ativa toggle */}
          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Sala ativa
            </span>
            <button
              type="button"
              onClick={() => setAtiva((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                ativa ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  ativa ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>

          {/* Recursos */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Recursos / equipamentos
            </h3>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {recursos.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {r}
                  <button
                    onClick={() => setRecursos((prev) => prev.filter((x) => x !== r))}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {recursos.length === 0 && (
                <span className="text-xs text-slate-400">Nenhum recurso.</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={novo}
                onChange={(e) => setNovo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && novo.trim()) {
                    setRecursos((prev) => [...prev, novo.trim()])
                    setNovo('')
                  }
                }}
                placeholder="Adicionar recurso…"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                onClick={() => {
                  if (novo.trim()) {
                    setRecursos((prev) => [...prev, novo.trim()])
                    setNovo('')
                  }
                }}
                className="rounded-lg border border-slate-200 px-2.5 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSalvar(sala.id, { ativa, recursos })}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

function Info({ icon: Icon, texto }: { icon: typeof MapPin; texto: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{texto}</span>
    </div>
  )
}
