import { Star, Dumbbell, Timer } from 'lucide-react'
import type { Exercise } from '@/../product-personal/sections/exercicios/types'

interface ExercicioCardProps {
  exercicio: Exercise
  onClick?: () => void
  onToggleFavorite?: () => void
}

const EQUIPMENT_LABEL: Record<string, string> = {
  livre: 'Livre',
  barra: 'Barra',
  halteres: 'Halteres',
  maquina: 'Máquina',
  cabos: 'Cabos',
  'peso-corporal': 'Peso corporal',
  kettlebell: 'Kettlebell',
  elastico: 'Elástico',
  outros: 'Outros',
}

const PATTERN_LABEL: Record<string, string> = {
  push: 'Push',
  pull: 'Pull',
  squat: 'Squat',
  hinge: 'Hinge',
  carry: 'Carry',
  lunge: 'Lunge',
  rotation: 'Rotation',
}

export function ExercicioCard({ exercicio, onClick, onToggleFavorite }: ExercicioCardProps) {
  const isCustom = exercicio.source === 'custom'
  const seconds = exercicio.averageTimeSeconds
  const timeLabel = seconds >= 60 ? `${Math.round(seconds / 60)}min` : `${seconds}s`

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group relative flex flex-col text-left
        overflow-hidden rounded-2xl border border-slate-200 bg-white
        transition-all duration-200
        hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
      "
    >
      {/* Media */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {exercicio.gifUrl ? (
          <img
            src={exercicio.gifUrl}
            alt={exercicio.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : exercicio.fallbackImageUrl ? (
          <img
            src={exercicio.fallbackImageUrl}
            alt={exercicio.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-700">
            <Dumbbell size={36} strokeWidth={1.5} />
          </div>
        )}

        {/* Source badge */}
        <span
          className={`
            absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider
            ${
              isCustom
                ? 'bg-teal-500/90 text-white'
                : 'bg-white/90 text-slate-700 dark:bg-slate-900/80 dark:text-slate-200'
            }
          `}
        >
          {isCustom ? 'Custom' : 'Curado'}
        </span>

        {/* Favorite */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.()
          }}
          className="
            absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full
            bg-white/85 text-slate-600 backdrop-blur transition-colors
            hover:bg-white hover:text-amber-500
            dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-amber-400
          "
          aria-label={exercicio.isFavorite ? 'Remover dos favoritos' : 'Marcar como favorito'}
        >
          <Star
            size={15}
            strokeWidth={2}
            className={
              exercicio.isFavorite
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent'
            }
          />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
          {exercicio.name}
        </h3>

        {/* Muscles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            {exercicio.primaryMuscle}
          </span>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {PATTERN_LABEL[exercicio.movementPattern] ?? exercicio.movementPattern}
          </span>
        </div>

        {/* Meta */}
        <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Dumbbell size={12} strokeWidth={2} />
            {EQUIPMENT_LABEL[exercicio.equipment] ?? exercicio.equipment}
          </span>
          <span className="inline-flex items-center gap-2">
            <DifficultyDots level={exercicio.difficulty} />
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Timer size={11} strokeWidth={2} />
              {timeLabel}
            </span>
          </span>
        </div>
      </div>
    </button>
  )
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Dificuldade ${level} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i <= level
              ? 'bg-teal-500 dark:bg-teal-400'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />
      ))}
    </span>
  )
}
