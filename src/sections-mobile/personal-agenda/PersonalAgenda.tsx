import data from '@/../product-mobile/sections/personal-agenda/data.json'
import type { PersonalAgendaData } from '@/../product-mobile/sections/personal-agenda/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalAgenda as Component } from './components/PersonalAgenda'

export default function PersonalAgendaPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalAgendaData}
          onSlotClick={(s) => (s.status === 'livre' ? console.log('Novo agendamento', s.hora) : go('personal-aluno-ficha'))}
          onNovaSessao={() => console.log('Nova sessão')}
          onSolicitacoes={() => go('personal-solicitacoes')}

      />
    </PreviewFonts>
  )
}
