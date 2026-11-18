export type PerfilId = 'personal' | 'aluno'

export interface PerfilOpcao {
  id: PerfilId
  titulo: string
  descricao: string
  icone: 'Dumbbell' | 'HeartPulse'
  contexto: string[]
}

export interface PerfilSeletorData {
  usuario: {
    primeiroNome: string
    avatarInicial: string
    registro: string
  }
  ultimoPerfil: PerfilId | null
  lembrarEscolha: boolean
  opcoes: PerfilOpcao[]
}

export interface PerfilSeletorProps {
  data: PerfilSeletorData
  onEscolher?: (perfil: PerfilId, lembrar: boolean) => void
  onSair?: () => void
}
