import { Calendar, Activity, Sparkles, TrendingDown } from 'lucide-react'
import type { SnapshotIdades } from '@/../product-mobile/sections/minha-saude/types'

interface IdadesCardProps {
  idades: SnapshotIdades
  /** Mostrar a 4ª linha (visual projetada) — só aparece em detalhe de snapshot com meta */
  showProjetada?: boolean
}

interface LinhaIdade {
  label: string
  valor: string
  icon: typeof Calendar
  iconBg: string
  iconColor: string
  isEstimativa?: boolean
  delta?: { valor: number; tone: 'good' | 'bad' | 'neutral' }
}

function formatFaixa(f: { min: number; max: number }): string {
  return f.min === f.max ? `${f.min}` : `${f.min}–${f.max}`
}

export function IdadesCard({ idades, showProjetada = false }: IdadesCardProps) {
  const linhas: LinhaIdade[] = [
    {
      label: 'Real',
      valor: `${idades.real} anos`,
      icon: Calendar,
      iconBg: 'bg-slate-700/40',
      iconColor: 'text-slate-300',
    },
  ]

  if (idades.corporal !== undefined) {
    const delta = idades.corporal - idades.real
    linhas.push({
      label: 'Corporal',
      valor: `${idades.corporal} anos`,
      icon: Activity,
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-300',
      delta: { valor: delta, tone: delta > 0 ? 'bad' : delta < 0 ? 'good' : 'neutral' },
    })
  }

  if (idades.visualEstimada) {
    const med = (idades.visualEstimada.min + idades.visualEstimada.max) / 2
    const delta = Math.round(med - idades.real)
    linhas.push({
      label: 'Visual estimada',
      valor: `${formatFaixa(idades.visualEstimada)} anos`,
      icon: Sparkles,
      iconBg: 'bg-teal-500/15',
      iconColor: 'text-teal-300',
      isEstimativa: true,
      delta: { valor: delta, tone: delta > 0 ? 'bad' : delta < 0 ? 'good' : 'neutral' },
    })
  }

  if (showProjetada && idades.visualProjetada) {
    const med = (idades.visualProjetada.min + idades.visualProjetada.max) / 2
    const delta = Math.round(med - idades.real)
    linhas.push({
      label: 'Visual projetada',
      valor: `${formatFaixa(idades.visualProjetada)} anos`,
      icon: TrendingDown,
      iconBg: 'bg-sky-500/15',
      iconColor: 'text-sky-300',
      isEstimativa: true,
      delta: { valor: delta, tone: delta > 0 ? 'bad' : delta < 0 ? 'good' : 'neutral' },
    })
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
        <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
          Idades
        </span>
        <span className="text-slate-600 text-[9.5px] italic">estimativas</span>
      </div>
      <ul className="divide-y divide-slate-800/80">
        {linhas.map((l) => {
          const Icon = l.icon
          return (
            <li key={l.label} className="flex items-center gap-3 px-3.5 py-2.5">
              <div className={`w-7 h-7 rounded-lg ${l.iconBg} flex items-center justify-center ${l.iconColor} shrink-0`}>
                <Icon size={13} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-100 text-[12.5px] font-semibold leading-tight flex items-center gap-1.5">
                  {l.label}
                  {l.isEstimativa && (
                    <span className="text-[8.5px] font-mono uppercase tracking-wider text-slate-600">
                      estimativa
                    </span>
                  )}
                </div>
                <div className="text-slate-300 text-[11.5px] font-mono tabular-nums mt-0.5">
                  {l.valor}
                </div>
              </div>
              {l.delta && (
                <DeltaBadge delta={l.delta.valor} tone={l.delta.tone} />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function DeltaBadge({ delta, tone }: { delta: number; tone: 'good' | 'bad' | 'neutral' }) {
  if (delta === 0) {
    return <span className="text-slate-600 text-[10px] font-mono tabular-nums">±0</span>
  }
  const cls =
    tone === 'good'
      ? 'text-emerald-300 bg-emerald-500/10'
      : tone === 'bad'
      ? 'text-rose-300 bg-rose-500/10'
      : 'text-slate-400 bg-slate-800'
  return (
    <span className={`${cls} text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded font-semibold`}>
      {delta > 0 ? '+' : ''}
      {delta}
    </span>
  )
}
