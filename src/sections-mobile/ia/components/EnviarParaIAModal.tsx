import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Camera,
  FolderOpen,
  FileUp,
  X,
  Sparkles,
  Plus,
  Calendar,
  Clock,
  Shield,
  Lightbulb,
  AlertTriangle,
  Check,
  Pencil,
  RefreshCw,
  PersonStanding,
  type LucideIcon,
} from 'lucide-react'
import type { ChatOptionType } from '@/../product-mobile/api-types'
import type { QuickActionUI } from '@/../product-mobile/sections/ia/types'
import { getIcon, bgFromCor, textFromCor } from './_shared'

type DateFieldKind = 'datetime' | 'date-only'

interface TypeConfig {
  maxFiles: number
  acceptPdf: boolean
  maxSizeMb: number
  extras?: 'meal-type' | 'body-photo'
  hint: string
  dateFieldKind: DateFieldKind
  dateFieldLabel: string
}

const TYPE_CONFIG: Record<ChatOptionType, TypeConfig> = {
  scale: {
    maxFiles: 1,
    acceptPdf: false,
    maxSizeMb: 50,
    hint: 'Mostre o display da balança em foco',
    dateFieldKind: 'datetime',
    dateFieldLabel: 'Data e hora da medição',
  },
  glucose: {
    maxFiles: 1,
    acceptPdf: false,
    maxSizeMb: 50,
    hint: 'Display do glicosímetro legível',
    dateFieldKind: 'datetime',
    dateFieldLabel: 'Data e hora da medição',
  },
  blood_pressure: {
    maxFiles: 1,
    acceptPdf: false,
    maxSizeMb: 50,
    hint: 'Mostre sistólica, diastólica e pulso',
    dateFieldKind: 'datetime',
    dateFieldLabel: 'Data e hora da medição',
  },
  food: {
    maxFiles: 5,
    acceptPdf: false,
    maxSizeMb: 10,
    extras: 'meal-type',
    hint: 'Até 5 fotos do mesmo prato',
    dateFieldKind: 'datetime',
    dateFieldLabel: 'Data e hora da refeição',
  },
  lab_exam: {
    maxFiles: 5,
    acceptPdf: true,
    maxSizeMb: 10,
    hint: 'Aceita PDF ou foto · até 5 arquivos',
    dateFieldKind: 'date-only',
    dateFieldLabel: 'Data do exame',
  },
  bioimpedance: {
    maxFiles: 5,
    acceptPdf: true,
    maxSizeMb: 10,
    hint: 'Aceita PDF ou foto do relatório',
    dateFieldKind: 'date-only',
    dateFieldLabel: 'Data da avaliação',
  },
  body_photo: {
    maxFiles: 5,
    acceptPdf: false,
    maxSizeMb: 10,
    extras: 'body-photo',
    hint: 'Até 5 fotos · marque a posição de cada uma',
    dateFieldKind: 'date-only',
    dateFieldLabel: 'Data da avaliação',
  },
}

type MealType = 'cafe' | 'almoco' | 'lanche' | 'janta' | 'ceia'
type BodySex = 'masculino' | 'feminino'
type BodySlotId = 'frontal' | 'posterior' | 'lat_esq' | 'lat_dir' | 'duplo_biceps'

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'cafe', label: 'Café' },
  { id: 'almoco', label: 'Almoço' },
  { id: 'lanche', label: 'Lanche' },
  { id: 'janta', label: 'Janta' },
  { id: 'ceia', label: 'Ceia' },
]

const BODY_SLOTS: { id: BodySlotId; label: string; required: boolean }[] = [
  { id: 'frontal', label: 'Frontal', required: true },
  { id: 'posterior', label: 'Posterior', required: true },
  { id: 'lat_esq', label: 'Lat. Esq.', required: true },
  { id: 'lat_dir', label: 'Lat. Dir.', required: true },
  { id: 'duplo_biceps', label: 'Duplo Bíceps', required: false },
]

const DICAS_FOTO = [
  'Iluminação clara e uniforme',
  'Fundo neutro, sem objetos atrás',
  'Roupa justa ou roupa de banho',
  'Postura ereta, braços levemente afastados',
  'Distância de ~2m da câmera',
]

interface FileItem {
  id: string
  name: string
  isPdf: boolean
  /** Para body_photo: identifica em qual slot a foto foi tirada */
  slot?: BodySlotId
}

type ViewState = 'upload' | 'analyzing' | 'result'

interface EnviarParaIAModalProps {
  action: QuickActionUI
  onClose: () => void
  onSubmit?: (payload: { action: QuickActionUI; files: number; meta: Record<string, unknown> }) => void
  /** Datas YYYY-MM-DD com exames já registrados (pra warning de duplicata em lab_exam) */
  existingExamDates?: string[]
}

export function EnviarParaIAModal({ action, onClose, onSubmit, existingExamDates }: EnviarParaIAModalProps) {
  const cfg = TYPE_CONFIG[action.option.type]
  const Icon = getIcon(action.iconeNome)
  const iconBg = bgFromCor(action.cor)
  const iconText = textFromCor(action.cor)

  const [view, setView] = useState<ViewState>('upload')
  const [files, setFiles] = useState<FileItem[]>([])
  const [mealType, setMealType] = useState<MealType>('almoco')
  const [bodySex, setBodySex] = useState<BodySex>('masculino')
  const [activeBodySlot, setActiveBodySlot] = useState<BodySlotId>('frontal')

  const now = useMemo(() => new Date(), [])
  const [date, setDate] = useState<string>(toDateInput(now))
  const [time, setTime] = useState<string>(toTimeInput(now))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const isBodyPhoto = action.option.type === 'body_photo'
  const isLabExam = action.option.type === 'lab_exam'

  const filledBodySlots = useMemo(
    () => new Set(files.map((f) => f.slot).filter(Boolean) as BodySlotId[]),
    [files],
  )
  const requiredBodyDone = BODY_SLOTS.filter((s) => s.required).every((s) =>
    filledBodySlots.has(s.id),
  )

  const canAddMore = files.length < cfg.maxFiles
  const canSubmit = isBodyPhoto ? requiredBodyDone : files.length > 0

  const isDuplicate = isLabExam && existingExamDates?.includes(date)

  const addMockFile = (kind: 'camera' | 'galeria' | 'pdf') => {
    if (!canAddMore) return
    const idx = files.length
    const id = `f-${Date.now()}-${idx}`
    const name =
      kind === 'pdf'
        ? `exame-${idx + 1}.pdf`
        : kind === 'camera'
          ? `camera-${idx + 1}.jpg`
          : `galeria-${idx + 1}.jpg`
    const slot = isBodyPhoto ? activeBodySlot : undefined

    setFiles((prev) => {
      // Em body_photo: substitui se slot já tem foto
      if (isBodyPhoto && slot) {
        const filtered = prev.filter((f) => f.slot !== slot)
        return [...filtered, { id, name, isPdf: kind === 'pdf', slot }]
      }
      return [...prev, { id, name, isPdf: kind === 'pdf', slot }]
    })

    if (isBodyPhoto) {
      const order: BodySlotId[] = ['frontal', 'posterior', 'lat_esq', 'lat_dir', 'duplo_biceps']
      const nextEmpty = order.find(
        (s) => s !== slot && !files.some((f) => f.slot === s),
      )
      if (nextEmpty) setActiveBodySlot(nextEmpty)
    }
  }

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))
  const removeBodySlot = (slot: BodySlotId) =>
    setFiles((prev) => prev.filter((f) => f.slot !== slot))

  const submit = () => {
    if (!canSubmit) return
    setView('analyzing')
    setTimeout(() => setView('result'), 1400)
  }

  const retry = () => {
    setView('analyzing')
    setTimeout(() => setView('result'), 1200)
  }

  const confirmSave = () => {
    const meta: Record<string, unknown> = {}
    if (cfg.dateFieldKind === 'datetime') {
      meta.measuredAt = `${date}T${time}:00`
    } else {
      meta.date = date
    }
    if (cfg.extras === 'meal-type') meta.mealType = mealType
    if (cfg.extras === 'body-photo') {
      meta.sex = bodySex
      meta.slots = files.map((f) => ({ slot: f.slot, name: f.name }))
    }
    onSubmit?.({ action, files: files.length, meta })
    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end" data-nymos-mobile="true">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Fechar"
      />

      <div className="relative w-full bg-slate-950 rounded-t-[28px] border-t border-slate-800 max-h-[92%] flex flex-col animate-in slide-in-from-bottom duration-200">
        <div className="pt-2.5 pb-1 flex items-center justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        <ModalHeader
          Icon={Icon}
          iconBg={iconBg}
          iconText={iconText}
          label={action.option.label}
          description={action.option.description}
          view={view}
          onClose={onClose}
        />

        {view === 'upload' && (
          <UploadView
            cfg={cfg}
            action={action}
            files={files}
            canAddMore={canAddMore}
            canSubmit={canSubmit}
            isBodyPhoto={isBodyPhoto}
            isLabExam={isLabExam}
            isDuplicate={!!isDuplicate}
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
            mealType={mealType}
            onMealTypeChange={setMealType}
            bodySex={bodySex}
            onBodySexChange={setBodySex}
            activeBodySlot={activeBodySlot}
            onActiveBodySlotChange={setActiveBodySlot}
            filledBodySlots={filledBodySlots}
            onAddFile={addMockFile}
            onRemoveFile={removeFile}
            onRemoveBodySlot={removeBodySlot}
            onSubmit={submit}
          />
        )}

        {view === 'analyzing' && <AnalyzingView corLabel={action.option.label} />}

        {view === 'result' && (
          <ResultView
            action={action}
            cfg={cfg}
            isDuplicate={!!isDuplicate}
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
            onConfirm={confirmSave}
            onEdit={() => setView('upload')}
            onRetry={retry}
          />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface ModalHeaderProps {
  Icon: LucideIcon
  iconBg: string
  iconText: string
  label: string
  description: string
  view: ViewState
  onClose: () => void
}

function ModalHeader({ Icon, iconBg, iconText, label, description, view, onClose }: ModalHeaderProps) {
  const subtitle =
    view === 'analyzing' ? 'Analisando...' : view === 'result' ? 'Resultado da análise' : description
  return (
    <div className="px-5 pt-2 pb-3 flex items-start gap-3 border-b border-slate-900">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center ${iconText} shrink-0`}>
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-semibold text-[15px] leading-tight">{label}</div>
        <div className="text-slate-400 text-[11.5px] mt-0.5 leading-snug">{subtitle}</div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white shrink-0"
        aria-label="Fechar"
      >
        <X size={15} />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface UploadViewProps {
  cfg: TypeConfig
  action: QuickActionUI
  files: FileItem[]
  canAddMore: boolean
  canSubmit: boolean
  isBodyPhoto: boolean
  isLabExam: boolean
  isDuplicate: boolean
  date: string
  time: string
  onDateChange: (v: string) => void
  onTimeChange: (v: string) => void
  mealType: MealType
  onMealTypeChange: (v: MealType) => void
  bodySex: BodySex
  onBodySexChange: (v: BodySex) => void
  activeBodySlot: BodySlotId
  onActiveBodySlotChange: (v: BodySlotId) => void
  filledBodySlots: Set<BodySlotId>
  onAddFile: (k: 'camera' | 'galeria' | 'pdf') => void
  onRemoveFile: (id: string) => void
  onRemoveBodySlot: (s: BodySlotId) => void
  onSubmit: () => void
}

function UploadView(props: UploadViewProps) {
  const {
    cfg,
    action,
    files,
    canAddMore,
    canSubmit,
    isBodyPhoto,
    isLabExam,
    isDuplicate,
    date,
    time,
    onDateChange,
    onTimeChange,
    mealType,
    onMealTypeChange,
    bodySex,
    onBodySexChange,
    activeBodySlot,
    onActiveBodySlotChange,
    filledBodySlots,
    onAddFile,
    onRemoveFile,
    onRemoveBodySlot,
    onSubmit,
  } = props

  return (
    <>
      <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 no-scrollbar">
        <DateField
          label={cfg.dateFieldLabel}
          kind={cfg.dateFieldKind}
          date={date}
          time={time}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
        />

        {isLabExam && isDuplicate && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-2.5 flex items-start gap-2.5">
            <AlertTriangle size={15} className="text-amber-300 mt-0.5 shrink-0" strokeWidth={2.2} />
            <div className="min-w-0">
              <div className="text-amber-200 text-[12.5px] font-semibold">Já existe um exame nesta data</div>
              <div className="text-amber-200/70 text-[11px] mt-0.5 leading-snug">
                Se enviar, o sistema pode retornar um conflito. Considere trocar a data ou substituir o registro existente.
              </div>
            </div>
          </div>
        )}

        {cfg.extras === 'meal-type' && (
          <ChipPicker
            label="Refeição"
            options={MEAL_TYPES}
            value={mealType}
            onChange={onMealTypeChange}
            cor={action.cor}
          />
        )}

        {isBodyPhoto ? (
          <BodyPhotoSection
            sex={bodySex}
            onSexChange={onBodySexChange}
            activeSlot={activeBodySlot}
            onActiveSlotChange={onActiveBodySlotChange}
            files={files}
            filledSlots={filledBodySlots}
            onRemoveSlot={onRemoveBodySlot}
            cor={action.cor}
          />
        ) : (
          <GenericFilesSection
            cfg={cfg}
            files={files}
            canAddMore={canAddMore}
            onRemoveFile={onRemoveFile}
            onAddGalleryQuick={() => onAddFile('galeria')}
          />
        )}

        <div className="grid grid-cols-2 gap-2">
          <PickerButton
            icon={Camera}
            label="Câmera"
            disabled={!canAddMore}
            onClick={() => onAddFile('camera')}
          />
          <PickerButton
            icon={FolderOpen}
            label="Galeria"
            disabled={!canAddMore}
            onClick={() => onAddFile('galeria')}
          />
          {cfg.acceptPdf && (
            <PickerButton
              icon={FileUp}
              label="Arquivo PDF"
              disabled={!canAddMore}
              onClick={() => onAddFile('pdf')}
              full
            />
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-slate-900 bg-slate-950">
        <button
          disabled={!canSubmit}
          onClick={onSubmit}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[14px] flex items-center justify-center gap-2 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600"
        >
          <Sparkles size={15} strokeWidth={2.4} />
          Analisar com IA
        </button>
        <div className="text-slate-600 text-[10px] text-center mt-2">
          Os dados serão extraídos e salvos em{' '}
          <span className="font-mono text-slate-500">{action.option.targetTable}</span>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface DateFieldProps {
  label: string
  kind: DateFieldKind
  date: string
  time: string
  onDateChange: (v: string) => void
  onTimeChange: (v: string) => void
}

function DateField({ label, kind, date, time, onDateChange, onTimeChange }: DateFieldProps) {
  return (
    <div>
      <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-2">
        {label} <span className="text-rose-400">*</span>
      </div>
      <div className="flex gap-2">
        <label className="flex-1 flex items-center gap-2 px-3 h-11 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-slate-600">
          <Calendar size={14} className="text-slate-500 shrink-0" strokeWidth={2.2} />
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex-1 bg-transparent text-slate-100 text-[13px] font-mono tabular-nums outline-none [color-scheme:dark]"
          />
        </label>
        {kind === 'datetime' && (
          <label className="w-[110px] flex items-center gap-2 px-3 h-11 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-slate-600">
            <Clock size={14} className="text-slate-500 shrink-0" strokeWidth={2.2} />
            <input
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="flex-1 bg-transparent text-slate-100 text-[13px] font-mono tabular-nums outline-none [color-scheme:dark]"
            />
          </label>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface GenericFilesSectionProps {
  cfg: TypeConfig
  files: FileItem[]
  canAddMore: boolean
  onRemoveFile: (id: string) => void
  onAddGalleryQuick: () => void
}

function GenericFilesSection({
  cfg,
  files,
  canAddMore,
  onRemoveFile,
  onAddGalleryQuick,
}: GenericFilesSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
          {cfg.maxFiles === 1 ? 'Imagem' : `Arquivos · ${files.length}/${cfg.maxFiles}`}
        </span>
        <span className="text-slate-600 text-[10px] font-mono tabular-nums">máx {cfg.maxSizeMb}MB</span>
      </div>

      {files.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-6 text-center">
          <div className="text-slate-300 text-[12.5px] font-medium">Nenhum arquivo ainda</div>
          <div className="text-slate-500 text-[11px] mt-0.5">{cfg.hint}</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="relative aspect-square rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center"
            >
              {f.isPdf ? (
                <div className="text-center px-2">
                  <FileUp size={20} className="text-emerald-300 mx-auto" strokeWidth={2.2} />
                  <div className="text-slate-300 text-[10px] mt-1 truncate">{f.name}</div>
                </div>
              ) : (
                <Camera size={22} className="text-slate-500" strokeWidth={1.8} />
              )}
              <button
                onClick={() => onRemoveFile(f.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="Remover"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          {canAddMore && (
            <button
              onClick={onAddGalleryQuick}
              className="aspect-square rounded-xl border border-dashed border-slate-700 hover:border-slate-500 flex items-center justify-center text-slate-500 hover:text-slate-300"
              aria-label="Adicionar mais"
            >
              <Plus size={18} strokeWidth={2.2} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface BodyPhotoSectionProps {
  sex: BodySex
  onSexChange: (v: BodySex) => void
  activeSlot: BodySlotId
  onActiveSlotChange: (v: BodySlotId) => void
  files: FileItem[]
  filledSlots: Set<BodySlotId>
  onRemoveSlot: (s: BodySlotId) => void
  cor: QuickActionUI['cor']
}

function BodyPhotoSection({
  sex,
  onSexChange,
  activeSlot,
  onActiveSlotChange,
  files,
  filledSlots,
  onRemoveSlot,
  cor,
}: BodyPhotoSectionProps) {
  const activeBg = bgFromCor(cor)
  const activeText = textFromCor(cor)
  return (
    <div className="space-y-3">
      <InfoCard
        icon={Shield}
        cor="emerald"
        title="Como funciona a análise?"
        body="Suas fotos não são armazenadas. Apenas as métricas extraídas pela IA (postura, simetria, composição visual) são salvas."
      />

      <InfoCard
        icon={Lightbulb}
        cor="amber"
        title="Dicas para melhor análise"
        body={
          <ul className="space-y-0.5 mt-1">
            {DICAS_FOTO.map((d) => (
              <li key={d} className="text-[11px] text-slate-300/90 leading-snug">
                · {d}
              </li>
            ))}
          </ul>
        }
      />

      <div>
        <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-2">Sexo</div>
        <div className="grid grid-cols-2 gap-2">
          {(['masculino', 'feminino'] as BodySex[]).map((s) => {
            const isActive = s === sex
            return (
              <button
                key={s}
                onClick={() => onSexChange(s)}
                className={`h-11 rounded-2xl text-[13px] font-medium border transition-colors ${
                  isActive
                    ? `${activeBg} ${activeText} border-transparent`
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {s === 'masculino' ? 'Masculino' : 'Feminino'}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
            Posições · {filledSlots.size}/4 obrigatórias
          </span>
          <span className="text-slate-600 text-[10px] font-mono tabular-nums">
            {Array.from(filledSlots).length === 0 ? 'sem fotos' : `${filledSlots.size}/5`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BODY_SLOTS.slice(0, 4).map((s) => (
            <BodySlotTile
              key={s.id}
              slot={s}
              isActive={activeSlot === s.id}
              hasFile={filledSlots.has(s.id)}
              file={files.find((f) => f.slot === s.id)}
              sex={sex}
              cor={cor}
              onSelect={() => onActiveSlotChange(s.id)}
              onRemove={() => onRemoveSlot(s.id)}
            />
          ))}
        </div>
        <div className="mt-2">
          <BodySlotTile
            slot={BODY_SLOTS[4]}
            isActive={activeSlot === 'duplo_biceps'}
            hasFile={filledSlots.has('duplo_biceps')}
            file={files.find((f) => f.slot === 'duplo_biceps')}
            sex={sex}
            cor={cor}
            onSelect={() => onActiveSlotChange('duplo_biceps')}
            onRemove={() => onRemoveSlot('duplo_biceps')}
            wide
          />
        </div>
      </div>
    </div>
  )
}

interface BodySlotTileProps {
  slot: { id: BodySlotId; label: string; required: boolean }
  isActive: boolean
  hasFile: boolean
  file?: FileItem
  sex: BodySex
  cor: QuickActionUI['cor']
  onSelect: () => void
  onRemove: () => void
  wide?: boolean
}

const RING_BY_COR: Record<QuickActionUI['cor'], string> = {
  teal: 'ring-2 ring-teal-400',
  sky: 'ring-2 ring-sky-400',
  emerald: 'ring-2 ring-emerald-400',
  amber: 'ring-2 ring-amber-400',
  rose: 'ring-2 ring-rose-400',
  violet: 'ring-2 ring-violet-400',
}

function BodySlotTile({ slot, isActive, hasFile, file, sex, cor, onSelect, onRemove, wide }: BodySlotTileProps) {
  const activeRing = isActive ? RING_BY_COR[cor] : ''
  const activeText = textFromCor(cor)
  return (
    <div className={wide ? 'flex items-stretch gap-2' : ''}>
      <button
        onClick={onSelect}
        className={`relative w-full ${wide ? 'h-16' : 'aspect-[2/3]'} rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 ${activeRing} flex flex-col items-center justify-center overflow-hidden`}
      >
        {hasFile ? (
          <Camera size={22} className={textFromCor(cor)} strokeWidth={2} />
        ) : (
          <PersonStanding
            size={wide ? 28 : 36}
            className={`${sex === 'feminino' ? 'text-rose-300/30' : 'text-sky-300/30'}`}
            strokeWidth={1.5}
          />
        )}
        <div
          className={`text-[10px] mt-1 font-medium ${
            isActive ? activeText : hasFile ? 'text-slate-200' : 'text-slate-500'
          } px-1 text-center leading-tight`}
        >
          {slot.label}
          {!slot.required && <span className="text-slate-600"> (opc)</span>}
        </div>
        {hasFile && file && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
            aria-label="Remover"
          >
            <X size={11} />
          </button>
        )}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function AnalyzingView({ corLabel }: { corLabel: string }) {
  return (
    <div className="flex-1 flex items-center justify-center px-5 py-12">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center animate-pulse">
          <Sparkles size={24} className="text-white" strokeWidth={2.4} />
        </div>
        <div className="text-slate-100 font-semibold text-[14px] mt-3">Analisando com IA</div>
        <div className="text-slate-500 text-[11.5px] mt-1">Extraindo dados de {corLabel.toLowerCase()}...</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface ResultViewProps {
  action: QuickActionUI
  cfg: TypeConfig
  isDuplicate: boolean
  date: string
  time: string
  onDateChange: (v: string) => void
  onTimeChange: (v: string) => void
  onConfirm: () => void
  onEdit: () => void
  onRetry: () => void
}

function ResultView({
  action,
  cfg,
  isDuplicate,
  date,
  time,
  onDateChange,
  onTimeChange,
  onConfirm,
  onEdit,
  onRetry,
}: ResultViewProps) {
  const result = mockResultByType(action.option.type)
  const isLabExam = action.option.type === 'lab_exam'
  const showDuplicate = isLabExam && isDuplicate

  return (
    <>
      <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 no-scrollbar">
        <DateField
          label={cfg.dateFieldLabel}
          kind={cfg.dateFieldKind}
          date={date}
          time={time}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
        />

        {showDuplicate && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 flex items-start gap-2.5">
            <AlertTriangle size={15} className="text-rose-300 mt-0.5 shrink-0" strokeWidth={2.2} />
            <div className="min-w-0">
              <div className="text-rose-200 text-[12.5px] font-semibold">Conflito de data</div>
              <div className="text-rose-200/80 text-[11px] mt-0.5 leading-snug">
                Já existe um exame em <span className="font-mono">{formatDateBR(date)}</span>. Troque a data
                acima ou use <span className="font-semibold">Substituir registro</span>.
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
            Dados extraídos
          </span>
          <ConfidenceBadge confidence={result.confidence} />
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800">
          {result.fields.map((row) => (
            <div key={row.label} className="px-4 py-2.5 flex items-center justify-between">
              <span className="text-slate-400 text-[12px]">{row.label}</span>
              <span className="text-slate-100 text-[13px] font-mono tabular-nums">{row.value}</span>
            </div>
          ))}
        </div>
        {result.notes && (
          <div className="text-slate-500 text-[11px] italic leading-snug">{result.notes}</div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-900 bg-slate-950 space-y-2">
        {showDuplicate ? (
          <button
            onClick={onConfirm}
            className="w-full h-12 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-100 font-semibold text-[13.5px] flex items-center justify-center gap-2"
          >
            Substituir registro existente
          </button>
        ) : (
          <button
            onClick={onConfirm}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[14px] flex items-center justify-center gap-2"
          >
            <Check size={15} strokeWidth={2.6} />
            Confirmar e salvar
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onEdit}
            className="h-10 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-medium text-[12.5px] flex items-center justify-center gap-1.5"
          >
            <Pencil size={13} strokeWidth={2.2} />
            Editar fotos
          </button>
          <button
            onClick={onRetry}
            className="h-10 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-medium text-[12.5px] flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={13} strokeWidth={2.2} />
            Re-analisar
          </button>
        </div>
      </div>
    </>
  )
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const tone = pct >= 90 ? 'emerald' : pct >= 75 ? 'amber' : 'rose'
  const map: Record<string, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-300',
    amber: 'bg-amber-500/15 text-amber-300',
    rose: 'bg-rose-500/15 text-rose-300',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full ${map[tone]} text-[10.5px] font-mono tabular-nums font-semibold`}>
      {pct}% confiança
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface PickerButtonProps {
  icon: typeof Camera
  label: string
  disabled?: boolean
  full?: boolean
  onClick: () => void
}

function PickerButton({ icon: Icon, label, disabled, full, onClick }: PickerButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${full ? 'col-span-2' : ''} h-11 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 text-slate-200 text-[13px] font-medium disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <Icon size={15} strokeWidth={2.2} />
      {label}
    </button>
  )
}

interface ChipPickerProps<T extends string> {
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  cor: QuickActionUI['cor']
}

function ChipPicker<T extends string>({ label, options, value, onChange, cor }: ChipPickerProps<T>) {
  const activeBg = bgFromCor(cor)
  const activeText = textFromCor(cor)
  return (
    <div>
      <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-2">{label}</div>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => {
          const isActive = opt.id === value
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`px-3 h-8 rounded-full text-[12px] font-medium border ${
                isActive
                  ? `${activeBg} ${activeText} border-transparent`
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface InfoCardProps {
  icon: LucideIcon
  cor: 'emerald' | 'amber' | 'sky'
  title: string
  body: ReactNode
}

function InfoCard({ icon: Icon, cor, title, body }: InfoCardProps) {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/25',
      text: 'text-emerald-300',
    },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-300' },
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/25', text: 'text-sky-300' },
  }
  const c = map[cor]
  return (
    <div className={`rounded-2xl ${c.bg} border ${c.border} px-3.5 py-2.5 flex items-start gap-2.5`}>
      <Icon size={15} className={`${c.text} mt-0.5 shrink-0`} strokeWidth={2.2} />
      <div className="min-w-0 flex-1">
        <div className={`${c.text} text-[12px] font-semibold`}>{title}</div>
        <div className="text-slate-300/90 text-[11px] mt-0.5 leading-snug">{body}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function toDateInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toTimeInput(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

interface ResultMock {
  confidence: number
  fields: { label: string; value: string }[]
  notes?: string
}

function mockResultByType(type: ChatOptionType): ResultMock {
  switch (type) {
    case 'scale':
      return {
        confidence: 0.94,
        fields: [
          { label: 'Peso', value: '78,4 kg' },
          { label: 'Variação vs anterior', value: '−0,3 kg' },
        ],
      }
    case 'glucose':
      return {
        confidence: 0.91,
        fields: [
          { label: 'Glicemia', value: '105 mg/dL' },
          { label: 'Faixa', value: 'Normal' },
        ],
      }
    case 'blood_pressure':
      return {
        confidence: 0.89,
        fields: [
          { label: 'Sistólica', value: '124 mmHg' },
          { label: 'Diastólica', value: '82 mmHg' },
          { label: 'Pulso', value: '68 bpm' },
        ],
      }
    case 'food':
      return {
        confidence: 0.86,
        fields: [
          { label: 'Alimento', value: 'Arroz, feijão, frango' },
          { label: 'Porção', value: '~450g' },
          { label: 'Calorias', value: '612 kcal' },
          { label: 'Carboidratos', value: '78g' },
          { label: 'Proteína', value: '42g' },
          { label: 'Gordura', value: '14g' },
        ],
        notes: 'Estimativa baseada em foto. Confirme a porção se necessário.',
      }
    case 'lab_exam':
      return {
        confidence: 0.92,
        fields: [
          { label: 'Hemoglobina', value: '14,2 g/dL' },
          { label: 'Glicose', value: '92 mg/dL' },
          { label: 'Colesterol total', value: '186 mg/dL' },
          { label: 'HDL', value: '54 mg/dL' },
          { label: 'LDL', value: '108 mg/dL' },
          { label: 'Triglicérides', value: '120 mg/dL' },
        ],
      }
    case 'bioimpedance':
      return {
        confidence: 0.93,
        fields: [
          { label: '% Gordura', value: '18,5%' },
          { label: 'Massa muscular', value: '62,3 kg' },
          { label: 'Água corporal', value: '54,8%' },
          { label: 'Massa óssea', value: '3,2 kg' },
        ],
      }
    case 'body_photo':
      return {
        confidence: 0.88,
        fields: [
          { label: 'Postura', value: 'Normal' },
          { label: 'Simetria', value: '92%' },
          { label: 'Composição visual', value: 'Eutrófico' },
        ],
        notes: 'Análise visual. Não substitui bioimpedância.',
      }
  }
}
