import { Download } from 'lucide-react'
import type {
  Periodo,
  ProducaoMedico,
  RelatoriosData,
} from '@/../product-clinic/sections/relatorios/types'
import { AVATAR_COR, BADGE_COR, BAR_COR, brl, pct } from './helpers'

interface Props {
  dados: RelatoriosData
  onPeriodo: (p: Periodo) => void
  onExportar: () => void
  onLinhaClick: (m: ProducaoMedico) => void
}

export function RelatoriosView({ dados, onPeriodo, onExportar, onLinhaClick }: Props) {
  const maxSala = Math.max(...dados.salas.map((s) => s.pct))
  const maxEsp = Math.max(...dados.porEspecialidade.map((e) => e.pct))
  const maxNoShow = Math.max(...dados.noShow.map((n) => n.quantidade))

  const fin = dados.financeiro
  const maxRecTipo = Math.max(...dados.receitaPorTipo.map((r) => r.pct))
  const maxDespGrupo = Math.max(...dados.despesaPorGrupo.map((g) => g.pct))
  const totalDesp = dados.despesaComportamento.fixa + dados.despesaComportamento.variavel
  const fixaPct = totalDesp ? (dados.despesaComportamento.fixa / totalDesp) * 100 : 0
  const varPct = 100 - fixaPct

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Relatórios</h1>
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
              {k.valor}
            </div>
          </div>
        ))}
      </div>

      {/* Financeiro do período */}
      <div className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Financeiro do período
        </h2>

        {/* Resultado */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ResumoCard label="Receita" valor={brl(fin.receita)} cor="text-emerald-600 dark:text-emerald-400" />
          <ResumoCard label="Despesa" valor={brl(fin.despesa)} cor="text-rose-600 dark:text-rose-400" />
          <div className="rounded-2xl border border-teal-500 bg-teal-50/50 p-4 dark:border-teal-600 dark:bg-teal-950/20">
            <div className="text-[11px] uppercase tracking-wide text-slate-400">Resultado</div>
            <div className="mt-1 text-xl font-bold text-teal-700 dark:text-teal-300">
              {brl(fin.resultado)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">margem {pct(fin.margem)}</div>
          </div>
        </div>

        {/* Fluxo de caixa */}
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-5">
          <Fluxo label="Recebido" valor={brl(fin.recebido)} cor="text-emerald-600 dark:text-emerald-400" />
          <Fluxo label="A receber" valor={brl(fin.aReceber)} cor="text-amber-600 dark:text-amber-400" />
          <Fluxo label="Pago" valor={brl(fin.pago)} cor="text-slate-700 dark:text-slate-200" />
          <Fluxo label="A pagar" valor={brl(fin.aPagar)} cor="text-rose-600 dark:text-rose-400" />
          {/* Não é caixa: é o líquido do período. Chamar de saldo assumiria caixa inicial zero. */}
          <Fluxo
            label="Resultado do período"
            valor={brl(fin.recebido - fin.pago)}
            cor="text-teal-600 dark:text-teal-400"
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Receita por tipo */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Receita por tipo
            </h3>
            <div className="space-y-2.5">
              {dados.receitaPorTipo.map((r) => (
                <BarLinha
                  key={r.tipo}
                  nome={r.tipo}
                  valor={brl(r.valor)}
                  sub={pct(r.pct)}
                  width={(r.pct / maxRecTipo) * 100}
                  cor="bg-emerald-500"
                />
              ))}
            </div>
          </div>

          {/* Despesa */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Despesa · fixa × variável
            </h3>
            <div className="mb-1.5 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="bg-sky-500" style={{ width: `${fixaPct}%` }} />
              <div className="bg-amber-500" style={{ width: `${varPct}%` }} />
            </div>
            <div className="mb-4 flex justify-between text-[11px]">
              <span className="text-sky-600 dark:text-sky-400">
                Fixa {brl(dados.despesaComportamento.fixa)} · {pct(fixaPct)}
              </span>
              <span className="text-amber-600 dark:text-amber-400">
                Variável {brl(dados.despesaComportamento.variavel)} · {pct(varPct)}
              </span>
            </div>
            <div className="space-y-2.5">
              {dados.despesaPorGrupo.map((g) => (
                <BarLinha
                  key={g.grupo}
                  nome={g.grupo}
                  badge={g.comportamento === 'fixa' ? 'Fixa' : 'Variável'}
                  badgeCor={
                    g.comportamento === 'fixa'
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  }
                  valor={brl(g.valor)}
                  sub={pct(g.pct)}
                  width={(g.pct / maxDespGrupo) * 100}
                  cor={g.comportamento === 'fixa' ? 'bg-sky-500' : 'bg-amber-500'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Produção por médico */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Produção por médico
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-4 py-2 font-medium">Médico</th>
                <th className="px-4 py-2 text-right font-medium">Atend.</th>
                <th className="px-4 py-2 text-right font-medium">Teleconsultas</th>
                <th className="px-4 py-2 text-right font-medium">No-shows</th>
                <th className="px-4 py-2 text-right font-medium">Receita</th>
              </tr>
            </thead>
            <tbody>
              {dados.producao.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onLinhaClick(m)}
                  className="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${AVATAR_COR[m.cor]}`}>
                        {m.iniciais}
                      </span>
                      <div className="leading-tight">
                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {m.nome}
                        </div>
                        <div className="mt-0.5">
                          <span className={`rounded px-1 py-0.5 text-[10px] font-medium ${BADGE_COR[m.cor]}`}>
                            {m.especialidade}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                    {m.atendimentos}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                    {m.teleconsultas}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-amber-600 dark:text-amber-400">
                    {m.noShows}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-teal-700 dark:text-teal-300">
                    {brl(m.receita)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Ocupação de salas */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Ocupação de salas
          </h2>
          <ul className="space-y-3">
            {dados.salas.map((s) => (
              <li key={s.id}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-300">{s.nome}</span>
                  <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {pct(s.pct)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${(s.pct / maxSala) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Receita por especialidade */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Receita por especialidade
          </h2>
          <ul className="space-y-3">
            {dados.porEspecialidade.map((e) => (
              <li key={e.especialidade}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-300">{e.especialidade}</span>
                  <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {brl(e.valor)} · {pct(e.pct)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${BAR_COR[e.cor]}`}
                    style={{ width: `${(e.pct / maxEsp) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* No-show por médico */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            No-show por médico
          </h2>
          <ul className="space-y-3">
            {dados.noShow.map((n) => (
              <li key={n.id}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-300">{n.nome}</span>
                  <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {n.quantidade} · {pct(n.taxa)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${(n.quantidade / maxNoShow) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">
            Faltas não confirmadas em até 24h. Metas e lembretes automáticos entram no V2.
          </p>
        </div>
      </div>
    </div>
  )
}

function ResumoCard({ label, valor, cor }: { label: string; valor: string; cor: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-xl font-bold ${cor}`}>{valor}</div>
    </div>
  )
}

function Fluxo({ label, valor, cor }: { label: string; valor: string; cor: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-0.5 text-sm font-semibold tabular-nums ${cor}`}>{valor}</div>
    </div>
  )
}

function BarLinha({
  nome,
  valor,
  sub,
  width,
  cor,
  badge,
  badgeCor,
}: {
  nome: string
  valor: string
  sub: string
  width: number
  cor: string
  badge?: string
  badgeCor?: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 truncate text-xs text-slate-700 dark:text-slate-200">
          <span className="truncate">{nome}</span>
          {badge && (
            <span className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-medium ${badgeCor}`}>
              {badge}
            </span>
          )}
        </span>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100">
          {valor} <span className="text-[10px] font-normal text-slate-400">· {sub}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${cor}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
