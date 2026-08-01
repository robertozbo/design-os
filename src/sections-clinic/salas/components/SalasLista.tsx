import { useMemo } from 'react'
import { DoorClosed, DoorOpen, Plus, Video, Wrench } from 'lucide-react'
import type { Sala, SalasData, TipoSala } from '@/../product-clinic/sections/salas/types'
import { ESPEC_DOT, TIPO_BADGE, TIPO_LABEL, ocupacaoBar, ocupacaoPct } from './helpers'

const TIPO_ICON: Record<TipoSala, typeof DoorOpen> = {
  consultorio: DoorOpen,
  procedimento: Wrench,
  tele: Video,
}

interface Props {
  dados: SalasData
  onAbrir: (id: string) => void
  onNova: () => void
}

export function SalasLista({ dados, onAbrir, onNova }: Props) {
  const ativas = dados.salas.filter((s) => s.ativa)
  const kpis = useMemo(() => {
    const comCapacidade = ativas.filter((s) => s.horasDisponiveis > 0)
    const media =
      comCapacidade.length === 0
        ? 0
        : Math.round(
            comCapacidade.reduce((acc, s) => acc + ocupacaoPct(s.horasOcupadas, s.horasDisponiveis), 0) /
              comCapacidade.length,
          )
    const ociosas = ativas.filter((s) => s.consultasHoje === 0).length
    return { ativas: ativas.length, media, ociosas }
  }, [ativas])

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Salas &amp; recursos
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {kpis.ativas} salas ativas · ocupação média {kpis.media}% hoje
          </p>
        </div>
        <button
          onClick={onNova}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Nova sala
        </button>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Kpi label="Salas ativas" valor={String(kpis.ativas)} />
        <Kpi label="Ocupação média" valor={`${kpis.media}%`} />
        <Kpi label="Ociosas hoje" valor={String(kpis.ociosas)} />
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dados.salas.map((s) => (
          <SalaCard key={s.id} sala={s} onClick={() => onAbrir(s.id)} />
        ))}
      </div>
    </div>
  )
}

function SalaCard({ sala, onClick }: { sala: Sala; onClick: () => void }) {
  const Icon = TIPO_ICON[sala.tipo]
  const pct = ocupacaoPct(sala.horasOcupadas, sala.horasDisponiveis)
  const inativa = !sala.ativa

  return (
    <button
      onClick={onClick}
      className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-teal-500 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 ${
        inativa ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
            {inativa ? <DoorClosed className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {sala.nome}
            </div>
            <div className="text-[11px] text-slate-400">{sala.local}</div>
          </div>
        </div>
        {inativa ? (
          <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            inativa
          </span>
        ) : (
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TIPO_BADGE[sala.tipo]}`}>
            {TIPO_LABEL[sala.tipo]}
          </span>
        )}
      </div>

      {/* Recursos */}
      <div className="mt-3 flex flex-wrap gap-1">
        {sala.recursos.slice(0, 4).map((r) => (
          <span
            key={r}
            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {r}
          </span>
        ))}
      </div>

      {/* Ocupação */}
      {!inativa && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{sala.consultasHoje === 0 ? 'Ociosa hoje' : `${sala.consultasHoje} consultas hoje`}</span>
            <span className="font-mono tabular-nums">{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className={`h-full rounded-full ${ocupacaoBar(pct)}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {/* Próxima */}
      <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] dark:border-slate-800">
        {sala.proxima ? (
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className={`h-1.5 w-1.5 rounded-full ${ESPEC_DOT[sala.proxima.cor]}`} />
            Próxima {sala.proxima.inicio} · {sala.proxima.medico}
          </span>
        ) : (
          <span className="text-slate-400">Sem próximas consultas</span>
        )}
      </div>
    </button>
  )
}

function Kpi({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{valor}</div>
    </div>
  )
}
