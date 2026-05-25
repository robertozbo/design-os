import data from '@/../product-mobile/sections/exames/data.json'
import type { ExamesData } from '@/../product-mobile/sections/exames/types'
import { Exames as ExamesComponent } from './components/Exames'

export default function ExamesPreview() {
  const baseData = data as unknown as ExamesData

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
        <ExamesComponent
          data={baseData}
          onAbrirExame={(id) => console.log('Abrir exame:', id)}
          onNovoExame={() => console.log('Novo exame')}
          onAbrirHistorico={() => console.log('Abrir histórico')}
          onRefresh={() => console.log('Refresh')}
        />
      </div>
    </>
  )
}
