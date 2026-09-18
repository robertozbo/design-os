import data from '@/../product-mobile/sections/privacidade-seguranca/data.json'
import type { PrivacidadeSegurancaData } from '@/../product-mobile/sections/privacidade-seguranca/types'
import { PrivacidadeSeguranca as PrivacidadeSegurancaComponent } from './components/PrivacidadeSeguranca'

export default function PrivacidadeSegurancaPreview() {
  const baseData = data as unknown as PrivacidadeSegurancaData

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
        <PrivacidadeSegurancaComponent
          data={baseData}
          onToggleBiometria={(valor) => console.log('Biometria:', valor)}
          onAbrirPinSetup={() => console.log('Abrir setup de PIN')}
          onAbrirSessoes={() => {
            window.location.href = '/mobile/sections/sessoes-ativas'
          }}
          onAbrirTrocarSenha={() => {
            window.location.href = '/mobile/sections/trocar-senha'
          }}
          onAbrirDuasEtapas={() => console.log('Abrir duas etapas')}
          onTogglePrivacidade={(key, valor) => console.log('Privacidade:', key, valor)}
          onAbrirVisibilidadePerfil={() => {
            window.location.href = '/mobile/sections/visibilidade-perfil'
          }}
          onExportarDados={() => console.log('Exportar dados')}
          onAbrirConsentimentos={() => {
            window.location.href = '/mobile/sections/historico-consentimentos'
          }}
          onExcluirConta={() => {
            window.location.href = '/mobile/sections/excluir-conta'
          }}
        />
      </div>
    </>
  )
}
