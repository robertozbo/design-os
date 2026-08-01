import { FileText, Search, Smartphone, Sparkles, Video } from 'lucide-react'
import type {
  AtendimentoItem,
  AtendimentosData,
  Modalidade,
  Periodo,
  StatAtendimento,
} from '@/../product-clinic/sections/atendimentos/types'
import { BADGE_COR } from './helpers'

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
]

type FiltroMod = 'todas' | Modalidade

interface Props {
  dados: AtendimentosData
  busca: string
  filtroMod: FiltroMod
  soIA: boolean
  onPeriodo: (p: Periodo) => void
  onBusca: (v: string) => void
  onFiltroMod: (f: FiltroMod) => void
  onToggleIA: () => void
  onAbrir: (a: AtendimentoItem) => void
}

export function AtendimentosView({
  dados,
  busca,
  filtroMod,
  soIA,
  onPeriodo,
  onBusca,
  onFiltroMod,
  onToggleIA,
  onAbrir,
}: Props) {
  const termo = busca.trim().toLowerCase()
  const lista = dados.atendimentos.filter((a) => {
    if (termo && !a.paciente.nome.toLowerCase().includes(termo)) return false
    if (filtroMod !== 'todas' && a.modalidade !== filtroMod) return false
    if (soIA && !a.geradoPorIA) return false
    return true
  })

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Atendimentos</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Consultas assinadas · {dados.medico}
          </p>
        </div>
        <div className="flex items-center gap-0.5 self-start rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodo(p.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                dados.periodo === p.value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {dados.stats.map((s) => (
          <StatCard key={s.id} stat={s} />
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
        <div className="flex items-center gap-1.5">
          {(['todas', 'presencial', 'tele'] as FiltroMod[]).map((f) => (
            <button
              key={f}
              onClick={() => onFiltroMod(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filtroMod === f
                  ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {f === 'todas' ? 'Todas' : f === 'tele' ? 'Tele' : 'Presencial'}
            </button>
          ))}
          <button
            onClick={onToggleIA}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              soIA
                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Só IA
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {lista.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            Nenhum atendimento com esses filtros.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {lista.map((a) => (
              <AtendimentoRow key={a.id} item={a} onClick={() => onAbrir(a)} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2 px-1 text-[11px] text-slate-400">
        {lista.length} de {dados.atendimentos.length} atendimentos
      </div>
    </div>
  )
}

function StatCard({ stat }: { stat: StatAtendimento }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{stat.label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">{stat.valor}</div>
      <div className="mt-0.5 text-[11px] text-slate-400">{stat.sub}</div>
    </div>
  )
}

function AtendimentoRow({ item, onClick }: { item: AtendimentoItem; onClick: () => void }) {
  return (
    <li className="flex items-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left">
        {/* Data/hora */}
        <div className="w-14 shrink-0 text-center">
          <div className="text-xs font-medium text-slate-700 dark:text-slate-200">{item.data}</div>
          <div className="text-[10px] font-mono tabular-nums text-slate-400">{item.hora}</div>
        </div>

        {/* Paciente */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {item.paciente.iniciais}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {item.paciente.nome}
            </span>
            <span className="shrink-0 text-[11px] text-slate-400">{item.paciente.idade}a</span>
          </div>
          <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">{item.motivo}</div>
        </div>

        {/* Meta */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${BADGE_COR[item.cor]}`}
          >
            {item.especialidade}
          </span>
          {item.modalidade === 'tele' && (
            <Video className="h-3.5 w-3.5 text-sky-500" aria-label="Teleconsulta" />
          )}
          {item.geradoPorIA && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-50 px-1.5 py-0.5 text-[9px] font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              <Sparkles className="h-2.5 w-2.5" /> IA
            </span>
          )}
        </div>
        {/* Sempre presente: apagado quando não conectado — ausência de ícone seria ambígua. */}
        <span
          title={
            item.pacienteVinculado
              ? `${item.paciente.nome} usa o app Nymos — dados compartilhados entre consultas`
              : `${item.paciente.nome} não está conectado ao app`
          }
          className={`shrink-0 ${
            item.pacienteVinculado
              ? 'text-emerald-500 dark:text-emerald-400'
              : 'text-slate-300 dark:text-slate-600'
          }`}
        >
          <Smartphone className="h-4 w-4" strokeWidth={1.75} />
          <span className="sr-only">
            {item.pacienteVinculado ? 'Paciente vinculado ao app' : 'Paciente não conectado ao app'}
          </span>
        </span>
        <div className="w-12 shrink-0 text-right text-[11px] font-mono tabular-nums text-slate-400">
          {item.duracaoMin}min
        </div>
      </div>

      {/* Abrir no prontuário — botão rotulado: o ícone sozinho não dizia pra onde levava */}
      <button
        onClick={onClick}
        className="mr-3 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
      >
        <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
        Prontuário
      </button>
    </li>
  )
}
