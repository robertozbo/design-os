import { useMemo, useState } from 'react'
import { ChevronDown, FileText, Pill, Plus, Search } from 'lucide-react'
import type {
  FiltroLista,
  FiltroStatus,
  PeriodoFiltro,
  PrescricaoListaProps,
} from '@/../product-clinico/sections/prescricao/types'
import { FILTRO_STATUS_OPCOES, PERIODO_OPCOES, pluralReceitas } from './helpers'
import { PrescricaoRow } from './PrescricaoRow'

const PERIODO_DIAS: Record<PeriodoFiltro, number | null> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  tudo: null,
}

export function PrescricaoLista({
  filtroAtivo,
  kpis,
  prescricoesLista,
  onSelectPrescricao,
  onAbrirRenovacao,
  onAbrirNovaPrescricao,
  onChangeFiltro,
}: Pick<
  PrescricaoListaProps,
  | 'filtroAtivo'
  | 'kpis'
  | 'prescricoesLista'
  | 'onSelectPrescricao'
  | 'onAbrirRenovacao'
  | 'onAbrirNovaPrescricao'
  | 'onChangeFiltro'
>) {
  const [periodoOpen, setPeriodoOpen] = useState(false)

  const setBusca = (busca: string) =>
    onChangeFiltro?.({ ...filtroAtivo, busca })

  const togglePeriodo = (periodo: PeriodoFiltro) => {
    onChangeFiltro?.({ ...filtroAtivo, periodo })
    setPeriodoOpen(false)
  }

  const toggleStatus = (s: FiltroStatus) => {
    const next: FiltroStatus[] = filtroAtivo.status.includes(s)
      ? filtroAtivo.status.filter((x) => x !== s)
      : [...filtroAtivo.status, s]
    onChangeFiltro?.({ ...filtroAtivo, status: next })
  }

  const limparFiltros = () =>
    onChangeFiltro?.({ busca: '', status: [], periodo: '30d' })

  const filtroPrecisaRenovarAtivo = filtroAtivo.status.includes('precisa_renovar')

  const filtrados = useMemo(() => {
    const q = filtroAtivo.busca.trim().toLowerCase()
    const dias = PERIODO_DIAS[filtroAtivo.periodo]
    const corte = dias != null ? Date.now() - dias * 24 * 60 * 60 * 1000 : null

    return prescricoesLista.filter((p) => {
      if (q) {
        const inPaciente = p.pacienteNome.toLowerCase().includes(q)
        const inMed = p.medicamentosResumo.some((m) => m.nome.toLowerCase().includes(q))
        if (!inPaciente && !inMed) return false
      }
      if (corte != null) {
        const ts = new Date(`${p.dataEmissao}T12:00:00`).getTime()
        if (ts < corte) return false
      }
      if (filtroAtivo.status.length === 0) return true

      const matchesStatus = filtroAtivo.status.some((s) => {
        if (s === 'precisa_renovar') return p.precisaRenovar
        return p.status === s
      })
      return matchesStatus
    })
  }, [prescricoesLista, filtroAtivo])

  const temFiltro =
    !!filtroAtivo.busca || filtroAtivo.status.length > 0 || filtroAtivo.periodo !== '30d'

  const periodoLabel =
    PERIODO_OPCOES.find((p) => p.id === filtroAtivo.periodo)?.label ?? '30 dias'

  return (
    <div
      data-clinico-prescricao-lista
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Prescrição
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {pluralReceitas(prescricoesLista.length)}
              {kpis.precisaRenovar > 0 && (
                <>
                  {' · '}
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    {kpis.precisaRenovar} precisa{kpis.precisaRenovar === 1 ? '' : 'm'} renovar
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => onAbrirNovaPrescricao?.('')}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors
              hover:bg-teal-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            "
          >
            <Plus className="size-4" />
            Nova prescrição
          </button>
        </header>

        {/* KPIs */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi
            label="Ativas"
            valor={kpis.ativas}
            icon={<Pill className="size-3.5" />}
            tone="emerald"
          />
          <Kpi
            label="Precisa renovar"
            valor={kpis.precisaRenovar}
            tone="amber"
            interactive
            ativo={filtroPrecisaRenovarAtivo}
            onClick={() => toggleStatus('precisa_renovar')}
          />
          <Kpi label="Expiradas" valor={kpis.expiradas} tone="slate" />
          <Kpi label="Canceladas (30d)" valor={kpis.canceladasUlt30d} tone="slate" />
        </div>

        {/* Filtros */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por paciente ou medicação…"
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
            {FILTRO_STATUS_OPCOES.map((opt) => {
              const ativo = filtroAtivo.status.includes(opt.id)
              const baseClasses = ativo
                ? opt.alerta
                  ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  : 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleStatus(opt.id)}
                  className={`
                    inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all
                    ${baseClasses}
                  `}
                >
                  {opt.alerta && (
                    <span
                      className={`size-1.5 rounded-full ${
                        ativo ? 'bg-amber-500' : 'bg-amber-400'
                      }`}
                    />
                  )}
                  {opt.label}
                </button>
              )
            })}

            <div className="relative">
              <button
                onClick={() => setPeriodoOpen((o) => !o)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600"
              >
                {periodoLabel}
                <ChevronDown className="size-3" />
              </button>
              {periodoOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  {PERIODO_OPCOES.map((p) => {
                    const ativo = filtroAtivo.periodo === p.id
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePeriodo(p.id)}
                        className={`
                          flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors
                          ${
                            ativo
                              ? 'bg-teal-50 font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                              : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                          }
                        `}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {temFiltro && (
              <button
                onClick={limparFiltros}
                className="text-xs font-medium text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <FileText className="size-5" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {prescricoesLista.length === 0
                ? 'Nenhuma receita ainda'
                : 'Nenhuma receita com esses filtros'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {prescricoesLista.length === 0
                ? 'Emita pelo fluxo de Consulta ou clique em + Nova prescrição.'
                : 'Tente ajustar os filtros ou limpar a busca.'}
            </p>
            {temFiltro && (
              <button
                onClick={limparFiltros}
                className="mt-1 inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {filtrados.map((p) => (
              <PrescricaoRow
                key={p.id}
                prescricao={p}
                highlightRenovar={filtroPrecisaRenovarAtivo}
                onAbrir={() => onSelectPrescricao?.(p.id)}
                onRenovar={() => onAbrirRenovacao?.(p.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Kpi({
  label,
  valor,
  icon,
  tone,
  interactive = false,
  ativo = false,
  onClick,
}: {
  label: string
  valor: number
  icon?: React.ReactNode
  tone: 'emerald' | 'amber' | 'slate'
  interactive?: boolean
  ativo?: boolean
  onClick?: () => void
}) {
  const toneClasses: Record<typeof tone, string> = {
    emerald:
      'border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white text-emerald-700 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-slate-900 dark:text-emerald-300',
    amber:
      'border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-white text-amber-800 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-slate-900 dark:text-amber-300',
    slate:
      'border-slate-200/80 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
  }
  const ativoClasses = ativo
    ? 'ring-2 ring-amber-500/60 dark:ring-amber-400/40 shadow-md'
    : ''

  const Component = interactive ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`
        rounded-2xl border p-3.5 text-left shadow-sm transition-all
        ${toneClasses[tone]}
        ${interactive ? 'hover:shadow-md cursor-pointer' : ''}
        ${ativoClasses}
      `}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider opacity-80">{label}</p>
        {icon && <span className="opacity-70">{icon}</span>}
      </div>
      <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{valor}</p>
    </Component>
  )
}
