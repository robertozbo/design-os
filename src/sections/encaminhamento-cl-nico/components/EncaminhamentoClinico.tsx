import { useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import type {
  EncaminhamentoClinicoProps,
  Instrument,
  InvitePayload,
  Referral,
  ReferralTab,
  SignalPriority,
} from '@/../product/sections/encaminhamento-cl-nico/types'
import { PrivacyBanner } from './PrivacyBanner'
import { StatusTabs } from './StatusTabs'
import { FilterBar } from './FilterBar'
import { ReferralCard } from './ReferralCard'
import { ReferralDrawer } from './ReferralDrawer'
import { SendInviteModal } from './SendInviteModal'
import { AssignProfessionalModal } from './AssignProfessionalModal'
import { EmptyState } from './EmptyState'
import { STATUS_TO_TAB } from './utils'

type ModalState =
  | { kind: 'sendInvite'; referralId: string }
  | { kind: 'assignProfessional'; referralId: string }
  | null

export function EncaminhamentoClinico({
  referrals,
  partnerProfessionals,
  summary,
  filters,
  onSendInvite,
  onResendInvite,
  onCancelInvite,
  onDiscardSuggestion,
  onAssignProfessional,
  onMarkCompleted,
  onReopen,
  onArchive,
}: EncaminhamentoClinicoProps) {
  const [activeTab, setActiveTab] = useState<ReferralTab>('sugestoes')
  const [sectorFilter, setSectorFilter] = useState<string | null>(null)
  const [instrumentFilter, setInstrumentFilter] = useState<Instrument | null>(null)
  const [priorityFilters, setPriorityFilters] = useState<SignalPriority[]>([])
  const [drawerId, setDrawerId] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)

  const visible = useMemo(() => {
    return referrals
      .filter((r) => STATUS_TO_TAB[r.status] === activeTab)
      .filter((r) => !sectorFilter || r.sector === sectorFilter)
      .filter((r) => !instrumentFilter || r.riskSignal.instrument === instrumentFilter)
      .filter((r) => priorityFilters.length === 0 || priorityFilters.includes(r.riskSignal.priority))
      .sort((a, b) => new Date(b.lastTransitionAt).getTime() - new Date(a.lastTransitionAt).getTime())
  }, [referrals, activeTab, sectorFilter, instrumentFilter, priorityFilters])

  const hasActiveFilters =
    sectorFilter !== null || instrumentFilter !== null || priorityFilters.length > 0

  const drawerReferral = drawerId ? referrals.find((r) => r.id === drawerId) ?? null : null
  const modalReferral =
    modal ? referrals.find((r) => r.id === modal.referralId) ?? null : null

  function handleClearFilters() {
    setSectorFilter(null)
    setInstrumentFilter(null)
    setPriorityFilters([])
  }

  function handleTogglePriority(p: SignalPriority) {
    setPriorityFilters((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    )
  }

  function openDrawer(id: string) {
    setDrawerId(id)
  }

  function closeDrawer() {
    setDrawerId(null)
  }

  function openSendInvite(id: string) {
    setModal({ kind: 'sendInvite', referralId: id })
  }

  function openAssign(id: string) {
    setModal({ kind: 'assignProfessional', referralId: id })
  }

  function closeModal() {
    setModal(null)
  }

  function confirmSendInvite(referralId: string, payload: InvitePayload) {
    onSendInvite?.(referralId, payload)
    closeModal()
    closeDrawer()
  }

  function confirmAssign(referralId: string, professionalId: string) {
    onAssignProfessional?.(referralId, professionalId)
    closeModal()
  }

  function handleResend(r: Referral) {
    onResendInvite?.(r.id)
    closeDrawer()
  }

  function handleCancel(r: Referral) {
    onCancelInvite?.(r.id, 'Cancelado pelo SST')
    closeDrawer()
  }

  function handleDiscard(r: Referral) {
    onDiscardSuggestion?.(r.id, 'Sugestão descartada após análise')
    closeDrawer()
  }

  function handleComplete(r: Referral) {
    onMarkCompleted?.(r.id)
    closeDrawer()
  }

  function handleReopen(r: Referral) {
    onReopen?.(r.id)
    closeDrawer()
  }

  function handleArchive(r: Referral) {
    onArchive?.(r.id)
    closeDrawer()
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div
        className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white via-white/80 dark:from-slate-900 dark:via-slate-900/80 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <header className="flex flex-col gap-1.5 mb-6">
          <div className="flex items-center gap-2">
            <span className="
              inline-flex items-center gap-1.5
              px-2 py-0.5 rounded-md
              text-[10px] uppercase tracking-[0.14em] font-semibold
              bg-teal-50 dark:bg-teal-950/40
              text-teal-700 dark:text-teal-300
              ring-1 ring-teal-200 dark:ring-teal-900/60
            ">
              <ShieldCheck className="w-3 h-3" strokeWidth={2} />
              NR-1 · Saúde mental
            </span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Encaminhamento Clínico
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Triagem de sinais de risco individual com consentimento explícito do trabalhador. Identidade real só é revelada ao profissional clínico após o aceite.
          </p>
        </header>

        <div className="space-y-5">
          <PrivacyBanner />
          <StatusTabs active={activeTab} summary={summary} onChange={setActiveTab} />
          <FilterBar
            sectors={filters.sectors}
            instruments={filters.instruments}
            sectorFilter={sectorFilter}
            instrumentFilter={instrumentFilter}
            priorityFilters={priorityFilters}
            onChangeSector={setSectorFilter}
            onChangeInstrument={setInstrumentFilter}
            onTogglePriority={handleTogglePriority}
            onClearAll={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {visible.length === 0 ? (
            <EmptyState
              tab={activeTab}
              filtered={hasActiveFilters}
              onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
            />
          ) : (
            <ol className="flex flex-col gap-2">
              {visible.map((r, i) => (
                <li
                  key={r.id}
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                  className="opacity-0 animate-[reveal_500ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
                >
                  <ReferralCard
                    referral={r}
                    partners={partnerProfessionals}
                    onClick={() => openDrawer(r.id)}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {drawerReferral && (
        <ReferralDrawer
          referral={drawerReferral}
          partners={partnerProfessionals}
          onClose={closeDrawer}
          onSendInvite={() => openSendInvite(drawerReferral.id)}
          onResendInvite={() => handleResend(drawerReferral)}
          onCancelInvite={() => handleCancel(drawerReferral)}
          onDiscardSuggestion={() => handleDiscard(drawerReferral)}
          onAssignProfessional={() => openAssign(drawerReferral.id)}
          onMarkCompleted={() => handleComplete(drawerReferral)}
          onReopen={() => handleReopen(drawerReferral)}
          onArchive={() => handleArchive(drawerReferral)}
        />
      )}

      {modal?.kind === 'sendInvite' && modalReferral && (
        <SendInviteModal
          referral={modalReferral}
          partners={partnerProfessionals}
          onClose={closeModal}
          onConfirm={(payload) => confirmSendInvite(modalReferral.id, payload)}
        />
      )}

      {modal?.kind === 'assignProfessional' && modalReferral && (
        <AssignProfessionalModal
          referral={modalReferral}
          partners={partnerProfessionals}
          onClose={closeModal}
          onConfirm={(profId) => confirmAssign(modalReferral.id, profId)}
        />
      )}

      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-["],
          .animate-in { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  )
}
