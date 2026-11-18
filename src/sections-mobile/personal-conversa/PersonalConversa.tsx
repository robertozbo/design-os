import data from '@/../product-mobile/sections/personal-conversa/data.json'
import type { PersonalConversaData } from '@/../product-mobile/sections/personal-conversa/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalConversa as Component } from './components/PersonalConversa'

export default function PersonalConversaPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalConversaData}
          onAbrirFicha={() => go('personal-aluno-ficha')}
          onEnviar={(t) => console.log('Enviar', t)}
          onAnexar={() => console.log('Anexar')}

      />
    </PreviewFonts>
  )
}
