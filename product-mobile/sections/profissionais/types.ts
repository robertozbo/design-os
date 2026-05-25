// Types for Profissionais (Mobile)
//
// Gestão de vínculos profissional-paciente: ativos, convites recebidos
// e enviados, busca/convite de novos profissionais, escopo de
// compartilhamento de dados por profissional.

export type TipoProfissional = 'nutricionista' | 'personal' | 'medico' | 'psicologo'

export type StatusVinculo = 'ativo' | 'pausado' | 'desvinculado'

export type StatusConvite = 'pendente' | 'aceito' | 'recusado' | 'cancelado'

export interface ProfissionalBase {
  id: string
  tipo: TipoProfissional
  fullName: string
  especialidade: string
  /** Registro profissional ("CRN 12345", "CREF 67890", "CRM 54321") */
  registro: string
  fotoUrl: string | null
  inicial: string
}

// ============================================================================
// Escopo de compartilhamento — quais dados o profissional vê
// ============================================================================

/**
 * Categorias de dados que o paciente pode (não) compartilhar com cada
 * profissional vinculado. Granularidade é **por profissional individual**
 * (não por tipo) — paciente pode ter 2 personals com escopos diferentes.
 */
export interface EscopoCompartilhamento {
  /** Peso, altura, IMC, % gordura — base de qualquer acompanhamento. */
  metricasBasicas: boolean
  /** Composição corporal detalhada (gordura visceral, massa magra, água, etc). */
  bioimpedancia: boolean
  /** Exames laboratoriais (hemograma, lipidograma, hormônios). */
  examesLaboratoriais: boolean
  /** HealthKit / wearables / passos / cardio. */
  atividades: boolean
  /** Histórico de execução de treinos (séries, reps, carga). */
  treinos: boolean
  /** Fotos de evolução corporal. */
  fotosCorporais: boolean
  /** Diário alimentar — refeições, macros, foto de prato. */
  nutricao: boolean
  /** Objetivos definidos pelo paciente (peso alvo, passos, etc). */
  objetivos: boolean
  /** Medicação e adesão (Memed, doses, side-effects). */
  medicacao: boolean
  /** Diário emocional, humor, food noise. */
  saudeMental: boolean
}

/**
 * Configuração de cada categoria pra um tipo profissional: se aparece no
 * toggle list, e o valor default (on/off) quando aparece.
 */
type ConfigCategoria = 'default_on' | 'default_off' | 'oculta'

type DefaultsPorTipo = Record<TipoProfissional, Record<keyof EscopoCompartilhamento, ConfigCategoria>>

/**
 * Tabela canônica de defaults. `oculta` = categoria nem aparece no toggle list
 * pra esse tipo profissional (ex: psicólogo não precisa ver bioimpedância).
 */
export const DEFAULTS_ESCOPO: DefaultsPorTipo = {
  personal: {
    metricasBasicas: 'default_on',
    bioimpedancia: 'default_on',
    examesLaboratoriais: 'oculta',
    atividades: 'default_on',
    treinos: 'default_on',
    fotosCorporais: 'default_off',
    nutricao: 'default_off',
    objetivos: 'default_on',
    medicacao: 'oculta',
    saudeMental: 'oculta',
  },
  nutricionista: {
    metricasBasicas: 'default_on',
    bioimpedancia: 'default_on',
    examesLaboratoriais: 'default_off',
    atividades: 'default_off',
    treinos: 'oculta',
    fotosCorporais: 'default_off',
    nutricao: 'default_on',
    objetivos: 'default_on',
    medicacao: 'default_off',
    saudeMental: 'oculta',
  },
  medico: {
    metricasBasicas: 'default_on',
    bioimpedancia: 'default_on',
    examesLaboratoriais: 'default_on',
    atividades: 'default_on',
    treinos: 'default_off',
    fotosCorporais: 'default_off',
    nutricao: 'default_on',
    objetivos: 'default_on',
    medicacao: 'default_on',
    saudeMental: 'default_off',
  },
  psicologo: {
    metricasBasicas: 'default_off',
    bioimpedancia: 'oculta',
    examesLaboratoriais: 'oculta',
    atividades: 'default_off',
    treinos: 'oculta',
    fotosCorporais: 'oculta',
    nutricao: 'oculta',
    objetivos: 'default_off',
    medicacao: 'default_off',
    saudeMental: 'default_on',
  },
}

export const CATEGORIA_LABEL: Record<keyof EscopoCompartilhamento, string> = {
  metricasBasicas: 'Métricas básicas',
  bioimpedancia: 'Bioimpedância',
  examesLaboratoriais: 'Exames laboratoriais',
  atividades: 'Atividades físicas',
  treinos: 'Treinos',
  fotosCorporais: 'Fotos corporais',
  nutricao: 'Nutrição',
  objetivos: 'Objetivos',
  medicacao: 'Medicação',
  saudeMental: 'Saúde mental',
}

export const CATEGORIA_DESCRICAO: Record<keyof EscopoCompartilhamento, string> = {
  metricasBasicas: 'Peso, altura, IMC e percentual de gordura',
  bioimpedancia: 'Composição corporal detalhada (massa magra, gordura visceral, água)',
  examesLaboratoriais: 'Resultados de exames (sangue, hormônios, etc)',
  atividades: 'Atividades físicas registradas (passos, cardio, HealthKit)',
  treinos: 'Histórico de treinos com séries, reps e cargas',
  fotosCorporais: 'Fotos de evolução do corpo',
  nutricao: 'Diário alimentar com refeições e macros',
  objetivos: 'Metas que você definiu (peso, passos, etc)',
  medicacao: 'Medicações em uso, adesão e sintomas',
  saudeMental: 'Diário emocional, humor e bem-estar mental',
}

/** Gera escopo default pra um tipo profissional. */
export function escopoDefaultPara(tipo: TipoProfissional): EscopoCompartilhamento {
  const config = DEFAULTS_ESCOPO[tipo]
  return {
    metricasBasicas: config.metricasBasicas === 'default_on',
    bioimpedancia: config.bioimpedancia === 'default_on',
    examesLaboratoriais: config.examesLaboratoriais === 'default_on',
    atividades: config.atividades === 'default_on',
    treinos: config.treinos === 'default_on',
    fotosCorporais: config.fotosCorporais === 'default_on',
    nutricao: config.nutricao === 'default_on',
    objetivos: config.objetivos === 'default_on',
    medicacao: config.medicacao === 'default_on',
    saudeMental: config.saudeMental === 'default_on',
  }
}

/** Categorias visíveis pra um tipo (não-oculta). */
export function categoriasVisiveis(
  tipo: TipoProfissional,
): (keyof EscopoCompartilhamento)[] {
  const config = DEFAULTS_ESCOPO[tipo]
  return (Object.keys(config) as (keyof EscopoCompartilhamento)[]).filter(
    (k) => config[k] !== 'oculta',
  )
}

// ============================================================================
// Vínculos / convites
// ============================================================================

export interface ProfissionalVinculado {
  /** Dados do profissional */
  prof: ProfissionalBase
  status: StatusVinculo
  /** ISO date — quando vinculou */
  vinculadoEm: string
  /** Tempo relativo da última interação ("ontem", "há 2d") */
  ultimaInteracao: string | null
  /** Próximo agendamento se houver */
  proximoAgendamento: string | null
  /** Escopo de compartilhamento — definido no aceite, editável depois. */
  escopo?: EscopoCompartilhamento
}

export interface ConviteRecebido {
  id: string
  prof: ProfissionalBase
  /** ISO date do envio */
  enviadoEm: string
  /** Tempo relativo formatado ("há 2d") */
  tempoRelativo: string
  /** Mensagem opcional do profissional */
  mensagem: string | null
}

export interface ConviteEnviado {
  id: string
  prof: ProfissionalBase
  enviadoEm: string
  tempoRelativo: string
  status: StatusConvite
}

/**
 * Código de profissional que pode ser inserido pelo paciente pra vincular
 * diretamente (sem convite recebido). Profissional gera o código em seu
 * próprio app e compartilha por canal externo (WhatsApp, etc).
 *
 * No backend, esse mapeamento código→profissional é resolvido por um
 * endpoint de lookup (não trafega `prof` completo do front).
 */
export interface CodigoProfissional {
  codigo: string
  prof: ProfissionalBase
  /** Mensagem opcional pré-definida pelo profissional. */
  mensagem?: string
}

export interface ProfissionaisData {
  vinculados: ProfissionalVinculado[]
  convitesRecebidos: ConviteRecebido[]
  convitesEnviados: ConviteEnviado[]
  /**
   * Fixture de códigos válidos pra demo. Em produção, a UI faz lookup via
   * `onResolverCodigo(codigo)` que retorna o profissional do backend.
   */
  codigosDisponiveis?: CodigoProfissional[]
}

export type ProfissionaisAba = 'vinculados' | 'convites'

export interface ProfissionaisProps {
  data: ProfissionaisData
  abaInicial?: ProfissionaisAba

  onProfClick?: (id: string) => void
  onChat?: (profId: string) => void
  onDesvincular?: (profId: string) => void

  /**
   * Aceitar convite — o segundo argumento é o escopo definido na tela de
   * permissões. Quando ausente, deve-se assumir o default do tipo.
   */
  onAceitarConvite?: (conviteId: string, escopo: EscopoCompartilhamento) => void
  onRecusarConvite?: (conviteId: string) => void
  onCancelarConviteEnviado?: (conviteId: string) => void

  onConvidarNovo?: () => void

  /**
   * Atualizar permissões de um profissional já vinculado (modo edição).
   */
  onAtualizarEscopo?: (profId: string, escopo: EscopoCompartilhamento) => void

  /**
   * Vincular profissional via código (paciente recebeu o código do profissional
   * por canal externo). Chamado após paciente validar código + confirmar escopo
   * de compartilhamento.
   */
  onVincularPorCodigo?: (codigo: string, escopo: EscopoCompartilhamento) => void
}
