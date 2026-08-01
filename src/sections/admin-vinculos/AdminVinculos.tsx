import data from '@/../product/sections/admin-vinculos/data.json'
import type { AdminVinculosProps } from '@/../product/sections/admin-vinculos/types'
import { AdminVinculos as View } from './components/AdminVinculos'

export default function AdminVinculosPreview() {
  const props = data as unknown as AdminVinculosProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-vinculos], [data-nymos-admin-vinculos] * { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
        [data-nymos-admin-vinculos] .font-mono, [data-nymos-admin-vinculos] .tabular-nums { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>
      <View {...props} onSearch={(q) => console.log('search →', q)} onVinculoClick={(id) => console.log('vinculo →', id)} onForceUnlink={(id) => console.log('force unlink →', id)} onAlertAction={(id) => console.log('alert →', id)} />
    </>
  )
}
