export type IdiomaPreferido = 'pt' | 'en' | 'es'

export type EspecialidadeFisio =
  | 'traumato-ortopedica'
  | 'neurologica'
  | 'respiratoria'
  | 'esportiva'
  | 'pediatrica'
  | 'geriatrica'
  | 'dermato-funcional'
  | 'pelvica'
  | 'reumatologica'
  | 'aquatica'
  | 'outra'

export type TipoRegistro = 'CREFITO' | 'Outro'

export interface Identidade {
  nome: string
  tratamento: string // "Dr.", "Dra.", "" etc.
  cargo: string // "Fisioterapeuta Traumato-Ortopédico"
  especialidade: EspecialidadeFisio
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
  numero: string // formato CREFITO: "3/99999-F"
  conselho: string // "CREFITO"
  uf: string // "SP"
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
  pacientesAtivos: number
  sessoesRealizadas: number
  avaliacoesCineticoFuncionais: number
  anosDePratica: number
  metodosDominantes: string[] // ex: ['Pilates clínico', 'RPG', 'McKenzie']
}

export interface ConfiguracaoPerfilPublico {
  /** Master switch — quando false, perfil não aparece no diretório público. */
  ativo: boolean
  /** URL slug pública (ex: "roberto-zboralski") */
  slug: string
  /** Bio curta exibida no card público (até ~200 chars) */
  bioPublica: string
  /** Cidade/UF mostrados no card público */
  cidade: string
  uf: string
  /** Flags de visibilidade — controla quais campos aparecem no card público */
  mostrarFoto: boolean
  mostrarEspecialidade: boolean
  mostrarTelefone: boolean
  mostrarEmail: boolean
  mostrarWhatsapp: boolean // gera link wa.me a partir do telefone
  mostrarLocalizacao: boolean
  mostrarMetodos: boolean
  mostrarAnosExperiencia: boolean
  /** Habilita botão "Agendar consulta" direto pelo perfil público (auto-confirma slot livre) */
  permitirAgendamentoDireto: boolean
  /** Permite receber convites de agendamento (paciente solicita, fisio aprova) */
  receberConvites: boolean
  /** Canais por onde o fisio quer receber convites */
  canaisConvite: CanalConvite[]
}

export type CanalConvite = 'whatsapp' | 'email' | 'app'

export interface Perfil {
  id: string
  identidade: Identidade
  registrosProfissionais: RegistroProfissional[]
  assinaturaDigital: AssinaturaDigital
  historicoAtuacao: HistoricoAtuacao
  perfilPublico: ConfiguracaoPerfilPublico
}
