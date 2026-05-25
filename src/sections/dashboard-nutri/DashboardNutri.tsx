import data from '@/../product/sections/dashboard-nutri/data.json'
import type { DashboardNutriProps } from '@/../product/sections/dashboard-nutri/types'
import { DashboardNutri as DashboardNutriView } from './components/DashboardNutri'

export default function DashboardNutriPreview() {
  const props = data as unknown as DashboardNutriProps

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-dashboard-nutri],
        [data-nymos-dashboard-nutri] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-dashboard-nutri] .font-mono,
        [data-nymos-dashboard-nutri] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <DashboardNutriView
        nutri={props.nutri}
        header={props.header}
        kpis={props.kpis}
        todayAgenda={props.todayAgenda}
        patientsWidget={props.patientsWidget}
        operationalAlerts={props.operationalAlerts}
        quickActions={props.quickActions}
        upsellCard={props.upsellCard}
        aiInsights={props.aiInsights}
        emptyStates={props.emptyStates}
        onTimeframeChange={(t) => console.log('timeframe →', t)}
        onPatientsTabChange={(t) => console.log('patients tab →', t)}
        onPatientClick={(id) => console.log('patient click →', id)}
        onAppointmentClick={(id) => console.log('appointment click →', id)}
        onAlertAction={(id) => console.log('alert action →', id)}
        onQuickAction={(id) => console.log('quick action →', id)}
        onUpsellClick={(plan) => console.log('upsell to', plan)}
        onAiInsightClick={(id) => console.log('ai insight →', id)}
      />
    </>
  )
}
