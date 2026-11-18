export type TipoAvaliacao = 'antropometria' | 'dobras' | 'bioimpedancia' | 'forca' | 'mobilidade' | 'cardio'

export interface CampoMedida {
  id: string
  label: string
  unidade: string
  valor: string
  anterior?: string
}

export interface PersonalAvaliacaoNovaData {
  aluno: { nome: string; inicial: string; ultima: string }
  tipos: Array<{ id: TipoAvaliacao; label: string; icone: string }>
  tipoSelecionado: TipoAvaliacao
  campos: CampoMedida[]
}

export interface PersonalAvaliacaoNovaProps {
  data: PersonalAvaliacaoNovaData
  onTrocarAluno?: () => void
  onFoto?: () => void
  onSalvar?: () => void
}
