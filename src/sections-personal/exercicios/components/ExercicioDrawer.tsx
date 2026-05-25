import {
  X,
  Star,
  Dumbbell,
  Timer,
  Activity,
  Copy,
  Pencil,
  Trash2,
  AlertTriangle,
  Play,
} from 'lucide-react'
import type { Exercise } from '@/../product-personal/sections/exercicios/types'

interface ExercicioDrawerProps {
  exercicio: Exercise | null
  open: boolean
  onClose?: () => void
  onToggleFavorite?: () => void
  onDuplicateAsCustom?: () => void
  onEdit?: () => void
  onDelete?: () => void
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

export function ExercicioDrawer({
  exercicio,
  open,
  onClose,
  onToggleFavorite,
  onDuplicateAsCustom,
  onEdit,
  onDelete,
}: ExercicioDrawerProps) {
  if (!exercicio) return null

  const isCustom = exercicio.source === 'custom'
  const seconds = exercicio.averageTimeSeconds
  const timeLabel = seconds >= 60 ? `${Math.round(seconds / 60)} min` : `${seconds}s`

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300
          ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}
        `}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col bg-white shadow-2xl transition-transform duration-300
          dark:bg-slate-950
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-label="Detalhe do exercício"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                  isCustom
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {isCustom ? 'Custom' : 'Curado'}
              </span>
              <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                {exercicio.primaryMuscle}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {PATTERN_LABEL[exercicio.movementPattern] ?? exercicio.movementPattern}
              </span>
            </div>
            <h2 className="text-xl font-semibold leading-snug text-slate-900 dark:text-slate-50">
              {exercicio.name}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onToggleFavorite}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-amber-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-amber-400"
              aria-label="Favorito"
            >
              <Star
                size={18}
                className={
                  exercicio.isFavorite
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent'
                }
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Media */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
            {exercicio.gifUrl ? (
              <img
                src={exercicio.gifUrl}
                alt={exercicio.name}
                className="h-full w-full object-cover"
              />
            ) : exercicio.fallbackImageUrl ? (
              <img
                src={exercicio.fallbackImageUrl}
                alt={exercicio.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-700">
                <Dumbbell size={42} strokeWidth={1.4} />
              </div>
            )}
            {exercicio.videoUrl && (
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors hover:bg-slate-900/20"
                aria-label="Reproduzir vídeo"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg ring-1 ring-slate-900/10 transition-transform hover:scale-110 dark:bg-slate-100">
                  <Play size={22} fill="currentColor" />
                </span>
              </button>
            )}
          </div>

          {/* Muscles */}
          <section className="mt-6">
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Grupos musculares
            </h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="inline-flex items-center rounded-md bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white dark:bg-teal-500">
                  {exercicio.primaryMuscle}
                </span>
                <span className="ml-2 text-[11px] text-slate-500 dark:text-slate-400">
                  primário
                </span>
              </div>
              {exercicio.secondaryMuscles.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {exercicio.secondaryMuscles.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {m}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    secundários
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Metadata */}
          <section className="mt-6 grid grid-cols-3 gap-3">
            <MetaCell
              icon={<Dumbbell size={14} />}
              label="Equipamento"
              value={EQUIPMENT_LABEL[exercicio.equipment] ?? exercicio.equipment}
            />
            <MetaCell
              icon={<Activity size={14} />}
              label="Dificuldade"
              valueNode={<DifficultyDots level={exercicio.difficulty} />}
            />
            <MetaCell
              icon={<Timer size={14} />}
              label="Tempo médio"
              value={timeLabel}
            />
          </section>

          {/* Instructions */}
          {exercicio.instructions.length > 0 && (
            <section className="mt-6">
              <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Instruções
              </h3>
              <ol className="mt-3 space-y-2">
                {exercicio.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 font-mono text-[10px] font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Tips */}
          {exercicio.tips.length > 0 && (
            <section className="mt-6">
              <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Dicas de execução
              </h3>
              <ul className="mt-2 space-y-1.5">
                {exercicio.tips.map((t, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Variations */}
          {exercicio.variations.length > 0 && (
            <section className="mt-6">
              <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Variações sugeridas
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {exercicio.variations.map((v) => (
                  <span
                    key={v}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-mono text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Contraindications */}
          {exercicio.contraindications.length > 0 && (
            <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle size={14} />
                <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
                  Contraindicações
                </h3>
              </div>
              <ul className="mt-2 space-y-1">
                {exercicio.contraindications.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm text-amber-900 dark:text-amber-200"
                  >
                    • {c}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
          {isCustom ? (
            <>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-900/20"
              >
                <Trash2 size={14} />
                Excluir
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                <Pencil size={14} />
                Editar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onDuplicateAsCustom}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <Copy size={14} />
              Duplicar como customizado
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Fechar
          </button>
        </footer>
      </aside>
    </>
  )
}

function MetaCell({
  icon,
  label,
  value,
  valueNode,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  valueNode?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icon}
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
        {valueNode ?? value}
      </div>
    </div>
  )
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Dificuldade ${level} de 5`}>
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
