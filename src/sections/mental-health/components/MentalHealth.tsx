import { useState } from 'react'
import type {
  AssessmentType,
  MentalHealthProps,
} from '@/../product/sections/mental-health/types'
import { AssessmentRunner } from './AssessmentRunner'
import { HistoryListCard } from './HistoryListCard'
import { LastScoresCard } from './LastScoresCard'
import { MentalHealthHeader } from './MentalHealthHeader'
import { MonthlyTrendCard } from './MonthlyTrendCard'
import { MoodTrendCard } from './MoodTrendCard'
import { ScheduledAssessmentCard } from './ScheduledAssessmentCard'
import { TodayCheckInCard } from './TodayCheckInCard'

export function MentalHealth({
  header,
  todayCheckIn,
  emotionOptions,
  moodChart,
  scheduledAssessment,
  lastAssessmentScores,
  monthlyTrend,
  historyEntries,
  linkedPsychologistName,
  questionnaires,
  onSubmitCheckIn,
  onEditCheckIn,
  onOpenAssessment,
  onDismissAssessment,
  onViewMoodHistory,
  onViewAssessmentHistory,
  onOpenHistoryEntry,
  onSubmitAssessment,
}: MentalHealthProps) {
  const [activeAssessment, setActiveAssessment] = useState<AssessmentType | null>(
    null,
  )

  const handleOpenAssessment = (type: AssessmentType) => {
    onOpenAssessment?.(type)
    setActiveAssessment(type)
  }

  if (activeAssessment !== null) {
    const catalog = questionnaires[activeAssessment]
    const previousScore =
      activeAssessment === 'phq9'
        ? lastAssessmentScores.phq9?.scoreValue ?? null
        : lastAssessmentScores.gad7?.scoreValue ?? null
    return (
      <AssessmentRunner
        catalog={catalog}
        requestedBy={linkedPsychologistName}
        previousScore={previousScore}
        onSubmit={(payload) => {
          onSubmitAssessment?.(payload)
          setActiveAssessment(null)
        }}
        onExit={() => setActiveAssessment(null)}
      />
    )
  }

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <MentalHealthHeader header={header} />

        <div className="mt-8">
          <TodayCheckInCard
            todayCheckIn={todayCheckIn}
            emotionOptions={emotionOptions}
            linkedPsychologistName={linkedPsychologistName}
            onSubmitCheckIn={onSubmitCheckIn}
            onEditCheckIn={onEditCheckIn}
            revealIndex={1}
          />
        </div>

        {linkedPsychologistName && scheduledAssessment && (
          <div className="mt-4">
            <ScheduledAssessmentCard
              assessment={scheduledAssessment}
              onOpen={handleOpenAssessment}
              onDismiss={onDismissAssessment}
              revealIndex={2}
            />
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MoodTrendCard
              chart={moodChart}
              onNavigate={onViewMoodHistory}
              revealIndex={3}
            />
          </div>
          <MonthlyTrendCard trend={monthlyTrend} revealIndex={4} />
        </div>

        {linkedPsychologistName && (
          <div className="mt-4">
            <LastScoresCard
              scores={lastAssessmentScores}
              onViewHistory={onViewAssessmentHistory}
              revealIndex={5}
            />
          </div>
        )}

        <div className="mt-4">
          <HistoryListCard
            entries={historyEntries}
            onOpenEntry={onOpenHistoryEntry}
            onViewAll={onViewMoodHistory}
            revealIndex={6}
          />
        </div>
      </div>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from {
          opacity: 0;
          transform: translateY(14px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
