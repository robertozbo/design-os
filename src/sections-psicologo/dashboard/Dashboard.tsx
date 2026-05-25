import data from '@/../product-psicologo/sections/dashboard/data.json'
import type { DashboardData } from '@/../product-psicologo/sections/dashboard/types'
import { Dashboard as DashboardComponent } from './components/Dashboard'

export default function DashboardPreview() {
  const dashData = data as unknown as DashboardData

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
        <DashboardComponent
          data={dashData}
          onIniciarSessao={(id) => console.log('Iniciar sessão:', id)}
          onSessaoClick={(id) => console.log('Ver sessão:', id)}
          onPacienteClick={(id) => console.log('Ver paciente:', id)}
          onAlertaClick={(id) => console.log('Ver alerta:', id)}
          onNovoPaciente={() => console.log('Novo paciente')}
          onAplicarInstrumento={() => console.log('Aplicar instrumento')}
          onAnotacaoRapida={() => console.log('Anotação rápida')}
          onVerTodosPacientes={() => console.log('Ver todos pacientes')}
        />
      </div>
    </>
  )
}
