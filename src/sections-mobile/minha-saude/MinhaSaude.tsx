import data from '@/../product-mobile/sections/minha-saude/data.json'
import type { MinhaSaudeData } from '@/../product-mobile/sections/minha-saude/types'
import { MinhaSaude as MinhaSaudeComponent } from './components/MinhaSaude'

export default function MinhaSaudePreview() {
  const baseData = data as unknown as MinhaSaudeData

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
        <MinhaSaudeComponent
          data={baseData}
          onDimensaoClick={(id) => console.log('Dimensão:', id)}
          onGerarAnalise={() => console.log('Gerar análise')}
          onSnapshotClick={(id) => console.log('Snapshot:', id)}
          onTrocarSnapshotInicial={() => console.log('Trocar inicial')}
          onTrocarSnapshotFinal={() => console.log('Trocar final')}
          onGerarProjecao={() => console.log('Gerar projeção')}
          onEditarMeta={() => console.log('Editar meta')}
          onColetarDado={(t) => console.log('Coletar:', t)}
        />
      </div>
    </>
  )
}
