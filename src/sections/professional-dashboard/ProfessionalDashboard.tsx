import data from '@/../product/sections/professional-dashboard/data.json'
import type { ProfessionalDashboardProps } from '@/../product/sections/professional-dashboard/types'
import { ProfessionalDashboard as ProfessionalDashboardView } from './components/ProfessionalDashboard'

export default function ProfessionalDashboardPreview() {
  const props = data as unknown as ProfessionalDashboardProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-prof-dashboard],
        [data-nymos-prof-dashboard] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-prof-dashboard] .font-mono,
        [data-nymos-prof-dashboard] .font-mono * {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-prof-dashboard>
        <ProfessionalDashboardView
          professional={props.professional}
          workspace={props.workspace}
          nr1={props.nr1}
          kpis={props.kpis}
          agenda={props.agenda}
          filterChips={props.filterChips}
          activeFilterId={props.activeFilterId}
          totalFilteredCount={props.totalFilteredCount}
          patients={props.patients}
          drawer={props.drawer}
          onFilterChange={(id) =>
            console.log('[ProfDashboard] filter change:', id)
          }
          onSearchChange={(q) =>
            console.log('[ProfDashboard] search:', q)
          }
          onOpenPatient={(id) =>
            console.log('[ProfDashboard] open patient:', id)
          }
          onCloseDrawer={() => console.log('[ProfDashboard] close drawer')}
          onOpenTimeline={(id) =>
            console.log('[ProfDashboard] open timeline:', id)
          }
          onAcknowledgeAlert={(pid, aid) =>
            console.log('[ProfDashboard] ack alert:', pid, aid)
          }
          onSaveClinicalNote={(pid, note) =>
            console.log('[ProfDashboard] save note:', pid, note)
          }
          onAgendaPeriodChange={(p) =>
            console.log('[ProfDashboard] agenda period:', p)
          }
          onOpenAppointment={(id) =>
            console.log('[ProfDashboard] open appointment:', id)
          }
          onStartAppointment={(id) =>
            console.log('[ProfDashboard] start appointment:', id)
          }
          onNewAppointment={() =>
            console.log('[ProfDashboard] new appointment')
          }
          onSeeFullAgenda={() =>
            console.log('[ProfDashboard] see full agenda')
          }
          onOpenNr1Module={() =>
            console.log('[ProfDashboard] open NR-1 module')
          }
        />
      </div>
    </>
  )
}
