import data from '@/../product-psicologo/sections/perfil/data.json'
import type { Perfil } from '@/../product-psicologo/sections/perfil/types'
import { PerfilOverview as PerfilComponent } from './components/PerfilOverview'

export default function PerfilPreview() {
  const perfil = data as unknown as Perfil
  return (
    <PerfilComponent
      perfil={perfil}
      onEditPerfil={() => console.log('Editar perfil')}
    />
  )
}
