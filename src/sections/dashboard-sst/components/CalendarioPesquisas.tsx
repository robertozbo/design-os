import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Microscope } from 'lucide-react'
import type {
  JanelaPesquisaCalendario,
  JanelaPesquisaStatus,
} from '@/../product/sections/dashboard-sst/types'

interface Props {
  janelas: JanelaPesquisaCalendario[]
  onAbrirJanelaPesquisa?: (avaliacaoId: string) => void
}

const STATUS_TONE: Record<JanelaPesquisaStatus, { dot: string; pill: string; label: string }> = {
  agendada: {
    dot: 'bg-slate-400 dark:bg-slate-500',
    pill: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-slate-200/60 dark:ring-slate-700',
    label: 'Agendada',
  },
  em_aplicacao: {
    dot: 'bg-teal-500',
    pill: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/40',
    label: 'Em aplicação',
  },
  publicada: {
    dot: 'bg-violet-500',
    pill: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/40',
    label: 'Publicada',
  },
  encerrada: {
    dot: 'bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/40',
    label: 'Encerrada',
  },
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = [
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

function parseISO(s: string): Date {
  return new Date(s + 'T00:00:00')
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isWithin(date: Date, start: Date, end: Date): boolean {
  const d = date.getTime()
  return d >= start.getTime() && d <= end.getTime()
}

export function CalendarioPesquisas({ janelas, onAbrirJanelaPesquisa }: Props) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const grid = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1)
    const startDayOfWeek = firstOfMonth.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const cells: { date: Date; inMonth: boolean }[] = []

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth, -i)
      cells.push({ date: d, inMonth: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(viewYear, viewMonth, d), inMonth: true })
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date
      const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
      cells.push({ date: next, inMonth: false })
    }
    return cells
  }, [viewYear, viewMonth])

  const janelasNoCalendario = useMemo(() => {
    return janelas.map((j) => ({
      ...j,
      _inicio: parseISO(j.janelaInicio),
      _fim: parseISO(j.janelaFim),
    }))
  }, [janelas])

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1)
      setViewMonth(11)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }
  const goNext = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1)
      setViewMonth(0)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }
  const goToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
  }

  const janelasDoMes = janelas
    .filter((j) => {
      const ini = parseISO(j.janelaInicio)
      const fim = parseISO(j.janelaFim)
      return (
        (ini.getFullYear() === viewYear && ini.getMonth() === viewMonth) ||
        (fim.getFullYear() === viewYear && fim.getMonth() === viewMonth) ||
        (ini < new Date(viewYear, viewMonth, 1) && fim > new Date(viewYear, viewMonth + 1, 0))
      )
    })
    .sort((a, b) => a.janelaInicio.localeCompare(b.janelaInicio))

  return (
    <section className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays
            className="w-4 h-4 text-teal-600 dark:text-teal-400"
            strokeWidth={2}
          />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Calendário de pesquisas
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            · {janelas.length} janelas
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Mês anterior"
            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={goToday}
            className="px-2 py-1 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Hoje
          </button>
          <span className="px-2 text-sm font-medium text-slate-700 dark:text-slate-200 min-w-[140px] text-center">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label="Próximo mês"
            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition"
          >
            <ChevronRight className="w-4 h-4 text-slate-500" strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] gap-5">
        <div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-mono uppercase tracking-[0.12em] font-semibold text-slate-400 dark:text-slate-500 py-1"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell, i) => {
              const matchingJanelas = janelasNoCalendario.filter((j) =>
                isWithin(cell.date, j._inicio, j._fim),
              )
              const isToday = sameDay(cell.date, today)
              const top = matchingJanelas[0]
              const tone = top ? STATUS_TONE[top.status] : null
              const dayNum = cell.date.getDate()

              return (
                <button
                  type="button"
                  key={i}
                  onClick={top ? () => onAbrirJanelaPesquisa?.(top.avaliacaoId) : undefined}
                  disabled={!top}
                  className={`
                    relative aspect-square rounded-lg text-[11px] font-medium tabular-nums
                    flex flex-col items-center justify-center gap-0.5
                    transition
                    ${cell.inMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-700'}
                    ${isToday ? 'ring-1 ring-teal-500/60 dark:ring-teal-400/60' : ''}
                    ${
                      top
                        ? 'hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer'
                        : 'cursor-default'
                    }
                  `}
                  title={
                    top
                      ? `${matchingJanelas.length} ${matchingJanelas.length === 1 ? 'janela' : 'janelas'}: ${matchingJanelas
                          .map((j) => `${j.empregadorRazaoSocial} (${STATUS_TONE[j.status].label})`)
                          .join(' · ')}`
                      : undefined
                  }
                >
                  <span>{dayNum}</span>
                  {tone && (
                    <span className="flex items-center gap-0.5">
                      <span className={`w-1 h-1 rounded-full ${tone.dot}`} />
                      {matchingJanelas.length > 1 && (
                        <span className="text-[8px] font-mono font-bold text-slate-500">
                          +{matchingJanelas.length - 1}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
            {(Object.keys(STATUS_TONE) as JanelaPesquisaStatus[]).map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_TONE[s].dot}`} />
                {STATUS_TONE[s].label}
              </span>
            ))}
          </div>
        </div>

        <aside>
          <h4 className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            Janelas neste mês ({janelasDoMes.length})
          </h4>
          {janelasDoMes.length === 0 ? (
            <p className="text-[12px] text-slate-500 dark:text-slate-500 italic leading-relaxed">
              Sem pesquisas neste mês.
            </p>
          ) : (
            <ul className="space-y-2">
              {janelasDoMes.map((j) => {
                const tone = STATUS_TONE[j.status]
                return (
                  <li key={j.avaliacaoId}>
                    <button
                      type="button"
                      onClick={() => onAbrirJanelaPesquisa?.(j.avaliacaoId)}
                      className="w-full text-left rounded-xl bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 ring-1 ring-slate-200/60 dark:ring-slate-800/60 px-3 py-2.5 transition"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-semibold ${tone.pill}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${tone.dot}`} />
                          {tone.label}
                        </span>
                        {j.coberturaPercent !== null && (
                          <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                            {j.coberturaPercent.toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] font-medium text-slate-800 dark:text-slate-200 leading-tight truncate">
                        {j.empregadorRazaoSocial}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Microscope className="w-3 h-3" strokeWidth={1.75} />
                        <span className="font-mono truncate">{j.instrumento}</span>
                      </div>
                      <div className="mt-0.5 text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-500">
                        {j.janelaInicio} → {j.janelaFim}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </aside>
      </div>
    </section>
  )
}
