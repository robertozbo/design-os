import { Pill, Plus, RotateCw, Search, ShieldCheck, Smartphone } from 'lucide-react'
import type {
  FiltroStatus,
  PrescricaoData,
  PrescricaoItem,
} from '@/../product-clinic/sections/prescricao/types'
import { BADGE_COR, STATUS_META, TIPO_META, validadeLabel } from './helpers'

const FILTROS: { value: FiltroStatus; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'ativa', label: 'Ativas' },
  { value: 'precisa_renovar', label: 'Precisam renovar' },
  { value: 'expirada', label: 'Expiradas' },
  { value: 'cancelada', label: 'Canceladas' },
]

interface Props {
  dados: PrescricaoData
  busca: string
  filtro: FiltroStatus
  onBusca: (v: string) => void
  onFiltro: (f: FiltroStatus) => void
  onNova: () => void
  onAbrir: (p: PrescricaoItem) => void
  onRenovar: (p: PrescricaoItem) => void
}

export function PrescricaoListaView({
  dados,
  busca,
  filtro,
  onBusca,
  onFiltro,
  onNova,
  onAbrir,
  onRenovar,
}: Props) {
  const termo = busca.trim().toLowerCase()
  const lista = dados.prescricoes.filter((p) => {
    if (termo && !p.paciente.nome.toLowerCase().includes(termo)) return false
    if (filtro === 'todas') return true
    if (filtro === 'precisa_renovar') return p.precisaRenovar
    return p.status === filtro
  })

  const kpis = [
    { label: 'Ativas', valor: dados.kpis.ativas },
    { label: 'Precisam renovar', valor: dados.kpis.precisaRenovar },
    { label: 'Expiradas', valor: dados.kpis.expiradas },
    { label: 'Controladas', valor: dados.kpis.controladas },
  ]

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Prescrições</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Memed · ICP-Brasil · {dados.clinica}
          </p>
        </div>
        <button
          onClick={onNova}
          className="inline-flex items-center gap-1.5 self-start rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
        >
          <Plus className="h-4 w-4" /> Nova prescrição
        </button>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-[11px] uppercase tracking-wide text-slate-400">{k.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
              {k.valor}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => onBusca(e.target.value)}
            placeholder="Buscar paciente…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFiltro(f.value)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                filtro === f.value
                  ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="mt-3 space-y-2">
        {lista.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
            Nenhuma prescrição com esses filtros.
          </div>
        ) : (
          lista.map((p) => (
            <PrescricaoRow
              key={p.id}
              p={p}
              onClick={() => onAbrir(p)}
              onRenovar={() => onRenovar(p)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function PrescricaoRow({
  p,
  onClick,
  onRenovar,
}: {
  p: PrescricaoItem
  onClick: () => void
  onRenovar: () => void
}) {
  const status = STATUS_META[p.status]
  const tipo = TIPO_META[p.tipo]
  const validade = validadeLabel(p.diasAteVencer)
  const principal = p.medicamentos[0]
  const extras = p.medicamentos.length - 1

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border bg-white p-3.5 transition-all dark:bg-slate-900 ${
        p.precisaRenovar
          ? 'border-amber-200 dark:border-amber-900/50'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <button onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Pill className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {p.paciente.nome}
            </span>
            <span className="shrink-0 text-[11px] text-slate-400">{p.paciente.idade}a</span>
          </div>
          <div className={`truncate text-[11px] ${status.riscado ? 'text-slate-400 line-through' : 'text-slate-500 dark:text-slate-400'}`}>
            {principal.nome}
            {extras > 0 && ` +${extras}`}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tipo.chip}`}>
              {tipo.label}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${BADGE_COR[p.prescritor.cor]}`}
            >
              {p.prescritor.especialidade}
            </span>
            {p.validadeICP && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <ShieldCheck className="h-2.5 w-2.5" /> ICP-Brasil
              </span>
            )}
            {p.entregueNoApp && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Smartphone className="h-2.5 w-2.5" /> no app
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Status + validade + renovar */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${status.chip}`}>
          {status.label}
        </span>
        <span
          className={`text-[10px] font-medium ${
            validade.alerta ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
          }`}
        >
          {validade.texto}
        </span>
        {p.precisaRenovar && (
          <button
            onClick={onRenovar}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-amber-600"
          >
            <RotateCw className="h-3 w-3" /> Renovar
          </button>
        )}
      </div>
    </div>
  )
}
