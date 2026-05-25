import { useMemo, useState } from 'react'
import data from '@/../product/sections/plano-de-a-o-and-pgr/data.json'
import type {
  CicloHistoricoResumo,
  EmpregadorContexto,
  FiltrosPlano,
  KpisPlano,
  PlanoAcaoItem,
  PlanoVigente,
  ResponsavelDisponivel,
  SetorAfetado,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import { PlanoAcaoBoard } from './components/PlanoAcaoBoard'

export default function PlanoAcaoBoardPreview() {
  const initial: FiltrosPlano = useMemo(
    () => ({
      busca: data.filtrosAtuais.busca ?? '',
      setoresIds: data.filtrosAtuais.setoresIds ?? [],
      responsaveisIds: data.filtrosAtuais.responsaveisIds ?? [],
      prazo: (data.filtrosAtuais.prazo as FiltrosPlano['prazo']) ?? 'todos',
      prioridade:
        (data.filtrosAtuais.prioridade as FiltrosPlano['prioridade']) ?? 'todas',
    }),
    [],
  )
  const [filtros, setFiltros] = useState<FiltrosPlano>(initial)

  return (
    <PlanoAcaoBoard
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      planoVigente={data.planoVigente as PlanoVigente}
      ciclosHistorico={data.ciclosHistorico as CicloHistoricoResumo[]}
      kpis={data.kpis as KpisPlano}
      filtrosAtuais={filtros}
      responsaveisDisponiveis={data.responsaveisDisponiveis as ResponsavelDisponivel[]}
      setoresAfetados={data.setoresAfetados as SetorAfetado[]}
      itens={data.itens as PlanoAcaoItem[]}
      onSelectCiclo={(id) => console.log('Selecionar ciclo', id)}
      onFiltrosChange={(f) => setFiltros(f)}
      onAddItem={() => console.log('Novo item')}
      onEditItem={(id) => console.log('Editar item', id)}
      onSaveItem={(input) => console.log('Salvar item', input)}
      onSelectItem={(id) => console.log('Abrir detalhe item', id)}
      onChangeItemStatus={(id, status) =>
        console.log('Mudar status', { id, status })
      }
      onArchiveItem={(id) => console.log('Arquivar item', id)}
      onAddEvidencia={(id) => console.log('Anexar evidência', id)}
      onSaveEvidencia={(input) => console.log('Salvar evidência', input)}
      onRemoveEvidencia={(itemId, evId) =>
        console.log('Remover evidência', { itemId, evId })
      }
      onExportPgrIntent={() => console.log('Abrir export PGR')}
      onConfirmExportPgr={(input) => console.log('Exportar PGR', input)}
      onNavigateToAvaliacao={(avalId, setorId, fatorId) =>
        console.log('Ir para Avaliação', { avalId, setorId, fatorId })
      }
      onEncerrarCiclo={() => console.log('Encerrar ciclo')}
    />
  )
}
