import { useMemo } from 'react'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Pencil,
  Plus,
  Power,
  Trash2,
} from 'lucide-react'
import type {
  CategoriasData,
  Comportamento,
  TipoFinanceiro,
} from '@/../product-medical-clinic/sections/categorias-financeiras/types'
import { COMPORTAMENTO_META } from './helpers'

export type FiltroComp = 'todas' | Comportamento

interface Props {
  dados: CategoriasData
  tipos: TipoFinanceiro[]
  filtroDespesa: FiltroComp
  onFiltroDespesa: (f: FiltroComp) => void
  onNovo: () => void
  onEditar: (t: TipoFinanceiro) => void
  onExcluir: (t: TipoFinanceiro) => void
  onToggleAtivo: (t: TipoFinanceiro) => void
}

export function CategoriasView({
  dados,
  tipos,
  filtroDespesa,
  onFiltroDespesa,
  onNovo,
  onEditar,
  onExcluir,
  onToggleAtivo,
}: Props) {
  const receitas = useMemo(
    () => tipos.filter((t) => t.natureza === 'receita'),
    [tipos],
  )
  const despesas = useMemo(
    () =>
      tipos
        .filter((t) => t.natureza === 'despesa')
        .filter((t) => filtroDespesa === 'todas' || t.comportamento === filtroDespesa),
    [tipos, filtroDespesa],
  )

  const fixas = tipos.filter((t) => t.natureza === 'despesa' && t.comportamento === 'fixa').length
  const variaveis = tipos.filter((t) => t.natureza === 'despesa' && t.comportamento === 'variavel').length

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Tipos de conta</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Categorias de receita e despesa da clínica · {receitas.length} receitas · {fixas} fixas ·{' '}
            {variaveis} variáveis
          </p>
        </div>
        <button
          onClick={onNovo}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Adicionar tipo
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* RECEITAS */}
        <Painel
          titulo="Tipos de receita"
          icon={<ArrowUpCircle className="h-4 w-4 text-emerald-500" />}
          grupos={dados.gruposReceita}
          itens={receitas}
          onEditar={onEditar}
          onExcluir={onExcluir}
          onToggleAtivo={onToggleAtivo}
        />

        {/* DESPESAS */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <ArrowDownCircle className="h-4 w-4 text-rose-500" /> Tipos de despesa
            </h2>
            <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
              {(['todas', 'fixa', 'variavel'] as FiltroComp[]).map((f) => (
                <button
                  key={f}
                  onClick={() => onFiltroDespesa(f)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    filtroDespesa === f
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {f === 'todas' ? 'Todas' : f === 'fixa' ? 'Fixas' : 'Variáveis'}
                </button>
              ))}
            </div>
          </div>
          <Painel
            grupos={dados.gruposDespesa}
            itens={despesas}
            onEditar={onEditar}
            onExcluir={onExcluir}
            onToggleAtivo={onToggleAtivo}
          />
        </div>
      </div>
    </div>
  )
}

function Painel({
  titulo,
  icon,
  grupos,
  itens,
  onEditar,
  onExcluir,
  onToggleAtivo,
}: {
  titulo?: string
  icon?: React.ReactNode
  grupos: string[]
  itens: TipoFinanceiro[]
  onEditar: (t: TipoFinanceiro) => void
  onExcluir: (t: TipoFinanceiro) => void
  onToggleAtivo: (t: TipoFinanceiro) => void
}) {
  const gruposComItens = grupos.filter((g) => itens.some((t) => t.grupo === g))
  return (
    <div>
      {titulo && (
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {icon} {titulo}
        </h2>
      )}
      <div className="space-y-3">
        {gruposComItens.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 dark:border-slate-700">
            Nenhum tipo aqui.
          </div>
        ) : (
          gruposComItens.map((g) => (
            <div key={g} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                {g}
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {itens
                  .filter((t) => t.grupo === g)
                  .map((t) => (
                    <li
                      key={t.id}
                      className={`flex items-center gap-2 px-3 py-2 ${t.ativo ? '' : 'opacity-45'}`}
                    >
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-slate-200">
                        {t.nome}
                      </span>
                      {t.comportamento && (
                        <span
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${COMPORTAMENTO_META[t.comportamento].badge}`}
                        >
                          {COMPORTAMENTO_META[t.comportamento].label}
                        </span>
                      )}
                      <div className="flex shrink-0 items-center gap-0.5">
                        <IconBtn title="Editar" onClick={() => onEditar(t)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </IconBtn>
                        {t.padrao ? (
                          <IconBtn
                            title={t.ativo ? 'Desativar' : 'Reativar'}
                            onClick={() => onToggleAtivo(t)}
                            className={t.ativo ? 'hover:text-amber-600' : 'hover:text-emerald-600'}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </IconBtn>
                        ) : (
                          <IconBtn
                            title="Excluir"
                            onClick={() => onExcluir(t)}
                            className="hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </IconBtn>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
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
      className={`rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
    >
      {children}
    </button>
  )
}
