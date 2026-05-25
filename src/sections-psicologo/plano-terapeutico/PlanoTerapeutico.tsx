import data from '@/../product-psicologo/sections/plano-terapeutico/data.json'
import type { PlanoData } from '@/../product-psicologo/sections/plano-terapeutico/types'
import { PlanoTerapeutico as PlanoComponent } from './components/PlanoTerapeutico'

export default function PlanoTerapeuticoPreview() {
  const d = data as unknown as PlanoData
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
        <PlanoComponent
          data={d}
          onPacienteClick={() => console.log('Ver paciente:', d.paciente.id)}
          onNovaVersao={() => console.log('Nova versão')}
          onEditarPlano={() => console.log('Editar plano')}
          onObjetivoClick={(id) => console.log('Ver objetivo:', id)}
          onTecnicaClick={(id) => console.log('Ver técnica:', id)}
          onVersaoClick={(v) => console.log('Ver versão:', v)}
        />
      </div>
    </>
  )
}
