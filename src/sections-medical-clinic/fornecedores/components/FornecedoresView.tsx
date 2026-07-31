import { useMemo } from 'react'
import { Building2, Mail, MapPin, Pencil, Phone, Plus, Power, Search, Trash2 } from 'lucide-react'
import type {
  Fornecedor,
  FornecedoresData,
} from '@/../product-medical-clinic/sections/fornecedores/types'
import { soDigitos } from './helpers'

interface Props {
  dados: FornecedoresData
  fornecedores: Fornecedor[]
  busca: string
  onBusca: (v: string) => void
  onNovo: () => void
  onEditar: (f: Fornecedor) => void
  onExcluir: (f: Fornecedor) => void
  onToggleAtivo: (f: Fornecedor) => void
}

export function FornecedoresView({
  dados,
  fornecedores,
  busca,
  onBusca,
  onNovo,
  onEditar,
  onExcluir,
  onToggleAtivo,
}: Props) {
  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    const qd = soDigitos(busca)
    if (!q) return fornecedores
    return fornecedores.filter(
      (f) =>
        f.razaoSocial.toLowerCase().includes(q) ||
        f.nomeFantasia.toLowerCase().includes(q) ||
        (qd && soDigitos(f.cnpj).includes(qd)) ||
        (qd && soDigitos(f.telefone).includes(qd)),
    )
  }, [fornecedores, busca])

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Fornecedores</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {fornecedores.filter((f) => f.ativo).length} ativos · consulta de CNPJ
          </p>
        </div>
        <button
          onClick={onNovo}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Adicionar fornecedor
        </button>
      </div>

      {/* Busca */}
      <div className="relative mt-5 sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          placeholder="Buscar por nome, CNPJ ou telefone…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
      </div>

      {/* Lista */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        {lista.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">Nenhum fornecedor encontrado.</div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {lista.map((f) => (
              <li
                key={f.id}
                className={`flex items-center gap-3 bg-white px-4 py-3 dark:bg-slate-900 ${f.ativo ? '' : 'opacity-45'}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {f.nomeFantasia}
                    </span>
                    <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {f.categoria}
                    </span>
                  </div>
                  <div className="truncate text-[11px] text-slate-400">{f.razaoSocial} · {f.cnpj}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {f.telefone || '—'}
                    </span>
                    {f.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {f.email}
                      </span>
                    )}
                    {f.cidade && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {f.cidade}/{f.uf}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <IconBtn title="Editar" onClick={() => onEditar(f)}>
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn
                    title={f.ativo ? 'Desativar' : 'Reativar'}
                    onClick={() => onToggleAtivo(f)}
                    className={f.ativo ? 'hover:text-amber-600' : 'hover:text-emerald-600'}
                  >
                    <Power className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn
                    title="Excluir"
                    onClick={() => onExcluir(f)}
                    className="hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-2 px-1 text-[11px] text-slate-400">
        {lista.length} de {fornecedores.length} · categorias: {dados.categorias.length}
      </p>
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
      aria-label={title}
      className={`rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
    >
      {children}
    </button>
  )
}
