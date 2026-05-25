import { useMemo, useState } from 'react'
import { X, Search, Play, Check, Plus } from 'lucide-react'
import catalog from '@/../product-mobile/sections/treinos/exercise-catalog.json'
import type { Exercise, MuscleGroup } from '@/../product-mobile/api-types'
import { CATEGORY_ICON } from './_shared'

type Catalog = {
  muscleGroups: (MuscleGroup & { sortOrder: number })[]
  exercises: Exercise[]
}

const data = catalog as unknown as Catalog

interface SelecionarExerciciosSheetProps {
  /** Letra da sessão sendo montada (pra header contextual) */
  sessaoLetra: string
  sessaoNome: string
  /** IDs já presentes na sessão (não mostra como selecionável duplo) */
  jaAdicionadosIds?: string[]
  onClose: () => void
  onConfirm: (exerciciosIds: string[]) => void
}

export function SelecionarExerciciosSheet({
  sessaoLetra,
  sessaoNome,
  jaAdicionadosIds = [],
  onClose,
  onConfirm,
}: SelecionarExerciciosSheetProps) {
  const [grupoAtivo, setGrupoAtivo] = useState<string>(data.muscleGroups[0].id)
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const exerciciosDoGrupo = useMemo(() => {
    const term = search.trim().toLowerCase()
    return data.exercises.filter((ex) => {
      if (ex.muscleGroupId !== grupoAtivo) return false
      if (term && !ex.name.toLowerCase().includes(term)) return false
      return true
    })
  }, [grupoAtivo, search])

  const countByGroup = useMemo(() => {
    const map: Record<string, number> = {}
    selecionados.forEach((id) => {
      const ex = data.exercises.find((e) => e.id === id)
      if (ex) map[ex.muscleGroupId] = (map[ex.muscleGroupId] ?? 0) + 1
    })
    return map
  }, [selecionados])

  const toggle = (id: string) => {
    if (jaAdicionadosIds.includes(id)) return
    setSelecionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const total = selecionados.size

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col" data-nymos-mobile="true">
      <div className="h-12 shrink-0" />

      <div className="px-4 h-[64px] shrink-0 flex items-center gap-3 border-b border-slate-900">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white"
          aria-label="Fechar"
        >
          <X size={17} strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
            Treino {sessaoLetra}
          </div>
          <div className="text-slate-100 font-semibold text-[14px] truncate leading-tight">
            {sessaoNome || 'Adicionar exercícios'}
          </div>
        </div>
      </div>

      <div className="px-4 py-2 shrink-0">
        <label className="flex items-center gap-2 px-3 h-10 rounded-full bg-slate-900 border border-slate-800 focus-within:border-slate-600">
          <Search size={14} className="text-slate-500 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar exercício..."
            className="flex-1 bg-transparent text-slate-100 text-[12.5px] outline-none placeholder:text-slate-600"
          />
        </label>
      </div>

      <div className="px-2 pb-2 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 px-2">
          {data.muscleGroups.map((g) => {
            const Icon = CATEGORY_ICON[g.category]
            const count = countByGroup[g.id] ?? 0
            const active = grupoAtivo === g.id
            return (
              <button
                key={g.id}
                onClick={() => setGrupoAtivo(g.id)}
                className={`flex items-center gap-1.5 px-3 h-9 rounded-full text-[12px] font-semibold whitespace-nowrap shrink-0 border ${
                  active
                    ? 'bg-slate-100 text-slate-900 border-transparent'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={12} strokeWidth={2.4} />
                {g.name}
                {count > 0 && (
                  <span
                    className={`ml-0.5 min-w-4 h-4 px-1 rounded-full text-[9.5px] font-bold flex items-center justify-center font-mono tabular-nums ${
                      active ? 'bg-slate-900 text-slate-100' : 'bg-teal-500 text-white'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-3 no-scrollbar">
        {exerciciosDoGrupo.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-8 text-center">
            <div className="text-slate-300 text-[12.5px] font-medium">Sem exercícios</div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              {search ? 'Nenhum resultado pra busca.' : 'Grupo sem exercícios cadastrados.'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {exerciciosDoGrupo.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                selected={selecionados.has(ex.id)}
                jaAdicionado={jaAdicionadosIds.includes(ex.id)}
                onClick={() => toggle(ex.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-900 bg-slate-950 shrink-0">
        <button
          onClick={() => onConfirm(Array.from(selecionados))}
          disabled={total === 0}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[14px] flex items-center justify-center gap-2 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600"
        >
          <Plus size={15} strokeWidth={2.6} />
          {total === 0 ? 'Selecione exercícios' : `Adicionar ${total} exercício${total === 1 ? '' : 's'}`}
        </button>
      </div>
    </div>
  )
}

interface ExerciseCardProps {
  exercise: Exercise
  selected: boolean
  jaAdicionado: boolean
  onClick: () => void
}

function ExerciseCard({ exercise, selected, jaAdicionado, onClick }: ExerciseCardProps) {
  const hasVideo = !!exercise.videoUrl

  return (
    <button
      onClick={onClick}
      disabled={jaAdicionado}
      className={`relative aspect-[3/4] rounded-2xl border overflow-hidden flex flex-col text-left ${
        jaAdicionado
          ? 'bg-slate-900/40 border-slate-800/60 opacity-60 cursor-default'
          : selected
            ? 'bg-teal-500/10 border-teal-500/50'
            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex-1 flex items-center justify-center bg-slate-800/40 relative">
        {exercise.imageUrl ? (
          <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 text-[20px] font-bold">
            {exercise.name[0].toUpperCase()}
          </div>
        )}
        {hasVideo && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-950/80 flex items-center justify-center text-teal-300">
            <Play size={11} fill="currentColor" />
          </div>
        )}
        {selected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-lg">
            <Check size={13} strokeWidth={3} />
          </div>
        )}
        {jaAdicionado && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-400 text-[8.5px] font-semibold uppercase tracking-wider">
            já na sessão
          </div>
        )}
      </div>
      <div className="px-2.5 py-2 bg-slate-950/40">
        <div className="text-slate-100 font-semibold text-[11.5px] leading-tight line-clamp-2">
          {exercise.name}
        </div>
        <div className="text-slate-500 text-[9.5px] mt-0.5 uppercase tracking-wider">
          {exercise.exerciseType === 'time' ? 'Tempo' : 'Reps'}
        </div>
      </div>
    </button>
  )
}
