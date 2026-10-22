import data from '@/../product-mobile/sections/consultas/data.json'
import type { ConsultasData } from '@/../product-mobile/sections/consultas/types'
import { Consultas as ConsultasComponent } from './components/Consultas'

export default function ConsultasPreview() {
  const consultasData = data as unknown as ConsultasData

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
        <ConsultasComponent
          data={consultasData}
          onGerarCodigoDeChegada={(id) => console.log('Gerar código de chegada:', id)}
          onEntrarTeleconsulta={(id, link) => console.log('Entrar teleconsulta:', id, link)}
          onAdicionarCalendario={(id) => console.log('Adicionar ao calendário:', id)}
          onConversar={(profId) => console.log('Conversar:', profId)}
          onVerProfissionais={() => console.log('Ver profissionais')}
        />
      </div>
    </>
  )
}
