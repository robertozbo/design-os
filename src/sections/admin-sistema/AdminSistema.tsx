import data from '@/../product/sections/admin-sistema/data.json'
import type { AdminSistemaProps } from '@/../product/sections/admin-sistema/types'
import { AdminSistema as View } from './components/AdminSistema'

export default function AdminSistemaPreview() {
  const props = data as unknown as AdminSistemaProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-sistema], [data-nymos-admin-sistema] * { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
        [data-nymos-admin-sistema] .font-mono, [data-nymos-admin-sistema] .tabular-nums { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>
      <View {...props} onToggleFlag={(id) => console.log('flag →', id)} onChangeProvider={(id) => console.log('provider →', id)} onActivateMaintenance={() => console.log('maintenance')} />
    </>
  )
}
