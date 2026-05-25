import type { DashboardProps } from '@/../product/sections/dashboard/types'
import { DashboardHeader } from './DashboardHeader'
import { QuickActions } from './QuickActions'
import { MoodSnapshotCard } from './MoodSnapshotCard'
import { VitalMetricsCard } from './VitalMetricsCard'
import { BiomarkersCard } from './BiomarkersCard'
import { GoalsCard } from './GoalsCard'
import { ActivityStreakCard } from './ActivityStreakCard'

export function Dashboard({
  user,
  header,
  timeframe,
  quickActions,
  mood,
  heroStats,
  biomarkers,
  goals,
  activityStreak,
  onTimeframeChange,
  onQuickAction,
  onMoodCheckIn,
  onNavigateMood,
  onNavigateVitalMetrics,
  onNavigateBiomarkers,
  onNavigateGoals,
  onNavigateActivities,
}: DashboardProps) {
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
        <DashboardHeader
          user={user}
          header={header}
          timeframe={timeframe}
          onTimeframeChange={onTimeframeChange}
        />

        <div className="mt-7">
          <QuickActions
            actions={quickActions}
            revealIndex={1}
            onAction={onQuickAction}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <MoodSnapshotCard
              mood={mood}
              revealIndex={5}
              onCheckIn={onMoodCheckIn}
              onNavigate={onNavigateMood}
            />
          </div>
          <div className="md:col-span-1">
            <VitalMetricsCard
              stats={heroStats}
              revealIndex={6}
              onNavigate={onNavigateVitalMetrics}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BiomarkersCard
            biomarkers={biomarkers}
            revealIndex={7}
            onNavigate={onNavigateBiomarkers}
          />
          <GoalsCard goals={goals} revealIndex={8} onNavigate={onNavigateGoals} />
          <ActivityStreakCard
            streak={activityStreak}
            revealIndex={9}
            onNavigate={onNavigateActivities}
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
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
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
