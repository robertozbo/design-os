import {
  Activity,
  Bike,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  PersonStanding,
  Smartphone,
  Watch,
} from 'lucide-react'
import type { Atividade, AtividadesData } from '@/../product/sections/pacientes/types'

interface AtividadesTabProps {
  data: AtividadesData
}

const TYPE_ICON: Record<string, typeof Activity> = {
  Caminhada: PersonStanding,
  Corrida: Footprints,
  Ciclismo: Bike,
  Musculação: Dumbbell,
}

const SOURCE_ICON: Record<string, typeof Watch> = {
  'Apple Watch': Watch,
  Garmin: Watch,
  'Health Connect': Smartphone,
}

export function AtividadesTab({ data }: AtividadesTabProps) {
  if (data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Sem atividades registradas
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          O paciente ainda não sincronizou atividades pelo smartwatch ou app.
        </p>
      </div>
    )
  }

  // Aggregate metrics
  const totalDuration = data.items.reduce((sum, a) => sum + a.duration, 0)
  const totalCalories = data.items.reduce((sum, a) => sum + a.calories, 0)
  const totalDistance = data.items.reduce((sum, a) => sum + a.distanceKm, 0)
  const avgHr = Math.round(
    data.items.reduce((sum, a) => sum + a.avgHr, 0) / data.items.length,
  )

  return (
    <div className="space-y-5">
      {/* Aggregate stats */}
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Resumo do período
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            Últimas {data.items.length} atividades sincronizadas do smartwatch
          </p>
        </header>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <AggregateTile label="Duração" value={`${totalDuration}`} unit="min" icon={<Activity size={14} />} />
          <AggregateTile label="Calorias" value={totalCalories.toLocaleString('pt-BR')} unit="kcal" icon={<Flame size={14} />} />
          <AggregateTile label="Distância" value={totalDistance.toFixed(1)} unit="km" icon={<Footprints size={14} />} />
          <AggregateTile label="FC média" value={String(avgHr)} unit="bpm" icon={<Heart size={14} />} />
        </div>
      </article>

      {/* List */}
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Histórico
          </h2>
        </header>
        <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {data.items.map((atividade) => (
            <AtividadeRow key={atividade.id} atividade={atividade} />
          ))}
        </div>
      </article>
    </div>
  )
}

function AggregateTile({
  label,
  value,
  unit,
  icon,
}: {
  label: string
  value: string
  unit: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icon}
        <p className="text-[10px] font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {value}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">{unit}</span>
      </p>
    </div>
  )
}

function AtividadeRow({ atividade }: { atividade: Atividade }) {
  const TypeIcon = TYPE_ICON[atividade.type] ?? Activity
  const SourceIcon = SOURCE_ICON[atividade.source] ?? Watch

  return (
    <div className="flex items-center gap-4 px-2 py-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
        <TypeIcon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {atividade.type}
          </p>
          <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-500">
            {formatDate(atividade.date)}
          </span>
        </div>
        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
          <SourceIcon size={11} />
          {atividade.source}
        </p>
      </div>

      <div className="hidden gap-4 sm:flex">
        <Metric label="Duração" value={`${atividade.duration}m`} />
        {atividade.distanceKm > 0 && (
          <Metric label="Distância" value={`${atividade.distanceKm.toFixed(1)}km`} />
        )}
        <Metric label="Calorias" value={`${atividade.calories}`} />
        <Metric label="FC média" value={`${atividade.avgHr}`} unit="bpm" />
      </div>
    </div>
  )
}

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="text-right">
      <p className="font-mono text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200">
        {value}
        {unit && <span className="ml-0.5 text-[10px] font-normal text-slate-500">{unit}</span>}
      </p>
      <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  } catch {
    return iso
  }
}
