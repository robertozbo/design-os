import data from '@/../product-mobile/sections/personal-programas/data.json'
import type { PersonalProgramasData } from '@/../product-mobile/sections/personal-programas/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalProgramas as Component } from './components/PersonalProgramas'

export default function PersonalProgramasPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalProgramasData}
          onAbrir={() => go('personal-treino-detalhe')}
          onNovo={() => console.log('Novo programa')}

      />
    </PreviewFonts>
  )
}
