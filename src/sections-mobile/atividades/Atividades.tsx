import { useState } from 'react'
import data from '@/../product-mobile/sections/atividades/data.json'
import type { AtividadesData, AtividadeViewModel, CategoriaUI, Periodo } from '@/../product-mobile/sections/atividades/types'
import { Atividades as AtividadesComponent } from './components/Atividades'

export default function AtividadesPreview() {
  const baseData = data as unknown as AtividadesData
  const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo>('hoje')
  const [selectedCategorias, setSelectedCategorias] = useState<CategoriaUI[]>([])

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
        <AtividadesComponent
          data={baseData}
          selectedPeriodo={selectedPeriodo}
          onPeriodoChange={setSelectedPeriodo}
          selectedCategorias={selectedCategorias}
          onCategoriasChange={setSelectedCategorias}
          onAtividadeClick={(a: AtividadeViewModel) => console.log('Open activity:', a.activity.id)}
          onRegistrarClick={() => console.log('Register manual')}
          onConectarDispositivoClick={() => console.log('Connect wearable')}
        />
      </div>
    </>
  )
}
