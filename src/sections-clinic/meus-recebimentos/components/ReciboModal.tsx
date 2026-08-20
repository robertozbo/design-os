import { Download, X } from 'lucide-react'
import type {
  ProfissionalRef,
  RepassePago,
} from '@/../product-clinic/sections/meus-recebimentos/types'
import { brl } from './helpers'

interface Props {
  repasse: RepassePago
  profissional: ProfissionalRef
  clinica: string
  onBaixar: () => void
  onFechar: () => void
}

export function ReciboModal({ repasse: r, profissional, clinica, onBaixar, onFechar }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Repasse de {r.competencia}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {r.recibo} · pago em {r.pagoEm}
            </p>
          </div>
          <button
            aria-label="Fechar"
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="text-[11px] text-slate-400">
            {profissional.nome} · {profissional.conselho} · {clinica}
          </div>

          <dl className="mt-4 space-y-2 text-xs">
            <Linha rotulo="Atendimentos" valor={String(r.atendimentos)} />
            <Linha rotulo="Produzido (bruto)" valor={brl(r.bruto)} />
            <Linha rotulo="Sua comissão" valor={brl(r.comissao)} />
            <Linha rotulo="Deduções" valor={`− ${brl(r.deducoes)}`} negativo />
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Líquido pago
            </span>
            <span className="text-xl font-semibold tabular-nums text-teal-600 dark:text-teal-400">
              {brl(r.liquido)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <button
            onClick={onFechar}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Fechar
          </button>
          <button
            onClick={onBaixar}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600"
          >
            <Download className="h-3.5 w-3.5" /> Baixar recibo
          </button>
        </div>
      </div>
    </div>
  )
}

function Linha({
  rotulo,
  valor,
  negativo = false,
}: {
  rotulo: string
  valor: string
  negativo?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-slate-500 dark:text-slate-400">{rotulo}</dt>
      <dd
        className={`font-medium tabular-nums ${
          negativo ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'
        }`}
      >
        {valor}
      </dd>
    </div>
  )
}
