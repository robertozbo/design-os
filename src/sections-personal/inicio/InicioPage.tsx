import { useState } from 'react'
import data from '@/../product-personal/sections/inicio/data.json'
import type {
  AgendaItem,
  AlunoRisco,
  AtalhoId,
  AtividadeEvento,
  NotaDiario,
  ProximaReavaliacao,
} from '@/../product-personal/sections/inicio/types'
import { InicioPage as InicioPageView } from './components/InicioPage'

export default function InicioPagePreview() {
  const [diario, setDiario] = useState<NotaDiario[]>(
    data.diario as NotaDiario[],
  )
  const [agenda, setAgenda] = useState<AgendaItem[]>(
    data.agenda as AgendaItem[],
  )

  return (
    <InicioPageView
      greeting={data.greeting}
      kpis={data.kpis}
      agenda={agenda}
      alunosRisco={data.alunosRisco as AlunoRisco[]}
      proximasReavaliacoes={data.proximasReavaliacoes as ProximaReavaliacao[]}
      atalhos={data.atalhos as AtalhoId[]}
      diario={diario}
      atividadeRecente={data.atividadeRecente as AtividadeEvento[]}
      onMarcarSessaoRealizada={(id) => {
        setAgenda((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: 'realizada' } : s)),
        )
        console.log('marcar realizada:', id)
      }}
      onOpenSessao={(id) => console.log('open sessao:', id)}
      onOpenAluno={(id) => console.log('open aluno:', id)}
      onCreateAvaliacao={() => console.log('create avaliacao')}
      onOpenTreinos={() => console.log('open treinos')}
      onConvidarAluno={() => console.log('convidar aluno')}
      onAddNota={(texto) => {
        if (!texto) return
        const novaNota: NotaDiario = {
          id: `n-${Date.now()}`,
          texto,
          criadoEm: new Date().toISOString(),
          feita: false,
        }
        setDiario((prev) => [...prev, novaNota])
      }}
      onToggleNota={(id) =>
        setDiario((prev) =>
          prev.map((n) => (n.id === id ? { ...n, feita: !n.feita } : n)),
        )
      }
      onRemoveNota={(id) =>
        setDiario((prev) => prev.filter((n) => n.id !== id))
      }
      onOpenAgenda={() => console.log('open agenda')}
      onOpenAtividade={() => console.log('open atividade')}
    />
  )
}
