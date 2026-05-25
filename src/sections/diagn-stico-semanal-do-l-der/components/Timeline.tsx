import type { TimelineEvent } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { TimelineEventCard } from './TimelineEventCard'

interface Props {
  events: TimelineEvent[]
  emptyLabel?: string
}

export function Timeline({ events, emptyLabel = 'Sem eventos registrados.' }: Props) {
  if (events.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        {emptyLabel}
      </div>
    )
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  )

  return (
    <ol className="relative">
      {sorted.map((event, i) => (
        <TimelineEventCard
          key={event.id}
          event={event}
          isFirst={i === 0}
          isLast={i === sorted.length - 1}
        />
      ))}
    </ol>
  )
}
