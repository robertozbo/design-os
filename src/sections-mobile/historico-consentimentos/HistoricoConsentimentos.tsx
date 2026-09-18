import data from '@/../product-mobile/sections/historico-consentimentos/data.json'
import type { HistoricoConsentimentosData } from '@/../product-mobile/sections/historico-consentimentos/types'
import { HistoricoConsentimentos as HistoricoConsentimentosComponent } from './components/HistoricoConsentimentos'

export default function HistoricoConsentimentosPreview() {
  const baseData = data as unknown as HistoricoConsentimentosData

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
        <HistoricoConsentimentosComponent
          data={baseData}
          onRevogarConsentimento={(id) => console.log('Revogar consentimento:', id)}
          onAbrirTermoCompleto={(tipo, versao) => console.log('Abrir termo:', tipo, versao)}
          onAbrirExcluirConta={() => {
            window.location.href = '/mobile/sections/excluir-conta'
          }}
        />
      </div>
    </>
  )
}
