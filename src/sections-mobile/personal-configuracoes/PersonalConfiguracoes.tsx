import data from '@/../product-mobile/sections/personal-configuracoes/data.json'
import type { PersonalConfiguracoesData } from '@/../product-mobile/sections/personal-configuracoes/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalConfiguracoes as Component } from './components/PersonalConfiguracoes'

export default function PersonalConfiguracoesPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalConfiguracoesData}
          onItem={(id) => (id === 'disponibilidade' ? go('personal-agenda') : console.log('Item', id))}

      />
    </PreviewFonts>
  )
}
