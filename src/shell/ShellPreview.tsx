import { useState } from 'react'
import {
  Activity,
  Apple,
  Bell,
  Brain,
  Dumbbell,
  FlaskConical,
  LayoutDashboard,
  Scale,
  Settings,
  Target,
} from 'lucide-react'
import { AppShell, type NavigationItem } from './components'

const primarySections: Omit<NavigationItem, 'isActive'>[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Mental Health', href: '/mental-health', icon: Brain },
  { label: 'Metrics', href: '/metrics', icon: Activity },
  { label: 'Exams', href: '/exams', icon: FlaskConical },
  { label: 'Activities', href: '/activities', icon: Dumbbell },
  { label: 'Body Evolution', href: '/body-evolution', icon: Scale },
  { label: 'Nutrition', href: '/nutrition', icon: Apple },
  { label: 'Goals', href: '/goals', icon: Target },
]

const secondaryBase: Omit<NavigationItem, 'isActive'>[] = [
  { label: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function ShellPreview() {
  const [activeHref, setActiveHref] = useState('/dashboard')

  const navigationItems = primarySections.map((item) => ({
    ...item,
    isActive: item.href === activeHref,
  }))

  const secondaryItems = secondaryBase.map((item) => ({
    ...item,
    isActive: item.href === activeHref,
  }))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        [data-nymos-shell] { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
        [data-nymos-shell] .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>
      <div data-nymos-shell className="h-screen">
        <AppShell
          productName="Nymos"
          navigationItems={navigationItems}
          secondaryItems={secondaryItems}
          user={{ name: 'Alex Morgan', email: 'alex@nymos.health' }}
          onNavigate={(href) => setActiveHref(href)}
          onLogout={() => console.log('Logout')}
        >
          <div className="p-6 md:p-10 max-w-5xl">
            <div className="mb-8">
              <div className="text-[11px] uppercase tracking-[0.14em] text-teal-600 dark:text-teal-400 font-semibold mb-2">
                Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Good morning, Alex
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Here's your health snapshot for today.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <StatCard label="Mood today" value="7.2" unit="/ 10" accent="violet" />
              <StatCard label="Resting HR" value="62" unit="bpm" accent="teal" />
              <StatCard label="Sleep" value="7h 48m" accent="teal" />
              <StatCard label="Steps" value="8,214" accent="teal" />
              <StatCard label="LDL · Mar 12" value="118" unit="mg/dL" accent="teal" />
              <StatCard label="GAD-7" value="6" unit="mild" accent="violet" />
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Content area
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Section screens will render here inside the shell.
              </p>
            </div>
          </div>
        </AppShell>
      </div>
    </>
  )
}

function StatCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string
  value: string
  unit?: string
  accent: 'teal' | 'violet'
}) {
  const accentClass =
    accent === 'teal'
      ? 'text-teal-600 dark:text-teal-400'
      : 'text-violet-600 dark:text-violet-400'
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-semibold">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <div className={`text-2xl font-semibold font-mono ${accentClass}`}>{value}</div>
        {unit && (
          <div className="text-sm text-slate-500 dark:text-slate-400">{unit}</div>
        )}
      </div>
    </div>
  )
}
