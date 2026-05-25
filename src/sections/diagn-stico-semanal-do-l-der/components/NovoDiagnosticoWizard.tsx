import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import type {
  DiagnosisDraft,
  NovoDiagnosticoWizardProps,
} from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { WizardStepper } from './WizardStepper'
import { WizardStepSignals } from './WizardStepSignals'
import { WizardStepObservation } from './WizardStepObservation'
import { WizardStepAction } from './WizardStepAction'
import { WizardFooter } from './WizardFooter'

const STEPS = [
  {
    id: 'signals',
    title: 'Revisar sinais',
    subtitle: 'Confira os 4 sinais semanais e adicione notas opcionais.',
  },
  {
    id: 'observation',
    title: 'Observação do time',
    subtitle: 'Descreva o que observou nesta semana.',
  },
  {
    id: 'action',
    title: 'Ação e prazo',
    subtitle: 'Defina uma ação concreta com prazo.',
  },
]

const MIN_OBSERVATION = 40

function emptyDraft(leaderName: string): DiagnosisDraft {
  return {
    signalNotes: {},
    observation: '',
    action: { description: '', deadline: '', owner: leaderName },
  }
}

export function NovoDiagnosticoWizard({
  team,
  currentWeek,
  weeklySignals,
  initialDraft,
  onSubmit,
  onCancel,
}: NovoDiagnosticoWizardProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [draft, setDraft] = useState<DiagnosisDraft>(
    () => initialDraft ?? emptyDraft(team.leaderName)
  )

  const canAdvance = useMemo(() => {
    if (activeIndex === 0) return true
    if (activeIndex === 1) return draft.observation.trim().length >= MIN_OBSERVATION
    if (activeIndex === 2) {
      return (
        draft.action.description.trim().length > 0 &&
        draft.action.deadline.trim().length > 0 &&
        draft.action.owner.trim().length > 0
      )
    }
    return false
  }, [activeIndex, draft])

  function next() {
    if (activeIndex < STEPS.length - 1) setActiveIndex(activeIndex + 1)
  }

  function back() {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1)
  }

  function jumpTo(index: number) {
    if (index < activeIndex) setActiveIndex(index)
  }

  function setSignalNote(signalId: string, note: string) {
    setDraft((prev) => ({
      ...prev,
      signalNotes: { ...prev.signalNotes, [signalId]: note },
    }))
  }

  function setObservation(value: string) {
    setDraft((prev) => ({ ...prev, observation: value }))
  }

  function patchAction(patch: Partial<DiagnosisDraft['action']>) {
    setDraft((prev) => ({ ...prev, action: { ...prev.action, ...patch } }))
  }

  function submit() {
    if (!canAdvance) return
    onSubmit?.(draft)
  }

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <WizardStyles />

      <BackgroundGlow />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 pt-8 pb-32">
        <header
          style={{ animationDelay: '60ms' }}
          className="nymos-reveal opacity-0 flex items-start justify-between gap-4 mb-6"
        >
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200/70 dark:border-teal-900/60 text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              NR-1 · Novo diagnóstico
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              Diagnóstico de{' '}
              <span className="text-teal-700 dark:text-teal-300">{currentWeek.weekLabel.toLowerCase()}</span>
            </h1>
            <div className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              {team.sectorName} · {team.employerName}
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="
              flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl
              text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
            aria-label="Cancelar diagnóstico"
            title="Cancelar"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </header>

        <WizardStepper steps={STEPS} activeIndex={activeIndex} onJumpTo={jumpTo} />

        <div
          key={activeIndex}
          style={{ animationDelay: '180ms' }}
          className="nymos-reveal opacity-0 mt-8"
        >
          {activeIndex === 0 && (
            <WizardStepSignals
              signals={weeklySignals}
              signalNotes={draft.signalNotes}
              onChangeNote={setSignalNote}
            />
          )}
          {activeIndex === 1 && (
            <WizardStepObservation observation={draft.observation} onChange={setObservation} />
          )}
          {activeIndex === 2 && (
            <WizardStepAction
              draft={draft}
              team={team}
              currentWeek={currentWeek}
              signals={weeklySignals}
              onChangeAction={patchAction}
            />
          )}
        </div>
      </div>

      <WizardFooter
        activeIndex={activeIndex}
        totalSteps={STEPS.length}
        canAdvance={canAdvance}
        isFinalStep={activeIndex === STEPS.length - 1}
        onBack={back}
        onNext={next}
        onSubmit={submit}
      />
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
      <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-teal-200/40 dark:bg-teal-900/20 blur-3xl" />
      <div className="absolute -top-16 left-[18%] w-[420px] h-[420px] rounded-full bg-violet-200/30 dark:bg-violet-950/30 blur-3xl" />
    </div>
  )
}

function WizardStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
