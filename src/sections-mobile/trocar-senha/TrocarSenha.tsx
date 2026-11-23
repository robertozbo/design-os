import data from '@/../product-mobile/sections/trocar-senha/data.json'
import type { TrocarSenhaData } from '@/../product-mobile/sections/trocar-senha/types'
import { TrocarSenha as TrocarSenhaComponent } from './components/TrocarSenha'

export default function TrocarSenhaPreview() {
  const baseData = data as unknown as TrocarSenhaData

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'Geist Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-mobile="true">
        <TrocarSenhaComponent
          data={baseData}
          onSubmit={async (atual, nova) => {
            console.log('Trocar senha:', { atual, nova })
          }}
          onConcluido={() => {
            window.location.href = '/mobile/sections/privacidade-seguranca'
          }}
        />
      </div>
    </>
  )
}
