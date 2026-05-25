import data from '@/../product/sections/eventos-esocial/data.json'
import type {
  Ambiente,
  CertificadoDetalhado,
  EmpregadorEscopo,
} from '@/../product/sections/eventos-esocial/types'
import { ConfigurarCertificado } from './components/ConfigurarCertificado'

export default function ConfigurarCertificadoPreview() {
  return (
    <ConfigurarCertificado
      empregadorContexto={{
        ...data.empregadorContexto,
        ambienteCorrente: data.empregadorContexto.ambienteCorrente as Ambiente,
      }}
      certificado={data.certificadoDetalhado as CertificadoDetalhado}
      empregadoresDisponiveis={data.empregadoresDisponiveis as EmpregadorEscopo[]}
      onVoltar={() => console.log('Voltar')}
      onFechar={() => console.log('Fechar')}
      onUploadArquivo={(f) => console.log('Upload arquivo:', f)}
      onRemoverArquivo={() => console.log('Remover arquivo')}
      onSalvar={(input) => console.log('Salvar:', input)}
      onRevogar={() => console.log('Revogar certificado')}
    />
  )
}
