import { Fragment } from 'react'
import { ChevronDown, ChevronRight, TriangleAlert } from 'lucide-react'
import type { Conta, DiaFluxo } from '@/../product-clinic/sections/fluxo-caixa/types'
import { estaAtrasado, moeda, moedaComSinal } from './helpers'

interface Props {
  dias: DiaFluxo[]
  hoje: string
  /** Datas abertas na tabela. */
  abertos: string[]
  onAbrirDia: (data: string) => void
  onVerLancamento: (id: string) => void
}

export function TabelaDias({ dias, hoje, abertos, onAbrirDia, onVerLancamento }: Props) {
  if (dias.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
        Nenhum lançamento no período.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="px-4 py-2 text-left font-semibold">Dia</th>
            <th className="px-3 py-2 text-right font-semibold">Entradas</th>
            <th className="px-3 py-2 text-right font-semibold">Saídas</th>
            <th className="px-3 py-2 text-right font-semibold">Resultado</th>
            <th className="px-4 py-2 text-right font-semibold">Saldo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {dias.map((d) => {
            const aberto = abertos.includes(d.data)
            const negativo = d.saldoAcumulado < 0
            return (
              <Fragment key={d.data}>
                <tr
                  onClick={() => onAbrirDia(d.data)}
                  className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-1.5">
                      {aberto ? (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span
                        className={`tabular-nums ${
                          d.data === hoje
                            ? 'font-semibold text-slate-900 dark:text-slate-50'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {d.rotulo}
                      </span>
                      {d.data === hoje && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          hoje
                        </span>
                      )}
                      {d.origem === 'previsto' && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          previsto
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-teal-700 dark:text-teal-400">
                    {d.entradas > 0 ? moeda(d.entradas) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-rose-700 dark:text-rose-400">
                    {d.saidas > 0 ? moeda(d.saidas) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-300">
                    {moedaComSinal(d.resultado)}
                  </td>
                  <td
                    className={`px-4 py-2 text-right font-semibold tabular-nums ${
                      negativo ? 'text-rose-700 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <span className="inline-flex items-center justify-end gap-1">
                      {negativo && <TriangleAlert className="h-3.5 w-3.5" />}
                      {moedaComSinal(d.saldoAcumulado)}
                    </span>
                  </td>
                </tr>

                {aberto && (
                  <tr>
                    <td colSpan={5} className="bg-slate-50 px-4 py-2 dark:bg-slate-950/40">
                      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                        {d.lancamentos.map((l) => (
                          <LinhaLancamento
                            key={l.id}
                            lancamento={l}
                            hoje={hoje}
                            onVer={() => onVerLancamento(l.id)}
                          />
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function LinhaLancamento({
  lancamento,
  hoje,
  onVer,
}: {
  lancamento: Conta
  hoje: string
  onVer: () => void
}) {
  const entrada = lancamento.tipo === 'receber'
  const atrasado = estaAtrasado(lancamento, hoje)

  return (
    <li>
      <button
        onClick={onVer}
        className="flex w-full items-start gap-3 py-1.5 text-left transition-colors hover:opacity-80"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-700 dark:text-slate-200">{lancamento.descricao}</span>
            {atrasado && (
              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                atrasado · venceu {lancamento.vencimento.slice(8)}/{lancamento.vencimento.slice(5, 7)}
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-[11px] text-slate-400">
            {lancamento.contraparte ?? 'Sem contraparte'} · {lancamento.metodo}
          </span>
        </span>
        <span
          className={`shrink-0 text-xs font-medium tabular-nums ${
            entrada ? 'text-teal-700 dark:text-teal-400' : 'text-rose-700 dark:text-rose-400'
          }`}
        >
          {entrada ? '+' : '−'}R$ {moeda(lancamento.valor)}
        </span>
      </button>
    </li>
  )
}
