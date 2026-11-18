import data from '@/../product-mobile/sections/personal-aluno-ficha/data.json'
import type { PersonalAlunoFichaData } from '@/../product-mobile/sections/personal-aluno-ficha/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalAlunoFicha as Component } from './components/PersonalAlunoFicha'

export default function PersonalAlunoFichaPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalAlunoFichaData}
          onMensagem={() => go('personal-conversa')}
          onNovaAvaliacao={() => go('personal-avaliacao-nova')}
          onEditarTreino={() => go('personal-treino-detalhe')}
          onAbrirAvaliacao={() => go('personal-avaliacoes')}

      />
    </PreviewFonts>
  )
}
