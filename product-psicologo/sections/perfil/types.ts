/**
 * Tipos do Perfil do psicólogo.
 * Espelho adaptado de product-clinico/perfil/types.ts (CRM → CRP,
 * RQE removido, papéis mudaram pra realidade psi).
 */

export type IdiomaPreferido = 'pt' | 'en' | 'es'

export type PapelPsi =
  | 'clinico'
  | 'organizacional'
  | 'juridico'
  | 'escolar'
  | 'esportivo'
  | 'outro'

export type TipoRegistro = 'CRP' | 'Outro'

export type AbaPerfil = 'identidade' | 'registros' | 'assinatura'

export interface Identidade {
  nome: string
  tratamento: string // "Dr.", "Dra.", "" etc
  cargo: string // "Psicólogo Clínico", "Psicoterapeuta"
  papel: PapelPsi
  foto: string | null
  iniciais: string
  emailCorporativo: string
  telefone: string
  idiomaPreferido: IdiomaPreferido
  fusoHorario: string // "America/Sao_Paulo"
}

export interface RegistroProfissional {
  id: string
  tipo: TipoRegistro
  numero: string // formato CRP: "06/12345"
  conselho: string // "CRP"
  uf: string // "SP"
  dataEmissao: string // ISO
  dataValidade: string // ISO
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
  pacientesAtivos: number
  sessoesRealizadas: number
  planosTerapeuticos: number
  anosDePratica: number
  abordagensDominantes: string[] // ex: ['TCC', 'ACT', 'Mindfulness']
}

export interface Perfil {
  id: string
  identidade: Identidade
  registrosProfissionais: RegistroProfissional[]
  assinaturaDigital: AssinaturaDigital
  historicoAtuacao: HistoricoAtuacao
}

export interface PerfilProps {
  perfil: Perfil
  onEditPerfil?: () => void
}
