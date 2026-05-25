import {
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Plus,
  Sparkles,
  Video,
} from 'lucide-react'
import type {
  Atendimento,
  AtendimentosData,
  AttendanceType,
  PlanTier,
} from '@/../product/sections/pacientes/types'

interface AtendimentosTabProps {
  data: AtendimentosData
  currentPlan: PlanTier
  onOpenNovoAtendimento?: () => void
  onOpenAtendimento?: (id: string) => void
}

const ATTENDANCE_CONFIG: Record<
  AttendanceType,
  { label: string; Icon: typeof MapPin; tone: string }
> = {
  presencial: { label: 'Presencial', Icon: MapPin, tone: 'text-teal-700 dark:text-teal-300' },
  teleconsulta: { label: 'Teleconsulta', Icon: Video, tone: 'text-emerald-700 dark:text-emerald-300' },
  domicilio: { label: 'Domicílio', Icon: Home, tone: 'text-orange-700 dark:text-orange-300' },
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function AtendimentosTab({
  data,
  currentPlan,
  onOpenNovoAtendimento,
  onOpenAtendimento,
}: AtendimentosTabProps) {
  const canCreate = PLAN_RANK[currentPlan] >= PLAN_RANK['plus']
  const finalizadas = data.items.filter((a) => a.status === 'finalizado').length
  const rascunhos = data.items.filter((a) => a.status === 'rascunho').length

  return (
    <div className="space-y-5">
      {/* Header card with new appointment CTA */}
      <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Histórico de prontuário
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums">{finalizadas}</span> finalizado
            {finalizadas === 1 ? '' : 's'}
            {rascunhos > 0 && (
              <>
                <span className="mx-1.5 text-slate-300 dark:text-slate-700">·</span>
                <span className="text-amber-600 dark:text-amber-400">
                  <span className="font-mono tabular-nums">{rascunhos}</span> rascunho
                  {rascunhos === 1 ? '' : 's'}
                </span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNovoAtendimento}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 ${
            canCreate
              ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20'
              : 'bg-teal-600/60 text-white/80'
          }`}
        >
          <Plus size={14} />
          Novo Atendimento
          {!canCreate && (
            <span className="ml-1 rounded bg-orange-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-800">
              Plus
            </span>
          )}
        </button>
      </article>

      {/* Timeline of atendimentos */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-teal-300 via-slate-200 to-slate-200 dark:from-teal-800 dark:via-slate-800 dark:to-slate-800 sm:left-[30px]" />

        <div className="space-y-3">
          {data.items.map((atendimento, index) => (
            <AtendimentoTimelineItem
              key={atendimento.id}
              atendimento={atendimento}
              isFirst={index === 0}
              onClick={() => onOpenAtendimento?.(atendimento.id)}
            />
          ))}
        </div>
      </div>

      {data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Nenhum atendimento ainda
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Crie o primeiro prontuário pra começar a registrar a evolução do paciente.
          </p>
        </div>
      )}
    </div>
  )
}

function AtendimentoTimelineItem({
  atendimento,
  isFirst,
  onClick,
}: {
  atendimento: Atendimento
  isFirst: boolean
  onClick?: () => void
}) {
  const attendance = ATTENDANCE_CONFIG[atendimento.attendanceType]
  const AttendanceIcon = attendance.Icon
  const hasAi = atendimento.topicsCovered.some((t) => t.toLowerCase().includes('antropometria'))

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full items-start gap-4 rounded-xl border border-transparent pl-1 pr-4 py-3 text-left transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm dark:hover:border-slate-800 dark:hover:bg-slate-900/60"
    >
      {/* Date dot */}
      <div className="relative flex shrink-0 flex-col items-center pt-0.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[10px] font-semibold uppercase tracking-wider sm:h-14 sm:w-14 ${
            atendimento.status === 'finalizado'
              ? isFirst
                ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20'
                : 'bg-white text-slate-700 ring-2 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700'
              : 'bg-amber-100 text-amber-800 ring-2 ring-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-700'
          }`}
        >
          <span className="font-mono tabular-nums">{formatDateShort(atendimento.date)}</span>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {atendimento.type}
          </h3>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-500">
            {atendimento.label}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Clock size={11} />
            {atendimento.duration}min
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] ${attendance.tone}`}
          >
            <AttendanceIcon size={11} />
            {attendance.label}
          </span>
          {atendimento.status === 'finalizado' ? (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <CheckCircle2 size={10} />
              Finalizado
            </span>
          ) : (
            <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              Rascunho
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {atendimento.summary}
        </p>

        {atendimento.topicsCovered.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {atendimento.topicsCovered.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {topic.toLowerCase().includes('antropometria') && <Sparkles size={9} />}
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

function formatDateShort(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()
  } catch {
    return iso
  }
}
