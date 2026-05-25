import { Flame, CalendarCheck, Clock, Zap } from 'lucide-react'
import type { TreinosStats } from '@/../product-mobile/sections/treinos/types'

interface StatsStripProps {
  stats: TreinosStats
}

export function StatsStrip({ stats }: StatsStripProps) {
  return (
    <div className="px-4 grid grid-cols-4 gap-2">
      <Stat icon={Flame} cor="rose" valor={`${stats.streakDias}`} label="dias" />
      <Stat icon={CalendarCheck} cor="teal" valor={`${stats.totalMes}`} label="mês" />
      <Stat icon={Zap} cor="amber" valor={`${stats.frequenciaSemanalMedia.toFixed(1)}`} label="/sem" />
      <Stat icon={Clock} cor="sky" valor={`${stats.duracaoMediaMin}`} label="min" />
    </div>
  )
}

interface StatProps {
  icon: typeof Flame
  cor: 'rose' | 'teal' | 'amber' | 'sky'
  valor: string
  label: string
}

const COR_MAP = {
  rose: 'bg-rose-500/15 text-rose-300',
  teal: 'bg-teal-500/15 text-teal-300',
  amber: 'bg-amber-500/15 text-amber-300',
  sky: 'bg-sky-500/15 text-sky-300',
}

function Stat({ icon: Icon, cor, valor, label }: StatProps) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 px-2 py-2.5 text-center">
      <div className={`w-7 h-7 mx-auto rounded-lg ${COR_MAP[cor]} flex items-center justify-center mb-1`}>
        <Icon size={13} strokeWidth={2.2} />
      </div>
      <div className="text-slate-100 font-bold text-[14px] font-mono tabular-nums leading-none">{valor}</div>
      <div className="text-slate-500 text-[9.5px] uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  )
}
