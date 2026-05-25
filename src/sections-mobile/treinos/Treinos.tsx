import { useEffect, useState } from 'react'
import data from '@/../product-mobile/sections/treinos/data.json'
import type { TreinosData } from '@/../product-mobile/sections/treinos/types'
import { Treinos as TreinosComponent } from './components/Treinos'
import { CriarTreinoFlow } from './components/CriarTreinoFlow'
import { ExecutarTreinoFlow } from './components/ExecutarTreinoFlow'

export default function TreinosPreview() {
  const baseData = data as unknown as TreinosData
  const sessaoDeHoje =
    baseData.sessoes.find((s) => s.session.dayOfWeek === baseData.diaSemanaHoje) ?? null
  const finalData: TreinosData = { ...baseData, sessaoDeHoje }

  const [criarOpen, setCriarOpen] = useState(false)
  const [executarSessaoId, setExecutarSessaoId] = useState<string | null>(null)

  useEffect(() => {
    const onOpenAdd = () => setCriarOpen(true)
    window.addEventListener('nymos:open-add', onOpenAdd)
    return () => window.removeEventListener('nymos:open-add', onOpenAdd)
  }, [])

  useEffect(() => {
    let node: React.ReactNode = null
    if (criarOpen) {
      node = (
        <CriarTreinoFlow
          onClose={() => setCriarOpen(false)}
          onSalvar={(p) => {
            console.log('Salvar plano:', p)
            setCriarOpen(false)
          }}
        />
      )
    } else if (executarSessaoId) {
      const sessao = finalData.sessoes.find((s) => s.session.id === executarSessaoId)
      if (sessao) {
        node = (
          <ExecutarTreinoFlow
            sessao={sessao}
            pesoUsuarioKg={finalData.pesoUsuarioKg}
            pesoMedidoEm={finalData.pesoMedidoEm}
            onClose={() => setExecutarSessaoId(null)}
            onSalvar={(p) => {
              console.log('Salvar execução:', p)
              setExecutarSessaoId(null)
            }}
          />
        )
      }
    }
    window.dispatchEvent(new CustomEvent('nymos:set-overlay', { detail: { node } }))
    return () => {
      window.dispatchEvent(new CustomEvent('nymos:set-overlay', { detail: { node: null } }))
    }
  }, [criarOpen, executarSessaoId, finalData.sessoes])

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
        <TreinosComponent
          data={finalData}
          onChangeAba={(a) => console.log('[Treinos] aba:', a)}
          onIniciarTreino={(id) => setExecutarSessaoId(id)}
          onSessaoClick={(id) => console.log('Sessão:', id)}
          onExercicioClick={(id) => console.log('Exercício:', id)}
          onExecucaoClick={(id) => console.log('Execução:', id)}
          onVerTodoHistorico={() => console.log('Ver histórico')}
          onVerStats={() => console.log('Ver stats')}
          onOpenPersonalDetail={(id) => console.log('Abrir Personal:', id)}
          onTreinoProprioClick={(id) => console.log('Treino próprio:', id)}
          onNovoTreinoProprio={() => console.log('Novo treino próprio')}
        />
      </div>
    </>
  )
}
