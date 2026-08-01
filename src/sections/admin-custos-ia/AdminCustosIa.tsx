import data from '@/../product/sections/admin-custos-ia/data.json'
import type { AdminCustosIaProps } from '@/../product/sections/admin-custos-ia/types'
import { AdminCustosIa as AdminCustosIaView } from './components/AdminCustosIa'

const SECTION_ROUTES: Record<string, { id: string; screen: string }> = {
  usuarios: { id: 'admin-usuarios', screen: 'AdminUsuarios' },
  profissionais: { id: 'admin-profissionais', screen: 'AdminProfissionais' },
  pagamentos: { id: 'admin-pagamentos', screen: 'AdminPagamentos' },
  vinculos: { id: 'admin-vinculos', screen: 'AdminVinculos' },
  permissoes: { id: 'admin-permissoes', screen: 'AdminPermissoes' },
  sistema: { id: 'admin-sistema', screen: 'AdminSistema' },
  auditoria: { id: 'admin-auditoria', screen: 'AdminAuditoria' },
}

function navigateToSection(key: keyof typeof SECTION_ROUTES) {
  const route = SECTION_ROUTES[key]
  if (!route) return
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

export default function AdminCustosIaPreview() {
  const props = data as unknown as AdminCustosIaProps

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-custos-ia],
        [data-nymos-admin-custos-ia] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-admin-custos-ia] .font-mono,
        [data-nymos-admin-custos-ia] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <AdminCustosIaView
        header={props.header}
        kpis={props.kpis}
        patientsByCost={props.patientsByCost}
        professionalsByCost={props.professionalsByCost}
        featuresCost={props.featuresCost}
        alerts={props.alerts}
        emptyStates={props.emptyStates}
        onTimeframeChange={(t) => console.log('timeframe →', t)}
        onPatientClick={(id) => {
          console.log('patient →', id)
          navigateToSection('usuarios')
        }}
        onProfessionalClick={(id) => {
          console.log('professional →', id)
          navigateToSection('profissionais')
        }}
        onFeatureClick={(id) => console.log('feature →', id)}
        onAlertAction={(id) => console.log('alert action →', id)}
        onSeeAllPatients={() => navigateToSection('usuarios')}
        onSeeAllProfessionals={() => navigateToSection('profissionais')}
      />
    </>
  )
}
