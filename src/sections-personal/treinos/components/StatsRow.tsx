import { Activity, CheckCircle2, Flame, Gauge } from 'lucide-react'
import type { AdesaoStats } from '@/../product-personal/sections/treinos/types'
import { getAdesaoTone } from './objetivoStyle'

interface StatsRowProps {
  adesao: AdesaoStats
  duracaoSemanas?: number
}

export function StatsRow({ adesao, duracaoSemanas }: StatsRowProps) {
  const adesaoTone = getAdesaoTone(adesao.percentual)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        icon={<Gauge size={14} />}
        label="Adesão"
        valueNode={
          <div className="flex items-baseline gap-1">
            <span
              className={`font-mono text-2xl font-semibold tabular-nums ${adesaoTone.text}`}
            >
              {adesao.percentual}
            </span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
              %
            </span>
          </div>
        }
        progress={
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full ${adesaoTone.bar}`}
              style={{ width: `${adesao.percentual}%` }}
            />
          </div>
        }
      />

      <StatCard
        icon={<Flame size={14} />}
        label="Streak"
        valueNode={
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {adesao.streak}
            </span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
              sessões
            </span>
          </div>
        }
        hint="seguidas sem pular"
      />

      <StatCard
        icon={<CheckCircle2 size={14} />}
        label="Sessões"
        valueNode={
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {adesao.sessoesFeitas}
            </span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
              / {adesao.sessoesTotais}
            </span>
          </div>
        }
        hint={duracaoSemanas ? `${duracaoSemanas} semanas` : undefined}
      />

      <StatCard
        icon={<Activity size={14} />}
        label="RPE médio"
        valueNode={
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {adesao.rpeMedio?.toFixed(1) ?? '—'}
            </span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
              / 10
            </span>
          </div>
        }
        hint="esforço percebido"
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  valueNode,
  hint,
  progress,
}: {
  icon: React.ReactNode
  label: string
  valueNode: React.ReactNode
  hint?: string
  progress?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icon}
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-2">{valueNode}</div>
      {progress}
      {hint && (
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </div>
  )
}
