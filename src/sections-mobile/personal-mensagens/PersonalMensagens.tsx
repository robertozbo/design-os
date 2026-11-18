import data from '@/../product-mobile/sections/personal-mensagens/data.json'
import type { PersonalMensagensData } from '@/../product-mobile/sections/personal-mensagens/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalMensagens as Component } from './components/PersonalMensagens'

export default function PersonalMensagensPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalMensagensData}
          onAbrir={() => go('personal-conversa')}
          onNova={() => go('personal-alunos')}

      />
    </PreviewFonts>
  )
}
