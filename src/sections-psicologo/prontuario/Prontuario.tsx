import data from '@/../product-psicologo/sections/prontuario/data.json'
import type { ProntuarioData } from '@/../product-psicologo/sections/prontuario/types'
import { Prontuario as ProntuarioComponent } from './components/Prontuario'

export default function ProntuarioPreview() {
  const d = data as unknown as ProntuarioData
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
        <ProntuarioComponent
          data={d}
          onExportarPdf={() => console.log('Exportar PDF')}
          onImprimir={() => console.log('Imprimir')}
          onEditarSecao={(s) => console.log('Editar seção:', s)}
        />
      </div>
    </>
  )
}
