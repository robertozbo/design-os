import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ListChecks,
  Phone,
  Share2,
  Sparkles,
} from 'lucide-react'
import type {
  AssessmentCatalog,
  AssessmentInterpretation,
  AssessmentSubmission,
  InterpretationTone,
} from '@/../product/sections/mental-health/types'

export interface AssessmentRunnerProps {
  catalog: AssessmentCatalog
  /** First name (ou display name) do psicólogo que solicitou. Null esconde toggle de share. */
  requestedBy?: string | null
  /** Score anterior pra mostrar delta no resultado. */
  previousScore?: number | null
  onSubmit?: (payload: AssessmentSubmission) => void
  onExit?: () => void
}

type Step = 'intro' | 'questions' | 'result'

const TONE_BADGE: Record<InterpretationTone, string> = {
  good: 'bg-emerald-500/10 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20',
  caution:
    'bg-amber-500/10 text-amber-700 ring-amber-200/60 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20',
  warning:
    'bg-orange-500/10 text-orange-700 ring-orange-200/60 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-500/20',
  critical:
    'bg-rose-500/10 text-rose-700 ring-rose-200/60 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/20',
}

const TONE_SCORE_TEXT: Record<InterpretationTone, string> = {
  good: 'text-emerald-700 dark:text-emerald-300',
  caution: 'text-amber-700 dark:text-amber-300',
  warning: 'text-orange-700 dark:text-orange-300',
  critical: 'text-rose-700 dark:text-rose-300',
}

function findInterpretation(
  catalog: AssessmentCatalog,
  score: number,
): AssessmentInterpretation {
  return (
    catalog.interpretations.find(
      (i) => score >= i.minScore && score <= i.maxScore,
    ) ?? catalog.interpretations[0]
  )
}

export function AssessmentRunner({
  catalog,
  requestedBy = null,
  previousScore = null,
  onSubmit,
  onExit,
}: AssessmentRunnerProps) {
  const [step, setStep] = useState<Step>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [share, setShare] = useState<boolean>(requestedBy !== null)

  const totalQuestions = catalog.questions.length
  const currentQuestion = catalog.questions[questionIndex]
  const currentAnswer = answers[currentQuestion?.id ?? '']
  const isLastQuestion = questionIndex === totalQuestions - 1
  const allAnswered = catalog.questions.every((q) => answers[q.id] !== undefined)

  const score = useMemo(
    () => Object.values(answers).reduce((sum, v) => sum + v, 0),
    [answers],
  )
  const interpretation = findInterpretation(catalog, score)
  const safetyTriggered =
    catalog.safetyTriggerQuestionIndex !== null &&
    (answers[catalog.questions[catalog.safetyTriggerQuestionIndex]?.id ?? ''] ?? 0) > 0

  const handleSelectOption = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = () => {
    if (currentAnswer === undefined) return
    if (isLastQuestion) {
      setStep('result')
    } else {
      setQuestionIndex((i) => i + 1)
    }
  }

  const handleBack = () => {
    if (questionIndex === 0) {
      setStep('intro')
    } else {
      setQuestionIndex((i) => i - 1)
    }
  }

  const handleFinalize = () => {
    if (!allAnswered) return
    onSubmit?.({
      type: catalog.type,
      score,
      answers,
      shareWithPsychologist: share,
    })
  }

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
      data-nymos-assessment-runner
    >
      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <button
          type="button"
          onClick={onExit}
          className="
            inline-flex items-center gap-1.5 mb-6 text-sm
            text-slate-600 dark:text-slate-400
            hover:text-slate-900 dark:hover:text-slate-100
            transition-colors
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar pra Mental Health
        </button>

        {step === 'intro' && (
          <IntroPanel
            catalog={catalog}
            requestedBy={requestedBy}
            onStart={() => setStep('questions')}
          />
        )}

        {step === 'questions' && (
          <QuestionPanel
            catalog={catalog}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            currentAnswer={currentAnswer}
            onSelect={handleSelectOption}
            onNext={handleNext}
            onBack={handleBack}
            isLastQuestion={isLastQuestion}
          />
        )}

        {step === 'result' && (
          <ResultPanel
            catalog={catalog}
            score={score}
            interpretation={interpretation}
            previousScore={previousScore}
            safetyTriggered={safetyTriggered}
            requestedBy={requestedBy}
            share={share}
            onShareChange={setShare}
            onFinalize={handleFinalize}
            onReview={() => {
              setStep('questions')
              setQuestionIndex(0)
            }}
          />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Intro
// ─────────────────────────────────────────────────────────────────────────────

function IntroPanel({
  catalog,
  requestedBy,
  onStart,
}: {
  catalog: AssessmentCatalog
  requestedBy: string | null
  onStart: () => void
}) {
  return (
    <section
      className="
        rounded-2xl overflow-hidden
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
      "
    >
      <div className="relative p-7 sm:p-9 overflow-hidden">
        <div
          aria-hidden="true"
          className="
            absolute inset-x-0 top-0 h-40
            bg-gradient-to-br from-violet-200/60 via-transparent to-teal-200/40
            dark:from-violet-500/15 dark:via-transparent dark:to-teal-500/15
            pointer-events-none
          "
        />

        <div className="relative flex items-start gap-4">
          <div
            aria-hidden="true"
            className="
              grid place-items-center w-12 h-12 shrink-0 rounded-xl
              bg-violet-600 text-white
              shadow-[0_10px_24px_-12px_rgba(124,58,237,0.7)]
            "
          >
            <ListChecks className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            {requestedBy && (
              <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-violet-700 dark:text-violet-300 mb-1">
                {requestedBy} pediu pra você responder
              </div>
            )}
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              {catalog.name}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {catalog.fullName}
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {catalog.intro}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 tabular-nums">
                <ListChecks className="w-3.5 h-3.5" />
                {catalog.questions.length} perguntas
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">~{catalog.estimatedMinutes} min</span>
              <span aria-hidden="true">·</span>
              <span>Escala 0 a 3 por pergunta</span>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Pergunta-guia
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {catalog.framingQuestion}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-7 flex justify-end">
          <button
            type="button"
            onClick={onStart}
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              rounded-lg text-sm font-semibold
              bg-violet-600 text-white
              hover:bg-violet-500 active:bg-violet-700
              shadow-[0_8px_20px_-10px_rgba(124,58,237,0.7)]
              transition-colors
            "
          >
            Começar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Question (one at a time)
// ─────────────────────────────────────────────────────────────────────────────

function QuestionPanel({
  catalog,
  questionIndex,
  totalQuestions,
  currentAnswer,
  onSelect,
  onNext,
  onBack,
  isLastQuestion,
}: {
  catalog: AssessmentCatalog
  questionIndex: number
  totalQuestions: number
  currentAnswer: number | undefined
  onSelect: (v: number) => void
  onNext: () => void
  onBack: () => void
  isLastQuestion: boolean
}) {
  const question = catalog.questions[questionIndex]
  const pct = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <section className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2 text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          <span>
            Pergunta {questionIndex + 1} de {totalQuestions}
          </span>
          <span>{catalog.name}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-violet-600 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="
          rounded-2xl overflow-hidden
          bg-white/90 dark:bg-slate-900/80
          border border-slate-200/80 dark:border-slate-800
          shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
          p-6 sm:p-8
        "
      >
        <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400 mb-3">
          {catalog.framingQuestion}
        </p>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 leading-snug">
          {question.text}
        </h2>

        <div className="mt-6 space-y-2">
          {catalog.options.map((opt) => {
            const isSelected = currentAnswer === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelect(opt.value)}
                aria-pressed={isSelected}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  rounded-xl border text-left text-sm
                  transition-colors
                  ${
                    isSelected
                      ? 'border-violet-500 bg-violet-50 text-violet-900 dark:border-violet-400 dark:bg-violet-500/15 dark:text-violet-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800/60'
                  }
                `}
              >
                <span
                  aria-hidden="true"
                  className={`
                    grid place-items-center w-7 h-7 rounded-full shrink-0
                    text-xs font-semibold font-mono tabular-nums
                    ${
                      isSelected
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }
                  `}
                >
                  {opt.value}
                </span>
                <span className="flex-1">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-violet-600 dark:text-violet-300" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex items-center gap-1.5 px-3 py-2
            rounded-lg text-sm font-medium
            text-slate-600 dark:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition-colors
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={currentAnswer === undefined}
          className={`
            inline-flex items-center gap-1.5 px-4 py-2
            rounded-lg text-sm font-semibold transition-colors
            ${
              currentAnswer === undefined
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                : 'bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 shadow-[0_8px_20px_-10px_rgba(124,58,237,0.7)]'
            }
          `}
        >
          {isLastQuestion ? 'Ver resultado' : 'Próxima'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Result
// ─────────────────────────────────────────────────────────────────────────────

function ResultPanel({
  catalog,
  score,
  interpretation,
  previousScore,
  safetyTriggered,
  requestedBy,
  share,
  onShareChange,
  onFinalize,
  onReview,
}: {
  catalog: AssessmentCatalog
  score: number
  interpretation: AssessmentInterpretation
  previousScore: number | null
  safetyTriggered: boolean
  requestedBy: string | null
  share: boolean
  onShareChange: (v: boolean) => void
  onFinalize: () => void
  onReview: () => void
}) {
  const maxScore = catalog.questions.length * Math.max(...catalog.options.map((o) => o.value))
  const delta = previousScore !== null ? score - previousScore : null

  return (
    <section className="space-y-5">
      {safetyTriggered && <SafetyBanner />}

      <div
        className="
          rounded-2xl overflow-hidden
          bg-white/90 dark:bg-slate-900/80
          border border-slate-200/80 dark:border-slate-800
          shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
          p-6 sm:p-8
        "
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" aria-hidden="true" />
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
            Resultado · {catalog.name}
          </span>
        </div>

        <div className="flex items-end gap-6 flex-wrap">
          <div>
            <div className={`text-6xl font-semibold tracking-tight tabular-nums ${TONE_SCORE_TEXT[interpretation.tone]}`}>
              {score}
              <span className="text-slate-400 dark:text-slate-500 font-normal text-2xl">
                {' '}
                / {maxScore}
              </span>
            </div>
            {delta !== null && (
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {delta === 0
                  ? 'Mesmo score da aplicação anterior'
                  : `${delta > 0 ? '+' : ''}${delta} vs. aplicação anterior (${previousScore})`}
              </div>
            )}
          </div>

          <span
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-xs font-semibold uppercase tracking-[0.14em]
              ring-1
              ${TONE_BADGE[interpretation.tone]}
            `}
          >
            {interpretation.label}
          </span>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-prose">
          {interpretation.description}
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 px-4 py-3">
          <p className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
            <span>
              Este é um instrumento de triagem, não um diagnóstico. O resultado fica
              no seu prontuário e ajuda{' '}
              {requestedBy ?? 'sua psicóloga'} a acompanhar sua evolução clínica.
            </span>
          </p>
        </div>

        {requestedBy && (
          <button
            type="button"
            onClick={() => onShareChange(!share)}
            aria-pressed={share}
            className="
              mt-4 w-full flex items-center gap-3 px-3 py-2.5
              rounded-xl border
              bg-slate-50 dark:bg-slate-950
              border-slate-200 dark:border-slate-800
              hover:border-violet-300 dark:hover:border-violet-700
              transition-colors
            "
          >
            <div
              className={`
                w-9 h-5 rounded-full relative transition-colors shrink-0
                ${share ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-700'}
              `}
              aria-hidden="true"
            >
              <span
                className={`
                  absolute top-0.5 w-4 h-4 rounded-full bg-white
                  transition-[left] duration-200
                  ${share ? 'left-[18px]' : 'left-0.5'}
                `}
              />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-900 dark:text-slate-100">
                <Share2 className="w-3 h-3 text-violet-500 dark:text-violet-400" />
                Compartilhar resultado com {requestedBy}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Aparece como mensagem no chat do app
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReview}
          className="
            inline-flex items-center gap-1.5 px-3 py-2
            rounded-lg text-sm font-medium
            text-slate-600 dark:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition-colors
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Revisar respostas
        </button>
        <button
          type="button"
          onClick={onFinalize}
          className="
            inline-flex items-center gap-1.5 px-4 py-2
            rounded-lg text-sm font-semibold
            bg-violet-600 text-white
            hover:bg-violet-500 active:bg-violet-700
            shadow-[0_8px_20px_-10px_rgba(124,58,237,0.7)]
            transition-colors
          "
        >
          Finalizar
          <Check className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}

function SafetyBanner() {
  return (
    <div
      role="alert"
      className="
        rounded-2xl border border-rose-300 dark:border-rose-900/60
        bg-rose-50 dark:bg-rose-500/10
        px-5 py-4
      "
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-300 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">
            Você não está sozinho(a)
          </h3>
          <p className="mt-1 text-xs text-rose-800/90 dark:text-rose-200/90 leading-relaxed">
            Você indicou pensamentos de auto-lesão na pergunta 9. Pedimos que entre em
            contato agora com alguém que possa te apoiar.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="tel:188"
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5
                rounded-lg text-xs font-semibold
                bg-rose-600 text-white hover:bg-rose-500
                transition-colors
              "
            >
              <Phone className="w-3.5 h-3.5" />
              CVV · 188
            </a>
            <a
              href="https://www.cvv.org.br/chat"
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5
                rounded-lg text-xs font-semibold
                bg-white text-rose-700 border border-rose-300
                hover:bg-rose-50
                dark:bg-rose-500/15 dark:text-rose-100 dark:border-rose-500/30 dark:hover:bg-rose-500/25
                transition-colors
              "
            >
              Chat CVV (24h)
            </a>
            <span className="
              inline-flex items-center gap-1.5 px-3 py-1.5
              rounded-lg text-xs font-medium
              text-rose-800 dark:text-rose-200
            ">
              Sua psicóloga será notificada automaticamente
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
