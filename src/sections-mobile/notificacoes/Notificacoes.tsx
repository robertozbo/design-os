import data from '@/../product-mobile/sections/notificacoes/data.json'
import type { NotificacoesData } from '@/../product-mobile/sections/notificacoes/types'
import { Notificacoes as NotificacoesComponent } from './components/Notificacoes'

export default function NotificacoesPreview() {
  const baseData = data as unknown as NotificacoesData

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
        <NotificacoesComponent
          data={baseData}
          onAbrirNotificacao={(id) => console.log('Abrir notificação:', id)}
          onMarcarTodasLidas={() => console.log('Marcar todas como lidas')}
          onRefresh={() => console.log('Refresh')}
        />
      </div>
    </>
  )
}
