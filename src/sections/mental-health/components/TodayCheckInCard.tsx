import { useState } from 'react'
import { Check, Pencil, Share2, Sparkles } from 'lucide-react'
import type {
  CheckInSubmission,
  EmotionOption,
  EmotionTone,
  TodayCheckIn,
} from '@/../product/sections/mental-health/types'

interface Props {
  todayCheckIn: TodayCheckIn
  emotionOptions: EmotionOption[]
  /** First name (or display name) do psicólogo vinculado — null esconde o toggle */
  linkedPsychologistName?: string | null
  onSubmitCheckIn?: (payload: CheckInSubmission) => void
  onEditCheckIn?: () => void
  revealIndex?: number
}

const MAX_EMOTIONS = 5
const MAX_NOTE = 600

const MOOD_LABELS: Record<number, string> = {
  1: 'Muito baixo',
  2: 'Muito baixo',
  3: 'Baixo',
  4: 'Baixo',
  5: 'Neutro',
  6: 'Neutro',
  7: 'Bom',
  8: 'Bom',
  9: 'Ótimo',
  10: 'Ótimo',
}

const MOOD_EMOJI: Record<number, string> = {
  1: '😞',
  2: '😞',
  3: '😟',
  4: '😟',
  5: '😐',
  6: '🙂',
  7: '🙂',
  8: '😊',
  9: '😄',
  10: '🤩',
}

function moodGradient(score: number) {
  if (score <= 3) return 'from-violet-600 to-violet-400'
  if (score <= 6) return 'from-violet-500 to-teal-400'
  if (score <= 8) return 'from-teal-500 to-teal-300'
  return 'from-teal-400 to-emerald-300'
}

const ENERGY_LABELS: Record<number, string> = {
  1: 'baixa',
  2: 'baixa',
  3: 'média',
  4: 'alta',
  5: 'alta',
}

const SLEEP_LABELS: Record<number, string> = {
  1: 'ruim',
  2: 'ruim',
  3: 'ok',
  4: 'bom',
  5: 'ótimo',
}

const TONE_GROUP_LABEL: Record<EmotionTone, string> = {
  positive: 'Positivas',
  neutral: 'Neutras',
  negative: 'Difíceis',
}

const TONE_BASE: Record<EmotionTone, string> = {
  positive:
    'border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-900/60 dark:text-teal-300 dark:hover:bg-teal-500/10',
  neutral:
    'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700/70 dark:text-slate-300 dark:hover:bg-slate-800/60',
  negative:
    'border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-500/10',
}

const TONE_SELECTED: Record<EmotionTone, string> = {
  positive:
    'bg-teal-600 border-teal-600 text-white dark:bg-teal-500 dark:border-teal-500',
  neutral:
    'bg-slate-800 border-slate-800 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900',
  negative:
    'bg-rose-600 border-rose-600 text-white dark:bg-rose-500 dark:border-rose-500',
}

export function TodayCheckInCard({
  todayCheckIn,
  emotionOptions,
  linkedPsychologistName = null,
  onSubmitCheckIn,
  onEditCheckIn,
  revealIndex = 0,
}: Props) {
  const [mood, setMood] = useState<number>(todayCheckIn.mood ?? 7)
  const [energy, setEnergy] = useState<number>(todayCheckIn.energy ?? 3)
  const [sleep, setSleep] = useState<number>(todayCheckIn.sleepQuality ?? 3)
  const [emotions, setEmotions] = useState<string[]>(todayCheckIn.emotions)
  const [note, setNote] = useState<string>(todayCheckIn.note ?? '')
  const [share, setShare] = useState<boolean>(
    todayCheckIn.shareWithPsychologist && linkedPsychologistName !== null,
  )

  const canSubmit = emotions.length > 0
  const emotionsByTone: Record<EmotionTone, EmotionOption[]> = {
    positive: emotionOptions.filter((e) => e.tone === 'positive'),
    neutral: emotionOptions.filter((e) => e.tone === 'neutral'),
    negative: emotionOptions.filter((e) => e.tone === 'negative'),
  }

  const toggleEmotion = (id: string) => {
    setEmotions((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_EMOTIONS) return prev
      return [...prev, id]
    })
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmitCheckIn?.({
      mood,
      emotions,
      energy,
      sleepQuality: sleep,
      note,
      shareWithPsychologist: share,
    })
  }

  if (todayCheckIn.isCompleted) {
    return (
      <CompletedSummary
        todayCheckIn={todayCheckIn}
        emotionOptions={emotionOptions}
        linkedPsychologistName={linkedPsychologistName}
        onEdit={onEditCheckIn}
        revealIndex={revealIndex}
      />
    )
  }

  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        relative overflow-hidden rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      {/* Hero band (full-width header) */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className={`
            absolute inset-0
            bg-gradient-to-br ${moodGradient(mood)}
            opacity-[0.12] dark:opacity-20
            pointer-events-none
          `}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 px-6 sm:px-7 lg:px-8 py-5 sm:py-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`
                grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0
                bg-gradient-to-br ${moodGradient(mood)}
                text-2xl sm:text-3xl shadow-[0_8px_24px_-12px_rgba(13,148,136,0.6)]
              `}
              aria-hidden="true"
            >
              {MOOD_EMOJI[mood]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                  Diário de hoje
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums leading-none">
                  {mood}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  / {todayCheckIn.scaleMax}
                </span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">
                  · {MOOD_LABELS[mood] ?? 'Neutro'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 sm:max-w-sm sm:ml-auto sm:text-right">
            {todayCheckIn.hint}
          </p>
        </div>
      </div>

      {/* Form (full-width) */}
      <div className="relative p-6 sm:p-7 lg:p-8 space-y-6">
        <MoodSlider
          value={mood}
          min={todayCheckIn.scaleMin}
          max={todayCheckIn.scaleMax}
          onChange={setMood}
        />

        <EmotionsPicker
          byTone={emotionsByTone}
          selected={emotions}
          max={MAX_EMOTIONS}
          onToggle={toggleEmotion}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <MiniSlider
            label="Energia"
            value={energy}
            max={5}
            accent="teal"
            hint={ENERGY_LABELS[energy]}
            onChange={setEnergy}
          />
          <MiniSlider
            label="Qualidade do sono"
            value={sleep}
            max={5}
            accent="teal"
            hint={SLEEP_LABELS[sleep]}
            onChange={setSleep}
          />
        </div>

        <NoteField value={note} onChange={setNote} />

        {linkedPsychologistName && (
          <ShareToggle
            psychologistName={linkedPsychologistName}
            value={share}
            onChange={setShare}
          />
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            {canSubmit
              ? 'Respostas ajudam a detectar padrões ao longo das semanas.'
              : 'Selecione ao menos uma emoção pra continuar.'}
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              inline-flex items-center gap-1.5 px-4 py-2
              rounded-lg text-sm font-semibold transition-colors
              ${
                canSubmit
                  ? 'bg-teal-600 text-white hover:bg-teal-500 active:bg-teal-700 shadow-[0_8px_20px_-10px_rgba(13,148,136,0.6)]'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
              }
            `}
          >
            Salvar entrada
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Mood slider 1-10 with track + emoji
// ─────────────────────────────────────────────────────────────────────────────

function MoodSlider({
  value,
  min,
  max,
  onChange,
}: {
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          Nota do humor
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none" aria-hidden="true">
            {MOOD_EMOJI[value]}
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {value}
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              {' '}
              / {max}
            </span>
          </span>
        </div>
      </div>
      <div className="relative h-8 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div
          className="absolute left-0 h-1.5 rounded-full bg-teal-500"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          aria-label="Nota do humor"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer focus:outline-none"
        />
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            w-4 h-4 rounded-full bg-teal-600
            ring-2 ring-white dark:ring-slate-900
            shadow-[0_4px_10px_-2px_rgba(15,23,42,0.25)]
          "
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums mt-1">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Emotions grouped by tone (Positivas / Neutras / Difíceis), max 5
// ─────────────────────────────────────────────────────────────────────────────

function EmotionsPicker({
  byTone,
  selected,
  max,
  onToggle,
}: {
  byTone: Record<EmotionTone, EmotionOption[]>
  selected: string[]
  max: number
  onToggle: (id: string) => void
}) {
  const TONES: EmotionTone[] = ['positive', 'neutral', 'negative']
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          Como você se sente?
        </label>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
          {selected.length}/{max}
        </span>
      </div>
      <div className="space-y-2.5">
        {TONES.map((tone) => {
          const opts = byTone[tone]
          if (opts.length === 0) return null
          return (
            <div key={tone}>
              <div className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                {TONE_GROUP_LABEL[tone]}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {opts.map((opt) => {
                  const isSelected = selected.includes(opt.id)
                  const reachedMax = !isSelected && selected.length >= max
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onToggle(opt.id)}
                      aria-pressed={isSelected}
                      disabled={reachedMax}
                      className={`
                        inline-flex items-center px-2.5 py-1 rounded-full
                        text-xs font-medium border transition-colors
                        ${isSelected ? TONE_SELECTED[tone] : TONE_BASE[tone]}
                        ${reachedMax ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini slider 1-5 (energy / sleep) with qualitative hint
// ─────────────────────────────────────────────────────────────────────────────

function MiniSlider({
  label,
  value,
  max,
  accent,
  hint,
  onChange,
}: {
  label: string
  value: number
  max: number
  accent: 'teal' | 'violet'
  hint: string
  onChange: (n: number) => void
}) {
  const pct = ((value - 1) / (max - 1)) * 100
  const thumbColor = accent === 'teal' ? 'bg-teal-600' : 'bg-violet-600'
  const trackColor = accent === 'teal' ? 'bg-teal-500' : 'bg-violet-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </label>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {value}
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              {' '}
              / {max}
            </span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            · {hint}
          </span>
        </div>
      </div>
      <div className="relative h-8 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div
          className={`absolute left-0 h-1.5 rounded-full ${trackColor}`}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          aria-label={label}
          min={1}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer focus:outline-none"
        />
        <div
          aria-hidden="true"
          className={`
            pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            w-4 h-4 rounded-full ${thumbColor}
            ring-2 ring-white dark:ring-slate-900
            shadow-[0_4px_10px_-2px_rgba(15,23,42,0.25)]
          `}
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Textarea for note (up to 600 chars with counter)
// ─────────────────────────────────────────────────────────────────────────────

function NoteField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
          O que aconteceu hoje?
          <span className="ml-1 text-slate-400 dark:text-slate-500 font-normal normal-case">
            · opcional
          </span>
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_NOTE))}
        rows={3}
        placeholder="Gatilhos, conquistas, padrões que notou…"
        className="
          w-full rounded-xl resize-none
          bg-slate-50 dark:bg-slate-950
          border border-slate-200 dark:border-slate-800
          focus:border-teal-500/60 dark:focus:border-teal-400/60
          focus:outline-none focus:ring-2 focus:ring-teal-500/15
          px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          leading-relaxed
        "
      />
      <div className="text-right text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums mt-1">
        {value.length}/{MAX_NOTE}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Share with psychologist toggle (only rendered when linked)
// ─────────────────────────────────────────────────────────────────────────────

function ShareToggle({
  psychologistName,
  value,
  onChange,
}: {
  psychologistName: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  const firstName = psychologistName.split(' ')[0] ?? psychologistName
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className="
        w-full flex items-center gap-3 px-3 py-2.5
        rounded-xl border
        bg-slate-50 dark:bg-slate-950
        border-slate-200 dark:border-slate-800
        hover:border-teal-300 dark:hover:border-teal-700
        transition-colors
      "
    >
      <div
        className={`
          w-9 h-5 rounded-full relative transition-colors shrink-0
          ${value ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}
        `}
        aria-hidden="true"
      >
        <span
          className={`
            absolute top-0.5 w-4 h-4 rounded-full bg-white
            transition-[left] duration-200
            ${value ? 'left-[18px]' : 'left-0.5'}
          `}
        />
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-900 dark:text-slate-100">
          <Share2 className="w-3 h-3 text-violet-500 dark:text-violet-400 shrink-0" />
          Compartilhar com {firstName}
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
          Aparece como mensagem no chat do app
        </div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Completed summary card (after submission)
// ─────────────────────────────────────────────────────────────────────────────

function CompletedSummary({
  todayCheckIn,
  emotionOptions,
  linkedPsychologistName,
  onEdit,
  revealIndex = 0,
}: {
  todayCheckIn: TodayCheckIn
  emotionOptions: EmotionOption[]
  linkedPsychologistName: string | null
  onEdit?: () => void
  revealIndex?: number
}) {
  const selectedEmotions = emotionOptions.filter((e) =>
    todayCheckIn.emotions.includes(e.id),
  )
  const mood = todayCheckIn.mood ?? 0
  const shared = todayCheckIn.shareWithPsychologist && linkedPsychologistName !== null
  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        relative overflow-hidden rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        p-6 sm:p-7
        space-y-4
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Diário concluído
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`
                grid place-items-center w-14 h-14 rounded-2xl text-2xl
                bg-gradient-to-br ${moodGradient(mood)}
              `}
              aria-hidden="true"
            >
              {MOOD_EMOJI[mood]}
            </div>
            <div>
              <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
                {mood}
                <span className="text-slate-400 dark:text-slate-500 font-normal text-lg">
                  {' '}
                  / {todayCheckIn.scaleMax}
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {MOOD_LABELS[mood] ?? 'Neutro'} · Energia {todayCheckIn.energy}/5 · Sono{' '}
                {todayCheckIn.sleepQuality}/5
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
            text-xs font-medium
            text-slate-600 dark:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition-colors
          "
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
      </div>

      {selectedEmotions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedEmotions.map((e) => (
            <span
              key={e.id}
              className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                ${TONE_SELECTED[e.tone]}
              `}
            >
              {e.label}
            </span>
          ))}
        </div>
      )}

      {todayCheckIn.note && (
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {todayCheckIn.note}
        </p>
      )}

      {shared && linkedPsychologistName && (
        <div className="flex items-center gap-1.5 text-[11px] text-violet-600 dark:text-violet-300">
          <Share2 className="w-3 h-3" />
          Compartilhado com {linkedPsychologistName.split(' ')[0]}
        </div>
      )}
    </section>
  )
}
