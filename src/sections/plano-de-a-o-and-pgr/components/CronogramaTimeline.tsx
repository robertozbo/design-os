import { useMemo } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ListChecks,
  Loader2,
  RefreshCcw,
  User2,
} from 'lucide-react'
import type {
  PlanoAcaoItem,
  StatusItem,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'

interface Props {
  itens: PlanoAcaoItem[]
  hoje: Date
  onSelectItem?: (itemId: string) => void
}

const STATUS_TONE: Record<
  StatusItem,
  { dot: string; ring: string; label: string; icon: React.ReactNode; chip: string }
> = {
  planejado: {
    dot: 'bg-slate-400 dark:bg-slate-500',
    ring: 'ring-slate-200/60 dark:ring-slate-700',
    label: 'Planejado',
    icon: <ListChecks className="w-3 h-3" strokeWidth={2} />,
    chip: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  em_execucao: {
    dot: 'bg-teal-500',
    ring: 'ring-teal-200/60 dark:ring-teal-900/40',
    label: 'Em execução',
    icon: <Loader2 className="w-3 h-3" strokeWidth={2} />,
    chip: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
  },
  em_revisao: {
    dot: 'bg-violet-500',
    ring: 'ring-violet-200/60 dark:ring-violet-900/40',
    label: 'Em revisão',
    icon: <RefreshCcw className="w-3 h-3" strokeWidth={2} />,
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  },
  concluido: {
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200/60 dark:ring-emerald-900/40',
    label: 'Concluído',
    icon: <CheckCircle2 className="w-3 h-3" strokeWidth={2} />,
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
}

const MESES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MESES_PT[m - 1]} ${y}`
}

function diasEntre(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export function CronogramaTimeline({ itens, hoje, onSelectItem }: Props) {
  const ordenados = useMemo(
    () =>
      [...itens].sort((a, b) => {
        const da = new Date(a.prazo + 'T12:00:00').getTime()
        const db = new Date(b.prazo + 'T12:00:00').getTime()
        return da - db
      }),
    [itens],
  )

  const agrupado = useMemo(() => {
    const groups: Record<string, PlanoAcaoItem[]> = {}
    for (const it of ordenados) {
      const d = new Date(it.prazo + 'T12:00:00')
      const k = monthKey(d)
      if (!groups[k]) groups[k] = []
      groups[k].push(it)
    }
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
  }, [ordenados])

  if (itens.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 px-6 py-12 text-center">
        <CalendarDays
          className="w-7 h-7 mx-auto text-slate-400 dark:text-slate-500 mb-3"
          strokeWidth={1.5}
        />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Sem itens no cronograma
        </p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400">
          Adicione itens ao plano de ação para visualizá-los na timeline.
        </p>
      </div>
    )
  }

  return (
    <section className="mt-5 rounded-2xl bg-white/90 dark:bg-slate-900/60 ring-1 ring-slate-200/80 dark:ring-slate-800 p-4 sm:p-5">
      <header className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <CalendarDays
            className="w-4 h-4 text-teal-600 dark:text-teal-400"
            strokeWidth={2}
          />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Cronograma</h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            · {itens.length} itens
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          {(Object.keys(STATUS_TONE) as StatusItem[]).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_TONE[s].dot}`} />
              {STATUS_TONE[s].label}
            </span>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        {agrupado.map(([key, items]) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                {monthLabel(key)}
              </span>
              <span className="flex-1 h-px bg-slate-200/80 dark:bg-slate-800" />
              <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-500">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <ol className="relative space-y-2 ml-1">
              <span className="absolute left-[6px] top-1 bottom-1 w-px bg-slate-200 dark:bg-slate-800" />
              {items.map((it) => {
                const tone = STATUS_TONE[it.status]
                const prazo = new Date(it.prazo + 'T12:00:00')
                const dias = diasEntre(hoje, prazo)
                const vencido = it.status !== 'concluido' && dias < 0
                const proximo = it.status !== 'concluido' && dias >= 0 && dias <= 7

                const prazoTone = vencido
                  ? 'text-rose-700 dark:text-rose-300'
                  : proximo
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-slate-500 dark:text-slate-400'

                return (
                  <li key={it.id} className="relative pl-5">
                    <span
                      className={`absolute left-0 top-[16px] w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${tone.dot}`}
                    />
                    <button
                      type="button"
                      onClick={() => onSelectItem?.(it.id)}
                      className={`
                        w-full text-left rounded-xl bg-slate-50/60 dark:bg-slate-900/40 ring-1 ${tone.ring}
                        hover:bg-slate-100 dark:hover:bg-slate-800/60
                        px-3 py-2.5 transition
                      `}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 leading-tight truncate">
                            {it.titulo}
                          </h4>
                          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                            {it.origem.tipo === 'matriz' && it.origem.setorNome && it.origem.fatorNome
                              ? `${it.origem.setorNome} · ${it.origem.fatorNome}`
                              : it.origem.perigoNome ?? 'Criação livre'}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap ${tone.chip}`}
                        >
                          {tone.icon}
                          {tone.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <User2
                            className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0"
                            strokeWidth={1.75}
                          />
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                            {it.responsavel?.nome ?? 'Sem responsável'}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-mono tabular-nums whitespace-nowrap ${prazoTone}`}
                        >
                          {it.prazo}
                          {vencido && ` · ${Math.abs(dias)}d atraso`}
                          {proximo && !vencido && ` · ${dias}d`}
                        </span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}
