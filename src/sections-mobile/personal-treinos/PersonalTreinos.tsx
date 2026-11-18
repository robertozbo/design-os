import data from '@/../product-mobile/sections/personal-treinos/data.json'
import type { PersonalTreinosData } from '@/../product-mobile/sections/personal-treinos/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalTreinos as Component } from './components/PersonalTreinos'

export default function PersonalTreinosPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalTreinosData}
          onAbrirTemplate={() => go('personal-treino-detalhe')}
          onAbrirTreinoAluno={() => go('personal-aluno-ficha')}
          onNovoTemplate={() => go('personal-treino-detalhe')}
          onBiblioteca={() => go('personal-exercicios')}
          onProgramas={() => go('personal-programas')}

      />
    </PreviewFonts>
  )
}
