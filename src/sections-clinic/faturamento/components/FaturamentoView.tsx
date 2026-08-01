import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import type {
  Cobranca,
  FaturamentoData,
  FiltroStatus,
  Periodo,
} from '@/../product-clinic/sections/faturamento/types'
import {
  AVATAR_COR,
  BADGE_COR,
  FORMA_LABEL,
  STATUS_META,
  brl,
  dataCurta,
} from './helpers'

const FILTROS: { value: FiltroStatus; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'pago', label: 'Pagas' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'estornado', label: 'Estornadas' },
]

interface Props {
  dados: FaturamentoData
  onPeriodo: (p: Periodo) => void
  onExportar: () => void
  onCobranca: (c: Cobranca) => void
}

export function FaturamentoView({ dados, onPeriodo, onExportar, onCobranca }: Props) {
  const [filtro, setFiltro] = useState<FiltroStatus>('todos')

  const cobrancas = useMemo(
    () => (filtro === 'todos' ? dados.cobrancas : dados.cobrancas.filter((c) => c.status === filtro)),
    [dados.cobrancas, filtro],
  )
  const maxConv = Math.max(...dados.porConvenio.map((c) => c.pct))

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Faturamento</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{dados.clinica}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            {(['mes', 'trimestre'] as Periodo[]).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodo(p)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  dados.periodo === p
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {p === 'mes' ? 'Mês' : 'Trimestre'}
              </button>
            ))}
          </div>
          <button
            onClick={onExportar}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {dados.kpis.map((k) => (
          <div
            key={k.id}
            className={`rounded-2xl border p-4 ${
              k.destaque
                ? 'border-teal-500 bg-teal-50/50 dark:border-teal-600 dark:bg-teal-950/20'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="text-[11px] uppercase tracking-wide text-slate-400">{k.label}</div>
            <div
              className={`mt-1 text-lg font-semibold ${
                k.destaque ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-50'
              }`}
            >
              {brl(k.valor)}
            </div>
          </div>
        ))}
      </div>

      {/* Repasse por médico */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Repasse por médico
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-4 py-2 font-medium">Médico</th>
                <th className="px-4 py-2 text-right font-medium">Atend.</th>
                <th className="px-4 py-2 text-right font-medium">Bruto</th>
                <th className="px-4 py-2 text-right font-medium">%</th>
                <th className="px-4 py-2 text-right font-medium">Repasse</th>
                <th className="px-4 py-2 text-right font-medium">Líquido</th>
              </tr>
            </thead>
            <tbody>
              {dados.repasses.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-50 last:border-0 dark:border-slate-800/60"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${AVATAR_COR[r.cor]}`}>
                        {r.iniciais}
                      </span>
                      <div className="leading-tight">
                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {r.nome}
                        </div>
                        <div className="text-[10px] text-slate-400">{r.especialidade}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                    {r.atendimentos}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                    {brl(r.receitaBruta)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-400">
                    {r.repassePct}%
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                    {brl(r.repasseValor)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-teal-700 dark:text-teal-300">
                    {brl(r.liquidoClinica)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Cobranças */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Cobranças
            </h2>
            <div className="flex items-center gap-1">
              {FILTROS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltro(f.value)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                    filtro === f.value
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {cobrancas.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onCobranca(c)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-400 text-[10px] font-semibold text-white">
                    {c.pacienteIniciais}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                      {c.pacienteNome}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className={`rounded px-1 py-0.5 font-medium ${BADGE_COR[c.cor]}`}>
                        {c.especialidade}
                      </span>
                      <span>
                        {FORMA_LABEL[c.forma]}
                        {c.convenio ? ` · ${c.convenio}` : ''}
                      </span>
                      <span>· {dataCurta(c.data)}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                    {brl(c.valor)}
                  </span>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${STATUS_META[c.status].badge}`}>
                    {STATUS_META[c.status].label}
                  </span>
                </button>
              </li>
            ))}
            {cobrancas.length === 0 && (
              <li className="px-4 py-8 text-center text-xs text-slate-400">
                Nenhuma cobrança nesse filtro.
              </li>
            )}
          </ul>
        </div>

        {/* Por convênio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Por convênio
          </h2>
          <ul className="space-y-3">
            {dados.porConvenio.map((c) => (
              <li key={c.nome}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-300">{c.nome}</span>
                  <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {brl(c.valor)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${(c.pct / maxConv) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">
            Convênio = tracking textual (V1). TUSS/SADT e glosa entram no V2.
          </p>
        </div>
      </div>
    </div>
  )
}
