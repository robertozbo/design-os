import data from '@/../product-mobile/sections/mais/data.json'
import type { MaisData } from '@/../product-mobile/sections/mais/types'
import { Mais as MaisComponent } from './components/Mais'

export default function MaisPreview() {
  const maisData = data as unknown as MaisData

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-mobile="true">
        <MaisComponent
          data={maisData}
          onPerfilClick={() => {
            window.location.href = '/mobile/sections/perfil'
          }}
          onItemClick={(item) => {
            if (item.rota.startsWith('/mobile')) window.location.href = item.rota
            else console.log('Item:', item.id, item.rota)
          }}
          onUpgradeClick={() => console.log('Upgrade')}
          onLogoutClick={() => console.log('Logout')}
        />
      </div>
    </>
  )
}
