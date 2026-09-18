import { useMemo } from 'react'
import { AlertTriangle, Pencil, Plus, Power, Search, ShieldCheck, Users } from 'lucide-react'
import type {
  Convenio,
  FiltroConvenio,
  ResumoConvenios,
} from '@/../product-clinic/sections/convenios/types'
import { detectarParecidos, inteiro } from './helpers'

interface Props {
  resumo: ResumoConvenios
  convenios: Convenio[]
  filtro: FiltroConvenio
  busca: string
  onFiltro: (f: FiltroConvenio) => void
  onBusca: (q: string) => void
  onNovo: () => void
  onEditar: (c: Convenio) => void
  onToggleAtivo: (c: Convenio) => void
}

export function ConveniosView({
  resumo,
  convenios,
  filtro,
  busca,
  onFiltro,
  onBusca,
  onNovo,
  onEditar,
  onToggleAtivo,
}: Props) {
  const parecidos = useMemo(() => detectarParecidos(convenios), [convenios])

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return convenios.filter((c) => {
      if (filtro === 'ativos' && !c.ativo) return false
      if (filtro === 'inativos' && c.ativo) return false
      if (q && !c.nome.toLowerCase().includes(q) && !(c.codigoAns ?? '').includes(q)) return false
      return true
    })
  }, [convenios, filtro, busca])

  const vazioTotal = convenios.length === 0

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Convênios</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {resumo.ativos} ativos · {inteiro(resumo.conveniados)} pacientes conveniados ·{' '}
            {inteiro(resumo.particulares)} particulares
          </p>
        </div>
        <button
          onClick={onNovo}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Adicionar convênio
        </button>
      </div>

      {/* Filtros */}
      {!vazioTotal && (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={busca}
              onChange={(e) => onBusca(e.target.value)}
              placeholder="Buscar por nome ou registro ANS…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <Chip ativo={filtro === 'todos'} onClick={() => onFiltro('todos')}>
              Todos
            </Chip>
            <Chip ativo={filtro === 'ativos'} onClick={() => onFiltro('ativos')}>
              Ativos
            </Chip>
            <Chip ativo={filtro === 'inativos'} onClick={() => onFiltro('inativos')}>
              Inativos
            </Chip>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="mt-4">
        {vazioTotal ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <ShieldCheck className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              Nenhum convênio cadastrado
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-400 dark:text-slate-500">
              O convênio normalmente nasce no cadastro do paciente — a recepção digita o nome e ele
              entra no catálogo. Esta tela é onde ele é arrumado depois.
            </p>
            <button
              onClick={onNovo}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" /> Adicionar mesmo assim
            </button>
          </div>
        ) : lista.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
            Nenhum convênio encontrado.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {lista.map((c) => {
                const parecido = parecidos.get(c.id)
                return (
                  <li key={c.id} className="bg-white px-4 py-3 dark:bg-slate-900">
                    <div className={`flex items-center gap-3 ${c.ativo ? '' : 'opacity-60'}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                            {c.nome}
                          </span>
                          {c.codigoAns ? (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] tabular-nums text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                              <ShieldCheck className="h-3 w-3" /> ANS {c.codigoAns}
                            </span>
                          ) : (
                            <span className="shrink-0 text-[11px] text-slate-300 dark:text-slate-600">
                              sem ANS
                            </span>
                          )}
                          {!c.ativo && (
                            <span className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                              Inativo
                            </span>
                          )}
                        </div>
                        {parecido && (
                          <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            Nome parecido com{' '}
                            <button
                              onClick={() => onEditar(parecido)}
                              className="font-medium underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-300"
                            >
                              {parecido.nome}
                            </button>
                            <span className="text-amber-600/70 dark:text-amber-500/70">
                              ({inteiro(parecido.pacientes)} pacientes) — corrija a grafia e desative
                              o repetido
                            </span>
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-flex w-32 shrink-0 items-center justify-end gap-1.5 whitespace-nowrap tabular-nums ${
                          c.pacientes === 0
                            ? 'text-[11px] text-slate-300 dark:text-slate-600'
                            : 'text-sm font-semibold text-slate-900 dark:text-slate-100'
                        }`}
                        title={
                          c.pacientes === 0
                            ? 'Sem pacientes — pode desativar sem consequência'
                            : `${inteiro(c.pacientes)} pacientes neste convênio`
                        }
                      >
                        <Users className="h-3.5 w-3.5" />
                        {c.pacientes === 0 ? 'sem pacientes' : inteiro(c.pacientes)}
                      </span>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <IconBtn title="Editar" onClick={() => onEditar(c)}>
                          <Pencil className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn
                          title={c.ativo ? 'Desativar' : 'Reativar'}
                          onClick={() => onToggleAtivo(c)}
                          className={c.ativo ? 'hover:text-amber-600' : 'hover:text-emerald-600'}
                        >
                          <Power className="h-4 w-4" />
                        </IconBtn>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {!vazioTotal && (
        <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
          Desativar tira o convênio da oferta de novos cadastros. Quem já está nele continua nele —
          por isso não existe excluir.
        </p>
      )}
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
