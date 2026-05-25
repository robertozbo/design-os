import data from '@/../product/sections/relat-rios-de-conformidade/data.json'
import type {
  AvaliacaoPublicada,
  EmpregadorContexto,
  ResponsavelTecnico,
} from '@/../product/sections/relat-rios-de-conformidade/types'
import { RelatoriosWizard } from './components/RelatoriosWizard'

export default function RelatoriosWizardPreview() {
  return (
    <RelatoriosWizard
      empregadorContexto={data.empregadorContexto as EmpregadorContexto}
      responsaveisDisponiveis={data.responsaveisDisponiveis as ResponsavelTecnico[]}
      avaliacoesPublicadas={data.avaliacoesPublicadas as AvaliacaoPublicada[]}
      onCancel={() => console.log('Cancelar criação')}
      onCreate={(input) => console.log('Criar relatório', input)}
    />
  )
}
