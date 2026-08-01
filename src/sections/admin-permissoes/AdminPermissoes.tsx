import data from '@/../product/sections/admin-permissoes/data.json'
import type { AdminPermissoesProps } from '@/../product/sections/admin-permissoes/types'
import { AdminPermissoes as View } from './components/AdminPermissoes'

export default function AdminPermissoesPreview() {
  const props = data as unknown as AdminPermissoesProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-permissoes],
        [data-nymos-admin-permissoes] * { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
        [data-nymos-admin-permissoes] .font-mono,
        [data-nymos-admin-permissoes] .tabular-nums { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>
      <View {...props} onSimulateRole={(r) => console.log('simulate →', r)} onToggleCell={(r, p) => console.log('toggle →', r, p)} onSaveChanges={() => console.log('save')} onDiscardChanges={() => console.log('discard')} />
    </>
  )
}
