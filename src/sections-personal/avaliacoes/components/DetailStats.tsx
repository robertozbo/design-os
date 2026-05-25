import { Activity, Dumbbell, Heart, Scale, Target } from 'lucide-react'
import type { Avaliacao } from '@/../product-personal/sections/avaliacoes/types'

interface DetailStatsProps {
  avaliacao: Avaliacao
}

export function DetailStats({ avaliacao }: DetailStatsProps) {
  const peso =
    avaliacao.antropometria?.bioimpedancia?.pesoKg ??
    avaliacao.antropometria?.pesoKg ??
    null
  const pg =
    avaliacao.antropometria?.dobras.percentualGorduraPollock ??
    avaliacao.antropometria?.bioimpedancia?.percentualGordura ??
    null
  const fms = avaliacao.funcional?.fms?.totalScore ?? null
  const rm = avaliacao.funcional?.rm
  const rmTotal =
    rm && (rm.supino || rm.squat || rm.deadlift)
      ? (rm.supino?.estimadoKg ?? 0) +
        (rm.squat?.estimadoKg ?? 0) +
        (rm.deadlift?.estimadoKg ?? 0)
      : null
  const vo2 = avaliacao.funcional?.cardio?.vo2Estimado ?? null

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Stat
        icon={<Scale size={13} />}
        label="Peso"
        value={peso}
        unit="kg"
        tone="slate"
      />
      <Stat
        icon={<Activity size={13} />}
        label="% Gordura"
        value={pg}
        unit="%"
        tone="amber"
      />
      <Stat
        icon={<Target size={13} />}
        label="FMS"
        value={fms}
        unit="/21"
        tone="violet"
      />
      <Stat
        icon={<Dumbbell size={13} />}
        label="RM Total"
        value={rmTotal}
        unit="kg"
        tone="teal"
        hint={
          rm
            ? `${rm.supino?.estimadoKg ?? 0}/${rm.squat?.estimadoKg ?? 0}/${rm.deadlift?.estimadoKg ?? 0}`
            : undefined
        }
      />
      <Stat
        icon={<Heart size={13} />}
        label="VO2 estimado"
        value={vo2}
        unit="mL/kg/min"
        tone="rose"
      />
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
  unit,
  tone,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: number | null
  unit: string
  tone: 'slate' | 'amber' | 'violet' | 'teal' | 'rose'
  hint?: string
}) {
  const valueTone = {
    slate: 'text-slate-900 dark:text-slate-50',
    amber: 'text-amber-600 dark:text-amber-400',
    violet: 'text-violet-600 dark:text-violet-400',
    teal: 'text-teal-600 dark:text-teal-400',
    rose: 'text-rose-600 dark:text-rose-400',
  }[tone]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icon}
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1 font-mono">
        {value != null ? (
          <>
            <span className={`text-2xl font-semibold tabular-nums ${valueTone}`}>
              {value}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {unit}
            </span>
          </>
        ) : (
          <span className="font-mono text-base text-slate-400 dark:text-slate-500">
            —
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider tabular-nums text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </div>
  )
}
