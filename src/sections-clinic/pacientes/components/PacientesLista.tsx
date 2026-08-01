import { useMemo } from 'react'
import { Archive, ArchiveRestore, Building2, Eye, Pencil, Search, UserPlus, Users } from 'lucide-react'
import type {
  ClinicaCtx,
  FiltroPacientes,
  MedicoVinculo,
  PacienteClinica,
} from '@/../product-clinic/sections/pacientes/types'
import { AVATAR_COR, STATUS_APP_META, dataCurta } from './helpers'

/**
 * O que a persona logada pode ver desta tela.
 *
 * `clinico` = médico: a lista inteira. `administrativo` = recepção, que cadastra e agenda mas
 * **não pode ver diagnóstico** (LGPD Art. 11) — condição crônica sai da linha, da busca e do
 * cadastro. O resto da tela é idêntico, por isso é um recorte e não uma segunda tela.
 */
export type EscopoPacientes = 'clinico' | 'administrativo'

interface Props {
  ctx: ClinicaCtx
  /** Default `clinico`: quem não passa escopo é o médico. */
  escopo?: EscopoPacientes
  pacientes: PacienteClinica[]
  filtro: FiltroPacientes
  onFiltro: (f: FiltroPacientes) => void
  onAbrir: (id: string) => void
  onEditar: (id: string) => void
  onArquivar: (id: string) => void
  onDesarquivar: (id: string) => void
  arquivados: Set<string>
  verArquivados: boolean
  onVerArquivados: (v: boolean) => void
  onNovo: () => void
}

export function PacientesLista({
  ctx,
  escopo = 'clinico',
  pacientes,
  filtro,
  onFiltro,
  onAbrir,
  onEditar,
  onArquivar,
  onDesarquivar,
  arquivados,
  verArquivados,
  onVerArquivados,
  onNovo,
}: Props) {
  const clinico = escopo === 'clinico'

  const totalArquivados = useMemo(
    () => pacientes.filter((p) => arquivados.has(p.id)).length,
    [pacientes, arquivados],
  )
  const totalAtivos = pacientes.length - totalArquivados

  const filtrados = useMemo(() => {
    const q = filtro.busca.trim().toLowerCase()
    return pacientes.filter((p) => {
      if (arquivados.has(p.id) !== verArquivados) return false
      if (filtro.escopo === 'meus' && !p.equipe.some((m) => m.id === ctx.medicoLogadoId))
        return false
      if (
        filtro.especialidade !== 'todas' &&
        !p.equipe.some((m) => m.especialidade === filtro.especialidade)
      )
        return false
      if (filtro.statusApp !== 'todos' && p.statusApp !== filtro.statusApp) return false
      if (!q) return true
      if (p.nome.toLowerCase().includes(q)) return true
      // Buscar por condição revelaria o diagnóstico pelo resultado, mesmo sem exibi-lo na linha.
      return clinico && p.condicoesCronicas.some((c) => c.toLowerCase().includes(q))
    })
  }, [pacientes, filtro, ctx.medicoLogadoId, arquivados, verArquivados, clinico])

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Pacientes</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Building2 className="h-3.5 w-3.5" />
            {verArquivados
              ? `Arquivados · ${totalArquivados} paciente${totalArquivados === 1 ? '' : 's'}`
              : `Pool compartilhado da clínica · ${totalAtivos} paciente${totalAtivos === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          onClick={onNovo}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <UserPlus className="h-4 w-4" /> Novo paciente
        </button>
      </div>

      {/* Toolbar */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filtro.busca}
              onChange={(e) => onFiltro({ ...filtro, busca: e.target.value })}
              placeholder={clinico ? 'Buscar por nome ou condição…' : 'Buscar por nome…'}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          {/* Escopo toggle */}
          <div className="flex items-center gap-0.5 self-start rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            <EscopoBtn ativo={filtro.escopo === 'clinica'} onClick={() => onFiltro({ ...filtro, escopo: 'clinica' })}>
              <Users className="h-3.5 w-3.5" /> Toda a clínica
            </EscopoBtn>
            <EscopoBtn ativo={filtro.escopo === 'meus'} onClick={() => onFiltro({ ...filtro, escopo: 'meus' })}>
              Meus pacientes
            </EscopoBtn>
          </div>
        </div>
        {/* Especialidade chips + toggle arquivados */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            <Chip ativo={filtro.especialidade === 'todas'} onClick={() => onFiltro({ ...filtro, especialidade: 'todas' })}>
              Todas
            </Chip>
            {ctx.especialidades.map((e) => (
              <Chip key={e} ativo={filtro.especialidade === e} onClick={() => onFiltro({ ...filtro, especialidade: e })}>
                {e}
              </Chip>
            ))}
          </div>
          {/* Ativos / Arquivados */}
          <div className="flex items-center gap-0.5 self-start rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            <EscopoBtn ativo={!verArquivados} onClick={() => onVerArquivados(false)}>
              Ativos · {totalAtivos}
            </EscopoBtn>
            <EscopoBtn ativo={verArquivados} onClick={() => onVerArquivados(true)}>
              <Archive className="h-3.5 w-3.5" /> Arquivados · {totalArquivados}
            </EscopoBtn>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        {filtrados.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            {verArquivados ? 'Nenhum paciente arquivado.' : 'Nenhum paciente encontrado.'}
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtrados.map((p) => (
              <li
                key={p.id}
                className="group flex items-center bg-white transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-400 text-sm font-semibold text-white">
                    {p.iniciais}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {p.nome}
                      </span>
                      <span className="text-xs text-slate-400">{p.idade}a</span>
                    </div>
                    {clinico && (
                    <div className="mt-0.5 flex flex-wrap items-center gap-1">
                      {p.condicoesCronicas.length > 0 ? (
                        p.condicoesCronicas.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">sem condições crônicas</span>
                      )}
                      {p.condicoesCronicas.length > 2 && (
                        <span className="text-[10px] text-slate-400">+{p.condicoesCronicas.length - 2}</span>
                      )}
                    </div>
                    )}
                  </div>

                  {/* Equipe de cuidado */}
                  <div className="hidden shrink-0 sm:block">
                    <EquipeStack equipe={p.equipe} />
                  </div>

                  {/* Consultas */}
                  <div className="hidden w-28 shrink-0 text-right md:block">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      próx. {dataCurta(p.proximaConsultaEm)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {p.proximaEspecialidade ?? '—'}
                    </div>
                  </div>

                  {/* Status app */}
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-medium ${STATUS_APP_META[p.statusApp].badge}`}
                  >
                    {STATUS_APP_META[p.statusApp].label}
                  </span>
                </div>

                {/* Ações */}
                <div className="flex shrink-0 items-center gap-1 pr-3">
                  <button
                    onClick={() => onAbrir(p.id)}
                    title="Visualizar"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-teal-600 dark:hover:bg-slate-700 dark:hover:text-teal-400"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditar(p.id)}
                    title="Editar cadastro"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-teal-600 dark:hover:bg-slate-700 dark:hover:text-teal-400"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {verArquivados ? (
                    <button
                      onClick={() => onDesarquivar(p.id)}
                      title="Reativar paciente"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                    >
                      <ArchiveRestore className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onArquivar(p.id)}
                      title="Arquivar paciente"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-950/40 dark:hover:text-amber-400"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function EquipeStack({ equipe }: { equipe: MedicoVinculo[] }) {
  const visiveis = equipe.slice(0, 3)
  const resto = equipe.length - visiveis.length
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visiveis.map((m) => (
          <span
            key={m.id}
            title={`${m.nome} · ${m.especialidade}`}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white dark:ring-slate-900 ${AVATAR_COR[m.cor]}`}
          >
            {m.iniciais}
          </span>
        ))}
      </div>
      {resto > 0 && (
        <span className="ml-1 text-[11px] font-medium text-slate-400">+{resto}</span>
      )}
    </div>
  )
}

function EscopoBtn({
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
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        ativo
          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
      }`}
    >
      {children}
    </button>
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
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  )
}
