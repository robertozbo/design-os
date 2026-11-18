import data from '@/../product-mobile/sections/personal-solicitacoes/data.json'
import type { PersonalSolicitacoesData } from '@/../product-mobile/sections/personal-solicitacoes/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalSolicitacoes as Component } from './components/PersonalSolicitacoes'

export default function PersonalSolicitacoesPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalSolicitacoesData}
          onAceitar={(id) => console.log('Aceitar', id)}
          onSugerir={(id) => console.log('Sugerir horário', id)}
          onRecusar={() => go('personal-agenda')}

      />
    </PreviewFonts>
  )
}
