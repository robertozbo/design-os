import { useEffect, useState } from 'react'
import data from '@/../product-mobile/sections/objetivos/data.json'
import type { ObjetivosData, ObjetivoViewModel } from '@/../product-mobile/sections/objetivos/types'
import type { GoalStatus } from '@/../product-mobile/api-types'
import { Objetivos as ObjetivosComponent } from './components/Objetivos'

export default function ObjetivosPreview() {
  const baseData = data as unknown as ObjetivosData
  const [selectedStatus, setSelectedStatus] = useState<GoalStatus>('active')

  useEffect(() => {
    const onAdd = () => console.log('Open create goal sheet')
    window.addEventListener('nymos:open-add', onAdd)
    return () => window.removeEventListener('nymos:open-add', onAdd)
  }, [])

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
        <ObjetivosComponent
          data={baseData}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onObjetivoClick={(o: ObjetivoViewModel) => console.log('Open goal:', o.goal.id)}
          onCriarClick={() => console.log('Create goal')}
        />
      </div>
    </>
  )
}
