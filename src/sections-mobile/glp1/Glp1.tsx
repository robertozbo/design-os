import data from '@/../product-mobile/sections/glp1/data.json'
import type { Glp1Data } from '@/../product-mobile/sections/glp1/types'
import { Glp1 as Glp1Component } from './components/Glp1'

/** Painel do paciente que já configurou o acompanhamento. */
export default function Glp1Preview() {
  const baseData = data as unknown as Glp1Data

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
        <Glp1Component
          data={baseData}
          onSalvarConfiguracao={(p) => console.log('Configuração GLP-1:', p)}
          onSalvarAplicacao={(p) => console.log('Nova aplicação:', p)}
          onVerHistoricoCompleto={() => console.log('Ver histórico completo')}
          onFalarComMedico={() => console.log('Compartilhar com médico')}
        />
      </div>
    </>
  )
}
