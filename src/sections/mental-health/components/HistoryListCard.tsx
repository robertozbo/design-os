import { useState } from 'react'
import { ChevronDown, Moon, Share2, Zap } from 'lucide-react'
import type { DiaryHistoryItem } from '@/../product/sections/mental-health/types'
import { CardShell } from './CardShell'

export interface HistoryListCardProps {
  entries: DiaryHistoryItem[]
  onOpenEntry?: (entryId: string) => void
  onViewAll?: () => void
  revealIndex?: number
}

function moodTone(mood: number): {
  bg: string
  text: string
  ring: string
} {
  if (mood >= 8) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-300',
      ring: 'ring-emerald-200/60 dark:ring-emerald-500/20',
    }
  }
  if (mood >= 6) {
    return {
      bg: 'bg-teal-50 dark:bg-teal-500/10',
      text: 'text-teal-700 dark:text-teal-300',
      ring: 'ring-teal-200/60 dark:ring-teal-500/20',
    }
  }
  if (mood >= 4) {
    return {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-300',
      ring: 'ring-amber-200/60 dark:ring-amber-500/20',
    }
  }
  return {
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200/60 dark:ring-rose-500/20',
  }
}

const ENERGY_LABEL: Record<number, string> = {
  1: 'baixa',
  2: 'baixa',
  3: 'média',
  4: 'alta',
  5: 'alta',
}
const SLEEP_LABEL: Record<number, string> = {
  1: 'ruim',
  2: 'ruim',
  3: 'ok',
  4: 'bom',
  5: 'ótimo',
}

export function HistoryListCard({
  entries,
  onOpenEntry,
  onViewAll,
  revealIndex = 0,
}: HistoryListCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (entries.length === 0) {
    return (
      <CardShell
        eyebrow="Histórico"
        title="Histórico recente"
        accent="slate"
        revealIndex={revealIndex}
      >
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Quando você registrar alguns dias, eles aparecem aqui pra você
          revisitar.
        </div>
      </CardShell>
    )
  }

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
    onOpenEntry?.(id)
  }

  return (
    <CardShell
      eyebrow="Histórico"
      title="Histórico recente"
      meta={`${entries.length} ${entries.length === 1 ? 'entrada' : 'entradas'}`}
      accent="slate"
      onNavigate={onViewAll}
      revealIndex={revealIndex}
      padded={false}
    >
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {entries.map((entry) => {
          const tone = moodTone(entry.mood)
          const hasNote = entry.noteTruncated.trim().length > 0
          const isExpanded = expandedId === entry.id
          const expandedNote =
            entry.noteFull?.trim() || (hasNote ? entry.noteTruncated : '')
          const expandedEmotions =
            entry.allEmotionLabels && entry.allEmotionLabels.length > 0
              ? entry.allEmotionLabels
              : entry.topEmotionLabels
          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => handleToggle(entry.id)}
                aria-expanded={isExpanded}
                aria-controls={`history-${entry.id}-detail`}
                className="
                  w-full text-left
                  flex items-center gap-3 px-5 py-3.5
                  hover:bg-slate-50/80 dark:hover:bg-slate-800/40
                  focus:outline-none focus-visible:bg-slate-50/80 dark:focus-visible:bg-slate-800/40
                  transition-colors
                "
              >
                <div
                  className={`
                    shrink-0 grid place-items-center
                    w-11 h-11 rounded-xl
                    ${tone.bg} ${tone.text}
                    ring-1 ${tone.ring}
                  `}
                  aria-label={`Humor ${entry.mood} de 10`}
                >
                  <span className="text-sm font-semibold tabular-nums font-mono">
                    {entry.mood}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-mono">
                      {entry.dateLabel}
                    </span>
                    {entry.sharedWithPsychologist && (
                      <span
                        className="
                          inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md
                          text-[10px] font-medium
                          bg-violet-50 text-violet-700
                          dark:bg-violet-500/10 dark:text-violet-300
                        "
                        title="Compartilhado com seu psicólogo"
                      >
                        <Share2 className="w-2.5 h-2.5" />
                        Compartilhado
                      </span>
                    )}
                  </div>

                  {!isExpanded && (
                    <>
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        {entry.topEmotionLabels.map((label) => (
                          <span
                            key={label}
                            className="
                              inline-flex items-center px-1.5 py-0.5 rounded-md
                              text-[11px] font-medium
                              bg-slate-100 text-slate-700
                              dark:bg-slate-800 dark:text-slate-300
                            "
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      {hasNote && (
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 line-clamp-1">
                          {entry.noteTruncated}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <ChevronDown
                  className={`
                    shrink-0 w-4 h-4
                    text-slate-400 dark:text-slate-500
                    transition-transform duration-200
                    ${isExpanded ? 'rotate-180' : ''}
                  `}
                />
              </button>

              <div
                id={`history-${entry.id}-detail`}
                role="region"
                className={`
                  grid transition-[grid-template-rows] duration-300 ease-out
                  ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
                `}
              >
                <div className="overflow-hidden">
                  <div className="flex gap-3 px-5 pb-5 pt-1 pr-12">
                    <div className="w-11 shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0 space-y-3.5">
                      {expandedEmotions.length > 0 && (
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                            Como se sentiu
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {expandedEmotions.map((label) => (
                              <span
                                key={label}
                                className="
                                  inline-flex items-center px-2 py-0.5 rounded-md
                                  text-[11px] font-medium
                                  bg-slate-100 text-slate-700
                                  dark:bg-slate-800 dark:text-slate-300
                                "
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(entry.energy !== undefined ||
                        entry.sleepQuality !== undefined) && (
                        <div className="grid grid-cols-2 gap-3 max-w-md">
                          {entry.energy !== undefined && (
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                              <Zap className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                              <div className="min-w-0 leading-tight">
                                <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
                                  Energia
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-200">
                                  <span className="font-semibold tabular-nums font-mono">
                                    {entry.energy}/5
                                  </span>{' '}
                                  <span className="text-slate-500 dark:text-slate-400">
                                    · {ENERGY_LABEL[entry.energy] ?? ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          {entry.sleepQuality !== undefined && (
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                              <Moon className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                              <div className="min-w-0 leading-tight">
                                <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
                                  Sono
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-200">
                                  <span className="font-semibold tabular-nums font-mono">
                                    {entry.sleepQuality}/5
                                  </span>{' '}
                                  <span className="text-slate-500 dark:text-slate-400">
                                    · {SLEEP_LABEL[entry.sleepQuality] ?? ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {expandedNote.length > 0 ? (
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                            Nota do dia
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {expandedNote}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs italic text-slate-400 dark:text-slate-500">
                          Sem nota nesse dia.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </CardShell>
  )
}
