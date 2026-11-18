import data from '@/../product-mobile/sections/perfil-seletor/data.json'
import type { PerfilSeletorData } from '@/../product-mobile/sections/perfil-seletor/types'
import { PerfilSeletor as Component } from './components/PerfilSeletor'

export default function PerfilSeletorPreview() {
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
      <div data-nymos-mobile="true" className="min-h-full">
        <Component
          data={data as unknown as PerfilSeletorData}
          onEscolher={(perfil) => {
            window.location.href = perfil === 'personal' ? '/mobile/sections/personal-inicio' : '/mobile/sections/inicio'
          }}
          onSair={() => console.log('Sair')}
        />
      </div>
    </>
  )
}
