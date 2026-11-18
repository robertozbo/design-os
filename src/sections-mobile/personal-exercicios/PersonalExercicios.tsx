import data from '@/../product-mobile/sections/personal-exercicios/data.json'
import type { PersonalExerciciosData } from '@/../product-mobile/sections/personal-exercicios/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalExercicios as Component } from './components/PersonalExercicios'

export default function PersonalExerciciosPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalExerciciosData}
          onSelecionar={() => go('personal-treino-detalhe')}
          onNovo={() => console.log('Novo exercício')}

      />
    </PreviewFonts>
  )
}
