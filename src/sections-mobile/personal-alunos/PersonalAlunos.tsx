import data from '@/../product-mobile/sections/personal-alunos/data.json'
import type { PersonalAlunosData } from '@/../product-mobile/sections/personal-alunos/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalAlunos as Component } from './components/PersonalAlunos'

export default function PersonalAlunosPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalAlunosData}
          onAbrirAluno={() => go('personal-aluno-ficha')}
          onConvidar={() => go('personal-convidar')}

      />
    </PreviewFonts>
  )
}
