import { useState } from 'react'
import { CalendarClock, X } from 'lucide-react'
import type { ContaConectada, Publicacao } from '@/../product-clinic/sections/publicacoes/types'

interface Props {
  publicacao: Publicacao
  conta: ContaConectada
  onAgendar: (id: string, quando: string) => void
  onFechar: () => void
}

/** "2026-09-22T09:00" no formato que o `datetime-local` aceita. */
function paraInput(iso: string | null): string {
  if (!iso) return '2026-09-22T09:00'
  return iso.slice(0, 16)
}

const ATALHOS: { label: string; valor: string }[] = [
  { label: 'Amanhã, 9h', valor: '2026-09-18T09:00' },
  { label: 'Sexta, 11h', valor: '2026-09-19T11:00' },
  { label: 'Segunda, 9h', valor: '2026-09-21T09:00' },
]

export function AgendarModal({ publicacao, conta, onAgendar, onFechar }: Props) {
  const [quando, setQuando] = useState(paraInput(publicacao.agendadoPara))

  const restamHoje = conta.limiteDiario - conta.publicadosHoje
  const paraHoje = quando.startsWith('2026-09-17')

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-t-2xl bg-white shadow-xl dark:bg-slate-900 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <CalendarClock className="h-4 w-4" /> Agendar publicação
          </h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{publicacao.tema}</p>

          <input
            type="datetime-local"
            value={quando}
            onChange={(e) => setQuando(e.target.value)}
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {ATALHOS.map((a) => (
              <button
                key={a.valor}
                onClick={() => setQuando(a.valor)}
                className={`rounded-full border px-2.5 py-1 text-[11px] ${
                  quando === a.valor
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            {paraHoje
              ? `Hoje já saíram ${conta.publicadosHoje} de ${conta.limiteDiario} publicações — restam ${restamHoje} no limite da API do Instagram.`
              : `Limite de ${conta.limiteDiario} publicações por dia por conta (regra da API do Instagram, não do plano).`}
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          <button
            onClick={onFechar}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => onAgendar(publicacao.id, `${quando}:00-03:00`)}
            className="rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Agendar
          </button>
        </div>
      </div>
    </div>
  )
}
