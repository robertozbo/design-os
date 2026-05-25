import data from '@/../product/sections/eventos-esocial/data.json'
import type {
  Ambiente,
  SetorLite,
  TrabalhadorFormLite,
} from '@/../product/sections/eventos-esocial/types'
import { NovoEventoForm } from './components/NovoEventoForm'

export default function NovoEventoFormPreview() {
  return (
    <NovoEventoForm
      tipo="S-2220"
      empregadorContexto={{
        ...data.empregadorContexto,
        ambienteCorrente: data.empregadorContexto.ambienteCorrente as Ambiente,
      }}
      estabelecimentos={data.estabelecimentos}
      setores={data.setores as SetorLite[]}
      trabalhadores={data.trabalhadoresForm as TrabalhadorFormLite[]}
      sugestao={{
        origem: 'sugerido_aso',
        referenciaId: 'aso-2026-0591',
        referenciaLabel: 'ASO #0591 · Carolina Mendes Vieira',
        trabalhadorId: 'trab-011',
        dadosPrefilled: {
          tipoExame: 'periodico',
          dataASO: '2026-05-24',
          ordemServico: 'OS-2026-04891',
        },
      }}
      onCancelar={() => console.log('Cancelar')}
      onSalvarRascunho={(dados) => console.log('Salvar rascunho:', dados)}
      onValidarXsd={(dados) => console.log('Validar XSD:', dados)}
      onEnviarParaFila={(dados) => console.log('Enviar para fila:', dados)}
    />
  )
}
