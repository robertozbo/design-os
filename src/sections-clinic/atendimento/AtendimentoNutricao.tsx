import { useState } from 'react'
import data from '@/../product-clinic/sections/atendimento/data.json'
import type {
  AtendimentoData,
  AtendimentoNutri,
} from '@/../product-clinic/sections/atendimento/types'
import {
  AtendimentoShell,
  ContextoLateral,
  EvolucaoPesoCard,
  NutricaoRegistro,
  Toasts,
  useToasts,
} from './components'

export default function AtendimentoNutricaoPreview() {
  const base = (data as unknown as AtendimentoData).nutricao
  const [atd, setAtd] = useState<AtendimentoNutri>(base)
  const { toasts, push } = useToasts()

  // Peso digitado recalcula o IMC na hora: deixar o IMC parado enquanto o peso muda é
  // mostrar dois números que se contradizem na mesma tela.
  const setPeso = (peso: number) =>
    setAtd((a) => ({
      ...a,
      antropometria: {
        ...a.antropometria,
        peso,
        imc: Number((peso / (a.antropometria.altura * a.antropometria.altura)).toFixed(1)),
      },
    }))

  return (
    <>
      <AtendimentoShell
        atendimento={atd}
        clinica={(data as unknown as AtendimentoData).clinica}
        titulo="Consulta de nutrição"
        onSalvar={() => push('Rascunho salvo')}
        onFinalizar={() => push('Consulta assinada — plano enviado ao app do paciente')}
        onSair={() => push('Saiu sem assinar — rascunho mantido')}
        lateral={
          <ContextoLateral
            contexto={atd.contexto}
            alertas={atd.alertas}
            destaque={<EvolucaoPesoCard atendimento={atd} />}
          />
        }
      >
        <NutricaoRegistro
          atendimento={atd}
          onPeso={setPeso}
          onEvolucao={(v) => setAtd((a) => ({ ...a, evolucaoTexto: v }))}
          onOrientacao={(texto) =>
            setAtd((a) => ({ ...a, orientacoes: [...a.orientacoes, texto] }))
          }
        />
      </AtendimentoShell>
      <Toasts toasts={toasts} />
    </>
  )
}
