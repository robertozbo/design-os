export interface ConfigItem {
  id: string
  label: string
  descricao?: string
  tipo: 'toggle' | 'link'
  ligado?: boolean
  valor?: string
}

export interface PersonalConfiguracoesData {
  grupos: Array<{ id: string; label: string; itens: ConfigItem[] }>
  versao: string
}

export interface PersonalConfiguracoesProps {
  data: PersonalConfiguracoesData
  onItem?: (id: string) => void
}
