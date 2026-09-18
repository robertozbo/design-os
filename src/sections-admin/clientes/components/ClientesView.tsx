import { useMemo } from 'react'
import { AlertTriangle, Building2, Search, User, Users } from 'lucide-react'
import type {
  ClientesProps,
  SituacaoCobranca,
  Workspace,
} from '@/../product-admin/sections/clientes/types'
import {
  SITUACAO_META,
  TIPO_LABEL,
  desde,
  paradoDemais,
  prazo,
  reais,
} from './helpers'

export type FiltroSituacao = 'todos' | SituacaoCobranca

interface Props extends ClientesProps {
  filtro: FiltroSituacao
  busca: string
  onFiltro: (f: FiltroSituacao) => void
  onBusca: (q: string) => void
}

const FILTROS: { id: FiltroSituacao; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'ativo', label: 'Ativos' },
  { id: 'trial', label: 'Trial' },
  { id: 'inadimplente', label: 'Inadimplentes' },
  { id: 'cancelado', label: 'Cancelados' },
]

export function ClientesView({
  resumo,
  workspaces,
  filtro,
  busca,
  onFiltro,
  onBusca,
  onAbrir,
  onCobrar,
}: Props) {
  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return workspaces.filter((w) => {
      if (filtro !== 'todos' && w.situacao !== filtro) return false
      if (q && !w.nome.toLowerCase().includes(q) && !w.cidade.toLowerCase().includes(q)) return false
      return true
    })
  }, [workspaces, filtro, busca])

  return (
    <div className="p-6 pl-16 lg:pl-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Clientes</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Contrato e uso. Nenhum dado clínico aparece aqui.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi rotulo="Workspaces ativos" valor={String(resumo.ativos)} />
        <Kpi rotulo="MRR" valor={reais(resumo.mrr)} destaque />
        <Kpi rotulo="Em trial" valor={String(resumo.emTrial)} />
        <Kpi
          rotulo="Inadimplentes"
          valor={String(resumo.inadimplentes)}
          alerta={resumo.inadimplentes > 0}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => onBusca(e.target.value)}
            placeholder="Buscar por nome ou cidade…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => onFiltro(f.id)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filtro === f.id
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        {lista.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">Nada neste filtro.</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {lista.map((w) => (
              <Linha key={w.id} w={w} onAbrir={onAbrir} onCobrar={onCobrar} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Linha({
  w,
  onAbrir,
  onCobrar,
}: {
  w: Workspace
  onAbrir?: (id: string) => void
  onCobrar?: (id: string) => void
}) {
  const meta = SITUACAO_META[w.situacao]
  const p = prazo(w.situacao, w.prazoEm)
  const noLimite = w.profissionais >= w.maxProfissionais
  // Conta que paga e não entra há mais de um mês: o churn já aconteceu, a fatura é que
  // ainda não sabe. Só faz sentido marcar em quem está ativo.
  const sumido = w.situacao === 'ativo' && paradoDemais(w.ultimoAcesso)
  const Icone = w.tipo === 'empresa' ? Building2 : w.tipo === 'clinica' ? Users : User

  return (
    <li
      className={`bg-white px-4 py-3 dark:bg-slate-900 ${w.situacao === 'cancelado' ? 'opacity-55' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          onClick={() => onAbrir?.(w.id)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          {/* O tipo vive no ícone, não no texto: o plano já começa com "Clínica ·" e a
              linha lia "Clínica · São Paulo/SP · Clínica · até 6 médicos". */}
          <span title={TIPO_LABEL[w.tipo]} className="shrink-0">
            <Icone className="h-4 w-4 text-slate-400" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800 hover:underline dark:text-slate-100">
              {w.nome}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
              {w.cidade} · {w.plano}
            </p>
          </div>
        </button>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {w.addons.map((a) => (
            <span
              key={a.id}
              title={
                a.usados !== null ? `${a.usados} de ${a.incluidos} no ciclo` : 'sem cota'
              }
              className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
            >
              {a.nome}
              {a.usados !== null && (
                <span className="ml-1 font-normal tabular-nums opacity-70">
                  {a.usados}/{a.incluidos}
                </span>
              )}
            </span>
          ))}

          <span
            className={`w-20 text-right text-[11px] tabular-nums ${
              noLimite
                ? 'font-medium text-teal-700 dark:text-teal-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
            title={noLimite ? 'No limite do plano — candidato a upgrade' : 'Profissionais em uso'}
          >
            {w.profissionais} de {w.maxProfissionais}
          </span>

          <span className="w-20 text-right text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {reais(w.mrr)}
          </span>

          <span className="flex w-36 shrink-0 flex-col items-end gap-0.5">
            <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${meta.badge}`}>
              {meta.label}
            </span>
            {p && <span className="text-[10px] text-slate-400 dark:text-slate-500">{p}</span>}
          </span>

          <span
            className={`inline-flex w-24 shrink-0 items-center justify-end gap-1 text-[11px] ${
              sumido
                ? 'font-medium text-amber-600 dark:text-amber-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
            title={sumido ? 'Paga e não entra há mais de 30 dias' : 'Último acesso'}
          >
            {sumido && <AlertTriangle className="h-3 w-3" />}
            {desde(w.ultimoAcesso)}
          </span>

          {w.situacao === 'inadimplente' && (
            <button
              onClick={() => onCobrar?.(w.id)}
              className="shrink-0 rounded-lg bg-red-600 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-red-700"
            >
              Cobrar
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

function Kpi({
  rotulo,
  valor,
  destaque = false,
  alerta = false,
}: {
  rotulo: string
  valor: string
  destaque?: boolean
  alerta?: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-200 px-3.5 py-3 dark:border-slate-800">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {rotulo}
      </p>
      <p
        className={`mt-1 text-xl font-semibold tabular-nums ${
          alerta
            ? 'text-red-600 dark:text-red-400'
            : destaque
              ? 'text-teal-700 dark:text-teal-400'
              : 'text-slate-900 dark:text-slate-50'
        }`}
      >
        {valor}
      </p>
    </div>
  )
}
