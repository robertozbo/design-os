import data from '@/../product-mobile/sections/personal-plano/data.json'
import type { PersonalPlanoData } from '@/../product-mobile/sections/personal-plano/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalPlano as Component } from './components/PersonalPlano'

export default function PersonalPlanoPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalPlanoData}
          onEscolher={(id) => console.log('Plano', id)}
          onGerenciar={() => go('personal-configuracoes')}

      />
    </PreviewFonts>
  )
}
