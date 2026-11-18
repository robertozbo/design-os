export interface MaisItem {
  id: string
  label: string
  icone: string
  badge?: number
}

export interface MaisGrupo {
  id: string
  label: string
  itens: MaisItem[]
}

export interface PersonalMaisData {
  usuario: {
    primeiroNome: string
    nome: string
    avatarInicial: string
    registro: string
    plano: 'Free' | 'Plus' | 'Pro'
    temPerfilAluno: boolean
  }
  grupos: MaisGrupo[]
}

export interface PersonalMaisProps {
  data: PersonalMaisData
  onPerfilClick?: () => void
  onItemClick?: (item: MaisItem) => void
  onTrocarPerfil?: () => void
  onSair?: () => void
}
