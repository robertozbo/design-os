import data from '@/../product/sections/plano-de-a-o-and-pgr/data.json'
import type {
  EmpregadorContexto,
  PlanoAcaoItem,
  PlanoVigente,
  ResponsavelDisponivel,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import { ItemDetail } from './components/ItemDetail'

export default function ItemDetailPreview() {
  // Featured: o item mais rico no data (com origem matriz, evidências e impacto)
  const itens = data.itens as PlanoAcaoItem[]
  const item =
    itens.find((i) => i.evidencias.length > 0 && i.origem.tipo === 'matriz') ??
    itens.find((i) => i.status === 'em_revisao') ??
    itens[0]

  return (
    <ItemDetail
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      planoVigente={data.planoVigente as PlanoVigente}
      item={item}
      responsaveisDisponiveis={data.responsaveisDisponiveis as ResponsavelDisponivel[]}
      onVoltar={() => console.log('Voltar para Plano')}
      onEditarItem={(id) => console.log('Editar item:', id)}
      onChangeStatus={(id, s) => console.log('Change status:', id, s)}
      onChangeResponsavel={(id, r) => console.log('Change responsável:', id, r)}
      onEstenderPrazo={(id, p, j) => console.log('Estender prazo:', id, p, j)}
      onAddEvidencia={(id) => console.log('Add evidência:', id)}
      onRemoveEvidencia={(id, ev) => console.log('Remove evidência:', id, ev)}
      onSalvarImpacto={(id, i) => console.log('Salvar impacto:', id, i)}
      onArchive={(id) => console.log('Arquivar:', id)}
      onNavigateToAvaliacao={(av, s, f) =>
        console.log('Ir pra avaliação:', av, s, f)
      }
      onAbrirEvidencia={(id, ev) => console.log('Abrir evidência:', id, ev)}
    />
  )
}
