import { ChevronRight, UserCircle2 } from 'lucide-react'
import type {
  PartnerProfessional,
  Referral,
} from '@/../product/sections/encaminhamento-cl-nico/types'
import {
  PRIORITY_TONE,
  STATUS_META,
  STATUS_TONE_CLASS,
  formatRelative,
  formatAbsolute,
  timeInState,
  partnerById,
  getInitials,
} from './utils'

interface ReferralCardProps {
  referral: Referral
  partners: PartnerProfessional[]
  onClick?: () => void
}

export function ReferralCard({ referral, partners, onClick }: ReferralCardProps) {
  const tone = PRIORITY_TONE[referral.riskSignal.priority]
  const statusMeta = STATUS_META[referral.status]
  const statusClass = STATUS_TONE_CLASS[statusMeta.tone]
  const partner = partnerById(partners, referral.assignedProfessionalId)

  return (
    <article
      className="
        group relative
        rounded-xl
        bg-white dark:bg-slate-900
        ring-1 ring-slate-200 dark:ring-slate-800
        transition-all duration-200
        hover:ring-slate-300 dark:hover:ring-slate-700
        hover:shadow-sm hover:shadow-slate-900/5 dark:hover:shadow-black/30
        focus-within:ring-teal-400 dark:focus-within:ring-teal-500
      "
    >
      <span
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${tone.rail}`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onClick}
        className="w-full text-left pl-4 pr-3 py-4 focus:outline-none"
        aria-label={`Abrir caso ${referral.codename}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
              <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
              <time
                className="text-[11px] text-slate-500 dark:text-slate-500 tabular-nums"
                title={formatAbsolute(referral.lastTransitionAt)}
                dateTime={referral.lastTransitionAt}
              >
                {referral.status === 'sugestao'
                  ? `Detectado ${formatRelative(referral.createdAt)}`
                  : `Atualizado ${timeInState(referral)}`}
              </time>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="font-mono text-[13px] font-medium text-slate-900 dark:text-slate-50 tracking-tight">
                {referral.codename}
              </span>
              <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {referral.sector}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="
                inline-flex items-center gap-1
                px-2 py-0.5 rounded-md
                text-[11px] font-mono font-medium
                bg-slate-100 dark:bg-slate-800/80
                text-slate-700 dark:text-slate-300
                ring-1 ring-slate-200 dark:ring-slate-700
              ">
                {referral.riskSignal.instrument}
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span className="tabular-nums">{referral.riskSignal.score}/{referral.riskSignal.scoreMax}</span>
              </span>
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
          </div>

          <div className="shrink-0 flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
            {partner ? (
              <div className="flex items-center gap-2">
                <div className="
                  shrink-0 w-8 h-8 rounded-full
                  bg-emerald-100 dark:bg-emerald-950/50
                  ring-1 ring-emerald-200 dark:ring-emerald-900/60
                  flex items-center justify-center
                ">
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    {getInitials(partner.name)}
                  </span>
                </div>
                <div className="min-w-0 hidden sm:block text-right">
                  <div className="text-[11px] font-medium text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                    {partner.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-500 truncate max-w-[140px]">
                    {partner.specialty}
                  </div>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                <UserCircle2 className="w-4 h-4" strokeWidth={1.5} />
                Não atribuído
              </div>
            )}
            <ChevronRight
              className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
              strokeWidth={2}
            />
          </div>
        </div>
      </button>
    </article>
  )
}
