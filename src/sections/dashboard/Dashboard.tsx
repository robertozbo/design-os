import data from '@/../product/sections/dashboard/data.json'
import type { DashboardProps } from '@/../product/sections/dashboard/types'
import { Dashboard as DashboardView } from './components/Dashboard'

export default function DashboardPreview() {
  const props = data as unknown as DashboardProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-dashboard],
        [data-nymos-dashboard] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-dashboard] .font-mono,
        [data-nymos-dashboard] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-dashboard>
        <DashboardView
          user={props.user}
          header={props.header}
          timeframe={props.timeframe}
          quickActions={props.quickActions}
          mood={props.mood}
          heroStats={props.heroStats}
          biomarkers={props.biomarkers}
          goals={props.goals}
          activityStreak={props.activityStreak}
          onTimeframeChange={(t) => console.log('[Dashboard] timeframe:', t)}
          onQuickAction={(a) => console.log('[Dashboard] quick action:', a.id)}
          onMoodCheckIn={() => console.log('[Dashboard] mood check-in')}
          onNavigateMood={() => console.log('[Dashboard] → /mental-health')}
          onNavigateVitalMetrics={() => console.log('[Dashboard] → /metrics')}
          onNavigateBiomarkers={() => console.log('[Dashboard] → /exams')}
          onNavigateGoals={() => console.log('[Dashboard] → /goals')}
          onNavigateActivities={() => console.log('[Dashboard] → /activities')}
        />
      </div>
    </>
  )
}
