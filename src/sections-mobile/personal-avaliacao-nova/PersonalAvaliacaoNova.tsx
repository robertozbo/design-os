import data from '@/../product-mobile/sections/personal-avaliacao-nova/data.json'
import type { PersonalAvaliacaoNovaData } from '@/../product-mobile/sections/personal-avaliacao-nova/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalAvaliacaoNova as Component } from './components/PersonalAvaliacaoNova'

export default function PersonalAvaliacaoNovaPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalAvaliacaoNovaData}
          onTrocarAluno={() => go('personal-alunos')}
          onFoto={() => console.log('Fotos')}
          onSalvar={() => go('personal-aluno-ficha')}

      />
    </PreviewFonts>
  )
}
