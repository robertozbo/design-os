import data from '@/../product/sections/perfil/data.json'
import type {
  PapelOpcao,
  Perfil,
  TipoRegistroOpcao,
} from '@/../product/sections/perfil/types'
import { PerfilOverview } from './components/PerfilOverview'

export default function PerfilOverviewPreview() {
  return (
    <PerfilOverview
      perfil={data.perfil as Perfil}
      papelOpcoes={data.papelOpcoes as PapelOpcao[]}
      tipoRegistroOpcoes={data.tipoRegistroOpcoes as TipoRegistroOpcao[]}
      ufOpcoes={data.ufOpcoes as string[]}
      fusoHorarioOpcoes={data.fusoHorarioOpcoes as string[]}
      onEditPerfil={() => console.log('Abrir drawer de edição do perfil')}
      onSaveIdentidade={(input) => console.log('Salvar identidade', input)}
      onAddRegistro={(input) => console.log('Adicionar registro', input)}
      onEditRegistro={(input) => console.log('Editar registro', input)}
      onRemoveRegistro={(id) => console.log('Remover registro', id)}
      onSetPrimaryRegistro={(id) => console.log('Definir primário', id)}
      onUploadAssinatura={(input) => console.log('Upload assinatura', input)}
      onToggleIcpBrasil={(habilitado) => console.log('Toggle ICP-Brasil', habilitado)}
      onRecomputeHash={() => console.log('Recompilar hash da assinatura')}
    />
  )
}
