import { useState } from 'react'
import data from '@/../product-clinic/sections/atendimento/data.json'
import type {
  AtendimentoData,
  AtendimentoFono,
} from '@/../product-clinic/sections/atendimento/types'
import {
  AtendimentoShell,
  ContextoLateral,
  FonoaudiologiaRegistro,
  PrecisaoCard,
  Toasts,
  useToasts,
} from './components'

export default function AtendimentoFonoaudiologiaPreview() {
  const base = (data as unknown as AtendimentoData).fonoaudiologia
  const [atd, setAtd] = useState<AtendimentoFono>(base)
  const { toasts, push } = useToasts()

  const semRegistro = atd.alvos.every((alvo) => alvo.tentativas === 0)

  return (
    <>
      <AtendimentoShell
        atendimento={atd}
        clinica={(data as unknown as AtendimentoData).clinica}
        titulo="Sessão de fonoaudiologia"
        onSalvar={() => push('Rascunho salvo')}
        onFinalizar={() =>
          push(
            semRegistro
              ? 'Nenhum alvo com tentativa registrada — a evolução fica sem número'
              : 'Sessão assinada — evolução no prontuário e treino no app do responsável',
          )
        }
        onSair={() => push('Saiu sem assinar — rascunho mantido')}
        lateral={
          <ContextoLateral
            contexto={atd.contexto}
            alertas={atd.alertas}
            destaque={<PrecisaoCard atendimento={atd} />}
          />
        }
      >
        <FonoaudiologiaRegistro
          atendimento={atd}
          onInteligibilidade={(v) => setAtd((a) => ({ ...a, inteligibilidade: v }))}
          onAcerto={(id) =>
            setAtd((a) => ({
              ...a,
              alvos: a.alvos.map((alvo) =>
                alvo.id === id
                  ? { ...alvo, tentativas: alvo.tentativas + 1, acertos: alvo.acertos + 1 }
                  : alvo,
              ),
            }))
          }
          onErro={(id) =>
            setAtd((a) => ({
              ...a,
              alvos: a.alvos.map((alvo) =>
                alvo.id === id ? { ...alvo, tentativas: alvo.tentativas + 1 } : alvo,
              ),
            }))
          }
          onApoio={(id, apoio) =>
            setAtd((a) => ({
              ...a,
              alvos: a.alvos.map((alvo) => (alvo.id === id ? { ...alvo, apoio } : alvo)),
            }))
          }
          onExercicio={(id) =>
            setAtd((a) => ({
              ...a,
              exercicios: a.exercicios.map((e) =>
                e.id === id ? { ...e, aplicado: !e.aplicado } : e,
              ),
            }))
          }
          onOrientacao={(v) => setAtd((a) => ({ ...a, orientacaoCuidador: v }))}
          onEvolucao={(v) => setAtd((a) => ({ ...a, evolucaoTexto: v }))}
          onPlano={(v) => setAtd((a) => ({ ...a, planoProxima: v }))}
        />
      </AtendimentoShell>
      <Toasts toasts={toasts} />
    </>
  )
}
