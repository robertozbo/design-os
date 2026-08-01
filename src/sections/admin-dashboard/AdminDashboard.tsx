import data from '@/../product/sections/admin-dashboard/data.json'
import type { AdminDashboardProps } from '@/../product/sections/admin-dashboard/types'
import { AdminDashboard as AdminDashboardView } from './components/AdminDashboard'

const HREF_TO_SECTION: Record<string, { id: string; screen: string }> = {
  '/admin/dashboard': { id: 'admin-dashboard', screen: 'AdminDashboard' },
  '/admin/usuarios': { id: 'admin-usuarios', screen: 'AdminUsuarios' },
  '/admin/pagamentos': { id: 'admin-pagamentos', screen: 'AdminPagamentos' },
  '/admin/custos-ia': { id: 'admin-custos-ia', screen: 'AdminCustosIa' },
  '/admin/profissionais': { id: 'admin-profissionais', screen: 'AdminProfissionais' },
  '/admin/vinculos': { id: 'admin-vinculos', screen: 'AdminVinculos' },
  '/admin/permissoes': { id: 'admin-permissoes', screen: 'AdminPermissoes' },
  '/admin/sistema': { id: 'admin-sistema', screen: 'AdminSistema' },
  '/admin/auditoria': { id: 'admin-auditoria', screen: 'AdminAuditoria' },
}

function navigateTo(href: string) {
  // Match against the longest known prefix so query strings still resolve.
  const base = Object.keys(HREF_TO_SECTION).find((prefix) => href.startsWith(prefix))
  const route = base ? HREF_TO_SECTION[base] : null
  if (!route) {
    console.log('[admin-dashboard] no route mapped for', href)
    return
  }
  const designUrl = `/sections/${route.id}/screen-designs/${route.screen}`
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = designUrl
      return
    }
  } catch {
    // Cross-origin guard (shouldn't happen in dev)
  }
  window.location.href = `${designUrl}/fullscreen`
}

export default function AdminDashboardPreview() {
  const props = data as unknown as AdminDashboardProps

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-dashboard],
        [data-nymos-admin-dashboard] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-admin-dashboard] .font-mono,
        [data-nymos-admin-dashboard] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <AdminDashboardView
        header={props.header}
        systemStatus={props.systemStatus}
        kpis={props.kpis}
        actionQueue={props.actionQueue}
        panels={props.panels}
        recentActivity={props.recentActivity}
        mrrSeries={props.mrrSeries}
        upcomingEvents={props.upcomingEvents}
        onTimeframeChange={(t) => console.log('timeframe →', t)}
        onActionQueueSelect={(item) => navigateTo(item.href)}
        onPanelSelect={(panel) => navigateTo(panel.href)}
        onViewAllActivity={() => navigateTo('/admin/auditoria')}
        onActivitySelect={(event) => {
          console.log('activity →', event.id)
          navigateTo('/admin/auditoria')
        }}
        onUpcomingEventSelect={(event) => navigateTo(event.href)}
        onSystemStatusSelect={(status) => navigateTo(status.incidentHref)}
      />
    </>
  )
}
