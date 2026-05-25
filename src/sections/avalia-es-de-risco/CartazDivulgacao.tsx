import { CartazDivulgacao } from './components/CartazDivulgacao'

export default function CartazDivulgacaoPreview() {
  return (
    <CartazDivulgacao
      empregadorRazaoSocial="Vegamax Indústria de Alimentos S.A."
      avaliacaoNome="Avaliação Psicossocial 2026 Q2"
      instrumentoNome="COPSOQ-3"
      duracaoEstimadaMin={18}
      janelaInicio="2026-05-12"
      janelaFim="2026-05-30"
      responsavelTecnicoNome="Dra. Patrícia Mendonça"
      responsavelTecnicoRegistro="CRM/SP 142.387 · Médica do Trabalho"
      urlPesquisa="nymos.app/p/x7k9z2"
      onBaixarPdf={() => console.log('Baixar PDF/Word')}
      onImprimir={() => console.log('Imprimir')}
    />
  )
}
