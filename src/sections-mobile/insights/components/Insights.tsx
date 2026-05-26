import { useMemo, useState } from 'react'
import type {
  Insight,
  InsightCategory,
  InsightFilterKey,
  InsightsProps,
} from '@/../product-mobile/sections/insights/types'

// ============================================================================
// MAPPINGS
// ============================================================================

function mapCategoryToFilter(cat: InsightCategory): InsightFilterKey {
  if (cat === 'weekly_summary') return 'weekly_summary'
  if (cat === 'metric_alert' || cat === 'metric_highlight') return 'metric_alert'
  if (cat === 'nutrition' || cat === 'nutrition_tip') return 'nutrition'
  if (cat === 'activity' || cat === 'activity_suggestion' || cat === 'weekend_tip')
    return 'activity'
  return 'all'
}

const CATEGORY_ACCENT: Record<
  InsightCategory,
  { icon: string; iconBg: string; iconText: string; ring: string }
> = {
  weekly_summary: {
    icon: 'sparkles',
    iconBg: 'bg-gradient-to-br from-teal-500/20 to-violet-500/20',
    iconText: 'text-violet-300',
    ring: 'ring-violet-500/30',
  },
  metric_alert: {
    icon: 'alert',
    iconBg: 'bg-rose-500/15',
    iconText: 'text-rose-300',
    ring: 'ring-rose-500/30',
  },
  metric_highlight: {
    icon: 'alert',
    iconBg: 'bg-rose-500/15',
    iconText: 'text-rose-300',
    ring: 'ring-rose-500/30',
  },
  nutrition: {
    icon: 'utensils',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-300',
    ring: 'ring-emerald-500/30',
  },
  nutrition_tip: {
    icon: 'utensils',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-300',
    ring: 'ring-emerald-500/30',
  },
  activity: {
    icon: 'dumbbell',
    iconBg: 'bg-amber-500/15',
    iconText: 'text-amber-300',
    ring: 'ring-amber-500/30',
  },
  activity_suggestion: {
    icon: 'dumbbell',
    iconBg: 'bg-amber-500/15',
    iconText: 'text-amber-300',
    ring: 'ring-amber-500/30',
  },
  weekend_tip: {
    icon: 'calendar',
    iconBg: 'bg-teal-500/15',
    iconText: 'text-teal-300',
    ring: 'ring-teal-500/30',
  },
}

const FILTER_BADGE: Record<
  InsightFilterKey,
  { label: string; color: string }
> = {
  all: { label: 'Todos', color: 'border-slate-700 bg-slate-800 text-slate-300' },
  weekly_summary: {
    label: 'Semanal',
    color: 'border-violet-500/40 bg-violet-500/15 text-violet-300',
  },
  metric_alert: {
    label: 'Alerta',
    color: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
  },
  nutrition: {
    label: 'Nutrição',
    color: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  },
  activity: {
    label: 'Atividade',
    color: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  },
}

const FILTERS: { key: InsightFilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'weekly_summary', label: 'Semanal' },
  { key: 'metric_alert', label: 'Alertas' },
  { key: 'nutrition', label: 'Nutrição' },
  { key: 'activity', label: 'Atividade' },
]

// ============================================================================
// MAIN
// ============================================================================

export function Insights({ data, onMarcarLido, onRefresh }: InsightsProps) {
  const { stats, insights } = data
  const [activeFilter, setActiveFilter] = useState<InsightFilterKey>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return insights
    return insights.filter((i) => mapCategoryToFilter(i.category) === activeFilter)
  }, [insights, activeFilter])

  const headerStats = useMemo(
    () => [
      { id: 'total', label: 'Total', value: stats.total, accent: 'text-teal-400' },
      { id: 'unread', label: 'Não lidos', value: stats.unread, accent: 'text-violet-400' },
      { id: 'weekly', label: 'Semanais', value: stats.weekly, accent: 'text-violet-400' },
      { id: 'alerts', label: 'Alertas', value: stats.alerts, accent: 'text-rose-400' },
    ],
    [stats],
  )

  function handleTap(insight: Insight) {
    if (expandedId === insight.id) {
      setExpandedId(null)
    } else {
      setExpandedId(insight.id)
      if (!insight.isRead && insight.source === 'micro') {
        onMarcarLido?.(insight.id)
      }
    }
  }

  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <div className="px-4 pt-4 pb-24">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-2">
          {headerStats.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5"
            >
              <div
                className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${s.accent}`}
              >
                {s.label}
              </div>
              <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-slate-50">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => {
            const active = activeFilter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${
                  active
                    ? 'border-teal-400 bg-teal-500/15 text-teal-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-900'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-4 space-y-2.5">
            {filtered.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                expanded={expandedId === insight.id}
                onTap={() => handleTap(insight)}
              />
            ))}
          </div>
        )}

        {/* Refresh hint (mobile uses pull-to-refresh; expose button here for demo) */}
        {onRefresh && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1.5 text-[10.5px] font-semibold text-slate-400 hover:bg-slate-900"
            >
              Atualizar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// CARD
// ============================================================================

function InsightCard({
  insight,
  expanded,
  onTap,
}: {
  insight: Insight
  expanded: boolean
  onTap: () => void
}) {
  const accent = CATEGORY_ACCENT[insight.category]
  const filterKey = mapCategoryToFilter(insight.category)
  const badge = FILTER_BADGE[filterKey === 'all' ? 'all' : filterKey]
  const isUnread = !insight.isRead
  const preview =
    insight.content.length > 120
      ? insight.content.slice(0, 120) + '…'
      : insight.content
  const hasMore = insight.content.length > 120

  return (
    <button
      type="button"
      onClick={onTap}
      className={`w-full rounded-xl border bg-slate-900/60 p-3 text-left transition-colors hover:bg-slate-900 ${
        isUnread
          ? 'border-slate-800 border-l-[3px] border-l-teal-400'
          : 'border-slate-800'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ring-1 ${accent.iconBg} ${accent.iconText} ${accent.ring}`}
          aria-hidden
        >
          <CategoryIcon name={accent.icon} />
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${badge.color}`}
            >
              {badge.label}
            </span>
            {isUnread && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400"
                aria-label="Não lido"
              />
            )}
            {insight.source === 'weekly' && (
              <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-violet-400">
                IA · Semanal
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-[12.5px] font-semibold leading-snug text-slate-100">
            {insight.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <p className="mt-2.5 text-[11.5px] leading-relaxed text-slate-400">
        {expanded ? insight.content : preview}
      </p>

      {/* Related metrics chips */}
      {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {insight.relatedMetrics.map((m) => (
            <span
              key={m.key}
              className="rounded-md border border-slate-800 bg-slate-950/60 px-1.5 py-0.5 text-[9.5px] font-medium text-slate-400"
            >
              {m.label}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <ClockIcon />
          <span className="font-mono tabular-nums">{insight.generatedAtLabel}</span>
        </div>
        {hasMore && (
          <span className="text-[10px] font-semibold text-teal-400">
            {expanded ? 'Ver menos' : 'Ver mais'}
          </span>
        )}
      </div>
    </button>
  )
}

// ============================================================================
// EMPTY
// ============================================================================

function EmptyState() {
  return (
    <div className="mt-12 flex flex-col items-center text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-800 bg-gradient-to-br from-teal-500/10 to-violet-500/10 text-violet-300 ring-1 ring-violet-500/20">
        <SparklesIcon />
      </div>
      <h3 className="mt-4 text-[14px] font-semibold text-slate-100">
        Ainda não temos insights pra você
      </h3>
      <p className="mt-1 max-w-xs text-[11.5px] text-slate-400">
        Conforme você registra dados (humor, atividade, sono, exames), a IA Nymos
        identifica padrões e gera análises por aqui.
      </p>
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function CategoryIcon({ name }: { name: string }) {
  if (name === 'sparkles') return <SparklesIcon />
  if (name === 'alert') return <AlertIcon />
  if (name === 'utensils') return <UtensilsIcon />
  if (name === 'dumbbell') return <DumbbellIcon />
  if (name === 'calendar') return <CalendarIcon />
  return <SparklesIcon />
}

function SparklesIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}

function AlertIcon() {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function UtensilsIcon() {
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
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}

function DumbbellIcon() {
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
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </svg>
  )
}

function CalendarIcon() {
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
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
