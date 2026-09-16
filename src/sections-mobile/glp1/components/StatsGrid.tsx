import { Scale, TrendingDown, Target, CalendarCheck } from 'lucide-react'
import type { Glp1Stats } from '@/../product-mobile/sections/glp1/types'

interface Props {
  stats: Glp1Stats
}

const n1 = (v: number) => v.toFixed(1).replace('.', ',')
const n2 = (v: number) => v.toFixed(2).replace('.', ',')

export function StatsGrid({ stats }: Props) {
  return (
    <div className="px-4 mb-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Card
          icone={<Scale size={14} strokeWidth={2.2} className="text-teal-300" />}
          label="Peso atual"
          valor={n1(stats.pesoAtualKg)}
          unidade="kg"
          rodape={
            stats.imc
              ? `IMC ${n1(stats.imc)}${stats.imcClassificacao ? ` · ${stats.imcClassificacao}` : ''}`
              : null
          }
          rodapeCor="text-slate-500"
        />
        <Card
          icone={<TrendingDown size={14} strokeWidth={2.2} className="text-emerald-300" />}
          label="Já perdeu"
          valor={n1(stats.perdidoKg)}
          unidade="kg"
          rodape={`${n1(stats.perdidoPct)}% do peso inicial`}
          rodapeCor="text-emerald-300"
        />
        <Card
          icone={<Target size={14} strokeWidth={2.2} className="text-amber-300" />}
          label="Falta pra meta"
          valor={n1(stats.faltaKg)}
          unidade="kg"
          rodape={`${stats.diasRestantes} dias restantes`}
          rodapeCor="text-slate-500"
        />
        <Card
          icone={<CalendarCheck size={14} strokeWidth={2.2} className="text-sky-300" />}
          label="Adesão"
          valor={String(stats.adesaoPct)}
          unidade="%"
          rodape={`${stats.dosesAplicadas} de ${stats.dosesEsperadas} doses`}
          rodapeCor={stats.adesaoPct >= 85 ? 'text-sky-300' : 'text-amber-300'}
        />
      </div>

      {/* Ritmo: realizado vs necessário */}
      <div className="mt-2.5 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
            Ritmo atual
          </div>
          <div className="mt-0.5 font-mono tabular-nums text-slate-50 text-[16px] font-bold">
            {n2(stats.ritmoSemanalKg)}
            <span className="text-slate-500 text-[11px] font-normal"> kg/sem</span>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-800" />
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
            Necessário
          </div>
          <div className="mt-0.5 font-mono tabular-nums text-slate-300 text-[16px] font-bold">
            {n2(stats.ritmoNecessarioKg)}
            <span className="text-slate-500 text-[11px] font-normal"> kg/sem</span>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10.5px] font-medium ${
            stats.projecao === 'atrasado'
              ? 'bg-amber-500/15 text-amber-300'
              : stats.projecao === 'adiantado'
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-teal-500/15 text-teal-300'
          }`}
        >
          {stats.projecao === 'atrasado'
            ? 'atrasado'
            : stats.projecao === 'adiantado'
              ? 'adiantado'
              : 'no prazo'}
        </span>
      </div>
    </div>
  )
}

function Card({
  icone,
  label,
  valor,
  unidade,
  rodape,
  rodapeCor,
}: {
  icone: React.ReactNode
  label: string
  valor: string
  unidade: string
  rodape: string | null
  rodapeCor: string
}) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-3">
      <div className="flex items-center gap-1.5">
        {icone}
        <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500 truncate">
          {label}
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="font-mono tabular-nums text-slate-50 text-[22px] font-bold leading-none">
          {valor}
        </span>
        <span className="font-mono text-slate-500 text-[11px]">{unidade}</span>
      </div>
      {rodape && (
        <div className={`mt-1 text-[10.5px] truncate ${rodapeCor}`}>{rodape}</div>
      )}
    </div>
  )
}
