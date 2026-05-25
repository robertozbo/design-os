import { Activity, Calendar, CheckCircle2, Flame, Gauge } from 'lucide-react'
import type { Aluno } from '@/../product-personal/sections/alunos/types'
import { getAdesaoTone } from './helpers'

interface FichaStatsProps {
  aluno: Aluno
}

export function FichaStats({ aluno }: FichaStatsProps) {
  const adesao = aluno.adesao
  const adesaoTone = adesao ? getAdesaoTone(adesao.percentual) : null
  const ultimaAval = aluno.ultimaAvaliacaoData
    ? new Date(aluno.ultimaAvaliacaoData).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      })
    : '—'
  const proxima = aluno.proximaSessao
    ? new Date(aluno.proximaSessao.data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      })
    : '—'

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Stat
        icon={<Gauge size={13} />}
        label="Adesão"
        valueNode={
          adesao && adesaoTone ? (
            <div className="flex items-baseline gap-0.5">
              <span
                className={`font-mono text-xl font-semibold tabular-nums ${adesaoTone.text}`}
              >
                {adesao.percentual}
              </span>
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                %
              </span>
            </div>
          ) : (
            <span className="font-mono text-base text-slate-400 dark:text-slate-500">
              —
            </span>
          )
        }
        progress={
          adesao && adesaoTone ? (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full ${adesaoTone.bar}`}
                style={{ width: `${adesao.percentual}%` }}
              />
            </div>
          ) : null
        }
      />
      <Stat
        icon={<Flame size={13} />}
        label="Streak"
        valueNode={
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {adesao?.streak ?? 0}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              sessões
            </span>
          </div>
        }
      />
      <Stat
        icon={<CheckCircle2 size={13} />}
        label="Sessões"
        valueNode={
          adesao ? (
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                {adesao.sessoesFeitas}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                / {adesao.sessoesTotais}
              </span>
            </div>
          ) : (
            <span className="font-mono text-base text-slate-400 dark:text-slate-500">
              —
            </span>
          )
        }
      />
      <Stat
        icon={<Activity size={13} />}
        label="Última avaliação"
        valueNode={
          <p className="font-mono text-base font-semibold text-slate-900 dark:text-slate-50">
            {ultimaAval}
          </p>
        }
      />
      <Stat
        icon={<Calendar size={13} />}
        label="Próxima sessão"
        valueNode={
          <p className="font-mono text-base font-semibold text-slate-900 dark:text-slate-50">
            {proxima}
          </p>
        }
      />
    </div>
  )
}

function Stat({
  icon,
  label,
  valueNode,
  progress,
}: {
  icon: React.ReactNode
  label: string
  valueNode: React.ReactNode
  progress?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icon}
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-2">{valueNode}</div>
      {progress}
    </div>
  )
}
