import { Search, Plus, MailPlus, ChevronRight, Users } from 'lucide-react'
import type {
  PacientesListaProps,
  PacienteListItem,
  StatusApp,
} from '@/../product-clinico/sections/pacientes/types'
import { Avatar } from './Avatar'
import { PacienteAcoesMenu } from './PacienteAcoesMenu'
import {
  formatDataCurta,
  formatRelativo,
  STATUS_APP_LABEL,
  STATUS_APP_STYLE,
  STATUS_APP_DOT,
} from './helpers'

const STATUS_OPCOES: StatusApp[] = ['vinculado', 'convite-pendente', 'nao-convidado']

export function PacientesLista({
  pacientes,
  filtroAtivo,
  onAplicarFiltro,
  onLimparFiltros,
  onAbrirPaciente,
  onCadastrarNovo,
  onConvidarApp,
  onEditarPaciente,
  onExcluirPaciente,
}: PacientesListaProps) {
  const toggleStatus = (s: StatusApp) => {
    const novo = filtroAtivo.statusApp.includes(s)
      ? filtroAtivo.statusApp.filter((x) => x !== s)
      : [...filtroAtivo.statusApp, s]
    onAplicarFiltro?.({ ...filtroAtivo, statusApp: novo })
  }

  const setBusca = (busca: string) => {
    onAplicarFiltro?.({ ...filtroAtivo, busca })
  }

  // Apply filters
  const pacientesFiltrados = pacientes.filter((p) => {
    if (
      filtroAtivo.busca &&
      !p.nome.toLowerCase().includes(filtroAtivo.busca.toLowerCase())
    )
      return false
    if (
      filtroAtivo.statusApp.length > 0 &&
      !filtroAtivo.statusApp.includes(p.statusApp)
    )
      return false
    return true
  })

  const temFiltro =
    filtroAtivo.busca || filtroAtivo.statusApp.length > 0 || filtroAtivo.condicoes.length > 0 || filtroAtivo.convenios.length > 0

  return (
    <div
      data-clinico-pacientes-lista
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Pacientes
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {pacientes.length} pacientes ativos · {pacientes.filter((p) => p.statusApp === 'vinculado').length} usam o app
            </p>
          </div>
          <button
            onClick={onCadastrarNovo}
            className="
              inline-flex items-center justify-center gap-1.5 rounded-lg
              bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm
              transition-all hover:bg-teal-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
              dark:focus:ring-offset-slate-950
            "
          >
            <Plus className="size-4" />
            Novo paciente
          </button>
        </header>

        {/* Search + Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome…"
              value={filtroAtivo.busca}
              onChange={(e) => setBusca(e.target.value)}
              className="
                w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm
                placeholder:text-slate-400
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500
              "
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_OPCOES.map((s) => {
              const ativo = filtroAtivo.statusApp.includes(s)
              return (
                <button
                  key={s}
                  onClick={() => toggleStatus(s)}
                  className={`
                    inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all
                    ${
                      ativo
                        ? `${STATUS_APP_STYLE[s]} ring-2 ring-offset-1 ring-slate-300 dark:ring-slate-700 dark:ring-offset-slate-950`
                        : `${STATUS_APP_STYLE[s]} opacity-60 hover:opacity-100`
                    }
                  `}
                >
                  <span className={`size-1.5 rounded-full ${STATUS_APP_DOT[s]}`} />
                  {STATUS_APP_LABEL[s]}
                </button>
              )
            })}
            {temFiltro && (
              <button
                onClick={onLimparFiltros}
                className="text-xs font-medium text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {pacientesFiltrados.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-left dark:border-slate-800 dark:bg-slate-900/40">
                      <Th>Paciente</Th>
                      <Th>Idade</Th>
                      <Th className="hidden lg:table-cell">Condições</Th>
                      <Th>Última</Th>
                      <Th>Próxima</Th>
                      <Th>App</Th>
                      <Th className="text-right">{''}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientesFiltrados.map((p) => (
                      <PacienteRow
                        key={p.id}
                        p={p}
                        onAbrir={() => onAbrirPaciente?.(p.id)}
                        onConvidar={() => onConvidarApp?.(p.id)}
                        onEditar={() => onEditarPaciente?.(p.id)}
                        onExcluir={() => onExcluirPaciente?.(p.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="space-y-2 p-2 md:hidden">
                {pacientesFiltrados.map((p) => (
                  <PacienteCard
                    key={p.id}
                    p={p}
                    onAbrir={() => onAbrirPaciente?.(p.id)}
                    onConvidar={() => onConvidarApp?.(p.id)}
                    onEditar={() => onEditarPaciente?.(p.id)}
                    onExcluir={() => onExcluirPaciente?.(p.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`
        px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400
        ${className}
      `}
    >
      {children}
    </th>
  )
}

function PacienteRow({
  p,
  onAbrir,
  onConvidar,
  onEditar,
  onExcluir,
}: {
  p: PacienteListItem
  onAbrir?: () => void
  onConvidar?: () => void
  onEditar?: () => void
  onExcluir?: () => void
}) {
  return (
    <tr
      onClick={onAbrir}
      className="
        cursor-pointer border-b border-slate-100 transition-colors
        hover:bg-teal-50/40
        dark:border-slate-800/60 dark:hover:bg-teal-950/20
      "
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar nome={p.nome} size="md" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-slate-100">{p.nome}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {p.genero === 'feminino' ? '♀' : '♂'} · {p.convenio}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm tabular-nums text-slate-700 dark:text-slate-300">
        {p.idade}
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {p.condicoesCronicas.slice(0, 2).map((c, i) => (
            <span
              key={i}
              className="
                inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0 text-[10px]
                text-slate-700
                dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
              "
            >
              {c}
            </span>
          ))}
          {p.condicoesCronicas.length > 2 && (
            <span className="text-[10px] text-slate-400">+{p.condicoesCronicas.length - 2}</span>
          )}
          {p.condicoesCronicas.length === 0 && (
            <span className="text-[10px] italic text-slate-400">—</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
        {formatRelativo(p.ultimaConsultaEm)}
      </td>
      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
        {p.proximaConsultaEm ? formatDataCurta(p.proximaConsultaEm) : '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`
              inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium
              ${STATUS_APP_STYLE[p.statusApp]}
            `}
          >
            <span className={`size-1.5 rounded-full ${STATUS_APP_DOT[p.statusApp]}`} />
            {STATUS_APP_LABEL[p.statusApp]}
          </span>
          {p.statusApp === 'nao-convidado' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onConvidar?.()
              }}
              className="
                rounded-md p-1 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-700
                dark:hover:bg-teal-950/40 dark:hover:text-teal-300
              "
              aria-label="Convidar pro app"
              title="Convidar pro app"
            >
              <MailPlus className="size-3.5" />
            </button>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <PacienteAcoesMenu onEditar={onEditar} onExcluir={onExcluir} />
          <ChevronRight className="size-4 text-slate-300 dark:text-slate-600" />
        </div>
      </td>
    </tr>
  )
}

function PacienteCard({
  p,
  onAbrir,
  onConvidar,
  onEditar,
  onExcluir,
}: {
  p: PacienteListItem
  onAbrir?: () => void
  onConvidar?: () => void
  onEditar?: () => void
  onExcluir?: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onAbrir}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onAbrir?.()
      }}
      className="
        block w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-3 text-left
        transition-all hover:border-teal-300 hover:shadow-sm
        focus:outline-none focus:ring-2 focus:ring-teal-500/40
        dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
      "
    >
      <div className="flex items-start gap-3">
        <Avatar nome={p.nome} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate font-medium text-slate-900 dark:text-slate-100">{p.nome}</p>
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-[10px] tabular-nums text-slate-400">{p.idade} a</span>
              <PacienteAcoesMenu onEditar={onEditar} onExcluir={onExcluir} />
            </div>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-500">{p.convenio}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span
              className={`
                inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium
                ${STATUS_APP_STYLE[p.statusApp]}
              `}
            >
              <span className={`size-1.5 rounded-full ${STATUS_APP_DOT[p.statusApp]}`} />
              {STATUS_APP_LABEL[p.statusApp]}
            </span>
            {p.statusApp === 'nao-convidado' && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onConvidar?.()
                }}
                className="text-[10px] font-medium text-teal-600 hover:underline"
              >
                Convidar
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <Users className="size-5" />
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Nenhum paciente encontrado
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Ajuste os filtros ou cadastre seu primeiro paciente.
      </p>
    </div>
  )
}
