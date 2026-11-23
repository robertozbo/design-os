import data from '@/../product-mobile/sections/personal-inicio/data.json'
import type { PersonalInicioData } from '@/../product-mobile/sections/personal-inicio/types'
import { PersonalInicio as Component } from './components/PersonalInicio'

export default function PersonalInicioPreview() {
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
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-mobile="true" className="min-h-full">
        <Component
          data={data as unknown as PersonalInicioData}
          onCheckin={(s) => console.log('Check-in:', s.id)}
          onAbrirAluno={() => {
            window.location.href = '/mobile/sections/personal-aluno-ficha'
          }}
          onVerAgenda={() => {
            window.location.href = '/mobile/sections/personal-agenda'
          }}
          onAtalho={(id) => {
            const destino = {
              'nova-avaliacao': 'personal-avaliacao-nova',
              'aplicar-treino': 'personal-treinos',
              convidar: 'personal-convidar',
              mensagens: 'personal-mensagens',
            }[id]
            window.location.href = `/mobile/sections/${destino}`
          }}
        />
      </div>
    </>
  )
}
