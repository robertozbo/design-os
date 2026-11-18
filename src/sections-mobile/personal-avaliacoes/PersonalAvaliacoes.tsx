import data from '@/../product-mobile/sections/personal-avaliacoes/data.json'
import type { PersonalAvaliacoesData } from '@/../product-mobile/sections/personal-avaliacoes/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalAvaliacoes as Component } from './components/PersonalAvaliacoes'

export default function PersonalAvaliacoesPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalAvaliacoesData}
          onNova={() => go('personal-avaliacao-nova')}
          onAbrir={() => go('personal-aluno-ficha')}

      />
    </PreviewFonts>
  )
}
