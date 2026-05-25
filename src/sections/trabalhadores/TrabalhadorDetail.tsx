import { useMemo } from 'react'
import data from '@/../product/sections/trabalhadores/data.json'
import type {
  EmpregadorContexto,
  EstabelecimentoLite,
  SetorLite,
  Trabalhador,
} from '@/../product/sections/trabalhadores/types'
import { TrabalhadorDetail } from './components/TrabalhadorDetail'

const TRABALHADOR_ID = 'tr-005'

export default function TrabalhadorDetailPreview() {
  const trabalhador = useMemo<Trabalhador>(() => {
    const found = data.trabalhadores.find((t) => t.id === TRABALHADOR_ID)
    return (found ?? data.trabalhadores[0]) as Trabalhador
  }, [])

  const estabelecimento = useMemo<EstabelecimentoLite>(() => {
    const found = data.estabelecimentos.find(
      (e) => e.id === trabalhador.estabelecimentoId,
    )
    return (found ?? data.estabelecimentos[0]) as EstabelecimentoLite
  }, [trabalhador.estabelecimentoId])

  const setor = useMemo<SetorLite>(() => {
    const found = data.setores.find((s) => s.id === trabalhador.setorId)
    return (found ?? data.setores[0]) as SetorLite
  }, [trabalhador.setorId])

  return (
    <TrabalhadorDetail
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      trabalhador={trabalhador}
      estabelecimento={estabelecimento}
      setor={setor}
      onBackToList={() => console.log('Voltar para lista de trabalhadores')}
      onEditTrabalhador={(id) => console.log('Editar trabalhador', id)}
      onSaveTrabalhador={(input) => console.log('Salvar trabalhador', input)}
      onArchiveTrabalhador={(id) => console.log('Arquivar trabalhador', id)}
      onInviteNymos={(id) => console.log('Convidar para Nymos', id)}
      onNavigateToEstabelecimento={(id) => console.log('Ir para estab', id)}
      onNavigateToSetor={(estabId, setorId) =>
        console.log('Ir para Setor', { estabId, setorId })
      }
      onSelectCampanha={(avaliacaoId) => console.log('Abrir campanha', avaliacaoId)}
    />
  )
}
