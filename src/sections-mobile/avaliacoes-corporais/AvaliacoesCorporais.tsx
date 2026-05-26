import data from '@/../product-mobile/sections/avaliacoes-corporais/data.json'
import type { AvaliacoesCorporaisData } from '@/../product-mobile/sections/avaliacoes-corporais/types'
import { AvaliacoesCorporais as AvaliacoesCorporaisComponent } from './components/AvaliacoesCorporais'

export default function AvaliacoesCorporaisPreview() {
  const baseData = data as unknown as AvaliacoesCorporaisData

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
        <AvaliacoesCorporaisComponent
          data={baseData}
          onAbrirBioimpedancia={(id) => console.log('Abrir bioimpedância:', id)}
          onAbrirSessaoFotos={(id) => console.log('Abrir sessão fotos:', id)}
          onNovaAvaliacao={(tab) => console.log('Nova avaliação:', tab)}
          onRefresh={() => console.log('Refresh')}
        />
      </div>
    </>
  )
}
