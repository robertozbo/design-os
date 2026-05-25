import data from '@/../product/sections/avalia-es-de-risco/data.json'
import type {
  Avaliacao,
  Empregador,
  MatrizPublicada,
} from '@/../product/sections/avalia-es-de-risco/types'
import { RelatorioPsicossocial } from './components/RelatorioPsicossocial'

export default function RelatorioPsicossocialPreview() {
  const targetId = data.matriz.avaliacaoId
  const avaliacoes = data.avaliacoes as Avaliacao[]
  const avaliacao = avaliacoes.find((a) => a.id === targetId) ?? avaliacoes[0]
  const matriz = data.matriz as MatrizPublicada

  return (
    <RelatorioPsicossocial
      empregador={data.empregador as Empregador}
      avaliacao={avaliacao}
      matriz={matriz}
      responsavelTecnicoNome="Dra. Patrícia Mendonça"
      responsavelTecnicoRegistro="CRM/SP 142.387 · Médica do Trabalho"
      hashRelatorio="a3f8e2c1b4d9f6a7e1c8b3d2a4f5e6c9b8a7d6e5f4c3b2a1d9e8f7c6b5a4"
      timestampGeracao="2026-05-25 17:42"
    />
  )
}
