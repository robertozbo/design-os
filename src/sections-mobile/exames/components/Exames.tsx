import { useMemo } from 'react'
import type {
  Exam,
  ExamDateGroup,
  ExamesProps,
  ValueStatus,
} from '@/../product-mobile/sections/exames/types'

const STATUS_COLOR: Record<ValueStatus, string> = {
  normal: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  warning: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  critical: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
}

const STATUS_LABEL: Record<ValueStatus, string> = {
  normal: 'Normal',
  warning: 'Atenção',
  critical: 'Crítico',
}

function getWorstStatus(values: Exam['extractedValues']): ValueStatus {
  const statuses = Object.values(values).map((v) => v.status)
  if (statuses.includes('critical')) return 'critical'
  if (statuses.includes('warning')) return 'warning'
  return 'normal'
}

function getFirstSummary(values: Exam['extractedValues']): string | null {
  const entries = Object.entries(values)
  if (entries.length === 0) return null
  const [key, val] = entries[0]
  return `${key.replace(/_/g, ' ')}: ${val.value} ${val.unit}`
}

export function Exames({
  data,
  onAbrirExame,
  onNovoExame,
  onAbrirHistorico,
  onRefresh,
}: ExamesProps) {
  const { stats, groups } = data

  const headerStats = useMemo(
    () => [
      { id: 'total', label: 'Total', value: stats.total, icon: 'FileText' },
      { id: 'processed', label: 'Processados', value: stats.processed, icon: 'CheckCircle' },
      { id: 'pending', label: 'Pendentes', value: stats.pending, icon: 'Clock' },
    ],
    [stats],
  )

  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <div className="px-4 pt-4 pb-24">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2">
          {headerStats.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-400">
                {s.label}
              </div>
              <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-50">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Resumo por tipo */}
        {stats.byType.length > 0 && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[11.5px] font-semibold text-slate-100">Resumo por tipo</div>
                <div className="mt-0.5 text-[10px] text-slate-400">Registros por tipo de exame</div>
              </div>
              <button
                type="button"
                onClick={onAbrirHistorico}
                className="flex items-center gap-1 text-[10.5px] font-semibold text-teal-400 hover:text-teal-300"
              >
                Histórico →
              </button>
            </div>
            <div className="space-y-1.5">
              {stats.byType.map((item) => (
                <div key={item.typeName} className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">{item.label}</span>
                  <span className="font-mono text-[11px] font-semibold tabular-nums text-slate-100">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section list */}
        {groups.length === 0 ? (
          <EmptyState onNovoExame={onNovoExame} />
        ) : (
          <div className="mt-5 space-y-5">
            {groups.map((group) => (
              <ExamGroup
                key={group.dateISO}
                group={group}
                onAbrirExame={onAbrirExame}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={onNovoExame}
        aria-label="Novo exame"
        className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-teal-500 text-2xl text-slate-950 shadow-[0_8px_24px_-6px_rgba(20,184,166,0.6)] hover:bg-teal-400"
      >
        +
      </button>
    </div>
  )
}

function ExamGroup({
  group,
  onAbrirExame,
}: {
  group: ExamDateGroup
  onAbrirExame?: (id: string) => void
}) {
  return (
    <div>
      <div className="mb-2 px-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {group.dateLabel}
      </div>
      <div className="space-y-2">
        {group.exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} onTap={() => onAbrirExame?.(exam.id)} />
        ))}
      </div>
    </div>
  )
}

function ExamCard({ exam, onTap }: { exam: Exam; onTap: () => void }) {
  const isProcessing =
    exam.processing.phase === 'validating' || exam.processing.phase === 'extracting'
  const isFailed = exam.processing.failed
  const summary = !isProcessing && !isFailed ? getFirstSummary(exam.extractedValues) : null
  const worstStatus = !isProcessing && !isFailed ? getWorstStatus(exam.extractedValues) : null

  return (
    <button
      type="button"
      onClick={onTap}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left transition-colors hover:bg-slate-900"
    >
      {/* Icon */}
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
          isFailed
            ? 'bg-rose-500/15 text-rose-300'
            : isProcessing
              ? 'bg-slate-800 text-slate-500'
              : 'bg-teal-500/15 text-teal-300'
        }`}
        aria-hidden
      >
        <DropletsIcon />
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[12.5px] font-semibold text-slate-100">
            {exam.examType.displayName}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-slate-500">
            {exam.timeLabel}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[10.5px] text-slate-400">
          {isFailed
            ? exam.processing.errorMessage ?? 'Análise falhou'
            : isProcessing
              ? 'Processando…'
              : summary ?? 'Sem marcadores'}
        </div>
      </div>

      {/* Badge */}
      {isFailed ? (
        <span className="shrink-0 rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-rose-300">
          Falhou
        </span>
      ) : isProcessing ? (
        <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
          Processando
        </span>
      ) : worstStatus ? (
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${STATUS_COLOR[worstStatus]}`}
        >
          {STATUS_LABEL[worstStatus]}
        </span>
      ) : null}
    </button>
  )
}

function EmptyState({ onNovoExame }: { onNovoExame?: () => void }) {
  return (
    <div className="mt-12 flex flex-col items-center text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-500">
        <DropletsIcon />
      </div>
      <h3 className="mt-4 text-[14px] font-semibold text-slate-100">
        Você ainda não tem exames
      </h3>
      <p className="mt-1 max-w-xs text-[11.5px] text-slate-400">
        Tire foto do laudo ou faça upload do PDF. A IA extrai os marcadores automaticamente.
      </p>
      <button
        type="button"
        onClick={onNovoExame}
        className="mt-5 rounded-full bg-teal-500 px-5 py-2 text-[12px] font-semibold text-slate-950 hover:bg-teal-400"
      >
        Adicionar primeiro exame
      </button>
    </div>
  )
}

function DropletsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  )
}
