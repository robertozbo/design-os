import data from '@/../product/sections/admin-profissionais/data.json'
import type { AdminProfissionaisProps } from '@/../product/sections/admin-profissionais/types'
import { AdminProfissionais as View } from './components/AdminProfissionais'

export default function AdminProfissionaisPreview() {
  const props = data as unknown as AdminProfissionaisProps
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-admin-profissionais],
        [data-nymos-admin-profissionais] * { font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; }
        [data-nymos-admin-profissionais] .font-mono,
        [data-nymos-admin-profissionais] .tabular-nums { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>
      <View
        {...props}
        onTabChange={(t) => console.log('tab →', t)}
        onProClick={(id) => console.log('pro click →', id)}
        onProAction={(id, a) => console.log('pro action →', id, a)}
      />
    </>
  )
}
