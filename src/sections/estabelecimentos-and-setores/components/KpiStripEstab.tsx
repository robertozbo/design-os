import type {
  EmpregadorContexto,
  Estabelecimento,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import { Building2, Building, Layers3, Activity } from 'lucide-react'

interface KpiStripEstabProps {
  empregador: EmpregadorContexto
  estabelecimentos: Estabelecimento[]
}

const NUM = new Intl.NumberFormat('pt-BR')

export function KpiStripEstab({ empregador, estabelecimentos }: KpiStripEstabProps) {
  const matrizes = estabelecimentos.filter((e) => e.tipo === 'matriz').length
  const filiais = estabelecimentos.filter((e) => e.tipo === 'filial').length
  const ativos = estabelecimentos.filter((e) => !e.arquivadoEm)
  const coberturaAvg =
    ativos.length === 0
      ? 0
      : ativos.reduce((acc, e) => acc + e.saudeNr1.coberturaMedia, 0) / ativos.length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        revealIndex={1}
        label="Estabelecimentos"
        value={NUM.format(empregador.agregado.totalEstabelecimentos)}
        sub={`${matrizes} matriz · ${filiais} filiais`}
        icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent="teal"
      />
      <KpiCard
        revealIndex={2}
        label="Setores"
        value={NUM.format(empregador.agregado.totalSetores)}
        sub="cobertos pelo PGR"
        icon={<Layers3 className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent="slate"
      />
      <KpiCard
        revealIndex={3}
        label="Trabalhadores"
        value={NUM.format(empregador.agregado.totalTrabalhadores)}
        sub="elegíveis para avaliação"
        icon={<Building className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent="violet"
      />
      <KpiCard
        revealIndex={4}
        label="Cobertura média"
        value={`${(coberturaAvg * 100).toFixed(0)}%`}
        sub={coberturaAvg >= 0.65 ? 'acima do mínimo NR-1' : 'abaixo do mínimo NR-1'}
        icon={<Activity className="w-3.5 h-3.5" strokeWidth={1.75} />}
        accent={coberturaAvg >= 0.65 ? 'teal' : 'amber'}
      />
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
  revealIndex,
}: {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent: 'teal' | 'slate' | 'violet' | 'amber'
  revealIndex: number
}) {
  const accents = {
    teal: 'text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/30 ring-teal-200/60 dark:ring-teal-900/50',
    slate: 'text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/50 ring-slate-200/60 dark:ring-slate-700/60',
    violet: 'text-violet-700 dark:text-violet-300 bg-violet-50/70 dark:bg-violet-950/30 ring-violet-200/60 dark:ring-violet-900/50',
    amber: 'text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 ring-amber-200/60 dark:ring-amber-900/50',
  }[accent]

  return (
    <div
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        relative rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        px-4 py-3.5
        flex flex-col justify-between gap-3
        min-h-[104px]
      "
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className={`inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 ${accents}`}>
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
          {value}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{sub}</span>
      </div>
    </div>
  )
}
