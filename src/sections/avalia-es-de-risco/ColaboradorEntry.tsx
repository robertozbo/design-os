import { useState } from 'react'
import { ColaboradorEntry } from './components/ColaboradorEntry'
import type { Idioma } from '@/../product/sections/avalia-es-de-risco/types'

export default function ColaboradorEntryPreview() {
  const [idioma, setIdioma] = useState<Idioma>('pt')

  return (
    <ColaboradorEntry
      empregadorRazaoSocial="Vegamax Indústria de Alimentos S.A."
      funcaoColaborador="Operadora de Linha · Sênior"
      instrumentoNome="COPSOQ-3"
      instrumentoVersao="versão média · 76 questões"
      duracaoEstimadaMin={18}
      responsavelTecnicoNome="Dra. Patrícia Mendonça"
      responsavelTecnicoRegistro="CRM/SP 142.387 · Médica do Trabalho"
      idiomaSelecionado={idioma}
      idiomasDisponiveis={['pt', 'en', 'es']}
      onSelecionarIdioma={(i) => setIdioma(i)}
      onResponder={() => console.log('Iniciar questionário')}
      onRecusar={() => console.log('Opt-out registrado')}
    />
  )
}
