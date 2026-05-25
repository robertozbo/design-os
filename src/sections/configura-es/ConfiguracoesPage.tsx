import { useState } from 'react'
import data from '@/../product/sections/configura-es/data.json'
import type {
  Configuracoes,
  PerfilContexto,
  SecaoConfiguracoes,
  TipoEventoOpcao,
} from '@/../product/sections/configura-es/types'
import { ConfiguracoesPage } from './components/ConfiguracoesPage'

export default function ConfiguracoesPagePreview() {
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoConfiguracoes>('notificacoes')

  return (
    <ConfiguracoesPage
      perfilContexto={data.perfilContexto as PerfilContexto}
      tiposEventoOpcoes={data.tiposEventoOpcoes as TipoEventoOpcao[]}
      configuracoes={data.configuracoes as unknown as Configuracoes}
      secaoAtiva={secaoAtiva}
      onSecaoChange={(s) => setSecaoAtiva(s)}
      onToggleCanal={(tipo, canal, habilitado) =>
        console.log('Toggle canal', { tipo, canal, habilitado })
      }
      onUpdateDnd={(dnd) => console.log('Update DnD', dnd)}
      onUpdateDigest={(digest) => console.log('Update digest', digest)}
      onChangeOverrideEmpregador={(empId, modo) =>
        console.log('Override empregador', { empId, modo })
      }
      onIntegracaoAction={(id, action) =>
        console.log('Integração action', { id, action })
      }
      onUpdateInterface={(config) => console.log('Update interface', config)}
      onChangePasswordIntent={() => console.log('Abrir alterar senha')}
      onToggle2FA={(habilitado) => console.log('Toggle 2FA', habilitado)}
      onRevokeSession={(id) => console.log('Revogar sessão', id)}
      onRevokeAllOtherSessions={() => console.log('Revogar todas outras sessões')}
      onDownloadBackupCodes={() => console.log('Baixar códigos backup')}
      onChangeRetencaoLogs={(retencao) => console.log('Retenção logs', retencao)}
      onToggleConsentimento={(id, aceito) =>
        console.log('Toggle consentimento', { id, aceito })
      }
      onRequestExport={() => console.log('Solicitar exportação')}
      onDeleteAccountIntent={() => console.log('Excluir conta')}
    />
  )
}
