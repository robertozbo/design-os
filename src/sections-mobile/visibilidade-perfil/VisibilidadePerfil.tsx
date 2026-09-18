import data from '@/../product-mobile/sections/visibilidade-perfil/data.json'
import type { VisibilidadePerfilData } from '@/../product-mobile/sections/visibilidade-perfil/types'
import { VisibilidadePerfil as VisibilidadePerfilComponent } from './components/VisibilidadePerfil'

export default function VisibilidadePerfilPreview() {
  const baseData = data as unknown as VisibilidadePerfilData

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
      `}</style>
      <div data-nymos-mobile="true">
        <VisibilidadePerfilComponent
          data={baseData}
          onMudar={(nova) => console.log('Visibilidade:', nova)}
          onReabrirConexoes={() => {
            window.location.href = '/mobile/sections/profissionais'
          }}
        />
      </div>
    </>
  )
}
