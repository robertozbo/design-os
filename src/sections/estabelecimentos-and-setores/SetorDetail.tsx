import { useMemo } from 'react'
import data from '@/../product/sections/estabelecimentos-and-setores/data.json'
import type {
  EmpregadorContexto,
  Estabelecimento,
  GestorSetor,
  Setor,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import { SetorDetail } from './components/SetorDetail'

const ESTAB_ID = 'est-002'
const SETOR_ID = 'set-010'

export default function SetorDetailPreview() {
  const estabelecimento = useMemo<Estabelecimento>(() => {
    const found = data.estabelecimentos.find((e) => e.id === ESTAB_ID)
    return (found ?? data.estabelecimentos[0]) as Estabelecimento
  }, [])

  const setor = useMemo<Setor>(() => {
    const found = estabelecimento.setores.find((s) => s.id === SETOR_ID)
    return (found ?? estabelecimento.setores[0]) as Setor
  }, [estabelecimento])

  const profissionaisDisponiveis = useMemo<GestorSetor[]>(() => {
    const map = new Map<string, GestorSetor>()
    for (const e of data.estabelecimentos) {
      for (const s of e.setores) {
        if (s.gestor && !map.has(s.gestor.id)) map.set(s.gestor.id, s.gestor as GestorSetor)
      }
    }
    return Array.from(map.values())
  }, [])

  return (
    <SetorDetail
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      estabelecimento={estabelecimento}
      setor={setor}
      profissionaisDisponiveis={profissionaisDisponiveis}
      onBackToEstabelecimentos={() => console.log('Voltar para lista de estabs')}
      onBackToEstabelecimento={(id) => console.log('Voltar para detalhe do estab', id)}
      onEditSetor={(estabId, setorId) => console.log('Editar setor', { estabId, setorId })}
      onSaveSetor={(input) => console.log('Salvar setor', input)}
      onArchiveSetor={(estabId, setorId) => console.log('Arquivar setor', { estabId, setorId })}
      onNavigateToTrabalhadores={(estabId, setorId) =>
        console.log('Ir para Trabalhadores filtrados em', { estabId, setorId })
      }
      onNavigateToAvaliacoes={(estabId, setorId) =>
        console.log('Ir para Avaliações filtradas em', { estabId, setorId })
      }
      onNavigateToPlanoAcao={(estabId, setorId) =>
        console.log('Ir para Plano de Ação filtrado em', { estabId, setorId })
      }
      onContactGestor={(gestorId) => console.log('Contatar gestor', gestorId)}
    />
  )
}
