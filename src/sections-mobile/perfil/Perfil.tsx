import data from '@/../product-mobile/sections/perfil/data.json'
import type { PerfilData } from '@/../product-mobile/sections/perfil/types'
import { Perfil as PerfilComponent } from './components/Perfil'

export default function PerfilPreview() {
  const perfilData = data as unknown as PerfilData

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
        <PerfilComponent
          data={perfilData}
          onEditarFoto={() => console.log('Editar foto')}
          onEditarNome={() => console.log('Editar nome')}
          onEditarNascimento={() => console.log('Editar nascimento')}
          onEditarSexo={(s) => console.log('Sexo:', s)}
          onEditarAltura={() => console.log('Editar altura')}
          onAtualizarPeso={() => console.log('Atualizar peso')}
          onProfissionaisClick={() => {
            window.location.href = '/mobile/sections/profissionais'
          }}
          onEditarEmergencia={() => console.log('Emergência')}
          onAlterarSenha={() => console.log('Senha')}
          onExcluirConta={() => console.log('Excluir')}
        />
      </div>
    </>
  )
}
