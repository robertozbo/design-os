export type IdiomaPreferido = 'pt' | 'en' | 'es'

export type PapelSst =
  | 'endocrinologista'
  | 'clinico_geral'
  | 'cardiologista'
  | 'outro'

export type TipoRegistro = 'CRM' | 'RQE' | 'CRMV' | 'Outro'

export type AbaPerfil = 'identidade' | 'registros' | 'assinatura'

export interface Identidade {
  nome: string
  tratamento: string
  cargo: string
  papel: PapelSst
  foto: string | null
  iniciais: string
  emailCorporativo: string
  telefone: string
  idiomaPreferido: IdiomaPreferido
  fusoHorario: string
}

export interface RegistroProfissional {
  id: string
  tipo: TipoRegistro
  numero: string
  conselho: string
  uf: string
  dataEmissao: string
  dataValidade: string
  primario: boolean
}

export interface AssinaturaDigital {
  imagemUrl: string | null
  imagemUploadedEm: string | null
  hashSha256: string | null
  icpBrasilHabilitado: boolean
  icpCertificadoNome: string | null
}

export interface HistoricoAtuacao {
  empregadoresAtivos: number
  avaliacoesPublicadas: number
  relatoriosGerados: number
  anosDePratica: number
  especializacoes: string[]
}

export interface Perfil {
  id: string
  identidade: Identidade
  registrosProfissionais: RegistroProfissional[]
  assinaturaDigital: AssinaturaDigital
  historicoAtuacao: HistoricoAtuacao
}

export interface PapelOpcao {
  value: PapelSst
  label: string
}

export interface TipoRegistroOpcao {
  value: TipoRegistro
  label: string
}

export interface IdentidadeFormInput {
  nome: string
  tratamento: string
  cargo: string
  papel: PapelSst
  foto: string | null
  emailCorporativo: string
  telefone: string
  idiomaPreferido: IdiomaPreferido
  fusoHorario: string
}

export interface RegistroFormInput {
  id?: string
  tipo: TipoRegistro
  numero: string
  conselho: string
  uf: string
  dataEmissao: string
  dataValidade: string
  primario: boolean
}

export interface AssinaturaFormInput {
  imagemFile: File | null
  imagemUrl: string | null
  icpBrasilHabilitado: boolean
}

export interface PerfilProps {
  perfil: Perfil
  papelOpcoes: PapelOpcao[]
  tipoRegistroOpcoes: TipoRegistroOpcao[]
  ufOpcoes: string[]
  fusoHorarioOpcoes: string[]

  /** Called when user clicks "Editar perfil" — drawer is internal. */
  onEditPerfil?: () => void
  /** Called when the Identidade tab form is saved. */
  onSaveIdentidade?: (input: IdentidadeFormInput) => void
  /** Called when user adds a new registro profissional. */
  onAddRegistro?: (input: RegistroFormInput) => void
  /** Called when user edits an existing registro. */
  onEditRegistro?: (input: RegistroFormInput) => void
  /** Called when user removes a registro (must not be the primary). */
  onRemoveRegistro?: (registroId: string) => void
  /** Called when user marks a registro as primário (demotes the previous primary). */
  onSetPrimaryRegistro?: (registroId: string) => void
  /** Called when user uploads a new signature image. */
  onUploadAssinatura?: (input: AssinaturaFormInput) => void
  /** Called when user toggles ICP-Brasil signature support. */
  onToggleIcpBrasil?: (habilitado: boolean) => void
  /** Called when user clicks "Recopilar hash" to regenerate the signature hash. */
  onRecomputeHash?: () => void
}
