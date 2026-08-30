import { useState } from 'react'
import data from '@/../product/sections/treinamentos/data.json'
import type {
  Empregador,
  Trabalhador,
  Treinamento,
  Turma,
} from '@/../product/sections/treinamentos/types'
import { TreinamentosView } from './components/TreinamentosView'

export default function TreinamentosPreview() {
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>(data.treinamentos as Treinamento[])
  const [turmas, setTurmas] = useState<Turma[]>(data.turmas as Turma[])

  const patchAluno = (turmaId: string, trabalhadorId: string, patch: Partial<Turma['alunos'][number]>) =>
    setTurmas((prev) =>
      prev.map((t) =>
        t.id === turmaId
          ? {
              ...t,
              alunos: t.alunos.map((a) => (a.trabalhadorId === trabalhadorId ? { ...a, ...patch } : a)),
            }
          : t,
      ),
    )

  return (
    <TreinamentosView
      treinamentos={treinamentos}
      turmas={turmas}
      empregadores={data.empregadores as Empregador[]}
      trabalhadores={data.trabalhadores as Trabalhador[]}
      onCreateTreinamento={(input) =>
        setTreinamentos((prev) => [...prev, { ...input, id: `trein-${prev.length + 1}` }])
      }
      onCreateTurma={(input) =>
        setTurmas((prev) => [
          {
            id: `turma-${prev.length + 1}`,
            treinamentoId: input.treinamentoId,
            empregadorId: input.empregadorId,
            tipo: input.tipo,
            dataInicio: input.dataInicio,
            dataFim: input.dataFim,
            instrutor: input.instrutor,
            local: input.local,
            status: 'agendada',
            agendaGoogleSincronizada: false,
            alunos: input.trabalhadorIds.map((trabalhadorId) => ({
              trabalhadorId,
              presente: null,
              aprovado: null,
              certificadoEmitido: false,
              certificadoEnviado: false,
            })),
          },
          ...prev,
        ])
      }
      onTogglePresenca={(turmaId, trabalhadorId, presente) => patchAluno(turmaId, trabalhadorId, { presente })}
      onToggleAprovacao={(turmaId, trabalhadorId, aprovado) => patchAluno(turmaId, trabalhadorId, { aprovado })}
      onEmitirCertificados={(turmaId) =>
        setTurmas((prev) =>
          prev.map((t) =>
            t.id === turmaId
              ? {
                  ...t,
                  status: 'certificados_emitidos',
                  alunos: t.alunos.map((a) => (a.aprovado ? { ...a, certificadoEmitido: true } : a)),
                }
              : t,
          ),
        )
      }
      onEnviarCertificados={(turmaId, trabalhadorIds) =>
        setTurmas((prev) =>
          prev.map((t) =>
            t.id === turmaId
              ? {
                  ...t,
                  alunos: t.alunos.map((a) =>
                    trabalhadorIds.includes(a.trabalhadorId) ? { ...a, certificadoEnviado: true } : a,
                  ),
                }
              : t,
          ),
        )
      }
      onCriarEventoAgenda={(turmaId) =>
        setTurmas((prev) =>
          prev.map((t) => (t.id === turmaId ? { ...t, agendaGoogleSincronizada: true } : t)),
        )
      }
      onSelectTreinamento={(id) => console.log('Abrir curso', id)}
      onSelectTurma={(id) => console.log('Abrir turma', id)}
    />
  )
}
