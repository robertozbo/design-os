import data from '@/../product-mobile/sections/personal-convidar/data.json'
import type { PersonalConvidarData } from '@/../product-mobile/sections/personal-convidar/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalConvidar as Component } from './components/PersonalConvidar'

export default function PersonalConvidarPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalConvidarData}
          onCopiar={() => console.log('Copiar')}
          onCompartilhar={() => console.log('Compartilhar')}
          onWhatsApp={() => console.log('WhatsApp')}
          onReenviar={() => go('personal-alunos')}

      />
    </PreviewFonts>
  )
}
