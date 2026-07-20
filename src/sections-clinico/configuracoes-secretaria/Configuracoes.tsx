import { useState } from 'react'
import data from '@/../product-clinico/sections/configuracoes-secretaria/data.json'
import type {
  ConfiguracoesSecretariaData,
  NotificacoesSecretaria,
  PreferenciasSecretaria,
} from '@/../product-clinico/sections/configuracoes-secretaria/types'
import { Configuracoes as ConfigComponent } from './components/Configuracoes'

export default function ConfiguracoesSecretariaPreview() {
  const [state, setState] = useState<ConfiguracoesSecretariaData>(
    data as unknown as ConfiguracoesSecretariaData,
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        body, [data-nymos-clinico],
        [data-nymos-clinico] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-clinico] .font-mono,
        [data-nymos-clinico] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-clinico="true">
        <ConfigComponent
          data={state}
          onNotificacaoToggle={(key, valor) =>
            setState((s) => ({
              ...s,
              notificacoes: { ...s.notificacoes, [key]: valor } as NotificacoesSecretaria,
            }))
          }
          onPreferenciaChange={(campo, valor) =>
            setState((s) => ({
              ...s,
              preferencias: { ...s.preferencias, [campo]: valor } as PreferenciasSecretaria,
            }))
          }
          onAlterarSenha={() => console.log('Alterar senha')}
          onSalvar={() => console.log('Salvar config secretária:', state)}
        />
      </div>
    </>
  )
}
