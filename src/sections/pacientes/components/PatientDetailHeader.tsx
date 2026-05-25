import { ArrowLeft, CalendarPlus, ClipboardEdit, Sparkles } from 'lucide-react'
import type { PatientDetailBase, PatientStats, PlanTier } from '@/../product/sections/pacientes/types'
import { Avatar } from './Avatar'

interface PatientDetailHeaderProps {
  patient: PatientDetailBase
  stats: PatientStats
  currentPlan: PlanTier
  onBack?: () => void
  onAgendar?: () => void
  onAnaliseIa?: () => void
  onNovoAtendimento?: () => void
}

const STATUS_CONFIG = {
  vinculado: {
    label: 'Vinculado',
    tone: 'bg-emerald-500/15 text-emerald-700 ring-emerald-300 dark:text-emerald-300 dark:ring-emerald-700',
    dot: 'bg-emerald-500',
  },
  pendente: {
    label: 'Pendente',
    tone: 'bg-amber-500/15 text-amber-700 ring-amber-300 dark:text-amber-300 dark:ring-amber-700',
    dot: 'bg-amber-500',
  },
  arquivado: {
    label: 'Arquivado',
    tone: 'bg-slate-500/15 text-slate-700 ring-slate-300 dark:text-slate-300 dark:ring-slate-700',
    dot: 'bg-slate-400',
  },
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function PatientDetailHeader({
  patient,
  stats,
  currentPlan,
  onBack,
  onAgendar,
  onAnaliseIa,
  onNovoAtendimento,
}: PatientDetailHeaderProps) {
  const status = STATUS_CONFIG[patient.status]

  const canAnaliseIa = PLAN_RANK[currentPlan] >= PLAN_RANK['pro']
  const canAtendimento = PLAN_RANK[currentPlan] >= PLAN_RANK['plus']

  return (
    <div className="space-y-5">
      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft size={14} />
        Voltar para a carteira
      </button>

      {/* Identity row */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar name={patient.name} imageUrl={patient.avatarUrl} size="xl" />
            {patient.linkedToApp && (
              <span
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-slate-50 dark:ring-slate-950"
                title="Vinculado ao app"
              />
            )}
          </div>

          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
              Paciente
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                {patient.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${status.tone}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {patient.email}
              {patient.linkedDaysAgo !== null && patient.linkedDaysAgo > 0 && (
                <>
                  <span className="mx-2 text-slate-300 dark:text-slate-700">·</span>
                  <span>Vinculado há {patient.linkedDaysAgo} dias</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAgendar}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
          >
            <CalendarPlus size={14} />
            Agendar Consulta
          </button>

          <button
            type="button"
            onClick={onAnaliseIa}
            className={`group inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 ${
              canAnaliseIa
                ? 'border border-orange-300 bg-orange-50 text-orange-800 hover:border-orange-400 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-200 dark:hover:bg-orange-900/50'
                : 'border border-dashed border-orange-300 bg-orange-50/50 text-orange-700/80 hover:bg-orange-50 dark:border-orange-800 dark:bg-orange-900/10 dark:text-orange-300/80'
            }`}
          >
            <Sparkles size={14} />
            Análise IA
            {!canAnaliseIa && (
              <span className="ml-1 rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-900/60 dark:text-orange-200">
                Pro
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onNovoAtendimento}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 ${
              canAtendimento
                ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20'
                : 'bg-teal-600/60 text-white/80'
            }`}
          >
            <ClipboardEdit size={14} />
            Novo Atendimento
            {!canAtendimento && (
              <span className="ml-1 rounded bg-orange-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-orange-800">
                Plus
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Atendimentos"
          value={String(stats.totalAtendimentos)}
          caption="no histórico"
        />
        <StatTile
          label="Metas ativas"
          value={String(stats.metasAtivas)}
          caption="em andamento"
        />
        <StatTile
          label="Peso atual"
          value={`${stats.pesoAtual.value}`}
          unit={stats.pesoAtual.unit}
          caption={`atualizado ${formatRelativeDate(stats.pesoAtual.lastUpdated)}`}
        />
        <StatTile
          label="Último atendimento"
          value={String(stats.ultimoAtendimentoDiasAtras)}
          unit="dias atrás"
          caption={
            stats.proximoAgendamento
              ? `próximo: ${stats.proximoAgendamento}`
              : 'sem novo agendado'
          }
        />
      </div>
    </div>
  )
}

function StatTile({
  label,
  value,
  unit,
  caption,
}: {
  label: string
  value: string
  unit?: string
  caption: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{unit}</span>
        )}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
        {caption}
      </p>
    </div>
  )
}

function formatRelativeDate(iso: string) {
  // Lightweight: just show the date without locale gymnastics
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
  } catch {
    return iso
  }
}
