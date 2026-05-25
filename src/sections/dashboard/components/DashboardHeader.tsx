import type {
  DashboardHeaderInfo,
  DashboardTimeframe,
  DashboardUser,
  GreetingPeriod,
  TimeframeId,
} from '@/../product/sections/dashboard/types'

export interface DashboardHeaderProps {
  user: DashboardUser
  header: DashboardHeaderInfo
  timeframe: DashboardTimeframe
  onTimeframeChange?: (id: TimeframeId) => void
}

const GREETING: Record<GreetingPeriod, string> = {
  morning: 'Bom dia',
  afternoon: 'Boa tarde',
  evening: 'Boa noite',
}

function formatDate(iso: string): string {
  try {
    const formatted = new Date(iso).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  } catch {
    return iso
  }
}

export function DashboardHeader({
  user,
  header,
  timeframe,
  onTimeframeChange,
}: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="
          absolute -z-0 -top-32 -right-24 w-[420px] h-[420px] rounded-full
          bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.22)_0%,rgba(45,212,191,0)_60%)]
          dark:bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18)_0%,rgba(20,184,166,0)_60%)]
          blur-2xl
        "
      />
      <div
        aria-hidden="true"
        className="
          absolute -z-0 -top-10 -left-24 w-[360px] h-[360px] rounded-full
          bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.18)_0%,rgba(167,139,250,0)_60%)]
          dark:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.16)_0%,rgba(139,92,246,0)_60%)]
          blur-2xl
        "
      />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="nymos-reveal opacity-0" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-teal-600 dark:text-teal-400 mb-2">
            <span className="w-6 h-px bg-teal-500/60" />
            Dashboard
          </div>
          <h1 className="text-3xl md:text-[40px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.05]">
            {GREETING[header.greetingPeriod]}, {user.firstName}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {formatDate(header.currentDate)} · seu snapshot de saúde
          </p>
        </div>

        <div
          className="
            nymos-reveal opacity-0 self-start md:self-auto
            inline-flex items-center gap-0.5 p-1
            rounded-full
            bg-slate-100/80 dark:bg-slate-800/60
            border border-slate-200 dark:border-slate-700/60
            backdrop-blur-sm
          "
          style={{ animationDelay: '120ms' }}
          role="tablist"
          aria-label="Período"
        >
          {timeframe.options.map((opt) => {
            const active = opt.id === timeframe.active
            return (
              <button
                key={opt.id}
                role="tab"
                aria-selected={active}
                onClick={() => onTimeframeChange?.(opt.id)}
                className={`
                  relative px-3.5 py-1.5 rounded-full text-xs font-medium
                  transition-colors
                  ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }
                `}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
