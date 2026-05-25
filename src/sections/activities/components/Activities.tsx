import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Dumbbell, Plus, Smartphone } from 'lucide-react'
import type {
  ActivitiesProps,
  ActivityCategoryKey,
  ActivityView,
} from '@/../product/sections/activities/types'
import { ActivitiesHeader } from './ActivitiesHeader'
import { HeroStats } from './HeroStats'
import { ControlsBar } from './ControlsBar'
import { CategoryChips } from './CategoryChips'
import { ActivityListView } from './ActivityListView'
import { ActivityGridView } from './ActivityGridView'
import { AddActivityModal } from './AddActivityModal'
import { HistoryFilters } from './HistoryFilters'

export function Activities({
  hero,
  categories,
  types,
  durationPresets,
  activities,
  pagination,
  history,
  onCreate,
  onSubmitCreate,
  onCategoryChange,
  onSearchChange,
  onViewChange,
  onEditActivity,
  onDeleteActivity,
  onHistoryFilterChange,
  onPageChange,
  onConnectDevice,
}: ActivitiesProps) {
  const [view, setView] = useState<ActivityView>('list')
  const [category, setCategory] = useState<ActivityCategoryKey>('all')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(pagination.page)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return activities.filter((a) => {
      const okCategory = category === 'all' || a.activityType.categoryKey === category
      const okQuery =
        !q ||
        a.activityType.label.toLowerCase().includes(q) ||
        a.activityType.categoryLabel.toLowerCase().includes(q) ||
        a.notes.toLowerCase().includes(q)
      return okCategory && okQuery
    })
  }, [activities, category, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pagination.pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pagination.pageSize
  const paged = filtered.slice(start, start + pagination.pageSize)

  const handleCategoryChange = (next: ActivityCategoryKey) => {
    setCategory(next)
    setPage(1)
    onCategoryChange?.(next)
  }
  const handleQueryChange = (next: string) => {
    setQuery(next)
    setPage(1)
    onSearchChange?.(next)
  }
  const handleViewChange = (next: ActivityView) => {
    setView(next)
    onViewChange?.(next)
  }
  const handleCreate = () => {
    setModalOpen(true)
    onCreate?.()
  }
  const handlePage = (next: number) => {
    setPage(next)
    onPageChange?.(next)
  }

  const isEmpty = activities.length === 0
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
        <ActivitiesHeader onCreate={handleCreate} />

        {isEmpty ? (
          <EmptyState onCreate={handleCreate} onConnectDevice={onConnectDevice} />
        ) : (
          <>
            <div className="mt-8">
              <HeroStats stats={hero.stats} revealStartIndex={2} />
            </div>

            <div
              className="nymos-reveal opacity-0 mt-5"
              style={{ animationDelay: `${80 * 6}ms` }}
            >
              <ControlsBar
                query={query}
                view={view}
                onQueryChange={handleQueryChange}
                onViewChange={handleViewChange}
              />
            </div>

            <div
              className="nymos-reveal opacity-0 mt-3"
              style={{ animationDelay: `${80 * 7}ms` }}
            >
              <CategoryChips
                categories={categories}
                activeKey={category}
                onChange={handleCategoryChange}
              />
            </div>

            <div
              className="nymos-reveal opacity-0 mt-4"
              style={{ animationDelay: `${80 * 8}ms` }}
            >
              {isFilterEmpty ? (
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
                    Nenhuma atividade encontrada
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Ajuste a busca ou troque a categoria.
                  </div>
                </div>
              ) : view === 'list' ? (
                <ActivityListView
                  activities={paged}
                  onEdit={onEditActivity}
                  onDelete={onDeleteActivity}
                />
              ) : (
                <ActivityGridView
                  activities={paged}
                  onEdit={onEditActivity}
                  onDelete={onDeleteActivity}
                />
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

            <div className="mt-6">
              <HistoryFilters
                activities={activities}
                types={types}
                history={history}
                revealIndex={9}
                onFilterChange={onHistoryFilterChange}
              />
            </div>
          </>
        )}
      </div>

      <AddActivityModal
        open={modalOpen}
        categories={categories}
        types={types}
        durationPresets={durationPresets}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmitCreate}
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

function EmptyState({
  onCreate,
  onConnectDevice,
}: {
  onCreate: () => void
  onConnectDevice?: () => void
}) {
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
        <Dumbbell className="w-7 h-7" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Comece a registrar suas atividades
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cadastre exercícios manualmente ou conecte seu Apple Health / Google Fit pra sincronizar automaticamente.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onCreate}
          className="
            inline-flex items-center gap-1.5
            px-4 py-2 rounded-full
            bg-teal-600 hover:bg-teal-700 text-white
            dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
            text-sm font-medium shadow-sm
            transition-colors
          "
        >
          <Plus className="w-4 h-4" />
          Cadastrar
        </button>
        <button
          type="button"
          onClick={onConnectDevice}
          className="
            inline-flex items-center gap-1.5
            px-4 py-2 rounded-full
            border border-slate-200 dark:border-slate-700
            text-slate-700 dark:text-slate-200
            hover:bg-slate-100 dark:hover:bg-slate-800
            text-sm font-medium
            transition-colors
          "
        >
          <Smartphone className="w-4 h-4" />
          Conectar dispositivo
        </button>
      </div>
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
