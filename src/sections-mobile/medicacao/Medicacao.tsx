import data from '@/../product-mobile/sections/medicacao/data.json'
import type { MedicacaoData } from '@/../product-mobile/sections/medicacao/types'
import { Medicacao as MedicacaoComponent } from './components/Medicacao'

export default function MedicacaoPreview() {
  const baseData = data as unknown as MedicacaoData

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
        <MedicacaoComponent
          data={baseData}
          onMarcarDose={(id) => console.log('Marcar dose:', id)}
          onAdiarDose={(id, min) => console.log('Adiar dose:', id, min)}
          onAbrirReceitaMemed={(id) => console.log('Abrir receita Memed:', id)}
          onAbrirDetalheReceita={(id) => console.log('Detalhe receita:', id)}
          onVerHistoricoCompleto={() => console.log('Ver todas as receitas')}
          onFalarComMedico={(ctx) => console.log('Falar com médico:', ctx)}
          onDispensarRenovada={() => console.log('Dispensar banner renovada')}
        />
      </div>
    </>
  )
}
