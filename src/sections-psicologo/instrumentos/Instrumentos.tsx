import data from '@/../product-psicologo/sections/instrumentos/data.json'
import type { InstrumentosData } from '@/../product-psicologo/sections/instrumentos/types'
import { Instrumentos as InstrumentosComponent } from './components/Instrumentos'

export default function InstrumentosPreview() {
  const d = data as unknown as InstrumentosData
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        body, [data-nymos-psicologo],
        [data-nymos-psicologo] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-psicologo] .font-mono,
        [data-nymos-psicologo] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-psicologo="true">
        <InstrumentosComponent
          data={d}
          onInstrumentoClick={(id) => console.log('Ver instrumento:', id)}
          onAplicar={(id) => console.log('Aplicar:', id)}
          onAplicacaoClick={(id) => console.log('Ver aplicação:', id)}
          onFavoritoToggle={(id) => console.log('Toggle favorito:', id)}
          onPacienteClick={(id) => console.log('Ver paciente:', id)}
        />
      </div>
    </>
  )
}
