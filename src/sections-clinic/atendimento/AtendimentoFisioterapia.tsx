import { useState } from 'react'
import data from '@/../product-clinic/sections/atendimento/data.json'
import type {
  AtendimentoData,
  AtendimentoFisio,
} from '@/../product-clinic/sections/atendimento/types'
import {
  AtendimentoShell,
  ContextoLateral,
  EvolucaoDorCard,
  FisioterapiaRegistro,
  Toasts,
  useToasts,
} from './components'

export default function AtendimentoFisioterapiaPreview() {
  const base = (data as unknown as AtendimentoData).fisioterapia
  const [atd, setAtd] = useState<AtendimentoFisio>(base)
  const { toasts, push } = useToasts()

  const toggleConduta = (id: string) =>
    setAtd((a) => ({
      ...a,
      condutas: a.condutas.map((c) =>
        c.id === id ? { ...c, aplicada: !c.aplicada, detalhe: c.aplicada ? null : c.detalhe } : c,
      ),
    }))

  return (
    <>
      <AtendimentoShell
        atendimento={atd}
        clinica={(data as unknown as AtendimentoData).clinica}
        titulo="Sessão de fisioterapia"
        onSalvar={() => push('Rascunho salvo')}
        onFinalizar={() =>
          push(
            atd.evaSaida === null
              ? 'Registre a EVA de saída antes de assinar'
              : 'Sessão assinada — evolução no prontuário',
          )
        }
        onSair={() => push('Saiu sem assinar — rascunho mantido')}
        lateral={
          <ContextoLateral
            contexto={atd.contexto}
            alertas={atd.alertas}
            destaque={<EvolucaoDorCard atendimento={atd} />}
          />
        }
      >
        <FisioterapiaRegistro
          atendimento={atd}
          onEvaChegada={(v) => setAtd((a) => ({ ...a, evaChegada: v }))}
          onEvaSaida={(v) => setAtd((a) => ({ ...a, evaSaida: v }))}
          onConduta={toggleConduta}
          onEvolucao={(v) => setAtd((a) => ({ ...a, evolucaoTexto: v }))}
          onPlano={(v) => setAtd((a) => ({ ...a, planoProxima: v }))}
        />
      </AtendimentoShell>
      <Toasts toasts={toasts} />
    </>
  )
}
