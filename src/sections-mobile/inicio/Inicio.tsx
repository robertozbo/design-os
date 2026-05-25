import data from '@/../product-mobile/sections/inicio/data.json'
import type { InicioData, MiniStat, Novidade, QuickAction } from '@/../product-mobile/sections/inicio/types'
import { Inicio as InicioComponent } from './components/Inicio'

export default function InicioPreview() {
  const inicioData = data as unknown as InicioData

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
        <InicioComponent
          data={inicioData}
          onNovidadeClick={(n: Novidade) => console.log('Novidade click:', n.id)}
          onNovidadeDismiss={(id) => console.log('Novidade dismiss:', id)}
          onSaudeClick={() => {
            window.location.href = '/mobile/sections/minha-saude'
          }}
          onPlanoClick={() => console.log('Plano click')}
          onAnelClick={() => console.log('Anel click')}
          onMiniStatClick={(s: MiniStat) => console.log('Stat click:', s.id)}
          onSemanaClick={() => console.log('Semana click')}
          onQuickActionClick={(a: QuickAction) => console.log('Quick action:', a.id)}
          onStreakClick={() => console.log('Streak click')}
          onMedicacaoClick={() => {
            window.location.href = '/mobile/sections/medicacao'
          }}
          onMarcarDose={(id) => console.log('Marcar dose:', id)}
        />
      </div>
    </>
  )
}
