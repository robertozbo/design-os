import data from '@/../product-psicologo/sections/pacientes/data.json'
import type { PacientesData } from '@/../product-psicologo/sections/pacientes/types'
import { Pacientes as PacientesComponent } from './components/Pacientes'

export default function PacientesPreview() {
  const pacData = data as unknown as PacientesData
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
        <PacientesComponent
          data={pacData}
          onPacienteClick={(id) => console.log('Ver paciente:', id)}
          onNovoPaciente={() => console.log('Novo paciente')}
          onIniciarSessao={(id) => console.log('Iniciar sessão:', id)}
          onAplicarInstrumento={(id) => console.log('Aplicar instrumento:', id)}
        />
      </div>
    </>
  )
}
