import { useState } from 'react'
import { Check, CreditCard, X } from 'lucide-react'
import type { Conta } from '@/../product-medical-clinic/sections/_contas/types'
import { moeda } from './helpers'

interface Props {
  conta: Conta | null
  hoje: string
  onConfirmar: (id: string, pagoEm: string) => void
  onFechar: () => void
}

export function ConfirmarPagamentoModal({ conta, hoje, onConfirmar, onFechar }: Props) {
  const [pagoEm, setPagoEm] = useState(hoje)

  if (!conta) return null
  const receber = conta.tipo === 'receber'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Confirmar pagamento
            </h2>
          </div>
          <button
            aria-label="Fechar"
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wide text-emerald-700/70 dark:text-emerald-300/70">
                {receber ? 'Paciente' : 'Fornecedor'}
              </div>
              <div className="truncate text-sm font-medium text-emerald-900 dark:text-emerald-200">
                {conta.contraparte ?? conta.descricao}
              </div>
            </div>
            <div className="shrink-0 text-lg font-bold text-emerald-600 dark:text-emerald-400">
              R$ {moeda(conta.valor)}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Data de pagamento
            </label>
            <input
              type="date"
              value={pagoEm}
              onChange={(e) => setPagoEm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <button
            onClick={onFechar}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmar(conta.id, pagoEm)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Check className="h-4 w-4" /> Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
