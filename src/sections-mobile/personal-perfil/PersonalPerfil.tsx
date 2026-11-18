import data from '@/../product-mobile/sections/personal-perfil/data.json'
import type { PersonalPerfilData } from '@/../product-mobile/sections/personal-perfil/types'
import { PreviewFonts, go } from '../_personal/components/kit'
import { PersonalPerfil as Component } from './components/PersonalPerfil'

export default function PersonalPerfilPreview() {
  return (
    <PreviewFonts>
      <Component
        data={data as unknown as PersonalPerfilData}
          onEditar={() => console.log('Editar perfil')}
          onVerPublico={() => go('personal-convidar')}

      />
    </PreviewFonts>
  )
}
