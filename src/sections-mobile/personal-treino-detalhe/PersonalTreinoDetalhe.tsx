import data from '@/../product-mobile/sections/personal-treino-detalhe/data.json'
import type { PersonalTreinoDetalheData } from '@/../product-mobile/sections/personal-treino-detalhe/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalTreinoDetalhe as Component } from './components/PersonalTreinoDetalhe'

export default function PersonalTreinoDetalhePreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalTreinoDetalheData}
          onAdicionarExercicio={() => go('personal-exercicios')}
          onEditarExercicio={(id) => console.log('Editar', id)}
          onAplicar={() => go('personal-treinos')}

      />
    </PreviewFonts>
  )
}
