import { ArrowRight } from 'lucide-react'
import type { DashboardNutriProps } from '@/../product/sections/dashboard-nutri/types'
import { AppointmentRow } from './AppointmentRow'
import { DashboardHeader } from './DashboardHeader'
import { KpiTile } from './KpiTile'
import { OperationalAlertItem } from './OperationalAlertItem'
import { PatientsWidget } from './PatientsWidget'
import { QuickActionButton } from './QuickActionButton'
import { UpsellCard } from './UpsellCard'

export function DashboardNutri({
  nutri,
  header,
  kpis,
  todayAgenda,
  patientsWidget,
  operationalAlerts,
  quickActions,
  upsellCard,
  emptyStates,
  onTimeframeChange,
  onPatientsTabChange,
  onPatientClick,
  onAppointmentClick,
  onAlertAction,
  onQuickAction,
  onUpsellClick,
}: DashboardNutriProps) {
  const confirmedCount = todayAgenda.filter((a) => a.status === 'confirmada').length

  return (
    <div
      data-nymos-dashboard-nutri
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <div style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <DashboardHeader nutri={nutri} header={header} onTimeframeChange={onTimeframeChange} />
        </div>

        {/* KPI row */}
        <section
          aria-label="Indicadores do período"
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {kpis.map((kpi) => (
            <KpiTile key={kpi.id} kpi={kpi} currentPlan={nutri.plan} />
          ))}
        </section>

        {/* Agenda + Quick Actions */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div
            style={{ animationDelay: '240ms' }}
            className="nymos-reveal opacity-0 min-w-0"
          >
            <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <header className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    Agenda de hoje
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    {todayAgenda.length} consulta{todayAgenda.length === 1 ? '' : 's'} ·{' '}
                    {confirmedCount} confirmada{confirmedCount === 1 ? '' : 's'}
                  </p>
                </div>
                <a
                  href="/professional/agenda"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Ver toda a agenda <ArrowRight size={12} />
                </a>
              </header>

              <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800/60">
                {todayAgenda.length === 0 ? (
                  <div className="px-3 py-12 text-center">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {emptyStates.noAppointments.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {emptyStates.noAppointments.description}
                    </p>
                    {emptyStates.noAppointments.primaryAction && (
                      <a
                        href={emptyStates.noAppointments.primaryAction.href}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                      >
                        {emptyStates.noAppointments.primaryAction.label}
                      </a>
                    )}
                  </div>
                ) : (
                  todayAgenda.map((appointment) => (
                    <AppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                      onClick={() => onAppointmentClick?.(appointment.id)}
                    />
                  ))
                )}
              </div>
            </article>
          </div>

          <aside
            style={{ animationDelay: '320ms' }}
            className="nymos-reveal opacity-0 space-y-3"
          >
            <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Atalhos rápidos
            </h2>
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.id}
                action={action}
                currentPlan={nutri.plan}
                onClick={() => onQuickAction?.(action.id)}
              />
            ))}
          </aside>
        </section>

        {/* Patients widget */}
        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 mt-8"
        >
          <PatientsWidget
            widget={patientsWidget}
            currentPlan={nutri.plan}
            onTabChange={onPatientsTabChange}
            onPatientClick={onPatientClick}
          />
        </div>

        {/* Operational alerts */}
        <section
          style={{ animationDelay: '520ms' }}
          className="nymos-reveal opacity-0 mt-8 space-y-3"
        >
          <header className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Alertas operacionais
            </h2>
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
              {operationalAlerts.length} pendente{operationalAlerts.length === 1 ? '' : 's'}
            </span>
          </header>

          {operationalAlerts.length === 0 ? (
            <article className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {emptyStates.noAlerts.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {emptyStates.noAlerts.description}
              </p>
            </article>
          ) : (
            <div className="space-y-2">
              {operationalAlerts.map((alert) => (
                <OperationalAlertItem
                  key={alert.id}
                  alert={alert}
                  onAction={() => onAlertAction?.(alert.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Upsell card */}
        {upsellCard && (
          <div
            style={{ animationDelay: '620ms' }}
            className="nymos-reveal opacity-0 mt-8"
          >
            <UpsellCard card={upsellCard} onClick={() => onUpsellClick?.(upsellCard.toPlan)} />
          </div>
        )}
      </div>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      [data-nymos-dashboard-nutri] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-dashboard-nutri] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
