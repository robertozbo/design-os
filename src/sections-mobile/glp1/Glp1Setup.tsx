import data from '@/../product-mobile/sections/glp1/data.json'
import type { Glp1Data } from '@/../product-mobile/sections/glp1/types'
import { Glp1 as Glp1Component } from './components/Glp1'

/**
 * Primeiro acesso: nada configurado ainda. Mostra o convite + o wizard
 * passo-a-passo (medicação → dose → frequência → agenda → dados → meta).
 * Os dados de corpo chegam pré-preenchidos do perfil (`perfilPrefill`).
 */
export default function Glp1SetupPreview() {
  const baseData = {
    ...(data as unknown as Glp1Data),
    configuracao: null,
    stats: null,
    aplicacoes: [],
    // Paciente novo não tem histórico de peso: a curva nasce do peso do wizard.
    evolucaoPeso: [],
  } satisfies Glp1Data

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
        />
      </div>
    </>
  )
}
