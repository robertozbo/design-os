import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-mobile/sections/metricas/data.json'
import type {
  MetricasData,
  MetricaViewModel,
  Periodo,
} from '@/../product-mobile/sections/metricas/types'
import { Metricas as MetricasComponent } from './components/Metricas'

export default function MetricasPreview() {
  const baseData = data as unknown as MetricasData
  const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo>('30d')
  const navigate = useNavigate()

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
          onMetricaClick={(m: MetricaViewModel) =>
            navigate(`/mobile/sections/metricas-detalhe?m=${m.id}`)
          }
          onAdicionarClick={() => navigate('/mobile/sections/metricas-adicionar')}
          onConectarDispositivoClick={() => console.log('Connect device')}
        />
      </div>
    </>
  )
}
