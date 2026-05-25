import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, UserPlus, Users } from 'lucide-react'
import type {
  AcceptInvitePayload,
  DataCategoryKey,
  MyProfessionalsProps,
  PendingInvite,
  ProfessionalTypeKey,
  ProfessionalsView,
} from '@/../product/sections/my-professionals/types'
import { MyProfessionalsHeader } from './MyProfessionalsHeader'
import { HeroStats } from './HeroStats'
import { PendingInvitesBanner } from './PendingInvitesBanner'
import { ControlsBar } from './ControlsBar'
import { TypeChips } from './TypeChips'
import { ProfessionalListView } from './ProfessionalListView'
import { ProfessionalGridView } from './ProfessionalGridView'
import { LinkProfessionalModal } from './LinkProfessionalModal'
import { AcceptInviteModal } from './AcceptInviteModal'
import { ProfileDrawer } from './ProfileDrawer'

export function MyProfessionals({
  stats,
  pendingInvites,
  types,
  professionals,
  pagination,
  dataCategories,
  recommendedByType,
  onOpenLink,
  onSubmitLink,
  onAcceptInvite,
  onDismissInvite,
  onTypeChange,
  onSearchChange,
  onViewChange,
  onSelectProfessional,
  onUpdateSharedCategories,
  onSetPrimary,
  onUnlinkProfessional,
  onPageChange,
}: MyProfessionalsProps) {
  const [view, setView] = useState<ProfessionalsView>('list')
  const [typeKey, setTypeKey] = useState<ProfessionalTypeKey>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(pagination.page)
  const [linkOpen, setLinkOpen] = useState(false)
  const [activeInvite, setActiveInvite] = useState<PendingInvite | null>(null)
  const [activeReferralId, setActiveReferralId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return professionals.filter((r) => {
      const okType = typeKey === 'all' || r.professional.professionalType === typeKey
      const okQuery =
        !q ||
        r.professional.fullName.toLowerCase().includes(q) ||
        r.professional.typeLabel.toLowerCase().includes(q) ||
        r.professional.specialty.toLowerCase().includes(q) ||
        r.professional.email.toLowerCase().includes(q)
      return okType && okQuery
    })
  }, [professionals, typeKey, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pagination.pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pagination.pageSize
  const paged = filtered.slice(start, start + pagination.pageSize)

  const activeReferral = activeReferralId
    ? professionals.find((r) => r.id === activeReferralId) ?? null
    : null

  const handleType = (k: ProfessionalTypeKey) => {
    setTypeKey(k)
    setPage(1)
    onTypeChange?.(k)
  }
  const handleQuery = (q: string) => {
    setQuery(q)
    setPage(1)
    onSearchChange?.(q)
  }
  const handleView = (v: ProfessionalsView) => {
    setView(v)
    onViewChange?.(v)
  }
  const handlePage = (p: number) => {
    setPage(p)
    onPageChange?.(p)
  }
  const handleOpenLink = () => {
    setLinkOpen(true)
    onOpenLink?.()
  }
  const handleSelect = (id: string) => {
    setActiveReferralId(id)
    onSelectProfessional?.(id)
  }
  const handleAcceptInvite = (payload: AcceptInvitePayload) => {
    onAcceptInvite?.(payload)
    setActiveInvite(null)
  }
  const handleUpdateCategories = (referralId: string, sharedCategories: DataCategoryKey[]) => {
    onUpdateSharedCategories?.({ referralId, sharedCategories })
  }

  const isEmpty = professionals.length === 0
  const isFilterEmpty = !isEmpty && filtered.length === 0

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <MyProfessionalsHeader onOpenLink={handleOpenLink} />

        {pendingInvites.length > 0 && (
          <div className="mt-6">
            <PendingInvitesBanner
              invites={pendingInvites}
              revealIndex={1}
              onAccept={(invite) => setActiveInvite(invite)}
              onDismiss={onDismissInvite}
            />
          </div>
        )}

        {isEmpty ? (
          <EmptyState onOpenLink={handleOpenLink} />
        ) : (
          <>
            <div className="mt-6">
              <HeroStats stats={stats} revealStartIndex={2} />
            </div>

            <div
              className="nymos-reveal opacity-0 mt-6"
              style={{ animationDelay: `${80 * 5}ms` }}
            >
              <ControlsBar
                query={query}
                view={view}
                onQueryChange={handleQuery}
                onViewChange={handleView}
              />
            </div>

            <div
              className="nymos-reveal opacity-0 mt-3"
              style={{ animationDelay: `${80 * 6}ms` }}
            >
              <TypeChips types={types} activeKey={typeKey} onChange={handleType} />
            </div>

            <div
              className="nymos-reveal opacity-0 mt-4"
              style={{ animationDelay: `${80 * 7}ms` }}
            >
              {isFilterEmpty ? (
                <FilterEmptyState onClear={() => { handleQuery(''); handleType('all') }} />
              ) : view === 'list' ? (
                <ProfessionalListView referrals={paged} onSelect={handleSelect} />
              ) : (
                <ProfessionalGridView referrals={paged} onSelect={handleSelect} />
              )}

              {filtered.length > pagination.pageSize && (
                <Pagination
                  page={safePage}
                  totalPages={totalPages}
                  start={start + 1}
                  end={Math.min(start + pagination.pageSize, filtered.length)}
                  total={filtered.length}
                  onPage={handlePage}
                />
              )}
            </div>
          </>
        )}
      </div>

      <LinkProfessionalModal
        open={linkOpen}
        dataCategories={dataCategories}
        recommendedByType={recommendedByType}
        onClose={() => setLinkOpen(false)}
        onSubmit={(payload) => {
          onSubmitLink?.(payload)
          setLinkOpen(false)
        }}
      />

      <AcceptInviteModal
        invite={activeInvite}
        dataCategories={dataCategories}
        recommendedByType={recommendedByType}
        onClose={() => setActiveInvite(null)}
        onConfirm={handleAcceptInvite}
      />

      <ProfileDrawer
        referral={activeReferral}
        dataCategories={dataCategories}
        recommendedByType={recommendedByType}
        onClose={() => setActiveReferralId(null)}
        onSetPrimary={onSetPrimary}
        onUnlink={onUnlinkProfessional}
        onUpdateSharedCategories={handleUpdateCategories}
      />
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  start,
  end,
  total,
  onPage,
}: {
  page: number
  totalPages: number
  start: number
  end: number
  total: number
  onPage: (page: number) => void
}) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
        {start}–{end} de {total}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Página anterior"
          className="
            grid place-items-center w-8 h-8 rounded-lg
            text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
            transition-colors
          "
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-3 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-400">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Próxima página"
          className="
            grid place-items-center w-8 h-8 rounded-lg
            text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-slate-800
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
            transition-colors
          "
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function FilterEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div
      className="
        flex flex-col items-center justify-center text-center gap-2
        py-12 px-6
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-dashed border-slate-200 dark:border-slate-800
      "
    >
      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Nenhum profissional encontrado
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Ajuste a busca ou troque o tipo selecionado.
      </div>
      <button
        type="button"
        onClick={onClear}
        className="
          mt-2 inline-flex items-center
          px-3 py-1.5 rounded-full
          text-xs font-medium
          text-teal-700 dark:text-teal-300
          hover:bg-teal-500/10 dark:hover:bg-teal-400/10
          transition-colors
        "
      >
        Limpar filtros
      </button>
    </div>
  )
}

function EmptyState({ onOpenLink }: { onOpenLink: () => void }) {
  return (
    <div
      className="
        nymos-reveal opacity-0 mt-12
        flex flex-col items-center justify-center text-center gap-5
        py-16 px-6
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
      "
      style={{ animationDelay: '160ms' }}
    >
      <div className="grid place-items-center w-16 h-16 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-300">
        <Users className="w-7 h-7" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Vincule profissionais à sua jornada
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Nutricionista, personal, médico, psicólogo… Você controla quem vê o quê dos seus dados.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenLink}
        className="
          inline-flex items-center gap-1.5
          px-5 py-2.5 rounded-full
          bg-teal-600 hover:bg-teal-700 text-white
          dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
          text-sm font-medium shadow-sm
          transition-colors
        "
      >
        <UserPlus className="w-4 h-4" />
        Vincular meu primeiro profissional
      </button>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
