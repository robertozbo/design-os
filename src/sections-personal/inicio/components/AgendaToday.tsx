import { CheckCircle2, Clock, MapPin, Video, ChevronRight } from 'lucide-react'
import type { AgendaItem } from '@/../product-personal/sections/inicio/types'
import {
  SESSAO_STATUS,
  SESSAO_TIPO,
  hourStringToDecimal,
  nowHourDecimal,
} from './helpers'

interface AgendaTodayProps {
  agenda: AgendaItem[]
  onMarcarRealizada?: (sessaoId: string) => void
  onOpenSessao?: (sessaoId: string) => void
  onOpenAgenda?: () => void
}

export function AgendaToday({
  agenda,
  onMarcarRealizada,
  onOpenSessao,
  onOpenAgenda,
}: AgendaTodayProps) {
  const now = nowHourDecimal()
  const realizadas = agenda.filter((a) => a.status === 'realizada').length
  const pendentes = agenda.filter(
    (a) => a.status === 'agendada' || a.status === 'confirmada',
  ).length

  // Find next pending session (soonest in time among pending)
  const nextPending = agenda
    .filter((a) => a.status === 'agendada' || a.status === 'confirmada')
    .sort((a, b) =>
      hourStringToDecimal(a.hora) - hourStringToDecimal(b.hora),
    )[0]?.id

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Hoje
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
            <span className="font-mono tabular-nums">{agenda.length}</span> sessões agendadas
          </h2>
          <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">
              {realizadas} realizadas
            </span>{' '}
            ·{' '}
            <span className="text-slate-600 dark:text-slate-300">
              {pendentes} pendentes
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAgenda}
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Ver agenda
          <ChevronRight size={12} />
        </button>
      </header>

      {agenda.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Sem sessões hoje · próxima é amanhã às 09:00
        </p>
      ) : (
        <div className="relative px-5 py-4">
          {/* timeline rail */}
          <div className="absolute left-[51px] top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-1">
            {agenda.map((item) => {
              const isPast = item.status === 'realizada' || item.status === 'cancelada'
              const isNext = item.id === nextPending
              const itemHour = hourStringToDecimal(item.hora)
              const showNowMarker = !isPast && itemHour > now

              return (
                <div key={item.id}>
                  {showNowMarker && nextPending === item.id && (
                    <NowMarker now={now} />
                  )}
                  <SessaoRow
                    item={item}
                    isPast={isPast}
                    isNext={isNext}
                    onMarcarRealizada={() => onMarcarRealizada?.(item.id)}
                    onOpen={() => onOpenSessao?.(item.id)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </article>
  )
}

function SessaoRow({
  item,
  isPast,
  isNext,
  onMarcarRealizada,
  onOpen,
}: {
  item: AgendaItem
  isPast: boolean
  isNext: boolean
  onMarcarRealizada?: () => void
  onOpen?: () => void
}) {
  const tipoStyle = SESSAO_TIPO[item.tipo]
  const statusStyle = SESSAO_STATUS[item.status]

  return (
    <div
      className={`
        relative flex items-center gap-4 rounded-xl py-2 pr-2 transition-colors
        ${isPast ? 'opacity-60' : 'hover:bg-slate-50 dark:hover:bg-slate-900/60'}
        ${isNext ? 'bg-teal-50/40 dark:bg-teal-900/10 ring-1 ring-inset ring-teal-100 dark:ring-teal-900/40' : ''}
      `}
    >
      {/* Hour */}
      <div className="w-10 shrink-0 text-right">
        <p className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {item.hora}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {item.duracaoMin}min
        </p>
      </div>

      {/* Status dot on rail */}
      <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center">
        <span className={`h-3 w-3 rounded-full ring-4 ring-white dark:ring-slate-900 ${statusStyle.dot}`} />
      </div>

      {/* Aluno */}
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {item.aluno.avatarUrl ? (
          <img
            src={item.aluno.avatarUrl}
            alt={item.aluno.nome}
            className="h-9 w-9 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            {item.aluno.nome.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
            {item.aluno.nome}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5 truncate">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tipoStyle.badge}`}
            >
              {item.tipo === 'treino' && item.treinoLetra
                ? `Treino ${item.treinoLetra}`
                : tipoStyle.label}
            </span>
            <span className="inline-flex items-center gap-1 truncate font-mono text-[10px] text-slate-400 dark:text-slate-500">
              {item.modalidade === 'online' ? (
                <Video size={9} />
              ) : (
                <MapPin size={9} />
              )}
              <span className="truncate">{item.local ?? 'Online'}</span>
            </span>
          </div>
        </div>
      </button>

      {/* Action */}
      {item.status === 'realizada' ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={11} />
          Feita
        </span>
      ) : item.status === 'cancelada' ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
          Cancelada
        </span>
      ) : (
        <button
          type="button"
          onClick={onMarcarRealizada}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300"
        >
          <CheckCircle2 size={11} />
          Marcar feita
        </button>
      )}
    </div>
  )
}

function NowMarker({ now }: { now: number }) {
  const hh = Math.floor(now)
  const mm = Math.round((now - hh) * 60)
  const label = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`

  return (
    <div className="relative my-2 ml-[42px] flex items-center gap-2 pr-2">
      <div className="h-px flex-1 bg-teal-500 dark:bg-teal-400" />
      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white dark:bg-teal-400 dark:text-slate-950">
        <Clock size={10} />
        agora · {label}
      </span>
    </div>
  )
}
