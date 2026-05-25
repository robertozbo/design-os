import {
  Archive,
  CheckCircle2,
  Mail,
  RotateCcw,
  Trash2,
  UserPlus,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { useEffect } from 'react'
import type {
  PartnerProfessional,
  Referral,
} from '@/../product/sections/encaminhamento-cl-nico/types'
import {
  ACTOR_TONE,
  EVENT_ICON,
  PRIORITY_TONE,
  STATUS_META,
  STATUS_TONE_CLASS,
  formatAbsolute,
  formatRelative,
  getInitials,
  partnerById,
} from './utils'

interface ReferralDrawerProps {
  referral: Referral
  partners: PartnerProfessional[]
  onClose: () => void
  onSendInvite: () => void
  onResendInvite: () => void
  onCancelInvite: () => void
  onDiscardSuggestion: () => void
  onAssignProfessional: () => void
  onMarkCompleted: () => void
  onReopen: () => void
  onArchive: () => void
}

export function ReferralDrawer({
  referral,
  partners,
  onClose,
  onSendInvite,
  onResendInvite,
  onCancelInvite,
  onDiscardSuggestion,
  onAssignProfessional,
  onMarkCompleted,
  onReopen,
  onArchive,
}: ReferralDrawerProps) {
  const tone = PRIORITY_TONE[referral.riskSignal.priority]
  const statusMeta = STATUS_META[referral.status]
  const statusClass = STATUS_TONE_CLASS[statusMeta.tone]
  const partner = partnerById(partners, referral.assignedProfessionalId)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40" aria-modal="true" role="dialog">
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <aside
        className="
          absolute right-0 top-0 bottom-0
          w-full sm:max-w-xl
          bg-white dark:bg-slate-950
          ring-1 ring-slate-200 dark:ring-slate-800
          shadow-2xl shadow-slate-900/10 dark:shadow-black/40
          flex flex-col
          animate-in slide-in-from-right-4 fade-in duration-300
        "
      >
        <header className="shrink-0 flex items-start gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
              <span className={`
                inline-flex items-center gap-1
                px-1.5 py-0.5 rounded-md
                text-[10px] uppercase tracking-[0.14em] font-semibold
                ${tone.bg} ${tone.text}
              `}>
                <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
                {tone.label}
              </span>
              <span className={`
                inline-flex items-center
                px-1.5 py-0.5 rounded-md
                text-[10px] uppercase tracking-[0.14em] font-semibold
                ${statusClass.bg} ${statusClass.text}
              `}>
                {statusMeta.label}
              </span>
            </div>
            <h2 className="font-mono text-base font-semibold text-slate-900 dark:text-slate-50 tracking-tight truncate">
              {referral.codename}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {referral.sector} · sinal detectado {formatRelative(referral.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              shrink-0 inline-flex items-center justify-center
              w-9 h-9 rounded-lg
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-slate-800
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <RiskSignalSection referral={referral} />
          {partner && <AssignedSection partner={partner} />}
          {referral.cancellationReason && <NoteCard label="Motivo do cancelamento" body={referral.cancellationReason} />}
          <TimelineSection referral={referral} />
        </div>

        <ActionFooter
          referral={referral}
          onSendInvite={onSendInvite}
          onResendInvite={onResendInvite}
          onCancelInvite={onCancelInvite}
          onDiscardSuggestion={onDiscardSuggestion}
          onAssignProfessional={onAssignProfessional}
          onMarkCompleted={onMarkCompleted}
          onReopen={onReopen}
          onArchive={onArchive}
        />
      </aside>
    </div>
  )
}

function RiskSignalSection({ referral }: { referral: Referral }) {
  const tone = PRIORITY_TONE[referral.riskSignal.priority]
  const pct = (referral.riskSignal.score / referral.riskSignal.scoreMax) * 100

  return (
    <section>
      <SectionLabel>Sinal de risco</SectionLabel>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 p-4">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
            {referral.riskSignal.instrument}
          </div>
          <div className="text-right">
            <div className={`text-2xl font-semibold tabular-nums ${tone.text}`}>
              {referral.riskSignal.score}
              <span className="text-sm text-slate-400 dark:text-slate-500 font-normal">/{referral.riskSignal.scoreMax}</span>
            </div>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${tone.rail}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {referral.riskSignal.factors.map((f, i) => (
            <span
              key={i}
              className={`
                inline-flex items-center
                px-2 py-0.5 rounded-md
                text-[11px] font-medium
                ${tone.bg} ${tone.text}
                ring-1 ${tone.ring}
              `}
            >
              {f}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-500">
          Resposta enviada em {formatAbsolute(referral.riskSignal.respondedAt)}
        </p>
      </div>
    </section>
  )
}

function AssignedSection({ partner }: { partner: PartnerProfessional }) {
  return (
    <section>
      <SectionLabel>Profissional atribuído</SectionLabel>
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-200 dark:ring-emerald-900/40 p-3">
        <div className="
          shrink-0 w-10 h-10 rounded-full
          bg-emerald-100 dark:bg-emerald-950/60
          ring-1 ring-emerald-200 dark:ring-emerald-900/60
          flex items-center justify-center
        ">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {getInitials(partner.name)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {partner.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {partner.specialty} · {partner.languages.map((l) => l.toUpperCase()).join(' · ')}
          </div>
        </div>
      </div>
    </section>
  )
}

function NoteCard({ label, body }: { label: string; body: string }) {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed rounded-xl bg-slate-50 dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 p-3">
        {body}
      </p>
    </section>
  )
}

function TimelineSection({ referral }: { referral: Referral }) {
  return (
    <section>
      <SectionLabel>Timeline</SectionLabel>
      <ol className="relative space-y-3 ml-3">
        <span
          aria-hidden="true"
          className="absolute left-[14px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800"
        />
        {referral.timeline.map((event) => {
          const Icon = EVENT_ICON[event.type]
          const actor = ACTOR_TONE[event.actor]
          return (
            <li key={event.id} className="relative pl-10">
              <div
                className={`
                  absolute left-0 top-0
                  w-7 h-7 rounded-full
                  flex items-center justify-center
                  ring-2 ring-white dark:ring-slate-950
                  ${actor.bg}
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${actor.text}`} strokeWidth={2} />
              </div>
              <div className="text-[13px] text-slate-900 dark:text-slate-100 leading-snug">
                {event.label}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className={`text-[10px] uppercase tracking-[0.14em] font-medium ${actor.text}`}>
                  {actor.label}
                </span>
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                <time
                  className="text-[11px] text-slate-500 dark:text-slate-500 tabular-nums"
                  title={formatAbsolute(event.timestamp)}
                  dateTime={event.timestamp}
                >
                  {formatAbsolute(event.timestamp)}
                </time>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-500 mb-2">
      {children}
    </h3>
  )
}

interface ActionFooterProps {
  referral: Referral
  onSendInvite: () => void
  onResendInvite: () => void
  onCancelInvite: () => void
  onDiscardSuggestion: () => void
  onAssignProfessional: () => void
  onMarkCompleted: () => void
  onReopen: () => void
  onArchive: () => void
}

function ActionFooter({
  referral,
  onSendInvite,
  onResendInvite,
  onCancelInvite,
  onDiscardSuggestion,
  onAssignProfessional,
  onMarkCompleted,
  onReopen,
  onArchive,
}: ActionFooterProps) {
  let primary: { label: string; icon: LucideIcon; onClick: () => void } | null = null
  const secondaries: { label: string; icon: LucideIcon; onClick: () => void; danger?: boolean }[] = []

  switch (referral.status) {
    case 'sugestao':
      primary = { label: 'Enviar convite', icon: Mail, onClick: onSendInvite }
      secondaries.push({ label: 'Descartar sugestão', icon: Trash2, onClick: onDiscardSuggestion, danger: true })
      break
    case 'aguardando':
      primary = { label: 'Reenviar convite', icon: RotateCcw, onClick: onResendInvite }
      secondaries.push({ label: referral.assignedProfessionalId ? 'Trocar profissional' : 'Atribuir profissional', icon: UserPlus, onClick: onAssignProfessional })
      secondaries.push({ label: 'Cancelar convite', icon: XCircle, onClick: onCancelInvite, danger: true })
      break
    case 'em_atendimento':
      primary = referral.assignedProfessionalId
        ? { label: 'Marcar como concluído', icon: CheckCircle2, onClick: onMarkCompleted }
        : { label: 'Atribuir profissional', icon: UserPlus, onClick: onAssignProfessional }
      if (referral.assignedProfessionalId) {
        secondaries.push({ label: 'Trocar profissional', icon: UserPlus, onClick: onAssignProfessional })
      }
      break
    case 'concluido':
    case 'recusado':
    case 'cancelado':
      primary = { label: 'Reabrir caso', icon: RotateCcw, onClick: onReopen }
      secondaries.push({ label: 'Arquivar', icon: Archive, onClick: onArchive })
      break
  }

  if (!primary) return null

  const PrimaryIcon = primary.icon

  return (
    <footer className="shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
      {secondaries.map((s) => {
        const Icon = s.icon
        return (
          <button
            key={s.label}
            type="button"
            onClick={s.onClick}
            className={`
              inline-flex items-center justify-center gap-1.5
              px-3 py-2 rounded-lg
              text-xs font-medium
              ring-1 transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
              ${s.danger
                ? 'text-rose-700 dark:text-rose-300 ring-rose-200 dark:ring-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                : 'text-slate-700 dark:text-slate-200 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600 bg-white dark:bg-slate-900'}
            `}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={2} />
            {s.label}
          </button>
        )
      })}
      <button
        type="button"
        onClick={primary.onClick}
        className="
          inline-flex items-center justify-center gap-1.5
          px-3.5 py-2 rounded-lg
          text-xs font-semibold
          bg-teal-600 hover:bg-teal-700
          dark:bg-teal-500 dark:hover:bg-teal-400
          text-white dark:text-slate-950
          shadow-sm
          transition-all duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
        "
      >
        <PrimaryIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
        {primary.label}
      </button>
    </footer>
  )
}
