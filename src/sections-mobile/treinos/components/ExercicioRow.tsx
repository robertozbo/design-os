import { ChevronRight, Play, Weight, Timer } from 'lucide-react'
import type { SessionExerciseWithDetails } from '@/../product-mobile/api-types'
import { iconForExercise, formatLoad, formatRest } from './_shared'

interface ExercicioRowProps {
  sessionExercise: SessionExerciseWithDetails
  onClick?: (exercicioId: string) => void
  index?: number
}

export function ExercicioRow({ sessionExercise, onClick, index }: ExercicioRowProps) {
  const Icon = iconForExercise(sessionExercise.muscleGroup.category)
  const isTime = sessionExercise.exercise.exerciseType === 'time'
  const hasVideo = !!sessionExercise.exercise.videoUrl

  const seriesLabel = isTime
    ? `${sessionExercise.sets} × ${sessionExercise.timeSeconds}s`
    : `${sessionExercise.sets} × ${sessionExercise.reps}`

  return (
    <button
      onClick={() => onClick?.(sessionExercise.id)}
      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2.5 flex items-center gap-3 text-left"
    >
      {typeof index === 'number' && (
        <span className="text-slate-600 text-[10.5px] font-mono tabular-nums font-semibold w-4 text-center shrink-0">
          {index + 1}
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 relative">
        <Icon size={16} strokeWidth={2.2} />
        {hasVideo && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <Play size={8} fill="currentColor" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-semibold text-[12.5px] truncate leading-tight">
          {sessionExercise.exercise.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] text-slate-500 font-mono tabular-nums">
          <span className="font-semibold text-slate-300">{seriesLabel}</span>
          {sessionExercise.loadKg !== null && (
            <>
              <span className="text-slate-700">·</span>
              <span className="flex items-center gap-0.5">
                <Weight size={9} />
                {formatLoad(sessionExercise.loadKg)}
              </span>
            </>
          )}
          <span className="text-slate-700">·</span>
          <span className="flex items-center gap-0.5">
            <Timer size={9} />
            {formatRest(sessionExercise.restSeconds)}
          </span>
        </div>
      </div>
      <ChevronRight size={13} className="text-slate-600 shrink-0" />
    </button>
  )
}
