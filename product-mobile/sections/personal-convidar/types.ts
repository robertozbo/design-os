export interface ConvitePendente {
  id: string
  nome: string
  contato: string
  enviado: string
  status: 'enviado' | 'aceito' | 'expirado'
}

export interface PersonalConvidarData {
  codigo: string
  link: string
  mensagemPadrao: string
  aceitosNoMes: number
  convites: ConvitePendente[]
}

export interface PersonalConvidarProps {
  data: PersonalConvidarData
  onCopiar?: () => void
  onCompartilhar?: () => void
  onWhatsApp?: () => void
  onReenviar?: (id: string) => void
}
