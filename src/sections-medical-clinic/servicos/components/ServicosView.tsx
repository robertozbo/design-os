import { useMemo } from 'react'
import { Clock, Pencil, Plus, Power, Search, Trash2 } from 'lucide-react'
import type { Servico, ServicosData } from '@/../product-medical-clinic/sections/servicos/types'
import { moeda } from './helpers'

export interface FiltroServicos {
  categoria: 'todas' | string
  busca: string
}

interface Props {
  dados: ServicosData
  servicos: Servico[]
  filtro: FiltroServicos
  onFiltro: (f: FiltroServicos) => void
  onNovo: () => void
  onEditar: (s: Servico) => void
  onExcluir: (s: Servico) => void
  onToggleAtivo: (s: Servico) => void
}

export function ServicosView({
  dados,
  servicos,
  filtro,
  onFiltro,
  onNovo,
  onEditar,
  onExcluir,
  onToggleAtivo,
}: Props) {
  const lista = useMemo(() => {
    const q = filtro.busca.trim().toLowerCase()
    return servicos.filter((s) => {
      if (filtro.categoria !== 'todas' && s.categoria !== filtro.categoria) return false
      if (q && !s.nome.toLowerCase().includes(q)) return false
      return true
    })
  }, [servicos, filtro])

  const ativos = servicos.filter((s) => s.ativo)
  const ticket = ativos.length ? ativos.reduce((s, x) => s + x.preco, 0) / ativos.length : 0

  const gruposComItens = dados.categorias.filter((c) => lista.some((s) => s.categoria === c))

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Serviços</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Catálogo de faturamento · {ativos.length} ativos · ticket médio R$ {moeda(ticket)}
          </p>
        </div>
        <button
          onClick={onNovo}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Adicionar serviço
        </button>
      </div>

      {/* Filtros */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filtro.busca}
            onChange={(e) => onFiltro({ ...filtro, busca: e.target.value })}
            placeholder="Buscar serviço…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Chip ativo={filtro.categoria === 'todas'} onClick={() => onFiltro({ ...filtro, categoria: 'todas' })}>
            Todas
          </Chip>
          {dados.categorias.map((c) => (
            <Chip key={c} ativo={filtro.categoria === c} onClick={() => onFiltro({ ...filtro, categoria: c })}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {/* Lista agrupada */}
      <div className="mt-4 space-y-3">
        {gruposComItens.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
            Nenhum serviço encontrado.
          </div>
        ) : (
          gruposComItens.map((cat) => (
            <div key={cat} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                {cat}
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {lista
                  .filter((s) => s.categoria === cat)
                  .map((s) => (
                    <li
                      key={s.id}
                      className={`flex items-center gap-3 bg-white px-4 py-3 dark:bg-slate-900 ${s.ativo ? '' : 'opacity-45'}`}
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {s.nome}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        <Clock className="h-3 w-3" /> {s.duracaoMin} min
                      </span>
                      <span className="w-24 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        R$ {moeda(s.preco)}
                      </span>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <IconBtn title="Editar" onClick={() => onEditar(s)}>
                          <Pencil className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn
                          title={s.ativo ? 'Desativar' : 'Reativar'}
                          onClick={() => onToggleAtivo(s)}
                          className={s.ativo ? 'hover:text-amber-600' : 'hover:text-emerald-600'}
                        >
                          <Power className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn
                          title="Excluir"
                          onClick={() => onExcluir(s)}
                          className="hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconBtn>
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

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
        ativo
          ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
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
