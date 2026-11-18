export interface PlanoOpcao {
  id: 'free' | 'plus' | 'pro'
  nome: string
  preco: string
  recursos: string[]
  atual?: boolean
  destaque?: boolean
}

export interface PersonalPlanoData {
  uso: Array<{ label: string; usado: number; limite: number | null }>
  renovacao: string
  planos: PlanoOpcao[]
}

export interface PersonalPlanoProps {
  data: PersonalPlanoData
  onEscolher?: (id: PlanoOpcao['id']) => void
  onGerenciar?: () => void
}
