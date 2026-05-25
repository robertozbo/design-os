import { useMemo } from 'react'
import data from '@/../product/sections/estabelecimentos-and-setores/data.json'
import type {
  EmpregadorContexto,
  Estabelecimento,
  GestorSetor,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import { EstabelecimentoDetail } from './components/EstabelecimentoDetail'

const ESTABELECIMENTO_PREVIEW_ID = 'est-002'

export default function EstabelecimentoDetailPreview() {
  const estabelecimento = useMemo<Estabelecimento>(() => {
    const found = data.estabelecimentos.find((e) => e.id === ESTABELECIMENTO_PREVIEW_ID)
    return (found ?? data.estabelecimentos[0]) as Estabelecimento
  }, [])

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
    <EstabelecimentoDetail
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      estabelecimento={estabelecimento}
      profissionaisDisponiveis={profissionaisDisponiveis}
      onBackToList={() => console.log('Voltar para lista de estabs')}
      onEditEstabelecimento={(id) => console.log('Editar estab', id)}
      onArchiveEstabelecimento={(id) => console.log('Arquivar estab', id)}
      onAddSetor={(estabId) => console.log('Adicionar setor em', estabId)}
      onEditSetor={(estabId, setorId) => console.log('Editar setor', { estabId, setorId })}
      onSaveSetor={(input) => console.log('Salvar setor', input)}
      onArchiveSetor={(estabId, setorId) => console.log('Arquivar setor', { estabId, setorId })}
      onSelectSetor={(estabId, setorId) =>
        console.log('Abrir detalhe do setor', { estabId, setorId })
      }
      onNavigateToAvaliacoes={(id) => console.log('Ir para Avaliações filtradas em', id)}
    />
  )
}
