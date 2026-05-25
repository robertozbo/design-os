import data from '@/../product-mobile/sections/profissionais/data.json'
import type { ProfissionaisData } from '@/../product-mobile/sections/profissionais/types'
import { Profissionais as ProfissionaisComponent } from './components/Profissionais'

export default function ProfissionaisPreview() {
  const profData = data as unknown as ProfissionaisData

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
        <ProfissionaisComponent
          data={profData}
          onProfClick={(id) => console.log('Prof:', id)}
          onChat={(id) => console.log('Chat:', id)}
          onDesvincular={(id) => console.log('Desvincular:', id)}
          onAceitarConvite={(id, escopo) =>
            console.log('Aceitar:', id, 'escopo:', escopo)
          }
          onRecusarConvite={(id) => console.log('Recusar:', id)}
          onCancelarConviteEnviado={(id) => console.log('Cancelar enviado:', id)}
          onConvidarNovo={() => console.log('Convidar novo')}
          onAtualizarEscopo={(profId, escopo) =>
            console.log('Atualizar escopo:', profId, escopo)
          }
          onVincularPorCodigo={(codigo, escopo) =>
            console.log('Vincular por código:', codigo, 'escopo:', escopo)
          }
        />
      </div>
    </>
  )
}
