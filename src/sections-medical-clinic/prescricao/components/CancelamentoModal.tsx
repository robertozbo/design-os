import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import type { MotivoCancelamento } from '@/../product-medical-clinic/sections/prescricao/types'
import { MOTIVO_LABEL } from './helpers'

interface Props {
  pacienteNome: string
  onConfirmar: (motivo: MotivoCancelamento, justificativa: string) => void
  onFechar: () => void
}

const MOTIVOS: MotivoCancelamento[] = [
  'erro_prescricao',
  'mudanca_conduta',
  'reacao_adversa',
  'outro',
]

export function CancelamentoModal({ pacienteNome, onConfirmar, onFechar }: Props) {
  const [motivo, setMotivo] = useState<MotivoCancelamento | null>(null)
  const [justificativa, setJustificativa] = useState('')

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Cancelar prescrição
              </h2>
              <p className="text-[11px] text-slate-400">{pacienteNome}</p>
            </div>
          </div>
          <button
            aria-label="Fechar"
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Motivo</div>
          <div className="grid grid-cols-2 gap-1.5">
            {MOTIVOS.map((m) => (
              <button
                key={m}
                onClick={() => setMotivo(m)}
                className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                  motivo === m
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {MOTIVO_LABEL[m]}
              </button>
            ))}
          </div>

          <textarea
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            rows={3}
            placeholder="Justificativa (registrada no audit log)…"
            className="mt-3 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />

          <div className="mt-3 flex gap-2">
            <button
              onClick={onFechar}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Voltar
            </button>
            <button
              disabled={!motivo}
              onClick={() => motivo && onConfirmar(motivo, justificativa)}
              className="flex-1 rounded-lg bg-rose-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancelar prescrição
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
