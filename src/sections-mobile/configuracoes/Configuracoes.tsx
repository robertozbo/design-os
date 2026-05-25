import { useState } from 'react'
import data from '@/../product-mobile/sections/configuracoes/data.json'
import type {
  AcessibilidadePrefs,
  ConfiguracoesData,
  NotificacoesPrefs,
  PrivacidadePrefs,
  Tema,
} from '@/../product-mobile/sections/configuracoes/types'
import { Configuracoes as ConfiguracoesComponent } from './components/Configuracoes'

export default function ConfiguracoesPreview() {
  const [state, setState] = useState<ConfiguracoesData>(data as unknown as ConfiguracoesData)

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
        <ConfiguracoesComponent
          data={state}
          onTemaChange={(t: Tema) => setState((s) => ({ ...s, tema: t }))}
          onIdiomaChange={(idioma) => setState((s) => ({ ...s, idioma }))}
          onUnidadesChange={(unidades) => setState((s) => ({ ...s, unidades }))}
          onFormatoDataChange={(formatoData) => setState((s) => ({ ...s, formatoData }))}
          onNotificacaoToggle={(key, valor) =>
            setState((s) => ({
              ...s,
              notificacoes: { ...s.notificacoes, [key]: valor } as NotificacoesPrefs,
            }))
          }
          onPrivacidadeToggle={(key, valor) =>
            setState((s) => ({
              ...s,
              privacidade: { ...s.privacidade, [key]: valor } as PrivacidadePrefs,
            }))
          }
          onAcessibilidadeToggle={(key, valor) =>
            setState((s) => ({
              ...s,
              acessibilidade: { ...s.acessibilidade, [key]: valor } as AcessibilidadePrefs,
            }))
          }
          onExportarDados={() => console.log('Exportar dados')}
          onExcluirConta={() => console.log('Excluir conta')}
          onAbrirTermos={() => console.log('Termos')}
          onAbrirPrivacidade={() => console.log('Privacidade')}
          onAbrirLicencas={() => console.log('Licenças')}
        />
      </div>
    </>
  )
}
