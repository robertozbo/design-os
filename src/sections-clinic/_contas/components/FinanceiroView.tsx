import { useMemo } from 'react'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Eye,
  Pencil,
  Plus,
  Scale,
  Search,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import type {
  Conta,
  FinanceiroData,
  StatusConta,
  TipoConta,
} from '@/../product-clinic/sections/_contas/types'
import { STATUS_META, dataBR, moeda, statusEfetivo } from './helpers'

export interface FiltroFinanceiro {
  de: string
  ate: string
  status: 'todos' | StatusConta
  busca: string
}

interface Props {
  dados: FinanceiroData
  contas: Conta[]
  /** Página fixa: receber ou pagar (sem abas). */
  tipo: TipoConta
  filtro: FiltroFinanceiro
  onFiltro: (f: FiltroFinanceiro) => void
  onLimpar: () => void
  onNova: () => void
  onConfirmar: (c: Conta) => void
  onExcluir: (id: string) => void
  onAcao: (msg: string) => void
}

export function FinanceiroView({
  dados,
  contas,
  tipo,
  filtro,
  onFiltro,
  onLimpar,
  onNova,
  onConfirmar,
  onExcluir,
  onAcao,
}: Props) {
  const hoje = dados.hoje
  const receber = tipo === 'receber'

  // KPIs do período (ambas as abas — o saldo cruza receber e pagar).
  const kpi = useMemo(() => {
    let aReceber = 0
    let recebido = 0
    let aPagar = 0
    for (const c of contas) {
      if (filtro.de && c.vencimento < filtro.de) continue
      if (filtro.ate && c.vencimento > filtro.ate) continue
      const st = statusEfetivo(c, hoje)
      if (c.tipo === 'receber') {
        if (st === 'pago') recebido += c.valor
        else aReceber += c.valor
      } else {
        if (st !== 'pago') aPagar += c.valor
      }
    }
    return { aReceber, recebido, aPagar, saldo: aReceber - aPagar }
  }, [contas, hoje, filtro.de, filtro.ate])

  // Linhas filtradas da aba ativa.
  const lista = useMemo(() => {
    const q = filtro.busca.trim().toLowerCase()
    return contas
      .filter((c) => c.tipo === tipo)
      .filter((c) => {
        const st = statusEfetivo(c, hoje)
        if (filtro.status !== 'todos' && st !== filtro.status) return false
        if (filtro.de && c.vencimento < filtro.de) return false
        if (filtro.ate && c.vencimento > filtro.ate) return false
        if (!q) return true
        return (
          c.descricao.toLowerCase().includes(q) ||
          (c.contraparte ?? '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  }, [contas, tipo, filtro, hoje])

  const totalLista = lista.reduce((s, c) => s + c.valor, 0)

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {receber ? (
              <ArrowUpCircle className="h-6 w-6 text-emerald-500" />
            ) : (
              <ArrowDownCircle className="h-6 w-6 text-rose-500" />
            )}
            {receber ? 'Contas a receber' : 'Contas a pagar'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {receber
              ? 'Recebimentos de pacientes e convênios'
              : 'Despesas e obrigações da clínica'}
          </p>
        </div>
        <button
          onClick={onNova}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Adicionar conta a {receber ? 'receber' : 'pagar'}
        </button>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={ArrowUpCircle} label="A receber" valor={kpi.aReceber} cor="amber" />
        <Kpi icon={CheckCircle2} label="Recebido" valor={kpi.recebido} cor="emerald" />
        <Kpi icon={ArrowDownCircle} label="A pagar" valor={kpi.aPagar} cor="rose" />
        <Kpi icon={Scale} label="Saldo previsto" valor={kpi.saldo} cor="teal" />
      </div>

      {/* Filtros */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
        <FiltroCampo label="De">
          <input
            type="date"
            value={filtro.de}
            onChange={(e) => onFiltro({ ...filtro, de: e.target.value })}
            className={filtroInput}
          />
        </FiltroCampo>
        <FiltroCampo label="Até">
          <input
            type="date"
            value={filtro.ate}
            onChange={(e) => onFiltro({ ...filtro, ate: e.target.value })}
            className={filtroInput}
          />
        </FiltroCampo>
        <FiltroCampo label="Status">
          <select
            value={filtro.status}
            onChange={(e) => onFiltro({ ...filtro, status: e.target.value as FiltroFinanceiro['status'] })}
            className={filtroInput}
          >
            <option value="todos">Todos</option>
            <option value="aberto">Em aberto</option>
            <option value="pago">Pago</option>
            <option value="vencido">Vencido</option>
          </select>
        </FiltroCampo>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filtro.busca}
            onChange={(e) => onFiltro({ ...filtro, busca: e.target.value })}
            placeholder={`Buscar por ${receber ? 'paciente' : 'fornecedor'} ou descrição…`}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
        <button
          onClick={onLimpar}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X className="h-3.5 w-3.5" /> Limpar filtros
        </button>
      </div>

      {/* Tabela */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Cabeçalho */}
        <div className="hidden grid-cols-[1.4fr_1.6fr_0.9fr_0.9fr_0.9fr_auto] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 md:grid">
          <span>{receber ? 'Paciente' : 'Fornecedor'}</span>
          <span>Descrição</span>
          <span>Vencimento</span>
          <span className="text-right">Valor</span>
          <span>Status</span>
          <span className="text-right">Ações</span>
        </div>

        {lista.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            Nenhuma conta com esses filtros.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {lista.map((c) => {
              const st = statusEfetivo(c, hoje)
              const meta = STATUS_META[st]
              return (
                <li
                  key={c.id}
                  className="grid grid-cols-1 items-center gap-3 bg-white px-4 py-3 md:grid-cols-[1.4fr_1.6fr_0.9fr_0.9fr_0.9fr_auto] dark:bg-slate-900"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                      {c.contraparte ?? '—'}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm text-slate-700 dark:text-slate-200">
                      {c.descricao}
                    </div>
                    <div className="truncate text-[11px] text-slate-400">
                      {[c.categoria, c.metodo].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">{dataBR(c.vencimento)}</div>
                  <div
                    className={`text-right text-sm font-semibold tabular-nums ${
                      receber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {receber ? '+' : '−'}R$ {moeda(c.valor)}
                  </div>
                  <div>
                    <span className={`inline-block rounded-md px-2 py-1 text-[10px] font-medium ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-0.5">
                    {st !== 'pago' && (
                      <IconBtn
                        title="Confirmar pagamento"
                        onClick={() => onConfirmar(c)}
                        className="hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </IconBtn>
                    )}
                    <IconBtn title="Ver" onClick={() => onAcao(`Detalhe de ${c.descricao} (mock)`)}>
                      <Eye className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Editar" onClick={() => onAcao(`Editar ${c.descricao} (mock)`)}>
                      <Pencil className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn
                      title="Excluir"
                      onClick={() => onExcluir(c.id)}
                      className="hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* Rodapé */}
        {lista.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-[11px] text-slate-400">{lista.length} registro(s)</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Total: R$ {moeda(totalLista)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const filtroInput =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

const KPI_COR: Record<string, string> = {
  amber: 'text-amber-600 dark:text-amber-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  rose: 'text-rose-600 dark:text-rose-400',
  teal: 'text-teal-600 dark:text-teal-400',
}

function Kpi({
  icon: Icon,
  label,
  valor,
  cor,
}: {
  icon: typeof Wallet
  label: string
  valor: number
  cor: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-400">
        <Icon className={`h-3.5 w-3.5 ${KPI_COR[cor]}`} /> {label}
      </div>
      <div className={`mt-1 text-xl font-bold tabular-nums ${KPI_COR[cor]}`}>R$ {moeda(valor)}</div>
    </div>
  )
}

function FiltroCampo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  )
}

function IconBtn({
  title,
  onClick,
  className = '',
  children,
}: {
  title: string
  onClick: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
    >
      {children}
    </button>
  )
}
