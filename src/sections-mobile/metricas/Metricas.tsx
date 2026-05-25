import { useState } from 'react'
import data from '@/../product-mobile/sections/metricas/data.json'
import type { MetricasData, MetricaViewModel, Periodo } from '@/../product-mobile/sections/metricas/types'
import { Metricas as MetricasComponent } from './components/Metricas'

export default function MetricasPreview() {
  const baseData = data as unknown as MetricasData
  const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo>('30d')

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
        <MetricasComponent
          data={baseData}
          selectedPeriodo={selectedPeriodo}
          onPeriodoChange={setSelectedPeriodo}
          onMetricaClick={(m: MetricaViewModel) => console.log('Open metric:', m.tipo.value)}
          onAdicionarClick={() => console.log('Add manual record')}
          onConectarDispositivoClick={() => console.log('Connect device')}
        />
      </div>
    </>
  )
}
