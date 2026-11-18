import data from '@/../product-mobile/sections/personal-notificacoes/data.json'
import type { PersonalNotificacoesData } from '@/../product-mobile/sections/personal-notificacoes/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalNotificacoes as Component } from './components/PersonalNotificacoes'

export default function PersonalNotificacoesPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalNotificacoesData}
          onAbrir={(n) => go(n.tipo === 'agendamento' ? 'personal-solicitacoes' : 'personal-aluno-ficha')}
          onMarcarTodas={() => console.log('Marcar todas')}

      />
    </PreviewFonts>
  )
}
