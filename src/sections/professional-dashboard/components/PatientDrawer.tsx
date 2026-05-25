import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  Smile,
  Sparkles,
  X,
} from 'lucide-react'
import type {
  DrawerContent,
  DrawerMetric,
  Severity,
  Tone,
} from '@/../product/sections/professional-dashboard/types'
import { severityIcon, typeIcon, typeLabel } from './AlertPills'

interface Props {
  drawer: DrawerContent
  onClose?: () => void
  onOpenTimeline?: (patientId: string) => void
  onAcknowledgeAlert?: (patientId: string, alertId: string) => void
  onSaveClinicalNote?: (patientId: string, note: string) => void
}

const severityRing: Record<Severity, string> = {
  critical:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-500/10 dark:text-rose-300',
  warning:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-500/10 dark:text-amber-300',
  info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-500/10 dark:text-sky-300',
}

const metricTone: Record<Tone, string> = {
  good: 'text-teal-600 dark:text-teal-400',
  warning: 'text-amber-600 dark:text-amber-400',
  critical: 'text-rose-600 dark:text-rose-400',
  neutral: 'text-slate-500 dark:text-slate-400',
  info: 'text-sky-600 dark:text-sky-400',
}

export function PatientDrawer({
  drawer,
  onClose,
  onOpenTimeline,
  onAcknowledgeAlert,
  onSaveClinicalNote,
}: Props) {
  const [note, setNote] = useState('')

  if (!drawer.isOpen || !drawer.patient || !drawer.snapshot) {
    return (
      <aside
        aria-hidden="true"
        className="
          hidden xl:flex flex-col items-center justify-center
          w-full xl:w-[420px] xl:shrink-0
          rounded-2xl border border-dashed border-slate-200 dark:border-slate-800
          bg-white/40 dark:bg-slate-900/30
          text-center p-8
          text-slate-400 dark:text-slate-500
        "
      >
        <Smile className="w-5 h-5 mb-2" />
        <p className="text-sm font-medium">Selecione um paciente</p>
        <p className="mt-1 text-xs">
          Clique em uma linha para abrir o resumo clínico à direita.
        </p>
      </aside>
    )
  }

  const { patient, snapshot, openAlerts, clinicalNotes } = drawer

  return (
    <aside
      className="
        relative flex flex-col
        w-full xl:w-[420px] xl:shrink-0
        rounded-2xl overflow-hidden
        bg-white/95 dark:bg-slate-900/90
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
      aria-label={`Resumo clínico de ${patient.fullName}`}
    >
      {/* Header */}
      <header className="relative p-5 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-teal-500/10 via-transparent to-violet-500/10 pointer-events-none"
        />
        <div className="relative flex items-start gap-3">
          <div
            aria-hidden="true"
            className="
              shrink-0 grid place-items-center w-12 h-12 rounded-full
              bg-gradient-to-br from-teal-400 to-violet-400 text-white
              text-sm font-semibold
              shadow-[0_8px_24px_-12px_rgba(13,148,136,0.5)]
            "
          >
            {patient.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                {patient.fullName}
              </h3>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar drawer"
                  className="
                    shrink-0 grid place-items-center w-8 h-8 rounded-lg
                    text-slate-400 dark:text-slate-500
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    hover:text-slate-700 dark:hover:text-slate-200
                    transition-colors
                  "
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {patient.age} anos · {patient.linkedSinceLabel}
            </div>
            {patient.conditions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {patient.conditions.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Snapshot */}
        <section className="p-5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Snapshot
            </h4>
            <div className={`text-[11px] font-medium ${metricTone[snapshot.latestMood.tone]}`}>
              {snapshot.latestMood.label}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {snapshot.metrics.map((m) => (
              <MetricMini key={m.id} metric={m} />
            ))}
          </div>
        </section>

        {/* Alerts */}
        <section className="p-5 border-b border-slate-200/80 dark:border-slate-800">
          <h4 className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400 mb-3">
            Alertas abertos · {openAlerts.length}
          </h4>
          {openAlerts.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nenhum alerta aberto para este paciente.
            </p>
          ) : (
            <ul className="space-y-2">
              {openAlerts.map((a) => {
                const SevIcon = severityIcon[a.severity]
                const TypeIcon = typeIcon[a.type]
                return (
                  <li
                    key={a.id}
                    className={`
                      rounded-lg border p-3
                      ${severityRing[a.severity]}
                    `}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="shrink-0 grid place-items-center w-7 h-7 rounded-md bg-white/60 dark:bg-slate-900/60">
                        <TypeIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold opacity-80">
                          <SevIcon className="w-3 h-3" />
                          <span>{typeLabel[a.type]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="normal-case tracking-normal">
                            {a.sinceLabel}
                          </span>
                        </div>
                        <div className="mt-0.5 text-sm font-semibold leading-snug">
                          {a.label}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed opacity-90">
                          {a.detail}
                        </p>
                      </div>
                      {onAcknowledgeAlert && (
                        <button
                          type="button"
                          onClick={() => onAcknowledgeAlert(patient.id, a.id)}
                          aria-label="Marcar como visto"
                          title="Marcar como visto"
                          className="
                            shrink-0 grid place-items-center w-7 h-7 rounded-md
                            bg-white/70 dark:bg-slate-900/70
                            text-slate-500 dark:text-slate-400
                            hover:bg-white dark:hover:bg-slate-900
                            hover:text-slate-900 dark:hover:text-slate-100
                            transition-colors
                          "
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Clinical notes */}
        <section className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Notas clínicas
            </h4>
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-400 dark:text-slate-500">
              {clinicalNotes.length}
            </span>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-3">
            <label className="sr-only" htmlFor="clinical-note">
              Nova nota clínica
            </label>
            <textarea
              id="clinical-note"
              rows={3}
              placeholder="Observação clínica, próximos passos, orientações…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="
                w-full resize-none bg-transparent text-sm
                text-slate-900 dark:text-slate-100
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:outline-none
              "
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3 h-3 text-teal-500" />
                Salva no prontuário
              </div>
              <button
                type="button"
                disabled={note.trim().length === 0}
                onClick={() => {
                  if (note.trim().length === 0) return
                  onSaveClinicalNote?.(patient.id, note.trim())
                  setNote('')
                }}
                className="
                  inline-flex items-center gap-1.5 px-3 py-1.5
                  rounded-md text-xs font-semibold
                  bg-teal-600 text-white
                  hover:bg-teal-500 active:bg-teal-700
                  disabled:bg-slate-200 disabled:text-slate-500
                  dark:disabled:bg-slate-800 dark:disabled:text-slate-500
                  transition-colors
                "
              >
                Salvar nota
              </button>
            </div>
          </div>

          {clinicalNotes.length > 0 && (
            <ul className="mt-4 space-y-3">
              {clinicalNotes.map((n) => (
                <li
                  key={n.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-3"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {n.author}
                    </span>
                    <span>{n.dateLabel}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {n.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Footer CTA */}
      <footer className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90">
        <button
          type="button"
          onClick={() => onOpenTimeline?.(patient.id)}
          className="
            w-full inline-flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg text-sm font-semibold
            bg-slate-900 text-white
            hover:bg-slate-800
            dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
            transition-colors
          "
        >
          <ExternalLink className="w-4 h-4" />
          Abrir timeline completa
          <ArrowUpRight className="w-4 h-4 opacity-70" />
        </button>
      </footer>
    </aside>
  )
}

function MetricMini({ metric }: { metric: DrawerMetric }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
      <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        {metric.label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
          {metric.value}
        </span>
        {metric.unit && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {metric.unit}
          </span>
        )}
      </div>
      <div className={`mt-0.5 text-[11px] font-medium ${metricTone[metric.tone]}`}>
        {metric.trendLabel}
      </div>
    </div>
  )
}
