import { useEffect, useMemo, useRef, useState } from 'react'
import { Dumbbell, ArrowLeft, X, Camera, ImagePlus, Zap } from 'lucide-react'
import type {
  ActivityCategory,
  ActivityType,
  CreateActivityPayload,
  DurationPreset,
} from '@/../product/sections/activities/types'

export interface AddActivityModalProps {
  open: boolean
  categories: ActivityCategory[]
  types: ActivityType[]
  durationPresets: DurationPreset[]
  onClose: () => void
  onSubmit?: (payload: CreateActivityPayload) => void
}

function todayDate(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function nowTime(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function pointsForDuration(type: ActivityType | null, dur: DurationPreset): number {
  if (!type) return 0
  switch (dur) {
    case 30:
      return type.points30min
    case 45:
      return type.points45min
    case 60:
      return type.points60min
    case 80:
      return type.points80min
    case 120:
      return type.points120min
  }
}

export function AddActivityModal({
  open,
  categories,
  types,
  durationPresets,
  onClose,
  onSubmit,
}: AddActivityModalProps) {
  const filterableCategories = categories.filter((c) => c.key !== 'all')

  const [categoryId, setCategoryId] = useState<string>('')
  const [typeId, setTypeId] = useState<string>('')
  const [duration, setDuration] = useState<DurationPreset>(60)
  const [date, setDate] = useState(todayDate())
  const [time, setTime] = useState(nowTime())
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Reset on open
  useEffect(() => {
    if (!open) return
    const firstCat = filterableCategories[0]?.id ?? ''
    const firstType = firstCat ? types.find((t) => t.categoryId === firstCat)?.id ?? '' : ''
    setCategoryId(firstCat)
    setTypeId(firstType)
    setDuration(60)
    setDate(todayDate())
    setTime(nowTime())
    setImagePreview(null)
    setError(null)
  }, [open, types])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const typesForCategory = useMemo(
    () => types.filter((t) => t.categoryId === categoryId),
    [types, categoryId],
  )

  const selectedType = types.find((t) => t.id === typeId) ?? null
  const points = pointsForDuration(selectedType, duration)

  const handleCategoryChange = (id: string) => {
    setCategoryId(id)
    const firstTypeOfCat = types.find((t) => t.categoryId === id)
    setTypeId(firstTypeOfCat?.id ?? '')
  }

  const handleFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview((e.target?.result as string) ?? null)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !typeId) {
      setError('Selecione categoria e tipo de atividade.')
      return
    }
    const performedAt = new Date(`${date}T${time}:00`)
    if (Number.isNaN(performedAt.getTime())) {
      setError('Data ou hora inválida.')
      return
    }
    if (performedAt.getTime() > Date.now() + 5 * 60 * 1000) {
      setError('A atividade não pode estar no futuro.')
      return
    }
    onSubmit?.({
      activityTypeId: typeId,
      durationMinutes: duration,
      performedAt: performedAt.toISOString(),
      imageDataUrl: imagePreview ?? undefined,
    })
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-activity-title"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="
          absolute inset-0
          bg-slate-950/40 dark:bg-slate-950/70
          backdrop-blur-sm
          animate-[fade-in_180ms_ease-out]
        "
      />
      <div
        className="
          relative w-full max-w-lg max-h-[90vh] overflow-y-auto
          rounded-2xl
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
          shadow-2xl
          animate-[modal-in_220ms_cubic-bezier(0.16,1,0.3,1)]
        "
      >
        <style>{`
          @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
          @keyframes modal-in {
            from { opacity: 0; transform: translateY(8px) scale(0.98) }
            to { opacity: 1; transform: translateY(0) scale(1) }
          }
        `}</style>

        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            aria-label="Voltar"
            className="
              grid place-items-center w-8 h-8 rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:text-slate-700 dark:hover:text-slate-200
              transition-colors
            "
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="grid place-items-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300 shrink-0">
              <Dumbbell className="w-3.5 h-3.5" />
            </div>
            <h2
              id="add-activity-title"
              className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 truncate"
            >
              Adicionar Atividade
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              grid place-items-center w-8 h-8 rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:text-slate-700 dark:hover:text-slate-200
              transition-colors
            "
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-5">
          <Field label="Categoria" required>
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={selectClass}
            >
              {filterableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tipo de atividade" required>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className={selectClass}
              disabled={typesForCategory.length === 0}
            >
              {typesForCategory.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Duração" required>
            <div className="grid grid-cols-5 gap-2">
              {durationPresets.map((d) => {
                const active = d === duration
                const pts = pointsForDuration(selectedType, d)
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`
                      flex flex-col items-center justify-center
                      px-1 py-2 rounded-xl border
                      transition-colors
                      ${
                        active
                          ? 'bg-teal-500/10 text-teal-700 border-teal-500/40 dark:bg-teal-400/10 dark:text-teal-300 dark:border-teal-400/40'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    <div className="font-mono text-sm font-semibold tabular-nums">{d}min</div>
                    <div className="text-[9px] uppercase tracking-[0.12em] font-medium opacity-70">
                      Até
                    </div>
                    {pts > 0 && (
                      <div
                        className={`mt-1 text-[10px] font-mono tabular-nums ${
                          active ? 'opacity-90' : 'opacity-60'
                        }`}
                      >
                        {pts} pts
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data" required>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
                max={todayDate()}
              />
            </Field>
            <Field label="Hora" required>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Foto (opcional)">
            <div className="grid grid-cols-2 gap-2">
              {imagePreview ? (
                <div className="col-span-2 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800">
                  <img
                    src={imagePreview}
                    alt="Pré-visualização"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    aria-label="Remover foto"
                    className="
                      absolute top-2 right-2 grid place-items-center w-7 h-7 rounded-full
                      bg-slate-950/60 text-white hover:bg-slate-950/80
                      transition-colors
                    "
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="
                      flex flex-col items-center justify-center gap-1 py-5
                      rounded-xl border-2 border-dashed
                      border-slate-200 dark:border-slate-700
                      text-slate-600 dark:text-slate-400
                      hover:bg-slate-50 dark:hover:bg-slate-800
                      hover:border-slate-300 dark:hover:border-slate-600
                      transition-colors
                    "
                  >
                    <Camera className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-medium">Câmera</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="
                      flex flex-col items-center justify-center gap-1 py-5
                      rounded-xl border-2 border-dashed
                      border-slate-200 dark:border-slate-700
                      text-slate-600 dark:text-slate-400
                      hover:bg-slate-50 dark:hover:bg-slate-800
                      hover:border-slate-300 dark:hover:border-slate-600
                      transition-colors
                    "
                  >
                    <ImagePlus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-medium">Galeria</span>
                  </button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          </Field>

          {selectedType && (
            <div
              className="
                flex items-center justify-between gap-2 px-4 py-3 rounded-xl
                bg-teal-500/5 dark:bg-teal-400/5
                border border-teal-500/20 dark:border-teal-400/20
              "
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="grid place-items-center w-7 h-7 rounded-lg bg-teal-500/15 text-teal-600 dark:bg-teal-400/15 dark:text-teal-300 shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
                    Você vai ganhar
                  </div>
                  <div className="text-sm font-mono font-semibold tabular-nums text-teal-700 dark:text-teal-300">
                    {points} pts
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 text-right truncate">
                {selectedType.label} · {duration}min
              </div>
            </div>
          )}

          {error && (
            <div className="text-xs text-rose-600 dark:text-rose-400 px-3 py-2 rounded-lg bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/20 dark:border-rose-400/20">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-full
                text-sm font-medium
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="
                px-5 py-2 rounded-full
                bg-teal-600 hover:bg-teal-700 text-white
                dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                text-sm font-medium
                shadow-sm
                transition-colors
              "
            >
              Adicionar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputClass = `
  w-full px-3 py-2.5 rounded-xl
  bg-slate-50 dark:bg-slate-800/60
  border border-slate-200 dark:border-slate-700
  text-sm text-slate-900 dark:text-slate-100
  focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60
  dark:focus:ring-teal-400/30 dark:focus:border-teal-400/60
  transition-shadow
`

const selectClass = `${inputClass} appearance-none bg-no-repeat bg-[length:14px] bg-[right_12px_center] pr-10 cursor-pointer`

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        {label} {required && <span className="text-rose-500 dark:text-rose-400">*</span>}
      </span>
      {children}
    </label>
  )
}
