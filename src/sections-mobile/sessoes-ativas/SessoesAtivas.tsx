import data from '@/../product-mobile/sections/sessoes-ativas/data.json'
import type { SessoesAtivasData } from '@/../product-mobile/sections/sessoes-ativas/types'
import { SessoesAtivas as SessoesAtivasComponent } from './components/SessoesAtivas'

export default function SessoesAtivasPreview() {
  const baseData = data as unknown as SessoesAtivasData

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
        <SessoesAtivasComponent
          data={baseData}
          onEncerrarSessao={(id) => console.log('Encerrar sessão:', id)}
          onEncerrarTodasOutras={() => console.log('Encerrar todas as outras sessões')}
        />
      </div>
    </>
  )
}
