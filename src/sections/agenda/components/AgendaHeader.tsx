import {
  AlertTriangle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
} from 'lucide-react'
import type {
  AgendaViewId,
  GoogleSyncState,
  HeaderState,
} from '@/../product/sections/agenda/types'

interface AgendaHeaderProps {
  headerState: HeaderState
  googleSync: GoogleSyncState
  onViewChange?: (view: AgendaViewId) => void
  onNavigate?: (direction: 'prev' | 'next' | 'today') => void
  onDateChange?: (isoDate: string) => void
  onFilterTypeChange?: (filterId: string) => void
  onFilterStatusChange?: (filterId: string) => void
  onToggleUnavailable?: (show: boolean) => void
  onForceSync?: () => void
  onReconnectGoogle?: () => void
  onOpenCreate?: () => void
}

export function AgendaHeader({
  headerState,
  googleSync,
  onViewChange,
  onNavigate,
  onDateChange,
  onFilterTypeChange,
  onFilterStatusChange,
  onToggleUnavailable,
  onForceSync,
  onReconnectGoogle,
  onOpenCreate,
}: AgendaHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top row: view toggle · nav · sync · create */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div
            role="tablist"
            aria-label="Visualização"
            className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {headerState.viewOptions.map((opt) => {
              const active = opt.id === headerState.activeView
              return (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onViewChange?.(opt.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigate?.('prev')}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('today')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('next')}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Próximo"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Period label */}
          <div className="inline-flex items-center gap-2">
            <CalendarIcon size={14} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {headerState.periodLabel}
            </span>
            <input
              type="date"
              value={headerState.currentDate}
              onChange={(e) => onDateChange?.(e.target.value)}
              className="sr-only"
              aria-label="Pular pra data"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Google sync badge */}
          <GoogleSyncBadge
            sync={googleSync}
            onForceSync={onForceSync}
            onReconnect={onReconnectGoogle}
          />

          {/* Nova consulta */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20"
          >
            <Plus size={14} />
            Nova consulta
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterPills
          filters={headerState.filterTypes}
          selected={headerState.selectedFilterType}
          label="Tipo"
          onChange={onFilterTypeChange}
        />
        <span className="hidden h-5 w-px bg-slate-200 dark:bg-slate-800 sm:inline-block" />
        <FilterPills
          filters={headerState.filterStatuses}
          selected={headerState.selectedFilterStatus}
          label="Status"
          onChange={onFilterStatusChange}
        />

        <button
          type="button"
          onClick={() => onToggleUnavailable?.(!headerState.showUnavailableSlots)}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            headerState.showUnavailableSlots
              ? 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-900/30 dark:text-teal-200'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          {headerState.showUnavailableSlots ? <Eye size={12} /> : <EyeOff size={12} />}
          Slots indisponíveis
        </button>
      </div>
    </div>
  )
}

function FilterPills({
  filters,
  selected,
  label,
  onChange,
}: {
  filters: HeaderState['filterTypes']
  selected: string
  label: string
  onChange?: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
        {label}
      </span>
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 py-1.5 sm:flex-wrap sm:overflow-visible sm:py-0">
        {filters.map((f) => {
          const active = f.id === selected
          return (
            <button
              key={f.id}
              onClick={() => onChange?.(f.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                active
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {f.label}
              <span
                className={`font-mono text-[10px] tabular-nums ${
                  active
                    ? 'text-slate-300 dark:text-slate-500'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {f.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function GoogleSyncBadge({
  sync,
  onForceSync,
  onReconnect,
}: {
  sync: GoogleSyncState
  onForceSync?: () => void
  onReconnect?: () => void
}) {
  if (!sync.connected) {
    return (
      <button
        type="button"
        onClick={onReconnect}
        className="inline-flex items-center gap-1.5 rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
      >
        <AlertTriangle size={12} />
        Google Calendar desconectado
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900">
      {sync.conflictsCount > 0 ? (
        <AlertTriangle size={12} className="text-amber-500" />
      ) : (
        <CheckCircle2 size={12} className="text-emerald-500" />
      )}
      <span className="text-slate-700 dark:text-slate-300">
        {sync.conflictsCount > 0 ? (
          <>
            <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
              {sync.conflictsCount}
            </span>{' '}
            conflito{sync.conflictsCount === 1 ? '' : 's'}
          </>
        ) : (
          <>Sincronizado</>
        )}
      </span>
      <span className="text-slate-300 dark:text-slate-700">·</span>
      <span className="text-slate-500 dark:text-slate-400">{sync.lastSyncLabel}</span>
      <button
        type="button"
        onClick={onForceSync}
        className="ml-1 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        aria-label="Sincronizar agora"
        disabled={sync.syncing}
      >
        <RefreshCw size={12} className={sync.syncing ? 'animate-spin' : ''} />
      </button>
    </div>
  )
}
