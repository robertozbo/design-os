import data from '@/../product-mobile/sections/nutricao/data.json'
import type { NutricaoData } from '@/../product-mobile/sections/nutricao/types'
import { Nutricao as NutricaoComponent } from './components/Nutricao'

export default function NutricaoPreview() {
  const baseData = data as unknown as NutricaoData

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
        <NutricaoComponent
          data={baseData}
          onPrevDia={() => console.log('Prev day')}
          onProxDia={() => console.log('Next day')}
          onAlimentoClick={(m) => console.log('Open meal:', m.id)}
          onAdicionarAlimento={(r) => console.log('Add to:', r.type.name)}
          onMarcarPlanejada={(r) => console.log('Mark planned:', r.type.name)}
          onPlanoClick={() => console.log('Open plan')}
        />
      </div>
    </>
  )
}
