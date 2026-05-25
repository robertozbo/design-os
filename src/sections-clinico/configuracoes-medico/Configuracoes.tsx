import { useState } from 'react'
import data from '@/../product-clinico/sections/configuracoes-medico/data.json'
import type { ConfiguracoesData, NotificacoesPrefs } from '@/../product-clinico/sections/configuracoes-medico/types'
import { Configuracoes as ConfigComponent } from './components/Configuracoes'

export default function ConfiguracoesPreview() {
  const [state, setState] = useState<ConfiguracoesData>(data as unknown as ConfiguracoesData)
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
          onModalidadeToggle={(m) =>
            setState((s) => ({
              ...s,
              modalidades: { ...s.modalidades, [m]: { ...s.modalidades[m], ativa: !s.modalidades[m].ativa } },
            }))
          }
          onConvenioToggle={(id) =>
            setState((s) => ({
              ...s,
              convenios: s.convenios.map((c) => (c.id === id ? { ...c, ativo: !c.ativo } : c)),
            }))
          }
          onNotificacaoToggle={(key, valor) =>
            setState((s) => ({
              ...s,
              notificacoes: { ...s.notificacoes, [key]: valor } as NotificacoesPrefs,
            }))
          }
          onSalvar={() => console.log('Salvar config:', state)}
        />
      </div>
    </>
  )
}
