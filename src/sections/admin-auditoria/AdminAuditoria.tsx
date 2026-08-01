import data from '@/../product/sections/admin-auditoria/data.json'
import type { AdminAuditoriaProps } from '@/../product/sections/admin-auditoria/types'
import { AdminAuditoria as View } from './components/AdminAuditoria'

export default function AdminAuditoriaPreview() {
  const props = data as unknown as AdminAuditoriaProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-auditoria], [data-nymos-admin-auditoria] * { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
        [data-nymos-admin-auditoria] .font-mono, [data-nymos-admin-auditoria] .tabular-nums { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>
      <View {...props} onTypeFilter={(t) => console.log('type →', t)} onSeverityFilter={(s) => console.log('sev →', s)} onEventClick={(id) => console.log('event →', id)} onExport={() => console.log('export')} />
    </>
  )
}
