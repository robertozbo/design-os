import { ChevronRight, FlaskConical, ScanLine, Search, Users } from 'lucide-react'
import type {
  CategoriaExame,
  ExameListItem,
  StatusRevisao,
} from '@/../product-clinic/sections/exames/types'
import { BADGE_COR, NIVEL_META, TENDENCIA_SETA } from './helpers'

type FiltroTipo = 'todos' | CategoriaExame
type FiltroStatus = 'todos' | StatusRevisao

interface Props {
  clinica: string
  exames: ExameListItem[]
  busca: string
  filtroTipo: FiltroTipo
  filtroStatus: FiltroStatus
  onBusca: (v: string) => void
  onFiltroTipo: (f: FiltroTipo) => void
  onFiltroStatus: (f: FiltroStatus) => void
  onAbrir: (e: ExameListItem) => void
}

export function ExamesListaView({
  clinica,
  exames,
  busca,
  filtroTipo,
  filtroStatus,
  onBusca,
  onFiltroTipo,
  onFiltroStatus,
  onAbrir,
}: Props) {
  const termo = busca.trim().toLowerCase()
  const lista = exames.filter((e) => {
    if (termo && !e.paciente.nome.toLowerCase().includes(termo)) return false
    if (filtroTipo !== 'todos' && e.categoria !== filtroTipo) return false
    if (filtroStatus !== 'todos' && e.statusRevisao !== filtroStatus) return false
    return true
  })
  const aRevisar = exames.filter((e) => e.statusRevisao === 'a-revisar').length

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Exames</h1>
          {aRevisar > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              {aRevisar} a revisar
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Pool compartilhado · {clinica}
        </p>
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
          {(['todos', 'laboratorial', 'imagem'] as FiltroTipo[]).map((f) => (
            <Chip key={f} ativo={filtroTipo === f} onClick={() => onFiltroTipo(f)}>
              {f === 'todos' ? 'Todos' : f === 'imagem' ? 'Imagem' : 'Laboratorial'}
            </Chip>
          ))}
          <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />
          {(['todos', 'a-revisar', 'revisado'] as FiltroStatus[]).map((f) => (
            <Chip key={f} ativo={filtroStatus === f} onClick={() => onFiltroStatus(f)}>
              {f === 'todos' ? 'Todos' : f === 'a-revisar' ? 'A revisar' : 'Revisados'}
            </Chip>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="mt-3 space-y-2">
        {lista.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
            Nenhum exame com esses filtros.
          </div>
        ) : (
          lista.map((e) => <ExameRow key={e.id} exame={e} onClick={() => onAbrir(e)} />)
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
      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
        ativo
          ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

function ExameRow({ exame, onClick }: { exame: ExameListItem; onClick: () => void }) {
  const aRevisar = exame.statusRevisao === 'a-revisar'
  const CatIcon = exame.categoria === 'imagem' ? ScanLine : FlaskConical
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-all hover:border-teal-500 hover:shadow-sm dark:bg-slate-900 dark:hover:border-teal-500 ${
        aRevisar
          ? 'border-amber-200 dark:border-amber-900/50'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <CatIcon className="h-5 w-5" strokeWidth={1.75} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
            {exame.paciente.nome}
          </span>
          <span className="shrink-0 text-[11px] text-slate-400">{exame.paciente.idade}a</span>
        </div>
        <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">
          {exame.tipo} · {exame.laboratorio} · {exame.recebidoEm}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${BADGE_COR[exame.solicitante.cor]}`}
          >
            {exame.solicitante.especialidade}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Users className="h-2.5 w-2.5" /> {exame.compartilhadoCom}
          </span>
        </div>
      </div>

      {/* Destaque + status */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {exame.destaque && (
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${NIVEL_META[exame.destaque.alertNivel].bg} ${NIVEL_META[exame.destaque.alertNivel].texto}`}
          >
            {exame.destaque.nome} {exame.destaque.valor}
            <span>{TENDENCIA_SETA[exame.destaque.tendencia]}</span>
          </span>
        )}
        <span
          className={`text-[10px] font-medium ${
            aRevisar ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
          }`}
        >
          {aRevisar ? 'A revisar' : `Revisado · ${exame.revisadoPor?.split(' ').slice(0, 2).join(' ')}`}
        </span>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
    </button>
  )
}
