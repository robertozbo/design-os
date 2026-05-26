import data from '@/../product-mobile/sections/desafios/data.json'
import type { DesafiosData } from '@/../product-mobile/sections/desafios/types'
import { Desafios as DesafiosComponent } from './components/Desafios'

export default function DesafiosPreview() {
  const baseData = data as unknown as DesafiosData

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
      `}</style>
      <div data-nymos-mobile="true">
        <DesafiosComponent
          data={baseData}
          onAbrirDesafio={(id) => console.log('Abrir desafio:', id)}
          onExplorarDesafios={() => console.log('Explorar desafios')}
          onAbrirRanking={() => console.log('Abrir ranking')}
          onRefresh={() => console.log('Refresh')}
        />
      </div>
    </>
  )
}
