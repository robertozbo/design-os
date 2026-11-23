import data from '@/../product-mobile/sections/insights/data.json'
import type { InsightsData } from '@/../product-mobile/sections/insights/types'
import { Insights as InsightsComponent } from './components/Insights'

export default function InsightsPreview() {
  const baseData = data as unknown as InsightsData

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'Geist Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-mobile="true">
        <InsightsComponent
          data={baseData}
          onMarcarLido={(id) => console.log('Marcar lido:', id)}
          onRefresh={() => console.log('Refresh')}
        />
      </div>
    </>
  )
}
