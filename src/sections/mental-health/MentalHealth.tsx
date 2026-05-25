import data from '@/../product/sections/mental-health/data.json'
import type {
  AssessmentSubmission,
  AssessmentType,
  CheckInSubmission,
  MentalHealthProps,
} from '@/../product/sections/mental-health/types'
import { MentalHealth as MentalHealthView } from './components/MentalHealth'

export default function MentalHealthPreview() {
  const props = data as unknown as MentalHealthProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mental-health],
        [data-nymos-mental-health] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-mental-health] .font-mono,
        [data-nymos-mental-health] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-mental-health>
        <MentalHealthView
          header={props.header}
          todayCheckIn={props.todayCheckIn}
          emotionOptions={props.emotionOptions}
          moodChart={props.moodChart}
          scheduledAssessment={props.scheduledAssessment}
          lastAssessmentScores={props.lastAssessmentScores}
          monthlyTrend={props.monthlyTrend}
          historyEntries={props.historyEntries}
          linkedPsychologistName={props.linkedPsychologistName}
          questionnaires={props.questionnaires}
          onSubmitCheckIn={(payload: CheckInSubmission) =>
            console.log('[MentalHealth] submit check-in:', payload)
          }
          onEditCheckIn={() => console.log('[MentalHealth] edit check-in')}
          onOpenAssessment={(t: AssessmentType) =>
            console.log('[MentalHealth] open assessment:', t)
          }
          onDismissAssessment={(t: AssessmentType) =>
            console.log('[MentalHealth] dismiss assessment:', t)
          }
          onViewMoodHistory={() =>
            console.log('[MentalHealth] view mood history')
          }
          onViewAssessmentHistory={(t: AssessmentType) =>
            console.log('[MentalHealth] view assessment history:', t)
          }
          onOpenHistoryEntry={(id) =>
            console.log('[MentalHealth] open history entry:', id)
          }
          onSubmitAssessment={(payload: AssessmentSubmission) =>
            console.log('[MentalHealth] submit assessment:', payload)
          }
        />
      </div>
    </>
  )
}
